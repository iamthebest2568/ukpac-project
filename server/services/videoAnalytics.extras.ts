import fs from "node:fs";
import path from "node:path";
import fetch from "node-fetch";
import type { VideoEvent } from "./videoAnalytics";

// Firestore client
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, doc, query, orderBy, limit as limitFn, getDocs } from "firebase/firestore";

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
  try {
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY || "AIzaSyBdMPQP9DVM1S9bh70dFuMAsyzPJPOYXnk",
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || "uk-pact.firebaseapp.com",
      projectId: process.env.FIREBASE_PROJECT_ID || "uk-pact",
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "uk-pact.firebasestorage.app",
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "534142958499",
      appId: process.env.FIREBASE_APP_ID || "1:534142958499:web:3cf0b2380c055f7a747816",
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
        if (timestamp && typeof timestamp.toDate === "function") timestamp = timestamp.toDate().toISOString();
        out.push({
          sessionId: sanitizeThai(String(data.sessionID || data.sessionId || "")),
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
        if (timestamp && typeof timestamp.toDate === "function") timestamp = timestamp.toDate().toISOString();
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
  const supabaseUrl = process.env.SUPABASE_URL as string | undefined;
  const supabaseKey = process.env.SUPABASE_ANON_KEY as string | undefined;
  if (supabaseUrl && supabaseKey) {
    const params = new URLSearchParams({
      select: "*",
      order: "id.desc",
      limit: "1",
    });
    const res = await fetch(
      `${supabaseUrl}/rest/v1/video_events?${params.toString()}`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "count=exact",
          Range: "0-0",
        } as any,
      },
    );
    if (res.ok) {
      const cr = res.headers.get("content-range");
      const total = cr ? Number(cr.split("/")[1]) : NaN;
      const rows = await res.json();
      const lastTs =
        Array.isArray(rows) && rows[0]?.timestamp ? rows[0].timestamp : null;
      return {
        count: Number.isFinite(total) ? total : rows.length || 0,
        lastTs,
      };
    }
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
