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
  getFirestoreStatsFor,
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
      const ip =
        (req.headers["x-forwarded-for"] as string) || req.ip || undefined;
      const page = String(req.headers["referer"] || "");
      const parsed = AppEventSchema.parse(req.body);
      const withMeta = {
        ...parsed,
        userAgent: parsed.userAgent || ua,
        ip: parsed.ip || ip,
        page: parsed.page || page,
        timestamp: parsed.timestamp || new Date().toISOString(),
      };

      // Decide target collection: if page or payload indicates ukpack2, route to minigame2
      let target: string | undefined = undefined;
      try {
        const p = String(withMeta.page || "") || "";
        const payloadProject =
          (withMeta.payload &&
            (withMeta.payload.project || withMeta.payload.projectName)) ||
          undefined;
        if (p.includes("/ukpack2") || p.includes("/mydreambus") || payloadProject === "ukpack2" || payloadProject === "mydreambus") {
          target = "minigame2_events/minigame2-di";
        } else if (p.includes("/beforecitychange") || payloadProject === "beforecitychange" || p.includes("/ukpack1") || payloadProject === "ukpack1") {
          // Accept either new project name or legacy ukpack1 for backward compatibility
          target = "minigame1_events/minigame1-di";
        }
      } catch (_) {}

      await appendAppEvent(withMeta, target);
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

  // Aggregated stats for a project (ukpack2/ukpack1) - totals + timeseries
  app.get("/api/video-stats-project", async (req, res) => {
    try {
      const project = String(req.query.project || "");
      let col = "minigame1_events";
      let docId = "minigame1-di";
      if (project === "ukpack2" || project === "mydreambus") {
        col = "minigame2_events";
        docId = "minigame2-di";
      } else if (project === "ukpack1" || project === "beforecitychange") {
        col = "minigame1_events";
        docId = "minigame1-di";
      }
      const stats = await getFirestoreStatsFor(col, docId, 100);
      const agg = await computeStatsForProject(col, docId);
      res.status(200).json({
        ok: true,
        project,
        col,
        docId,
        firestoreSample: stats,
        aggregation: agg,
      });
    } catch (e: any) {
      res.status(500).json({
        ok: false,
        error: e?.message || "failed to compute project stats",
      });
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
      res.status(500).json({
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

  // Firestore stats for project collections
  app.get("/api/firestore-stats", async (req, res) => {
    try {
      const project = String(req.query.project || "");
      let col = "minigame1_events";
      let docId = "minigame1-di";
      if (project === "ukpack2" || project === "mydreambus") {
        col = "minigame2_events";
        docId = "minigame2-di";
      } else if (project === "ukpack1" || project === "beforecitychange") {
        col = "minigame1_events";
        docId = "minigame1-di";
      }
      const stats = await getFirestoreStatsFor(col, docId, 20);
      res.status(200).json({ ok: true, project, col, docId, stats });
    } catch (e: any) {
      res.status(500).json({
        ok: false,
        error: e?.message || "failed to fetch firestore stats",
      });
    }
  });

  // Public submissions from Realtime DB (sanitized)
  app.get("/api/public-submissions", async (req, res) => {
    try {
      const limit = req.query.limit
        ? Math.max(1, Math.min(200, Number(req.query.limit)))
        : 20;
      const items = await (
        await import("./services/submissions")
      ).listPublicSubmissions(limit);
      res.status(200).json({ ok: true, items });
    } catch (e: any) {
      res.status(500).json({
        ok: false,
        error: e?.message || "failed to fetch submissions",
      });
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

  // Publish public aggregation for Landing (saved to DATA_DIR/public_ukpack2.json)
  app.post("/api/ukpack2/publish", async (req, res) => {
    try {
      const DATA_DIR =
        process.env.DATA_DIR || path.join(process.cwd(), ".data");
      await fs.promises.mkdir(DATA_DIR, { recursive: true });
      const file = path.join(DATA_DIR, "public_ukpack2.json");
      const payload = req.body;
      await fs.promises.writeFile(
        file,
        JSON.stringify(payload, null, 2),
        "utf-8",
      );
      res.status(200).json({ ok: true, file });
    } catch (e: any) {
      res
        .status(500)
        .json({ ok: false, error: e?.message || "failed to publish" });
    }
  });

  app.get("/api/ukpack2/public", async (_req, res) => {
    try {
      const DATA_DIR =
        process.env.DATA_DIR || path.join(process.cwd(), ".data");
      const file = path.join(DATA_DIR, "public_ukpack2.json");
      if (!fs.existsSync(file))
        return res.status(404).json({ ok: false, error: "not found" });
      const buf = await fs.promises.readFile(file, "utf-8");
      const json = JSON.parse(buf);
      res.status(200).json({ ok: true, data: json });
    } catch (e: any) {
      res.status(500).json({
        ok: false,
        error: e?.message || "failed to read public aggregation",
      });
    }
  });

  // Alias endpoints for mydreambus - keep parity with ukpack2
  app.post("/api/mydreambus/publish", async (req, res) => {
    try {
      const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), ".data");
      await fs.promises.mkdir(DATA_DIR, { recursive: true });
      const fileUk = path.join(DATA_DIR, "public_ukpack2.json");
      const fileMy = path.join(DATA_DIR, "public_mydreambus.json");
      const payload = req.body;
      await Promise.all([
        fs.promises.writeFile(fileUk, JSON.stringify(payload, null, 2), "utf-8"),
        fs.promises.writeFile(fileMy, JSON.stringify(payload, null, 2), "utf-8"),
      ]);
      res.status(200).json({ ok: true, files: [fileUk, fileMy] });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || "failed to publish" });
    }
  });

  app.get("/api/mydreambus/public", async (_req, res) => {
    try {
      const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), ".data");
      const fileMy = path.join(DATA_DIR, "public_mydreambus.json");
      const fileUk = path.join(DATA_DIR, "public_ukpack2.json");
      let file = fileMy;
      if (!fs.existsSync(fileMy) && fs.existsSync(fileUk)) file = fileUk;
      if (!fs.existsSync(file)) return res.status(404).json({ ok: false, error: "not found" });
      const buf = await fs.promises.readFile(file, "utf-8");
      const json = JSON.parse(buf);
      res.status(200).json({ ok: true, data: json });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || "failed to read public aggregation" });
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

      // No Supabase configured — only local files cleared

      res.status(200).json({
        ok: true,
        cleared: files.map((f) => path.basename(f)),
        supabaseDeleted: null,
      });
    } catch (e: any) {
      res
        .status(500)
        .json({ ok: false, error: e?.message || "failed to clear data" });
    }
  });

  app.get("/api/dashboard-password", (_req, res) => {
    try {
      res
        .status(200)
        .json({ password: process.env.VITE_DASHBOARD_PASSWORD || null });
    } catch (e: any) {
      res.status(500).json({ password: null });
    }
  });

  return app;
}
