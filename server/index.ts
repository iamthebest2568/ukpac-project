import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import fetch from "node-fetch";
import { handleDemo } from "./routes/demo";
import {
  EventSchema,
  appendEvent,
  computeStats,
} from "./services/videoAnalytics";
import {
  listRecentEvents,
  listVideoEventsBySession,
  getVideoIngestStatus,
} from "./services/videoAnalytics.extras";
import {
  AppEventSchema,
  appendAppEvent,
  computeUserJourneyStats,
  computeSessionSummaries,
  getAppEventsBySession,
  getAppIngestStatus,
} from "./services/appEvents";

export function createServer() {
  const app = express();

  // Respect proxy headers for real IP
  app.set("trust proxy", true);

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Video analytics ingestion
  app.post("/api/video-events", async (req, res) => {
    try {
      const parsed = EventSchema.parse(req.body);
      const withTs = {
        ...parsed,
        timestamp: parsed.timestamp || new Date().toISOString(),
      };
      await appendEvent(withTs);
      res.status(200).json({ ok: true });
    } catch (e: any) {
      res
        .status(400)
        .json({ ok: false, error: e?.message || "invalid payload" });
    }
  });

  // Generic app tracking endpoint
  app.post("/api/track", async (req, res) => {
    try {
      const ua = String(req.headers["user-agent"] || "");
      const ip = (req.headers["x-forwarded-for"] as string) || req.ip || "";
      const page = String(req.headers["referer"] || "");
      const parsed = AppEventSchema.parse(req.body);
      const withMeta = {
        ...parsed,
        userAgent: parsed.userAgent || ua,
        ip: parsed.ip || ip,
        page: parsed.page || page,
        timestamp: parsed.timestamp || new Date().toISOString(),
      };
      await appendAppEvent(withMeta);
      res.status(200).json({ ok: true });
    } catch (e: any) {
      res
        .status(400)
        .json({ ok: false, error: e?.message || "invalid payload" });
    }
  });

  // Aggregated stats (optional date range)
  app.get("/api/video-stats", async (req, res) => {
    try {
      const from =
        typeof req.query.from === "string" ? req.query.from : undefined;
      const to = typeof req.query.to === "string" ? req.query.to : undefined;
      const stats = await computeStats(from, to);
      res.status(200).json(stats);
    } catch (e: any) {
      res
        .status(500)
        .json({ ok: false, error: e?.message || "failed to compute stats" });
    }
  });

  // User journey stats
  app.get("/api/user-journey-stats", async (_req, res) => {
    try {
      const recent = await listRecentEvents(2000);
      const agg = await computeUserJourneyStats(recent);
      res.status(200).json(agg);
    } catch (e: any) {
      res.status(500).json({
        ok: false,
        error: e?.message || "failed to compute journey stats",
      });
    }
  });

  // Per-session summaries
  app.get("/api/session-summaries", async (req, res) => {
    try {
      const limit = req.query.limit
        ? Math.max(1, Math.min(500, Number(req.query.limit)))
        : 100;
      const summaries = await computeSessionSummaries(limit);
      res.status(200).json(summaries);
    } catch (e: any) {
      res
        .status(500)
        .json({
          ok: false,
          error: e?.message || "failed to compute session summaries",
        });
    }
  });

  // Per-session detail
  app.get("/api/session/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const appEvents = await getAppEventsBySession(id);
      const videoEvents = await listVideoEventsBySession(id);
      res.status(200).json({ appEvents, videoEvents });
    } catch (e: any) {
      res
        .status(500)
        .json({ ok: false, error: e?.message || "failed to load session" });
    }
  });

  // Ingest status
  app.get("/api/ingest-status", async (_req, res) => {
    try {
      const app = await getAppIngestStatus();
      const video = await getVideoIngestStatus();
      res.status(200).json({ app, video });
    } catch (e: any) {
      res
        .status(500)
        .json({ ok: false, error: e?.message || "failed to load status" });
    }
  });

  // Recent events for dashboard
  app.get("/api/video-events", async (req, res) => {
    try {
      const limit = req.query.limit
        ? Math.max(1, Math.min(500, Number(req.query.limit)))
        : 50;
      const items = await listRecentEvents(limit);
      res.status(200).json(items);
    } catch (e: any) {
      res
        .status(500)
        .json({ ok: false, error: e?.message || "failed to list events" });
    }
  });

  // Clear analytics data: local files and Supabase (if configured)
  app.delete("/api/clear-data", async (_req, res) => {
    try {
      const DATA_DIR =
        process.env.DATA_DIR || path.join(process.cwd(), ".data");
      const files = ["events.jsonl", "app-events.jsonl"].map((f) =>
        path.join(DATA_DIR, f),
      );

      // Remove local files
      await Promise.all(
        files.map((fp) => fs.promises.rm(fp, { force: true }).catch(() => {})),
      );

      // Attempt to purge Supabase tables if env provided
      const supabaseUrl = process.env.SUPABASE_URL as string | undefined;
      const supabaseKey = process.env.SUPABASE_ANON_KEY as string | undefined;
      let supabaseDeleted = null as null | { video_events: number; app_events: number };
      if (supabaseUrl && supabaseKey) {
        let videoDeleted = 0;
        let appDeleted = 0;
        try {
          const urlV = new URL(`${supabaseUrl}/rest/v1/video_events`);
          urlV.searchParams.set("session_id", "not.is.null");
          const respV = await fetch(urlV.toString(), {
            method: "DELETE",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              Prefer: "return=representation",
            },
          });
          if (respV.ok) {
            const json = (await respV.json()) as any[];
            videoDeleted = Array.isArray(json) ? json.length : 0;
          }
        } catch {}
        try {
          const urlA = new URL(`${supabaseUrl}/rest/v1/app_events`);
          urlA.searchParams.set("session_id", "not.is.null");
          const respA = await fetch(urlA.toString(), {
            method: "DELETE",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              Prefer: "return=representation",
            },
          });
          if (respA.ok) {
            const json = (await respA.json()) as any[];
            appDeleted = Array.isArray(json) ? json.length : 0;
          }
        } catch {}
        supabaseDeleted = { video_events: videoDeleted, app_events: appDeleted };
      }

      res.status(200).json({
        ok: true,
        cleared: files.map((f) => path.basename(f)),
        supabaseDeleted,
      });
    } catch (e: any) {
      res
        .status(500)
        .json({ ok: false, error: e?.message || "failed to clear data" });
    }
  });

  return app;
}
