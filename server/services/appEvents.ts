import fs from "node:fs";
import path from "node:path";
import fetch from "node-fetch";
import { z } from "zod";

// Client Firestore SDK (fallback)
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit as limitFn,
  getDocs,
} from "firebase/firestore";

// Admin SDK (preferred when service account provided)
import admin from "firebase-admin";

const sanitizeThai = (text: any): any => {
  if (typeof text !== "string") return text;
  return text
    .normalize("NFC")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\uFFFD/g, "");
};

export const AppEventSchema = z.object({
  sessionId: z.string(),
  event: z.string(),
  timestamp: z.string().optional(),
  page: z.string().optional(),
  payload: z.record(z.any()).optional(),
  userAgent: z.string().optional(),
  ip: z.string().optional(),
});
export type AppEvent = z.infer<typeof AppEventSchema> & { timestamp: string };

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const APP_EVENTS_FILE = path.join(DATA_DIR, "app-events.jsonl");

let firestoreDb: ReturnType<typeof getFirestore> | null = null;
let adminDb: admin.firestore.Firestore | null = null;

function initServerFirestore() {
  if (adminDb || firestoreDb) return;

  // Prefer admin SDK when service account JSON is provided via env
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
      adminDb = admin.firestore();
      return;
    } catch (e) {
      console.warn("Server admin Firestore init failed", e);
      adminDb = null;
    }
  }

  // Fallback to client SDK initialization using environment configs
  try {
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY || "",
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
      projectId: process.env.FIREBASE_PROJECT_ID || "",
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
      appId: process.env.FIREBASE_APP_ID || "",
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

function ensureDir() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch {}
}

export async function appendAppEvent(
  ev: AppEvent,
  targetCollectionPath?: string,
) {
  // Try admin path first
  try {
    initServerFirestore();
    if (adminDb) {
      try {
        let col = "minigame1_events";
        let docId = "minigame1-di";
        if (targetCollectionPath && typeof targetCollectionPath === "string") {
          const parts = targetCollectionPath
            .replace(/^\/+/, "")
            .split("/")
            .filter(Boolean);
          if (parts.length >= 2) {
            col = parts[0];
            docId = parts[1];
          }
        }
        const docRef = adminDb.collection(col).doc(docId);
        const eventsCol = docRef.collection("events");
        const payload = {
          sessionID: ev.sessionId,
          event: ev.event,
          timestamp: ev.timestamp,
          page: ev.page ?? null,
          payload: ev.payload ?? null,
          userAgent: ev.userAgent ?? null,
          ip: ev.ip ?? null,
          createdAt: admin.firestore.FieldValue.serverTimestamp() as any,
        } as any;
        await eventsCol.add(payload);
        return;
      } catch (e) {
        console.warn("Failed to write app event using admin SDK", e);
        // fallthrough to file fallback
      }
    }
  } catch (e) {
    console.warn("appendAppEvent admin path error", e);
  }

  // Try client SDK path
  try {
    initServerFirestore();
    if (firestoreDb) {
      let colDocPath = ["minigame1_events", "minigame1-di"]; // default
      try {
        if (targetCollectionPath && typeof targetCollectionPath === "string") {
          const parts = targetCollectionPath
            .replace(/^\/+/, "")
            .split("/")
            .filter(Boolean);
          if (parts.length >= 2) colDocPath = [parts[0], parts[1]];
        }
      } catch (_) {}

      const colDoc = doc(firestoreDb, colDocPath[0], colDocPath[1]);
      const eventsCol = collection(colDoc, "events");
      const payload = {
        sessionID: ev.sessionId,
        event: ev.event,
        timestamp: ev.timestamp,
        page: ev.page ?? null,
        payload: ev.payload ?? null,
        userAgent: ev.userAgent ?? null,
        ip: ev.ip ?? null,
        createdAt: serverTimestamp(),
      } as any;
      await addDoc(eventsCol, payload);
      return;
    }
  } catch (e) {
    console.warn("Failed to write app event to Firestore", e);
  }

  // Fallback to file
  ensureDir();
  const line =
    JSON.stringify({
      ...ev,
      page: sanitizeThai(ev.page),
      userAgent: sanitizeThai(ev.userAgent),
    }) + "\n";
  await fs.promises.appendFile(APP_EVENTS_FILE, line, "utf8");
}

