import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import fetch from "node-fetch";
import { handleDemo } from "./routes/demo";
import admin from 'firebase-admin';

// Helper: format timestamp to Thailand time (Asia/Bangkok) using sv-SE for ISO-like string
function formatToBangkok(ts: any) {
  try {
    if (!ts) return '';
    const d = new Date(String(ts));
    if (isNaN(d.getTime())) return String(ts || '');
    return d.toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' });
  } catch (e) {
    return String(ts || '');
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
  app.post('/api/flush-pending', async (req, res) => {
    try {
      const items = Array.isArray(req.body) ? req.body : req.body?.items || [];
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ ok: false, error: 'no items' });
      }

      // Try admin SDK if service account is available
      const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (svc) {
        try {
          const parsed = typeof svc === 'string' ? JSON.parse(svc) : svc;
          if (!admin.apps || admin.apps.length === 0) {
            admin.initializeApp({ credential: admin.credential.cert(parsed as any) } as any);
          }
          const dbAdmin = admin.database ? admin.database() : null;
          const fsAdmin = admin.firestore ? admin.firestore() : null;

          // If RTDB URL present, use Realtime DB 'submissions' path
          if (process.env.FIREBASE_DATABASE_URL && dbAdmin) {
            const refSub = dbAdmin.ref('submissions');
            for (const it of items) {
              await refSub.push(it);
            }
            return res.json({ ok: true, written: items.length });
          }

          // Otherwise write to Firestore collection 'submissions' as fallback
          if (fsAdmin) {
            const col = fsAdmin.collection('submissions');
            for (const it of items) {
              await col.add(it);
            }
            return res.json({ ok: true, written: items.length });
          }
        } catch (e) {
          console.warn('flush-pending admin write failed', e);
          // fallthrough to attempt client SDK path
        }
      }

      // Fallback: write to local file for later manual processing
      try {
        const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), '.data');
        fs.mkdirSync(DATA_DIR, { recursive: true });
        const outFile = path.join(DATA_DIR, 'pending-submissions.jsonl');
        for (const it of items) {
          await fs.promises.appendFile(outFile, JSON.stringify(it) + '\n', 'utf8');
        }
        return res.json({ ok: true, written: items.length, fallback: true });
      } catch (e) {
        console.error('flush-pending file write failed', e);
        return res.status(500).json({ ok: false, error: 'failed to persist items' });
      }
    } catch (e: any) {
      console.error('flush-pending error', e);
      res.status(500).json({ ok: false, error: e?.message || 'failed' });
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
            const parsed = typeof svc === 'string' ? JSON.parse(svc) : svc;
            if (!admin.apps || admin.apps.length === 0) {
              admin.initializeApp({ credential: admin.credential.cert(parsed as any) } as any);
            }
            const fsAdmin = admin.firestore();
            const colRef = fsAdmin.collection('submissions');
            const snap = await colRef.limit(limit).get();
            if (snap && snap.size > 0) {
              const headers = [
                "ร���ัสเซสชัน (sessionID)",
                "IP (ip)",
                "เวลาเริ่ม (firstTimestamp)",
                "เวลาสิ้นสุด (lastTimestamp)",
                "ยอมรับ PDPA (PDPA_acceptance)",
                "ประเภทรถ (chassis_type)",
                "จำนวนที่นั่งรวม (total_seats)",
                "ที่นั่งพิเศษ (special_seats)",
                "จำนวนเด็ก/ผู้สูงอายุ (children_elder_count)",
                "จำนวนผู้ตั้งครรภ์ (pregnant_count)",
                "จำนวนพระ (monk_count)",
                "สิ่งอำนวยความสะดวก (features)",
                "ประเภทการชำระเงิน (payment_types)",
                "จำนวนประตู (doors)",
                "สี (color)",
                "ความถี่ (frequency)",
                "เส้นทาง (route)",
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
                  data.sessionID || data.sessionId || '',
                  data.ip || '',
                  formatToBangkok(data.firstTimestamp || ''),
                  formatToBangkok(data.lastTimestamp || ''),
                  data.PDPA_acceptance || '',
                  data.chassis_type || '',
                  data.total_seats || '',
                  data.special_seats || '',
                  data.children_elder_count || '',
                  data.pregnant_count || '',
                  data.monk_count || '',
                  Array.isArray(data.features) ? data.features.join(' | ') : (data.features || ''),
                  Array.isArray(data.payment_types) ? data.payment_types.join(' | ') : (data.payment_types || ''),
                  data.doors || '',
                  data.color || '',
                  data.frequency || '',
                  data.route || '',
                  data.area || '',
                  data.decision_use_service || '',
                  data.reason_not_use || '',
                  data.decision_enter_prize || '',
                  data.prize_name || '',
                  data.prize_phone || '',
                  data.prize_timestamp || '',
                  data.shared_with_friends || '',
                  data.shared_timestamp || '',
                ];
                const safe = vals.map((f) => '"' + String(f || "").replace(/"/g, '""') + '"');
                csvRows.push(safe.join(','));
              });

              const csvOut = csvRows.join('\n');
              res.setHeader('Content-Type', 'text/csv; charset=utf-8');
              res.setHeader('Content-Disposition', 'attachment; filename="mydreambus-sessions-' + Date.now() + '.csv"');
              return res.status(200).send('\uFEFF' + csvOut);
            }
          } catch (e) {
            console.warn('export-csv: failed to read submissions collection', e);
          }
        }
      } catch (e) {
        console.warn('export-csv: admin init failed', e);
      }

      // Fallback to existing behavior which computes from events
      const { computeSessionSummaries, getAppEventsBySession } = await import(
        './services/appEvents'
      );
      const summaries = await computeSessionSummaries(limit);

      const headers = [
        "รหัสเซสชัน (sessionID)",
        "IP (ip)",
        "เวลาเริ่ม (firstTimestamp)",
        "เวลาสิ้นสุด (lastTimestamp)",
        "ยอมรับ PDPA (PDPA_acceptance)",
        "ประเภทรถ (chassis_type)",
        "จำนวนที่นั่งรวม (total_seats)",
        "ที่นั่งพิเศษ (special_seats)",
        "จำนวนเด็ก/ผู้สูงอายุ (children_elder_count)",
        "จำนวนผู้ตั้งครรภ์ (pregnant_count)",
        "จำนวนพระ (monk_count)",
        "สิ่งอำนวยความสะดวก (features)",
        "ประเภทการช���ระเงิน (payment_types)",
        "จำนวนประตู (doors)",
        "สี (color)",
        "ความถี่ (frequency)",
        "เส้นทาง (route)",
        "พื้นที่ (area)",
        "ตัดสินใจใช้บริการ (decision_use_service)",
        "เหตุผลไม่ใช้บริการ (reason_not_use)",
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
