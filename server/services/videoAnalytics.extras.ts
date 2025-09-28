import fs from "node:fs";
import path from "node:path";
import fetch from "node-fetch";
import type { VideoEvent } from "./videoAnalytics";

// Firestore client
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  query,
  orderBy,
  limit as limitFn,
  getDocs,
} from "firebase/firestore";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const sanitizeThai = (text: any): any => {
  if (typeof text !== "string") return text;
  return text
    .normalize("NFC")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\uFFFD/g, "");
};
const EVENTS_FILE = path.join(DATA_DIR, "events.jsonl");

let firestoreDb: ReturnType<typeof getFirestore> | null = null;
function initFirestore() {
  if (firestoreDb) return;

  // Prefer the Admin SDK when a service account is provided (server environment)
  const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (svc) {
    try {
      const parsed = typeof svc === "string" ? JSON.parse(svc) : svc;
      // use require to avoid static ESM import issues in server runtime
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const admin = require("firebase-admin");
      if (!admin.apps || admin.apps.length === 0) {
        admin.initializeApp({ credential: admin.credential.cert(parsed as any) } as any);
      }
      firestoreDb = admin.firestore();
      return;
    } catch (e) {
      console.warn("Init Firestore (admin) failed", e);
      firestoreDb = null;
      // fall through to try client SDK as a last resort
    }
  }

  try {
    const firebaseConfig = {
      apiKey:
        process.env.FIREBASE_API_KEY ||
        "AIzaSyBdMPQP9DVM1S9bh70dFuMAsyzPJPOYXnk",
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || "uk-pact.firebaseapp.com",
      projectId: process.env.FIREBASE_PROJECT_ID || "uk-pact",
      storageBucket:
        process.env.FIREBASE_STORAGE_BUCKET || "uk-pact.firebasestorage.app",
      messagingSenderId:
        process.env.FIREBASE_MESSAGING_SENDER_ID || "534142958499",
      appId:
        process.env.FIREBASE_APP_ID ||
        "1:534142958499:web:3cf0b2380c055f7a747816",
    };
    let app;
    if (getApps && getApps().length > 0) app = getApp();
    else app = initializeApp(firebaseConfig as any);
    firestoreDb = getFirestore(app);
  } catch (e) {
    console.warn("Init Firestore failed", e);
    firestoreDb = null;
  }
}

export async function listRecentEvents(limit = 50): Promise<VideoEvent[]> {
  // Try Firestore first
  try {
    initFirestore();
    if (firestoreDb) {
      const colDoc = doc(firestoreDb, "minigame1_events", "minigame1-di");
      const eventsCol = collection(colDoc, "events");
      const q = query(eventsCol, orderBy("createdAt", "desc"), limitFn(limit));
      const snap = await getDocs(q as any);
      const out: VideoEvent[] = [];
      snap.forEach((d) => {
        const data = d.data() as any;
        const ts = data.timestamp || data.createdAt || new Date().toISOString();
        let timestamp = ts;
        if (timestamp && typeof timestamp.toDate === "function")
          timestamp = timestamp.toDate().toISOString();
        out.push({
          sessionId: sanitizeThai(
            String(data.sessionID || data.sessionId || ""),
          ),
          eventName: sanitizeThai(String(data.eventName || data.event || "")),
          timestamp: String(timestamp),
          choiceText: sanitizeThai(data.choiceText ?? undefined),
          variantId: data.variantId ?? undefined,
          variantName: sanitizeThai(data.variantName ?? undefined),
        });
      });
      return out;
    }
  } catch (e) {
    console.warn("Failed to read recent events from Firestore", e);
  }

  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch {}
  let lines: string[] = [];
  try {
    const raw = await fs.promises.readFile(EVENTS_FILE, "utf8");
    lines = raw.split(/\n+/).filter(Boolean);
  } catch {}
  const evs: VideoEvent[] = [];
  for (const line of lines.slice(-limit)) {
    try {
      const j = JSON.parse(line);
      if (j && j.sessionId && j.eventName) {
        const ts = j.timestamp || new Date().toISOString();
        evs.push({ ...j, timestamp: ts });
      }
    } catch {}
  }
  return evs.reverse();
}

export async function listVideoEventsBySession(
  sessionId: string,
): Promise<VideoEvent[]> {
  // Try Firestore first
  try {
    initFirestore();
    if (firestoreDb) {
      const colDoc = doc(firestoreDb, "minigame1_events", "minigame1-di");
      const eventsCol = collection(colDoc, "events");
      const q = query(eventsCol, orderBy("createdAt", "asc"));
      const snap = await getDocs(q as any);
      const out: VideoEvent[] = [];
      snap.forEach((d) => {
        const data = d.data() as any;
        const sid = String(data.sessionID || data.sessionId || "");
        if (sid !== sessionId) return;
        const ts = data.timestamp || data.createdAt || new Date().toISOString();
        let timestamp = ts;
        if (timestamp && typeof timestamp.toDate === "function")
          timestamp = timestamp.toDate().toISOString();
        out.push({
          sessionId: sanitizeThai(sid),
          eventName: sanitizeThai(String(data.eventName || data.event || "")),
          timestamp: String(timestamp),
          choiceText: sanitizeThai(data.choiceText ?? undefined),
          variantId: data.variantId ?? undefined,
          variantName: sanitizeThai(data.variantName ?? undefined),
        });
      });
      return out;
    }
  } catch (e) {
    console.warn("Failed to read session events from Firestore", e);
  }

  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch {}
  let lines: string[] = [];
  try {
    const raw = await fs.promises.readFile(EVENTS_FILE, "utf8");
    lines = raw.split(/\n+/).filter(Boolean);
  } catch {}
  const evs: VideoEvent[] = [];
  for (const line of lines) {
    try {
      const j = JSON.parse(line);
      if (j && j.sessionId === sessionId && j.eventName) {
        const ts = j.timestamp || new Date().toISOString();
        evs.push({ ...j, timestamp: ts });
      }
    } catch {}
  }
  evs.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  return evs;
}