export async function readAllAppEvents(): Promise<AppEvent[]> {
  // Prefer admin Firestore if available
  try {
    initServerFirestore();
    if (adminDb) {
      const colDoc = adminDb.collection("minigame1_events").doc("minigame1-di");
      const eventsCol = await colDoc
        .collection("events")
        .orderBy("createdAt", "asc")
        .limit(5000)
        .get();
      const events: AppEvent[] = [];
      eventsCol.forEach((d) => {
        const data = d.data() as any;
        const ts = data.timestamp || data.createdAt || new Date().toISOString();
        let timestamp = ts;
        if (
          timestamp &&
          timestamp.toDate &&
          typeof timestamp.toDate === "function"
        ) {
          timestamp = timestamp.toDate().toISOString();
        }
        events.push({
          sessionId: sanitizeThai(
            String(data.sessionID || data.sessionId || ""),
          ),
          event: sanitizeThai(String(data.event || "")),
          timestamp: String(timestamp || new Date().toISOString()),
          page: sanitizeThai(data.page ?? undefined),
          payload: data.payload ?? undefined,
          userAgent: sanitizeThai(
            data.userAgent ?? data.user_agent ?? undefined,
          ),
          ip: sanitizeThai(data.ip ?? undefined),
        });
      });
      return events;
    }
  } catch (e) {
    console.warn("Failed to read app events from admin Firestore", e);
  }

  // Fallback to client SDK Firestore
  try {
    initServerFirestore();
    if (firestoreDb) {
      const colDoc = doc(firestoreDb, "minigame1_events", "minigame1-di");
      const eventsCol = collection(colDoc, "events");
      const q = query(eventsCol, orderBy("createdAt", "asc"), limitFn(5000));
      const snap = await getDocs(q as any);
      const events: AppEvent[] = [];
      snap.forEach((d) => {
        const data = d.data() as any;
        const ts = data.timestamp || data.createdAt || new Date().toISOString();
        let timestamp = ts;
        if (timestamp && typeof timestamp.toDate === "function") {
          timestamp = timestamp.toDate().toISOString();
        }
        events.push({
          sessionId: sanitizeThai(
            String(data.sessionID || data.sessionId || ""),
          ),
          event: sanitizeThai(String(data.event || "")),
          timestamp: String(timestamp || new Date().toISOString()),
          page: sanitizeThai(data.page ?? undefined),
          payload: data.payload ?? undefined,
          userAgent: sanitizeThai(
            data.userAgent ?? data.user_agent ?? undefined,
          ),
          ip: sanitizeThai(data.ip ?? undefined),
        });
      });
      return events;
    }
  } catch (e) {
    console.warn("Failed to read app events from Firestore (client SDK)", e);
  }

  // Fallback to local file
  ensureDir();
  try {
    const raw = await fs.promises.readFile(APP_EVENTS_FILE, "utf8");
    const lines = raw.split(/\n+/).filter(Boolean);
    const events: AppEvent[] = [];
    for (const line of lines) {
      try {
        const j = JSON.parse(line);
        if (j && j.sessionId && j.event) {
          events.push({
            ...j,
            page: sanitizeThai(j.page),
            userAgent: sanitizeThai(j.userAgent),
            timestamp: j.timestamp || new Date().toISOString(),
          });
        }
      } catch {}
    }
    return events;
  } catch {
    return [];
  }
}

export async function getAppEventsBySession(
  sessionId: string,
): Promise<AppEvent[]> {
  const all = await readAllAppEvents();
  return all
    .filter((e) => e.sessionId === sessionId)
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
}

