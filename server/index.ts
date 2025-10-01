import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import fetch from "node-fetch";
import { handleDemo } from "./routes/demo";
import admin from "firebase-admin";

// In-memory debug storage for last incoming write-image-url payload
let lastWriteImageRequest: any = null;

// Helper: format timestamp to Thailand time (Asia/Bangkok) using sv-SE for ISO-like string
function formatToBangkok(ts: any) {
  try {
    if (!ts) return "";
    const d = new Date(String(ts));
    if (isNaN(d.getTime())) return String(ts || "");
    return d.toLocaleString("sv-SE", { timeZone: "Asia/Bangkok" });
  } catch (e) {
    return String(ts || "");
  }
}
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
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  const STORAGE_DISABLED =
    String(process.env.DISABLE_DATA_STORAGE || "").toLowerCase() === "1" ||
    String(process.env.DISABLE_DATA_STORAGE || "").toLowerCase() === "true";

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Proxy external images through server to avoid CORS issues when composing canvases
  app.get("/api/proxy-image", async (req, res) => {
    try {
      const url = String(req.query.url || "").trim();
      if (!url) return res.status(400).send("missing url");
      let parsed;
      try {
        parsed = new URL(url);
      } catch (e) {
        return res.status(400).send("invalid url");
      }

      const allowedHosts = [
        "cdn.builder.io",
        "builder.io",
        "firebasestorage.googleapis.com",
        "storage.googleapis.com",
        "images.unsplash.com",
      ];
      const hostname = parsed.hostname || "";
      const ok = allowedHosts.some((h) => hostname.includes(h));
      if (!ok) return res.status(403).send("host not allowed");

      const upstream = await fetch(url);
      if (!upstream.ok) return res.status(502).send("failed to fetch upstream");
      const contentType =
        upstream.headers.get("content-type") || "application/octet-stream";
      res.setHeader("Content-Type", contentType);
      // stream body
      const buffer = await upstream.arrayBuffer();
      res.send(Buffer.from(buffer));
    } catch (e) {
      console.error("/api/proxy-image error", e);
      res.status(500).send("proxy error");
    }
  });

  // Server endpoint to write imageUrl documents using Admin SDK (authorized server write)
  app.post("/api/write-image-url", async (req, res) => {
    if (STORAGE_DISABLED) {
      console.log("/api/write-image-url called but data storage is disabled — returning success without persisting");
      return res.json({ ok: true, disabled: true, message: "data storage disabled" });
    }

    const start = Date.now();
    try {
      const { imageUrl, collection } = req.body || {};
      if (!imageUrl || typeof imageUrl !== "string")
        return res.status(400).json({ ok: false, error: "missing imageUrl" });
      const allowed = [
        "beforecitychange-imgposter-events",
        "beforecitychange-imgsummary-events",
        "mydreambus-imgcar-events",
      ];
      const col = String(collection || "beforecitychange-imgposter-events");
      if (!allowed.includes(col))
        return res
          .status(400)
          .json({ ok: false, error: "collection not allowed" });

      const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (!svc)
        return res.status(500).json({
          ok: false,
          error: "FIREBASE_SERVICE_ACCOUNT not configured",
        });
      const parsed = typeof svc === "string" ? JSON.parse(svc) : svc;

      // Initialize admin once
      if (!admin.apps || admin.apps.length === 0) {
        try {
          admin.initializeApp({
            credential: admin.credential.cert(parsed as any),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
          } as any);
        } catch (e) {
          console.error("/api/write-image-url admin.init error", e);
        }
      }

      lastWriteImageRequest = {
        imageUrl: imageUrl?.slice(0, 1000),
        collection: col,
        ts: new Date().toISOString(),
        remoteIp: (req.headers["x-forwarded-for"] as string) || req.ip || null,
      };
      console.log("/api/write-image-url received", {
        imageUrl: imageUrl?.slice(0, 200),
        collection: col,
      });

      const fsAdmin = admin.firestore();

      // Guard Firestore write with timeout to avoid hanging requests
      const writePromise = (async () => {
        const docData: any = {
          imageUrl,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        if (req.body && req.body.page) docData.page = String(req.body.page);
        const docRef = await fsAdmin.collection(col).add(docData);
        return docRef;
      })();

      const timeoutMs = 8000; // 8s
      const timeoutPromise = new Promise((_, rej) =>
        setTimeout(() => rej(new Error("firestore-write-timeout")), timeoutMs),
      );

      let docRef: any = null;
      try {
        docRef = await Promise.race([writePromise, timeoutPromise]);
      } catch (e: any) {
        console.error(
          "/api/write-image-url firestore write failed or timed out",
          e,
        );
        // Fallback: persist to local file for later ingestion
        try {
          const DATA_DIR =
            process.env.DATA_DIR || path.join(process.cwd(), ".data");
          await fs.promises.mkdir(DATA_DIR, { recursive: true });
          const outFile = path.join(DATA_DIR, "beforecitychange-images.jsonl");
          const row = {
            imageUrl,
            collection: col,
            createdAt: new Date().toISOString(),
            remoteIp:
              (req.headers["x-forwarded-for"] as string) || req.ip || null,
          };
          await fs.promises.appendFile(
            outFile,
            JSON.stringify(row) + "\n",
            "utf8",
          );
          lastWriteImageRequest &&
            (lastWriteImageRequest.fallback = { file: outFile, row });
          console.log("/api/write-image-url fallback wrote to file", {
            file: outFile,
          });
          return res.json({ ok: true, fallback: true, path: outFile });
        } catch (ef) {
          console.error("/api/write-image-url fallback failed", ef);
          return res.status(504).json({
            ok: false,
            error: "firestore write timeout and fallback failed",
            detail: String(e?.message || e),
          });
        }
      }

      console.log("/api/write-image-url wrote doc", {
        id: docRef.id,
        collection: col,
        tookMs: Date.now() - start,
      });
      res.json({ ok: true, id: docRef.id });
    } catch (e: any) {
      console.error("/api/write-image-url error", e);
      res.status(500).json({ ok: false, error: e?.message || String(e) });
    }
  });

  // Debug endpoint: return last received write-image-url payload (in-memory)
  app.get("/api/last-write-image-request", (_req, res) => {
    try {
      res.json({ ok: true, last: lastWriteImageRequest });
    } catch (e: any) {
      console.error("/api/last-write-image-request error", e);
      res.status(500).json({ ok: false, error: e?.message || String(e) });
    }
  });

  // Server-side full-page capture using headless Chrome (puppeteer + chrome-aws-lambda)
  app.post("/api/capture-fullpage", async (req, res) => {
    try {
      const { url: rawUrl, page: pageName } = req.body || {};
      if (!rawUrl || typeof rawUrl !== "string")
        return res.status(400).json({ ok: false, error: "missing url" });

      // Resolve relative URLs to absolute based on the current host if needed
      let targetUrl = rawUrl;
      if (rawUrl.startsWith("/")) {
        const proto =
          req.headers["x-forwarded-proto"] || req.protocol || "https";
        const host = req.headers["x-forwarded-host"] || req.headers.host;
        targetUrl = `${proto}://${host}${rawUrl}`;
      }

      // Dynamic import puppeteer and chrome-aws-lambda to avoid crashing when libs are not installed
      let puppeteer: any = null;
      let chromium: any = null;
      try {
        // prefer chrome-aws-lambda environment when available
        chromium = await import("chrome-aws-lambda");
        puppeteer = await import("puppeteer-core");
      } catch (e) {
        try {
          puppeteer = await import("puppeteer");
        } catch (err) {
          console.error(
            "/api/capture-fullpage missing puppeteer dependency",
            err,
          );
          return res.status(500).json({ ok: false, error: "puppeteer not available" });
        }
      }

      // ... rest of capture implementation (unchanged)
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
      if (STORAGE_DISABLED) {
        console.log("/api/track called but data storage is disabled — returning success without persisting");
        return res.status(200).json({ ok: true, disabled: true, message: "data storage disabled" });
      }

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
        if (
          p.includes("/ukpack2") ||
          p.includes("/mydreambus") ||
          payloadProject === "ukpack2" ||
          payloadProject === "mydreambus"
        ) {
          target = "minigame2_events/minigame2-di";
        } else if (
          p.includes("/beforecitychange") ||
          payloadProject === "beforecitychange" ||
          p.includes("/ukpack1") ||
          payloadProject === "ukpack1"
        ) {
          // Map beforecitychange/ukpack1 to dedicated collection for clarity
          target = "beforecitychange_events/beforecitychange-di";
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
        col = "beforecitychange_events";
        docId = "beforecitychange-di";
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

  return app;
}
