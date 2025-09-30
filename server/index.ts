import "dotenv/config";
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
          return res.status(501).json({
            ok: false,
            error:
              "puppeteer not available on server. Install puppeteer or chrome-aws-lambda + puppeteer-core",
          });
        }
      }

      // Launch browser
      let browser: any = null;
      try {
        if (chromium && puppeteer) {
          const executablePath = await chromium.executablePath;
          browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: executablePath || undefined,
            headless: chromium.headless,
          });
        } else {
          // fallback to bundled puppeteer
          browser = await puppeteer.launch({ headless: true });
        }
      } catch (e) {
        console.error("/api/capture-fullpage browser launch failed", e);
        return res.status(500).json({
          ok: false,
          error: "failed to launch headless browser",
          detail: String(e?.message || e),
        });
      }

      let screenshotBuf: Buffer | null = null;
      try {
        const page = await browser.newPage();
        // set a larger viewport to help rendering responsive content
        await page.setViewport({ width: 1200, height: 900 });
        // navigate
        await page.goto(targetUrl, {
          waitUntil: ["networkidle2", "domcontentloaded"],
          timeout: 30000,
        });

        // give extra time for lazy images to load
        await page.evaluate(() => {
          return new Promise((resolve) => {
            setTimeout(resolve, 600);
          });
        });

        // Remove sticky/footer in page before capture (best-effort)
        await page.evaluate(() => {
          try {
            const foot = document.querySelector("footer");
            if (foot && foot.parentNode) foot.parentNode.removeChild(foot);
            const stickies = document.querySelectorAll(
              '[style*="position: sticky"], [style*="position: fixed"], .figma-style1-button-container',
            );
            stickies.forEach(
              (s) => ((s as HTMLElement).style.display = "none"),
            );
          } catch (_) {}
        });

        // Capture full page
        screenshotBuf = await page.screenshot({
          fullPage: true,
          type: "jpeg",
          quality: 86,
        });
        await page.close();
      } catch (e) {
        console.error("/api/capture-fullpage screenshot failed", e);
      } finally {
        try {
          if (browser) await browser.close();
        } catch (_) {}
      }

      if (!screenshotBuf)
        return res.status(500).json({ ok: false, error: "screenshot failed" });

      // Upload to Firebase Storage using admin SDK
      try {
        if (!admin.apps || admin.apps.length === 0) {
          const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
          if (svc) {
            const parsed = typeof svc === "string" ? JSON.parse(svc) : svc;
            admin.initializeApp({
              credential: admin.credential.cert(parsed as any),
              storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
            } as any);
          } else {
            console.warn("/api/capture-fullpage no service account configured");
          }
        }
        const bucket = admin.storage().bucket();
        const ts = Date.now();
        const filename = `mn2-step2-summary_${ts}.jpg`;
        const filePath = `beforecitychange/minigame-summary-captures/${filename}`;
        const file = bucket.file(filePath);
        await file.save(screenshotBuf, {
          metadata: { contentType: "image/jpeg" },
        });

        // generate signed URL
        const [signedUrl] = await file.getSignedUrl({
          action: "read",
          expires: "03-01-2500",
        });

        // Save into Firestore collection beforecitychange-imgsummary-events
        try {
          const fsAdmin = admin.firestore();
          const docRef = await fsAdmin
            .collection("beforecitychange-imgsummary-events")
            .add({
              imageUrl: signedUrl,
              page: pageName || "Step2_Summary",
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
          // respond
          return res.json({
            ok: true,
            storagePath: filePath,
            imageUrl: signedUrl,
            docId: docRef.id,
          });
        } catch (e) {
          console.error("/api/capture-fullpage firestore write failed", e);
          return res.json({
            ok: true,
            storagePath: filePath,
            imageUrl: signedUrl,
            docId: null,
          });
        }
      } catch (e) {
        console.error("/api/capture-fullpage upload failed", e);
        return res.status(500).json({
          ok: false,
          error: "upload failed",
          detail: String(e?.message || e),
        });
      }
    } catch (e: any) {
      console.error("/api/capture-fullpage error", e);
      res.status(500).json({ ok: false, error: e?.message || String(e) });
    }
  });

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

  // Flush pending submissions posted by clients (batch)
  app.post("/api/flush-pending", async (req, res) => {
    try {
      const items = Array.isArray(req.body) ? req.body : req.body?.items || [];
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ ok: false, error: "no items" });
      }

      // Try admin SDK if service account is available
      const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (svc) {
        try {
          const parsed = typeof svc === "string" ? JSON.parse(svc) : svc;
          if (!admin.apps || admin.apps.length === 0) {
            admin.initializeApp({
              credential: admin.credential.cert(parsed as any),
              storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
            } as any);
          }
          const dbAdmin = admin.database ? admin.database() : null;
          const fsAdmin = admin.firestore ? admin.firestore() : null;

          // If RTDB URL present, use Realtime DB 'submissions' path
          if (process.env.FIREBASE_DATABASE_URL && dbAdmin) {
            const refSub = dbAdmin.ref("submissions");
            for (const it of items) {
              await refSub.push(it);
            }
            return res.json({ ok: true, written: items.length });
          }

          // Otherwise write to Firestore collection 'submissions' as fallback
          if (fsAdmin) {
            const col = fsAdmin.collection("submissions");
            for (const it of items) {
              await col.add(it);
            }
            return res.json({ ok: true, written: items.length });
          }
        } catch (e) {
          console.warn("flush-pending admin write failed", e);
          // fallthrough to attempt client SDK path
        }
      }

      // Fallback: write to local file for later manual processing
      try {
        const DATA_DIR =
          process.env.DATA_DIR || path.join(process.cwd(), ".data");
        fs.mkdirSync(DATA_DIR, { recursive: true });
        const outFile = path.join(DATA_DIR, "pending-submissions.jsonl");
        for (const it of items) {
          await fs.promises.appendFile(
            outFile,
            JSON.stringify(it) + "\n",
            "utf8",
          );
        }
        return res.json({ ok: true, written: items.length, fallback: true });
      } catch (e) {
        console.error("flush-pending file write failed", e);
        return res
          .status(500)
          .json({ ok: false, error: "failed to persist items" });
      }
    } catch (e: any) {
      console.error("flush-pending error", e);
      res.status(500).json({ ok: false, error: e?.message || "failed" });
    }
  });

  // Upload design image via server (client posts base64 image). Server uses Admin SDK to
  // upload to Firebase Storage and write a Firestore document with the image URL.
  app.post("/api/upload-design", async (req, res) => {
    try {
      const { imageBase64, filename, project } = req.body || {};
      if (!imageBase64 || typeof imageBase64 !== "string") {
        return res
          .status(400)
          .json({ ok: false, error: "missing imageBase64" });
      }

      // Normalize and strip data URI prefix if present
      let base64 = imageBase64;
      const m = String(imageBase64).match(/^data:(.+);base64,(.*)$/);
      if (m) base64 = m[2];

      const buffer = Buffer.from(base64, "base64");

      const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (!svc)
        return res.status(500).json({
          ok: false,
          error: "FIREBASE_SERVICE_ACCOUNT not configured",
        });
      const parsed = typeof svc === "string" ? JSON.parse(svc) : svc;
      if (!admin.apps || admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.cert(parsed as any),
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
        } as any);
      }

      const bucket = admin.storage().bucket();
      const projectPrefix =
        project === "beforecitychange" ? "beforecitychange" : "mydreambus";
      const safeFilename =
        filename && typeof filename === "string"
          ? filename.replace(/[^a-zA-Z0-9._-]/g, "_")
          : `design_${Date.now()}.png`;
      const finalPath = `${projectPrefix}/designs/${safeFilename}`;
      const file = bucket.file(finalPath);

      // compute SHA-256 hash of buffer for verification metadata
      let clientHash: string | null = null;
      try {
        const crypto = require("crypto");
        clientHash = crypto.createHash("sha256").update(buffer).digest("hex");
      } catch (e) {
        clientHash = null;
      }

      // upload buffer with custom metadata (clientHash)
      const saveOptions: any = {
        resumable: false,
        contentType: "image/png",
        public: false,
      };
      if (clientHash) {
        saveOptions.metadata = {
          metadata: {
            clientHash,
            clientTimestamp: new Date().toISOString(),
          },
        };
      }
      await file.save(buffer, saveOptions);

      // generate signed URL (long expiry)
      const [signedUrl] = await file.getSignedUrl({
        action: "read",
        expires: "03-01-2500",
      });

      // Write Firestore doc referencing the URL
      const fsAdmin = admin.firestore();
      // Choose collection by project (updated names)
      const colName =
        project === "beforecitychange"
          ? "beforecitychange-imgposter-events"
          : "mydreambus-imgcar-events";
      const col = fsAdmin.collection(colName);
      const docRef = await col.add({
        imageUrl: signedUrl,
        clientHash: clientHash || null,
        path: finalPath,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.json({
        ok: true,
        imageUrl: signedUrl,
        id: docRef.id,
        path: finalPath,
      });
    } catch (e: any) {
      console.error("upload-design error", e);
      res.status(500).json({ ok: false, error: e?.message || String(e) });
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
        col = "beforecitychange_events";
        docId = "beforecitychange-di";
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

  // Import any server-pending submissions (.data/pending-submissions.jsonl) into Firestore 'submissions' collection
  app.post("/api/import-pending-to-submissions", async (req, res) => {
    try {
      const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (!svc)
        return res.status(400).json({
          ok: false,
          error: "FIREBASE_SERVICE_ACCOUNT not configured",
        });
      const parsed = typeof svc === "string" ? JSON.parse(svc) : svc;
      if (!admin.apps || admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.cert(parsed as any),
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
        } as any);
      }
      const fsAdmin = admin.firestore ? admin.firestore() : null;
      if (!fsAdmin)
        return res
          .status(500)
          .json({ ok: false, error: "admin.firestore unavailable" });

      const DATA_DIR =
        process.env.DATA_DIR || path.join(process.cwd(), ".data");
      const pendingFile = path.join(DATA_DIR, "pending-submissions.jsonl");
      if (!fs.existsSync(pendingFile))
        return res.json({ ok: true, processed: 0, written: 0 });

      const raw = await fs.promises.readFile(pendingFile, "utf8");
      const lines = raw.split(/\n+/).filter(Boolean);
      if (lines.length === 0)
        return res.json({ ok: true, processed: 0, written: 0 });

      const col = fsAdmin.collection("submissions");
      let processed = 0;
      let written = 0;
      const errors: any[] = [];

      for (const ln of lines) {
        try {
          const obj = JSON.parse(ln);
          // Map raw submission to session-mapped row if needed
          let row: any = null;
          if (!obj) continue;
          if (
            obj.firstTimestamp ||
            obj.lastTimestamp ||
            obj.PDPA_acceptance ||
            obj.sessionID
          ) {
            row = obj;
          } else if (
            obj.chassis ||
            obj.seating ||
            obj.serviceInfo ||
            obj.exterior
          ) {
            const sessionID =
              obj.sessionID || obj.sessionId || obj.session || "";
            const firstTS =
              obj.firstTimestamp ||
              obj.first_time ||
              obj.timestamp ||
              obj.createdAt ||
              "";
            const lastTS =
              obj.lastTimestamp ||
              obj.last_time ||
              obj.timestamp ||
              obj.createdAt ||
              "";
            const pdpa =
              obj.PDPA === true || obj.PDPA === "accepted" || obj.PDPA === "1"
                ? "1"
                : "";
            const seating = obj.seating || obj.seatingInfo || obj.seat || {};
            const totalSeats =
              seating &&
              (seating.totalSeats ||
                seating.total_seats ||
                seating.total ||
                seating.totalSeat)
                ? seating.totalSeats ||
                  seating.total_seats ||
                  seating.total ||
                  seating.totalSeat
                : "";
            const specialSeats =
              seating &&
              (seating.specialSeats ||
                seating.special_seats ||
                seating.special ||
                seating.specialSeat)
                ? seating.specialSeats ||
                  seating.special_seats ||
                  seating.special ||
                  seating.specialSeat
                : "";
            const childElder =
              seating &&
              (seating.childElderSeats ||
                seating.child_elder_seats ||
                seating.childElder ||
                seating.childElderSeats)
                ? seating.childElderSeats ||
                  seating.child_elder_seats ||
                  seating.childElder ||
                  seating.childElderSeats
                : "";
            const pregnant =
              seating &&
              (seating.pregnantSeats ||
                seating.pregnant ||
                seating.pregnant_seats)
                ? seating.pregnantSeats ||
                  seating.pregnant ||
                  seating.pregnant_seats
                : "";
            const monk =
              seating &&
              (seating.monkSeats || seating.monk || seating.monk_seats)
                ? seating.monkSeats || seating.monk || seating.monk_seats
                : "";
            const featuresArr = Array.isArray(obj.amenities)
              ? obj.amenities
              : Array.isArray(obj.features)
                ? obj.features
                : [];
            const paymentArr = Array.isArray(obj.paymentMethods)
              ? obj.paymentMethods
              : Array.isArray(obj.payment)
                ? obj.payment
                : Array.isArray(obj.payment_methods)
                  ? obj.payment_methods
                  : [];
            const doors =
              obj.doors ||
              (obj.doorConfig &&
                (obj.doorConfig.doorChoice || obj.doorConfig.doors)) ||
              "";
            let colorVal = "";
            try {
              if (obj.color) colorVal = String(obj.color);
              else if (obj.exterior && obj.exterior.color) {
                if (typeof obj.exterior.color === "string") {
                  try {
                    const parsedEx = JSON.parse(obj.exterior.color);
                    colorVal = parsedEx.colorHex || parsedEx.color || "";
                  } catch (e) {
                    colorVal = obj.exterior.color || "";
                  }
                } else if (typeof obj.exterior.color === "object") {
                  colorVal =
                    obj.exterior.color.colorHex ||
                    obj.exterior.color.color ||
                    "";
                }
              } else if (obj.exterior && obj.exterior.colorHex) {
                colorVal = obj.exterior.colorHex;
              }
            } catch (e) {
              colorVal = "";
            }
            const frequency =
              obj.frequency ||
              (obj.serviceInfo &&
                (obj.serviceInfo.frequency || obj.serviceInfo.freq)) ||
              obj.interval ||
              "";
            const route =
              obj.route ||
              (obj.serviceInfo &&
                (obj.serviceInfo.routeName || obj.serviceInfo.route)) ||
              "";
            const area =
              obj.area || (obj.serviceInfo && obj.serviceInfo.area) || "";
            const decisionUseService =
              obj.decisionUseService || obj.decision_use_service || "";
            const reasonNotUse =
              obj.reasonNotUse || obj.reason_not_use || obj.reason || "";
            const enterPrize =
              obj.enterPrize ||
              obj.prizeName ||
              obj.prizePhone ||
              obj.prize_name ||
              obj.prize_phone
                ? "1"
                : "";
            const prizeName = obj.prizeName || obj.prize_name || "";
            const prizePhone = obj.prizePhone || obj.prize_phone || "";
            const shared =
              (obj.userEngagement &&
                (obj.userEngagement.shared || obj.userEngagement.sharedTo)) ||
              obj.shared ||
              false;

            row = {
              sessionID: sessionID,
              ip: obj.ip || "",
              firstTimestamp: firstTS,
              lastTimestamp: lastTS,
              PDPA_acceptance: pdpa,
              chassis_type:
                obj.chassis || (obj.design && obj.design.chassis) || "",
              total_seats: totalSeats || "",
              special_seats: specialSeats || "",
              children_elder_count: childElder || "",
              pregnant_count: pregnant || "",
              monk_count: monk || "",
              features: Array.isArray(featuresArr) ? featuresArr : [],
              payment_types: Array.isArray(paymentArr) ? paymentArr : [],
              doors: doors || "",
              color: colorVal || "",
              frequency: frequency || "",
              route: route || "",
              area: area || "",
              decision_use_service: decisionUseService || "",
              reason_not_use: reasonNotUse || "",
              decision_enter_prize: enterPrize || "",
              prize_name: prizeName || "",
              prize_phone: prizePhone || "",
              prize_timestamp: "",
              shared_with_friends: shared ? "1" : "",
              shared_timestamp: "",
            };
          } else {
            // Unknown shape — skip
            continue;
          }

          processed++;
          try {
            await col.add(row);
            written++;
          } catch (e) {
            errors.push({ line: ln, error: String(e) });
          }
        } catch (e) {
          errors.push({ line: ln, error: String(e) });
        }
      }

      // Move existing pending file to processed archive
      try {
        const archive = path.join(
          DATA_DIR,
          "pending-submissions.processed." + Date.now() + ".jsonl",
        );
        await fs.promises.rename(pendingFile, archive);
      } catch (e) {
        // ignore
      }

      res.json({ ok: true, processed, written, errors });
    } catch (e: any) {
      console.error("import-pending failed", e);
      res.status(500).json({ ok: false, error: e?.message || String(e) });
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
      const DATA_DIR =
        process.env.DATA_DIR || path.join(process.cwd(), ".data");
      await fs.promises.mkdir(DATA_DIR, { recursive: true });
      const fileUk = path.join(DATA_DIR, "public_ukpack2.json");
      const fileMy = path.join(DATA_DIR, "public_mydreambus.json");
      const payload = req.body;
      await Promise.all([
        fs.promises.writeFile(
          fileUk,
          JSON.stringify(payload, null, 2),
          "utf-8",
        ),
        fs.promises.writeFile(
          fileMy,
          JSON.stringify(payload, null, 2),
          "utf-8",
        ),
      ]);
      res.status(200).json({ ok: true, files: [fileUk, fileMy] });
    } catch (e: any) {
      res
        .status(500)
        .json({ ok: false, error: e?.message || "failed to publish" });
    }
  });

  app.get("/api/mydreambus/public", async (_req, res) => {
    try {
      const DATA_DIR =
        process.env.DATA_DIR || path.join(process.cwd(), ".data");
      const fileMy = path.join(DATA_DIR, "public_mydreambus.json");
      const fileUk = path.join(DATA_DIR, "public_ukpack2.json");
      let file = fileMy;
      if (!fs.existsSync(fileMy) && fs.existsSync(fileUk)) file = fileUk;
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

  // Server-side CSV export for mydreambus (one request returns mapped CSV)
  app.get("/api/mydreambus/export-csv", async (req, res) => {
    try {
      const limit = req.query.limit
        ? Math.max(1, Math.min(500, Number(req.query.limit)))
        : 200;

      // Preferred source: server-side 'submissions' collection written by flush-pending
      try {
        const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
        if (svc) {
          try {
            const parsed = typeof svc === "string" ? JSON.parse(svc) : svc;
            if (!admin.apps || admin.apps.length === 0) {
              admin.initializeApp({
                credential: admin.credential.cert(parsed as any),
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
              } as any);
            }
            const fsAdmin = admin.firestore();
            const colRef = fsAdmin.collection("submissions");
            const snap = await colRef.limit(limit).get();
            if (snap && snap.size > 0) {
              const headers = [
                "ร���ัสเซสชัน (sessionID)",
                "IP (ip)",
                "เวลาเริ่ม (firstTimestamp)",
                "เวลาสิ้นสุด (lastTimestamp)",
                "ย���มรับ PDPA (PDPA_acceptance)",
                "ประเภทรถ (chassis_type)",
                "จำนวนที่นั่งร��ม (total_seats)",
                "ที่นั่งพิเศษ (special_seats)",
                "จำนวนเด��ก/ผู้สูงอายุ (children_elder_count)",
                "จำนวนผู้ตั้งครรภ์ (pregnant_count)",
                "จำนวนพระ (monk_count)",
                "สิ่งอำนวยความสะดวก (features)",
                "ประเภทก���รชำระเงิน (payment_types)",
                "จำนวนประตู (doors)",
                "สี (color)",
                "ความถี่ (frequency)",
                "เส้นท���ง (route)",
                "พื้นที่ (area)",
                "ตัดสินใจใช้บริการ (decision_use_service)",
                "เหตุผลไม่ใช้บริ���าร (reason_not_use)",
                "เข้าร่วมของรางวัล (decision_enter_prize)",
                "ชื่อผู้รับรางวัล (prize_name)",
                "เบอร์โทรผู้รับรางวัล (prize_phone)",
                "เวลาการรับรางวัล (prize_timestamp)",
                "แชร์กับเพื่อน (shared_with_friends)",
                "เวลาแชร์ (shared_timestamp)",
              ];

              const csvRows: string[] = [
                headers
                  .map((h) => '"' + String(h || "").replace(/"/g, '""') + '"')
                  .join(","),
              ];

              snap.forEach((d) => {
                const data = d.data() || {};
                const vals = [
                  data.sessionID || data.sessionId || "",
                  data.ip || "",
                  formatToBangkok(data.firstTimestamp || ""),
                  formatToBangkok(data.lastTimestamp || ""),
                  data.PDPA_acceptance || "",
                  data.chassis_type || "",
                  data.total_seats || "",
                  data.special_seats || "",
                  data.children_elder_count || "",
                  data.pregnant_count || "",
                  data.monk_count || "",
                  Array.isArray(data.features)
                    ? data.features.join(" | ")
                    : data.features || "",
                  Array.isArray(data.payment_types)
                    ? data.payment_types.join(" | ")
                    : data.payment_types || "",
                  data.doors || "",
                  data.color || "",
                  data.frequency || "",
                  data.route || "",
                  data.area || "",
                  data.decision_use_service || "",
                  data.reason_not_use || "",
                  data.decision_enter_prize || "",
                  data.prize_name || "",
                  data.prize_phone || "",
                  data.prize_timestamp || "",
                  data.shared_with_friends || "",
                  data.shared_timestamp || "",
                ];
                const safe = vals.map(
                  (f) => '"' + String(f || "").replace(/"/g, '""') + '"',
                );
                csvRows.push(safe.join(","));
              });

              const csvOut = csvRows.join("\n");
              res.setHeader("Content-Type", "text/csv; charset=utf-8");
              res.setHeader(
                "Content-Disposition",
                'attachment; filename="mydreambus-sessions-' +
                  Date.now() +
                  '.csv"',
              );
              return res.status(200).send("\uFEFF" + csvOut);
            }
          } catch (e) {
            console.warn(
              "export-csv: failed to read submissions collection",
              e,
            );
          }
        }
      } catch (e) {
        console.warn("export-csv: admin init failed", e);
      }

      // If admin collection was empty or unavailable, also try reading server fallback pending file
      try {
        const DATA_DIR =
          process.env.DATA_DIR || path.join(process.cwd(), ".data");
        const pendingFile = path.join(DATA_DIR, "pending-submissions.jsonl");
        if (fs.existsSync(pendingFile)) {
          try {
            const raw = await fs.promises.readFile(pendingFile, "utf8");
            const lines = raw.split(/\n+/).filter(Boolean);
            if (lines.length > 0) {
              const headers = [
                "รหัสเซสชัน (sessionID)",
                "IP (ip)",
                "เวลาเริ่ม (firstTimestamp)",
                "เวลาสิ้นสุด (lastTimestamp)",
                "ยอมรับ PDPA (PDPA_acceptance)",
                "ประ���ภทรถ (chassis_type)",
                "จำนวนที่นั่งรวม (total_seats)",
                "ที่นั่งพิเศษ (special_seats)",
                "จำนวนเด็ก/ผู้สูงอายุ (children_elder_count)",
                "จำนวนผู้ตั้งครรภ์ (pregnant_count)",
                "จำ���วนพระ (monk_count)",
                "ส��่งอำนวยความสะดวก (features)",
                "ประเภทการชำระเง��น (payment_types)",
                "จำนวนประตู (doors)",
                "สี (color)",
                "ความถี่ (frequency)",
                "เ��้นทาง (route)",
                "พื้นที่ (area)",
                "ตัดส���นใจใช้บริการ (decision_use_service)",
                "���หตุ��ลไม่ใช้บริการ (reason_not_use)",
                "เข้าร่วมของรางวัล (decision_enter_prize)",
                "ชื่อผู้�����ับรางวัล (prize_name)",
                "เบอร์โทรผู้รับรางวัล (prize_phone)",
                "เวลาการรับรางวัล (prize_timestamp)",
                "แชร์กับเพื่อน (shared_with_friends)",
                "เวลาแชร์ (shared_timestamp)",
              ];

              const csvRows: string[] = [
                headers
                  .map((h) => '"' + String(h || "").replace(/"/g, '""') + '"')
                  .join(","),
              ];

              let count = 0;
              for (const ln of lines) {
                if (count >= limit) break;
                try {
                  const obj = JSON.parse(ln);
                  // Only include already-mapped session rows (presence of firstTimestamp or PDPA_acceptance)
                  if (obj) {
                    // If already a mapped session row, accept it
                    if (
                      obj.firstTimestamp ||
                      obj.lastTimestamp ||
                      obj.PDPA_acceptance ||
                      obj.sessionID
                    ) {
                      const vals = [
                        obj.sessionID || obj.sessionId || "",
                        obj.ip || "",
                        formatToBangkok(
                          obj.firstTimestamp || obj.firstTimestamp || "",
                        ),
                        formatToBangkok(
                          obj.lastTimestamp || obj.lastTimestamp || "",
                        ),
                        obj.PDPA_acceptance ||
                          obj.PDPA ||
                          (obj.PDPA === true ? "1" : "") ||
                          "",
                        obj.chassis_type || obj.chassis || "",
                        obj.total_seats || obj.totalSeats || "",
                        obj.special_seats || "",
                        obj.children_elder_count || "",
                        obj.pregnant_count || "",
                        obj.monk_count || "",
                        Array.isArray(obj.features)
                          ? obj.features.join(" | ")
                          : obj.features || "",
                        Array.isArray(obj.payment_types)
                          ? obj.payment_types.join(" | ")
                          : obj.paymentTypes || obj.payment_methods || "",
                        obj.doors ||
                          (obj.doorConfig && obj.doorConfig.doorChoice) ||
                          "",
                        obj.color ||
                          (obj.exterior &&
                            (obj.exterior.color || obj.exterior.colorHex)) ||
                          "",
                        obj.frequency ||
                          obj.serviceInfo?.frequency ||
                          obj.interval ||
                          "",
                        obj.route || obj.serviceInfo?.routeName || "",
                        obj.area || obj.serviceInfo?.area || "",
                        obj.decision_use_service ||
                          obj.decisionUseService ||
                          "",
                        obj.reason_not_use ||
                          obj.reasonNotUse ||
                          obj.reason ||
                          "",
                        obj.decision_enter_prize ||
                          obj.enterPrize ||
                          (obj.prizeName ? "1" : "") ||
                          "",
                        obj.prize_name || obj.prizeName || "",
                        obj.prize_phone || obj.prizePhone || "",
                        obj.prize_timestamp || "",
                        obj.shared_with_friends ||
                          (obj.userEngagement && obj.userEngagement.shared
                            ? "1"
                            : "") ||
                          "",
                        obj.shared_timestamp || "",
                      ];
                      const safe = vals.map(
                        (f) => '"' + String(f || "").replace(/"/g, '""') + '"',
                      );
                      csvRows.push(safe.join(","));
                      count++;
                    } else if (
                      obj.chassis ||
                      obj.seating ||
                      obj.serviceInfo ||
                      obj.exterior
                    ) {
                      // Looks like a raw design submission — map to session row (handle multiple naming variants)
                      const sessionID =
                        obj.sessionID || obj.sessionId || obj.session || "";

                      const firstTS =
                        obj.firstTimestamp ||
                        obj.first_time ||
                        obj.timestamp ||
                        obj.createdAt ||
                        "";
                      const lastTS =
                        obj.lastTimestamp ||
                        obj.last_time ||
                        obj.timestamp ||
                        obj.createdAt ||
                        "";

                      const pdpa =
                        obj.PDPA === true ||
                        obj.PDPA === "accepted" ||
                        obj.PDPA === "1"
                          ? "1"
                          : "";

                      const seating =
                        obj.seating || obj.seatingInfo || obj.seat || {};
                      const totalSeats =
                        seating &&
                        (seating.totalSeats ||
                          seating.total_seats ||
                          seating.total ||
                          seating.totalSeat)
                          ? seating.totalSeats ||
                            seating.total_seats ||
                            seating.total ||
                            seating.totalSeat
                          : "";
                      const specialSeats =
                        seating &&
                        (seating.specialSeats ||
                          seating.special_seats ||
                          seating.special ||
                          seating.specialSeat)
                          ? seating.specialSeats ||
                            seating.special_seats ||
                            seating.special ||
                            seating.specialSeat
                          : "";
                      const childElder =
                        seating &&
                        (seating.childElderSeats ||
                          seating.child_elder_seats ||
                          seating.childElder ||
                          seating.childElderSeats)
                          ? seating.childElderSeats ||
                            seating.child_elder_seats ||
                            seating.childElder ||
                            seating.childElderSeats
                          : "";
                      const pregnant =
                        seating &&
                        (seating.pregnantSeats ||
                          seating.pregnant ||
                          seating.pregnant_seats)
                          ? seating.pregnantSeats ||
                            seating.pregnant ||
                            seating.pregnant_seats
                          : "";
                      const monk =
                        seating &&
                        (seating.monkSeats ||
                          seating.monk ||
                          seating.monk_seats)
                          ? seating.monkSeats ||
                            seating.monk ||
                            seating.monk_seats
                          : "";

                      const featuresArr = Array.isArray(obj.amenities)
                        ? obj.amenities
                        : Array.isArray(obj.features)
                          ? obj.features
                          : [];
                      const paymentArr = Array.isArray(obj.paymentMethods)
                        ? obj.paymentMethods
                        : Array.isArray(obj.payment)
                          ? obj.payment
                          : Array.isArray(obj.payment_methods)
                            ? obj.payment_methods
                            : [];

                      // doors
                      const doors =
                        obj.doors ||
                        (obj.doorConfig &&
                          (obj.doorConfig.doorChoice ||
                            obj.doorConfig.doors)) ||
                        "";

                      // color may be a JSON string or nested object
                      let colorVal = "";
                      try {
                        if (obj.color) colorVal = String(obj.color);
                        else if (obj.exterior && obj.exterior.color) {
                          if (typeof obj.exterior.color === "string") {
                            try {
                              const parsed = JSON.parse(obj.exterior.color);
                              colorVal = parsed.colorHex || parsed.color || "";
                            } catch (e) {
                              colorVal = obj.exterior.color || "";
                            }
                          } else if (typeof obj.exterior.color === "object") {
                            colorVal =
                              obj.exterior.color.colorHex ||
                              obj.exterior.color.color ||
                              "";
                          }
                        } else if (obj.exterior && obj.exterior.colorHex) {
                          colorVal = obj.exterior.colorHex;
                        }
                      } catch (e) {
                        colorVal = "";
                      }

                      const frequency =
                        obj.frequency ||
                        (obj.serviceInfo &&
                          (obj.serviceInfo.frequency ||
                            obj.serviceInfo.freq)) ||
                        obj.interval ||
                        "";
                      const route =
                        obj.route ||
                        (obj.serviceInfo &&
                          (obj.serviceInfo.routeName ||
                            obj.serviceInfo.route)) ||
                        "";
                      const area =
                        obj.area ||
                        (obj.serviceInfo && obj.serviceInfo.area) ||
                        "";

                      const decisionUseService =
                        obj.decisionUseService ||
                        obj.decision_use_service ||
                        "";
                      const reasonNotUse =
                        obj.reasonNotUse ||
                        obj.reason_not_use ||
                        obj.reason ||
                        "";

                      const enterPrize =
                        obj.enterPrize ||
                        obj.prizeName ||
                        obj.prizePhone ||
                        obj.prize_name ||
                        obj.prize_phone
                          ? "1"
                          : "";
                      const prizeName = obj.prizeName || obj.prize_name || "";
                      const prizePhone =
                        obj.prizePhone || obj.prize_phone || "";

                      const shared =
                        (obj.userEngagement &&
                          (obj.userEngagement.shared ||
                            obj.userEngagement.sharedTo)) ||
                        obj.shared ||
                        false;

                      const vals = [
                        sessionID,
                        obj.ip || "",
                        formatToBangkok(firstTS),
                        formatToBangkok(lastTS),
                        pdpa,
                        obj.chassis || (obj.design && obj.design.chassis) || "",
                        totalSeats || "",
                        specialSeats || "",
                        childElder || "",
                        pregnant || "",
                        monk || "",
                        Array.isArray(featuresArr)
                          ? featuresArr.join(" | ")
                          : "",
                        Array.isArray(paymentArr) ? paymentArr.join(" | ") : "",
                        doors || "",
                        colorVal || "",
                        frequency || "",
                        route || "",
                        area || "",
                        decisionUseService || "",
                        reasonNotUse || "",
                        enterPrize || "",
                        prizeName || "",
                        prizePhone || "",
                        "",
                        shared ? "1" : "",
                        "",
                      ];
                      const safe = vals.map(
                        (f) => '"' + String(f || "").replace(/"/g, '""') + '"',
                      );
                      csvRows.push(safe.join(","));
                      count++;
                    }
                  }
                } catch (e) {
                  // ignore parse errors
                }
              }

              if (csvRows.length > 1) {
                const csvOut = csvRows.join("\n");
                res.setHeader("Content-Type", "text/csv; charset=utf-8");
                res.setHeader(
                  "Content-Disposition",
                  'attachment; filename="mydreambus-sessions-' +
                    Date.now() +
                    '.csv"',
                );
                return res.status(200).send("\uFEFF" + csvOut);
              }
            }
          } catch (e) {
            console.warn(
              "export-csv: failed to read pending submissions file",
              e,
            );
          }
        }
      } catch (e) {
        console.warn("export-csv: pending-file check failed", e);
      }

      // Fallback to existing behavior which computes from events
      const { computeSessionSummaries, getAppEventsBySession } = await import(
        "./services/appEvents"
      );
      const summaries = await computeSessionSummaries(limit);

      const headers = [
        "รหัสเซสชัน (sessionID)",
        "IP (ip)",
        "เวลาเริ่ม (firstTimestamp)",
        "เวลาส���้นสุด (lastTimestamp)",
        "ยอมรับ PDPA (PDPA_acceptance)",
        "ประเภทรถ (chassis_type)",
        "จำนวนที่นั่��รวม (total_seats)",
        "ที่นั่งพิเศษ (special_seats)",
        "จำนวนเด็ก/ผู้สูงอายุ (children_elder_count)",
        "จำนวนผู้ตั้งครรภ์ (pregnant_count)",
        "จำนวน���ระ (monk_count)",
        "ส���่งอำนวยความสะดวก (features)",
        "ประเภทการช���ระเงิน (payment_types)",
        "จำนวนประตู (doors)",
        "สี (color)",
        "ความถี่ (frequency)",
        "เ���้นทาง (route)",
        "พื้นท��่ (area)",
        "ตัดสินใจใช้บริ���าร (decision_use_service)",
        "เหตุผลไม่ใช้บริกา�� (reason_not_use)",
        "เข้าร่วมของ��างวัล (decision_enter_prize)",
        "ชื่อผู้รับรางวัล (prize_name)",
        "เบอร์โทรผู้รับรางวัล (prize_phone)",
        "��วลาการรับรางวัล (prize_timestamp)",
        "แชร์กั��เพ��่อน (shared_with_friends)",
        "เวลาแชร์ (shared_timestamp)",
      ];

      const csvRows: string[] = [
        headers
          .map((h) => '"' + String(h || "").replace(/"/g, '""') + '"')
          .join(","),
      ];

      for (const s of summaries.slice(0, limit)) {
        const sid = s.sessionId || s.sessionID || String(s);
        const evs = await getAppEventsBySession(sid);
        if (!evs || evs.length === 0) continue;

        const rowObj: any = {
          sessionID: sid,
          ip: "",
          firstTimestamp: evs[0]?.timestamp || "",
          lastTimestamp: evs[evs.length - 1]?.timestamp || "",
          PDPA_acceptance: "",
          chassis_type: "",
          total_seats: "",
          special_seats: "",
          children_elder_count: "",
          pregnant_count: "",
          monk_count: "",
          features: [],
          payment_types: [],
          doors: "",
          color: "",
          frequency: "",
          route: "",
          area: "",
          decision_use_service: "",
          reason_not_use: "",
          decision_enter_prize: "",
          prize_name: "",
          prize_phone: "",
          prize_timestamp: "",
          shared_with_friends: "",
          shared_timestamp: "",
        };

        evs.forEach((e: any) => {
          const p = e.payload || {};
          if (
            rowObj.PDPA_acceptance === "" &&
            (p.PDPA === true ||
              p.pdpa === true ||
              p.PDPA === "accepted" ||
              p.pdpa === "accepted")
          )
            rowObj.PDPA_acceptance = "1";
          if (
            rowObj.PDPA_acceptance === "" &&
            (p.PDPA === false || p.pdpa === false || p.PDPA === "declined")
          )
            rowObj.PDPA_acceptance = "0";

          if (
            !rowObj.chassis_type &&
            (p.chassis || (p.design && p.design.chassis) || p.chassisType)
          )
            rowObj.chassis_type =
              p.chassis || (p.design && p.design.chassis) || p.chassisType;

          if (!rowObj.total_seats) {
            if (p.seating && p.seating.totalSeats)
              rowObj.total_seats = String(p.seating.totalSeats);
            else if (p.totalSeats) rowObj.total_seats = String(p.totalSeats);
          }
          if (!rowObj.special_seats && p.seating && p.seating.specialSeats)
            rowObj.special_seats = String(p.seating.specialSeats);

          if (!rowObj.children_elder_count && p.seating && p.seating.children)
            rowObj.children_elder_count = String(p.seating.children);
          if (
            !rowObj.pregnant_count &&
            ((p.seating && p.seating.pregnant) || p.pregnant)
          )
            rowObj.pregnant_count = String(
              (p.seating && p.seating.pregnant) || p.pregnant || "",
            );
          if (!rowObj.monk_count && ((p.seating && p.seating.monk) || p.monk))
            rowObj.monk_count = String(
              (p.seating && p.seating.monk) || p.monk || "",
            );

          if (Array.isArray(p.amenities))
            rowObj.features = Array.from(
              new Set((rowObj.features || []).concat(p.amenities)),
            );
          if (Array.isArray(p.features))
            rowObj.features = Array.from(
              new Set((rowObj.features || []).concat(p.features)),
            );

          if (Array.isArray(p.payment))
            rowObj.payment_types = Array.from(
              new Set((rowObj.payment_types || []).concat(p.payment)),
            );
          if (p.paymentType)
            rowObj.payment_types = Array.from(
              new Set((rowObj.payment_types || []).concat([p.paymentType])),
            );

          if (
            !rowObj.doors &&
            (p.doors || p.doorChoice || (p.doors && p.doors.doorChoice))
          ) {
            if (typeof p.doors === "string") rowObj.doors = p.doors;
            else if (p.doorChoice) rowObj.doors = p.doorChoice;
            else if (p.doors && p.doors.doorChoice)
              rowObj.doors = p.doors.doorChoice;
          }

          if (
            !rowObj.color &&
            ((p.color && p.color.colorHex) ||
              (p.exterior && p.exterior.color && p.exterior.color.colorHex) ||
              p.colorHex)
          )
            rowObj.color =
              (p.color && p.color.colorHex) ||
              (p.exterior && p.exterior.color && p.exterior.color.colorHex) ||
              p.colorHex ||
              "";

          if (!rowObj.frequency && (p.interval || p.frequency))
            rowObj.frequency = p.interval || p.frequency;
          if (!rowObj.route && p.route) rowObj.route = p.route;
          if (!rowObj.area && p.area) rowObj.area = p.area;

          if (
            !rowObj.decision_use_service &&
            (p.decisionUseService !== undefined || p.useService !== undefined)
          )
            rowObj.decision_use_service =
              (p.decisionUseService ?? p.useService) ? "1" : "0";

          if (
            !rowObj.reason_not_use &&
            (p.reasonNotUse || p.reason || p.reason_not_use)
          )
            rowObj.reason_not_use =
              p.reasonNotUse || p.reason || p.reason_not_use;

          if (
            !rowObj.decision_enter_prize &&
            (p.enterPrize !== undefined ||
              p.prizeEnter !== undefined ||
              p.wantsPrize !== undefined)
          )
            rowObj.decision_enter_prize =
              (p.enterPrize ?? p.prizeEnter ?? p.wantsPrize) ? "1" : "0";
          if (!rowObj.prize_name && (p.prizeName || p.name))
            rowObj.prize_name = p.prizeName || p.name;
          if (!rowObj.prize_phone && (p.prizePhone || p.phone))
            rowObj.prize_phone = p.prizePhone || p.phone;
          if (
            !rowObj.prize_timestamp &&
            e.timestamp &&
            (p.prizeName || p.prizePhone || p.enterPrize || p.wantsPrize)
          )
            rowObj.prize_timestamp = e.timestamp;

          if (!rowObj.shared_with_friends && (p.shared === true || p.sharedTo))
            rowObj.shared_with_friends = "1";
          if (!rowObj.shared_timestamp && (p.shared === true || p.sharedTo))
            rowObj.shared_timestamp = e.timestamp;
        });

        const featuresStr = Array.isArray(rowObj.features)
          ? rowObj.features.join(" | ")
          : rowObj.features || "";
        const paymentStr = Array.isArray(rowObj.payment_types)
          ? rowObj.payment_types.join(" | ")
          : rowObj.payment_types || "";

        const vals = [
          rowObj.sessionID,
          rowObj.ip || "",
          formatToBangkok(rowObj.firstTimestamp),
          formatToBangkok(rowObj.lastTimestamp),
          rowObj.PDPA_acceptance,
          rowObj.chassis_type,
          rowObj.total_seats,
          rowObj.special_seats,
          rowObj.children_elder_count,
          rowObj.pregnant_count,
          rowObj.monk_count,
          featuresStr,
          paymentStr,
          rowObj.doors,
          rowObj.color,
          rowObj.frequency,
          rowObj.route,
          rowObj.area,
          rowObj.decision_use_service,
          rowObj.reason_not_use,
          rowObj.decision_enter_prize,
          rowObj.prize_name,
          rowObj.prize_phone,
          rowObj.prize_timestamp,
          rowObj.shared_with_friends,
          rowObj.shared_timestamp,
        ];

        const safe = vals.map(
          (f) => '"' + String(f || "").replace(/"/g, '""') + '"',
        );
        csvRows.push(safe.join(","));
      }

      const csvOut = csvRows.join("\n");
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="mydreambus-sessions-' + Date.now() + '.csv"',
      );
      res.status(200).send("\uFEFF" + csvOut);
    } catch (e: any) {
      res
        .status(500)
        .json({ ok: false, error: e?.message || "failed to export csv" });
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
