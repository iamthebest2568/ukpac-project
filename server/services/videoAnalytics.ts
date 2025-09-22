import fs from "node:fs";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import fetch from "node-fetch";

// Firebase client SDK used server-side
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";

const sanitizeThai = (text: any): any => {
  if (typeof text !== "string") return text;
  return text
    .normalize("NFC")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\uFFFD/g, "");
};

export const EventSchema = z.object({
  sessionId: z.string(),
  eventName: z.string(),
  timestamp: z.string().optional(),
  choiceText: z.string().optional(),
  variantId: z.union([z.string(), z.number()]).optional(),
  variantName: z.string().optional(),
  page: z.string().optional(),
  userAgent: z.string().optional(),
  ip: z.string().optional(),
  payload: z.record(z.any()).optional(),
});
export type VideoEvent = z.infer<typeof EventSchema> & { timestamp: string };

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const EVENTS_FILE = path.join(DATA_DIR, "events.jsonl");

function ensureDir() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch {}
}

// Init server Firestore (non-admin) for storing video events under minigame1_events/minigame1-di/events
let firestoreDb: ReturnType<typeof getFirestore> | null = null;
function initServerFirestore() {
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
    console.warn("Server Firestore init failed", e);
    firestoreDb = null;
  }
}

export async function appendEvent(ev: VideoEvent) {
  // Try Firestore first
  try {
    initServerFirestore();
    if (firestoreDb) {
      const colDoc = doc(firestoreDb, "minigame1_events", "minigame1-di");
      const eventsCol = collection(colDoc, "events");
      const payload: any = {
        sessionID: ev.sessionId,
        eventName: ev.eventName,
        timestamp: ev.timestamp,
        choiceText: ev.choiceText ?? null,
        variantId: ev.variantId ?? null,
        variantName: ev.variantName ?? null,
        page: ev.page ?? null,
        userAgent: ev.userAgent ?? null,
        ip: ev.ip ?? null,
        payload: ev.payload ?? null,
        createdAt: serverTimestamp(),
      };
      await addDoc(eventsCol, payload);
      return;
    }
  } catch (e) {
    console.warn("Failed to write video event to Firestore", e);
  }

  // Fallback: write to local file only
  ensureDir();
  const line = JSON.stringify(ev) + "\n";
  await fs.promises.appendFile(EVENTS_FILE, line, "utf8");
}

export interface StatsResponse {
  totals: {
    totalSessions: number;
    totalPlays: number;
    completionRate: number;
    avgSessionLengthSeconds: number;
  };
  timeseries: Array<{ date: string; plays: number }>;
  variants: Array<{
    name: string;
    count: number;
    avgTimeSeconds: number;
    dropoutRate: number;
  }>;
  choices: Array<{ name: string; count: number }>;
}