export async function getVideoIngestStatus(): Promise<{
  count: number;
  lastTs: string | null;
}> {
  // Try Firestore first
  try {
    initFirestore();
    if (firestoreDb) {
      const colDoc = doc(firestoreDb, "minigame1_events", "minigame1-di");
      const eventsCol = collection(colDoc, "events");
      const q = query(eventsCol, orderBy("createdAt", "desc"), limitFn(1));
      const snap = await getDocs(q as any);
      let lastTs: string | null = null;
      let count = 0;
      const docs = snap.docs || [];
      if (docs.length > 0) {
        const d = docs[0].data() as any;
        const ts = d.timestamp || d.createdAt || null;
        if (ts && typeof ts.toDate === "function")
          lastTs = ts.toDate().toISOString();
        else if (ts) lastTs = String(ts);
      }
      // Count: Firestore does not support count easily without aggregation; approximate via docs length with a warning
      // We'll return -1 for unknown count
      return { count: -1, lastTs };
    }
  } catch (e) {
    console.warn("Failed to read ingest status from Firestore", e);
  }

  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch {}
  try {
    const raw = await fs.promises.readFile(EVENTS_FILE, "utf8");
    const lines = raw.split(/\n+/).filter(Boolean);
    const lastLine = lines[lines.length - 1];
    let lastTs: string | null = null;
    if (lastLine) {
      try {
        const j = JSON.parse(lastLine);
        lastTs = j.timestamp || null;
      } catch {}
    }
    return { count: lines.length, lastTs };
  } catch {
    return { count: 0, lastTs: null };
  }
}

// New: generic stats reader for any collection/document events subcollection
export async function getFirestoreStatsFor(
  colName: string,
  docId: string,
  limit = 20,
): Promise<{ count: number | null; lastTs: string | null; sample: any[] }> {
  try {
    initFirestore();
    if (!firestoreDb) return { count: null, lastTs: null, sample: [] };
    const colDoc = doc(firestoreDb, String(colName), String(docId));
    const eventsCol = collection(colDoc, "events");
    const q = query(eventsCol, orderBy("createdAt", "desc"), limitFn(limit));
    const snap = await getDocs(q as any);
    const sample: any[] = [];
    let lastTs: string | null = null;
    snap.forEach((d) => {
      const data = d.data() as any;
      if (!lastTs) {
        const ts = data.timestamp || data.createdAt || null;
        if (ts && typeof ts.toDate === "function")
          lastTs = ts.toDate().toISOString();
        else if (ts) lastTs = String(ts);
      }
      sample.push({ id: d.id, data });
    });
    return { count: null, lastTs, sample };
  } catch (e) {
    console.warn("Failed to fetch Firestore stats for", colName, docId, e);
    return { count: null, lastTs: null, sample: [] };
  }
}

// Compute simple aggregation (totals + timeseries by day) for a given events subcollection
export async function computeStatsForProject(
  colName: string,
  docId: string,
): Promise<{
  totals: { totalEvents: number; totalSessions: number };
  timeseries: Array<{ date: string; events: number }>;
  sample: any[];
}> {
  try {
    initFirestore();
    if (!firestoreDb)
      return {
        totals: { totalEvents: 0, totalSessions: 0 },
        timeseries: [],
        sample: [],
      };
    const colDoc = doc(firestoreDb, String(colName), String(docId));
    const eventsCol = collection(colDoc, "events");
    const q = query(eventsCol, orderBy("createdAt", "asc"));
    const snap = await getDocs(q as any);
    const events: any[] = [];
    snap.forEach((d) => {
      events.push(d.data());
    });
    // simple aggregates
    const totalEvents = events.length;
    const sessions = new Set<string>();
    const perDay = new Map<string, number>();
    for (const e of events) {
      const sid = String(e.sessionID || e.sessionId || "");
      if (sid) sessions.add(sid);
      const ts = e.timestamp || e.createdAt || new Date().toISOString();
      let iso = ts;
      try {
        if (ts && typeof ts.toDate === "function")
          iso = ts.toDate().toISOString();
      } catch (_) {}
      const date = String(iso).slice(0, 10);
      perDay.set(date, (perDay.get(date) || 0) + 1);
    }
    const timeseries = Array.from(perDay.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, events]) => ({ date, events }));
    const sample = events.slice(-20).reverse();
    return {
      totals: { totalEvents, totalSessions: sessions.size },
      timeseries,
      sample,
    };
  } catch (e) {
    console.warn("Failed to compute stats for project", colName, docId, e);
    return {
      totals: { totalEvents: 0, totalSessions: 0 },
      timeseries: [],
      sample: [],
    };
  }
}