// Compute simple user journey stats suitable for dashboard fallback
export async function computeUserJourneyStats(recentLimit = 1000) {
  const events = await readAllAppEvents();
  const totalSessions = new Set(events.map((e) => e.sessionId)).size;
  const totalPlays = events.filter(
    (e) =>
      String(e.event || "")
        .toLowerCase()
        .includes("play") ||
      String(e.event || "")
        .toLowerCase()
        .includes("start"),
  ).length;
  const completionRate = 0; // placeholder
  const avgSessionLengthSeconds = 0;

  // timeseries: group by date and count plays
  const timeseriesMap: Record<string, number> = {};
  for (const e of events) {
    const d = new Date(e.timestamp || new Date().toISOString());
    const key = d.toISOString().slice(0, 10);
    timeseriesMap[key] = (timeseriesMap[key] || 0) + 1;
  }
  const timeseries = Object.keys(timeseriesMap)
    .sort()
    .map((k) => ({ date: k, plays: timeseriesMap[k] }));

  // variants and choices are approximated
  const variantsMap: Record<
    string,
    { name: string; count: number; avgTimeSeconds: number; dropoutRate: number }
  > = {};
  const choicesMap: Record<string, number> = {};
  for (const e of events) {
    if (e.payload && typeof e.payload === "object") {
      const v = e.payload.variantName || e.payload.variant || null;
      if (v)
        variantsMap[v] = variantsMap[v] || {
          name: v,
          count: 0,
          avgTimeSeconds: 0,
          dropoutRate: 0,
        };
      if (v) variantsMap[v].count++;
    }
    if (e.event && String(e.event).toLowerCase().includes("choice")) {
      const name = e.payload?.choiceText || e.payload?.choice || e.event;
      if (name) choicesMap[String(name)] = (choicesMap[String(name)] || 0) + 1;
    }
  }

  const variants = Object.values(variantsMap);
  const choices = Object.keys(choicesMap).map((k) => ({
    name: k,
    count: choicesMap[k],
  }));

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

// Return ingest status (counts) for app and video by reading local files if Firestore unavailable
export async function getAppIngestStatus() {
  // Count app events in app-events.jsonl
  ensureDir();
  let appCount = 0;
  try {
    const raw = await fs.promises.readFile(APP_EVENTS_FILE, "utf8");
    appCount = raw.split(/\n+/).filter(Boolean).length;
  } catch {
    appCount = 0;
  }

  // Video events file
  let videoCount = 0;
  try {
    const vfile = path.join(DATA_DIR, "events.jsonl");
    const raw = await fs.promises.readFile(vfile, "utf8");
    videoCount = raw.split(/\n+/).filter(Boolean).length;
  } catch {
    videoCount = 0;
  }

  return {
    app: { count: appCount, lastTs: null },
    video: { count: videoCount, lastTs: null },
  };
}

// Lightweight computeSessionSummaries implementation (fallback)
export async function computeSessionSummaries(limit = 100) {
  const events = await readAllAppEvents();
  const bySession = new Map();
  for (const ev of events) {
    const sid = ev.sessionId || ev.sessionID || ev.sessionId || "";
    if (!sid) continue;
    const arr = bySession.get(sid) || [];
    arr.push(ev);
    bySession.set(sid, arr);
  }

  const summaries = [];
  for (const [sid, arr] of bySession) {
    arr.sort(
      (a: any, b: any) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
    const firstSeen = arr[0]?.timestamp || new Date().toISOString();
    const lastSeen = arr[arr.length - 1]?.timestamp || firstSeen;

    // Basic fields extracted when available
    const introWho =
      arr.find((e: any) => e.event && e.event.includes("INTRO_WHO"))?.payload
        ?.choice || undefined;
    const travelMethod =
      arr.find((e: any) => e.event && e.event.includes("TRAVEL_METHOD"))
        ?.payload?.choice || undefined;
    const mn1Selected = [];
    for (const e of arr) {
      if (
        e.event &&
        (e.event === "MN1_SELECT" || e.event === "BUDGET_STEP1_COMPLETE")
      ) {
        if (e.payload && e.payload.selectedPolicies) {
          mn1Selected.push(...(e.payload.selectedPolicies || []));
        }
      }
      if (e.event && e.event === "MN01_SELECT") {
        if (e.payload && e.payload.selectedPolicies)
          mn1Selected.push(...e.payload.selectedPolicies);
      }
    }

    summaries.push({
      sessionId: sid,
      firstSeen,
      lastSeen,
      introWho: introWho || undefined,
      travelMethod: travelMethod || undefined,
      mn1Selected: Array.isArray(mn1Selected)
        ? Array.from(new Set(mn1Selected))
        : [],
      contacts: 0,
    });
  }

  // sort by firstSeen desc
  summaries.sort(
    (a: any, b: any) =>
      new Date(b.firstSeen).getTime() - new Date(a.firstSeen).getTime(),
  );
  return summaries.slice(0, Math.max(0, Math.min(limit, summaries.length)));
}