export async function computeStats(
  fromISO?: string,
  toISO?: string,
): Promise<StatsResponse> {
  let events: VideoEvent[] = [];
  // Try Firestore first
  try {
    initServerFirestore();
    if (firestoreDb) {
      const colDoc = doc(firestoreDb, "minigame1_events", "minigame1-di");
      const eventsCol = collection(colDoc, "events");
      const q = query(eventsCol, orderBy("createdAt", "asc"));
      const snap = await getDocs(q as any);
      snap.forEach((d) => {
        const data = d.data() as any;
        const ts = data.timestamp || data.createdAt || new Date().toISOString();
        let timestamp = ts;
        if (timestamp && typeof timestamp.toDate === "function") timestamp = timestamp.toDate().toISOString();
        events.push({
          sessionId: sanitizeThai(String(data.sessionID || data.sessionId || "")),
          eventName: sanitizeThai(String(data.eventName || data.event || "")),
          timestamp: String(timestamp),
          choiceText: sanitizeThai(data.choiceText ?? undefined),
          variantId: data.variantId ?? undefined,
          variantName: sanitizeThai(data.variantName ?? undefined),
          page: sanitizeThai(data.page ?? undefined),
        });
      });
    }
  } catch (e) {
    console.warn("Failed to read video events from Firestore", e);
  }

  if (events.length === 0) {
    ensureDir();
    let lines: string[] = [];
    try {
      const raw = await fs.promises.readFile(EVENTS_FILE, "utf8");
      lines = raw.split(/\n+/).filter(Boolean);
    } catch {}
    for (const line of lines) {
      try {
        const j = JSON.parse(line);
        if (j && j.sessionId && j.eventName) {
          const ts = j.timestamp || new Date().toISOString();
          events.push({ ...j, timestamp: ts });
        }
      } catch {}
    }
  }
  // Apply time range filters if provided
  let filtered = events;
  const fromTs = fromISO ? new Date(fromISO).getTime() : undefined;
  const toTs = toISO ? new Date(toISO).getTime() : undefined;
  if (fromTs || toTs) {
    filtered = events.filter((e) => {
      const t = new Date(e.timestamp).getTime();
      if (Number.isNaN(t)) return false;
      if (fromTs && t < fromTs) return false;
      if (toTs && t > toTs) return false;
      return true;
    });
  }
  // Group by session
  const sessionsMap = new Map<string, VideoEvent[]>();
  for (const ev of filtered) {
    const arr = sessionsMap.get(ev.sessionId) || [];
    arr.push(ev);
    sessionsMap.set(ev.sessionId, arr);
  }
  const totalSessions = sessionsMap.size;
  let totalPlays = 0;
  let completes = 0;
  const playPerDay = new Map<string, number>();
  const variantStarts = new Map<string, number>();
  const variantSessionStarts = new Map<string, Set<string>>();
  const choiceCounts = new Map<string, number>();
  // Duration metrics removed per requirements

  for (const [sid, sess] of sessionsMap) {
    // sort by time
    sess.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
    // Removed session duration calculations (no playback length aggregation)

    for (const e of sess) {
      if (e.eventName === "sw.story.start") {
        totalPlays += 1;
        const day = e.timestamp.slice(0, 10);
        playPerDay.set(day, (playPerDay.get(day) || 0) + 1);
      }
      if (
        e.eventName === "sw.story.complete" ||
        e.eventName === "sw.story.end"
      ) {
        completes += 1;
      }
      if (e.eventName === "sw.variant.start") {
        const name = e.variantName || String(e.variantId || "");
        if (name) {
          variantStarts.set(name, (variantStarts.get(name) || 0) + 1);
          const set = variantSessionStarts.get(name) || new Set<string>();
          set.add(sid);
          variantSessionStarts.set(name, set);
        }
      }
      if (e.eventName === "sw.choice.selected") {
        const name = e.choiceText || "(ไม่มีข้อความ)";
        choiceCounts.set(name, (choiceCounts.get(name) || 0) + 1);
      }
    }
  }

  const completionRate = totalPlays > 0 ? completes / totalPlays : 0;
  const avgSessionLengthSeconds = 0;

  // Build arrays
  const timeseries = Array.from(playPerDay.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, plays]) => ({ date, plays }));

  const variants = Array.from(variantStarts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => {
      // approximate dropout per variant: sessions with variant start that did not complete story
      const sessionsWithVariant =
        variantSessionStarts.get(name) || new Set<string>();
      let dropoutSessions = 0;
      for (const sid of sessionsWithVariant) {
        const sess = sessionsMap.get(sid) || [];
        const completed = sess.some(
          (e) =>
            e.eventName === "sw.story.complete" ||
            e.eventName === "sw.story.end",
        );
        if (!completed) dropoutSessions += 1;
      }
      const dropoutRate =
        sessionsWithVariant.size > 0
          ? dropoutSessions / sessionsWithVariant.size
          : 0;
      return {
        name,
        count,
        avgTimeSeconds: 0,
        dropoutRate,
      };
    });

  const choices = Array.from(choiceCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  return {
    totals: {
      totalSessions,
      totalPlays,
      completionRate,
      avgSessionLengthSeconds,
    },
    timeseries,
    variants,
    choices,
  };
}
