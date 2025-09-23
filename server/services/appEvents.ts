import fs from "node:fs";
import fs from "node:fs";
import path from "node:path";
import fetch from "node-fetch";
import { z } from "zod";

// Firebase client SDK (used server-side for simple writes to Firestore)
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

// Server-side Firestore client (non-admin) initialization — used when replacing Supabase storage
let firestoreDb: ReturnType<typeof getFirestore> | null = null;
function initServerFirestore() {
  if (firestoreDb) return;
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
  // Attempt to write to Firestore; targetCollectionPath example: "minigame2_events/minigame2-di"
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
    // ignore and fall back to file
    console.warn("Failed to write app event to Firestore", e);
  }

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
  // Prefer Firestore (ukpack1) if available
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
        // handle Firestore Timestamp
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
    // ignore and fall back
    console.warn("Failed to read app events from Firestore", e);
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

export interface SessionSummary {
  sessionId: string;
  firstSeen: string;
  lastSeen: string;
  introWho?: string; // บทบาทในการเดินทางเข้าเมือง
  travelMethod?: string; // ยานพาหนะที่ใช้
  opinionLevel?: string; // ระดับความคิดเห็น (เห็นด้วย/กลางๆ/ไม่เห็นด้วย)
  ask02Choice?: string; // เหตุผลหลัก
  ask02CustomReason?: string; // เหตุผลเพิ่มเติม (พิมพ์เอง)
  reasonOther01?: string; // คำอธิบายเพิ่มเติม
  keyMessage1?: string; // Key message 1 (จาก Stornaway)
  mn1Selected: string[]; // ลำดับความสำคัญของประเด็น
  // MN2 selections keyed by MN1 priority
  mn2Selections?: Record<string, string[]>; // กลุ่มเป้าหมายที่ควรได้รับสิทธิ์
  // MN3 selections and per-policy budget
  mn3Selected?: string[]; // ประเด็นนโยบายที่ผู้ใช้เลือก
  mn3BudgetAllocation?: Record<string, number>; // การจัดสรรงบประมาณ
  mn3BudgetTotal?: number;
  satisfactionLevel?: string; // ระดับความพึงพอใจ
  ask05Comment?: string; // ข้อเสนอเพิ่มเติมต่อรัฐ
  fakeNewsResponse?: string; // การตอบสนองต่อข่าวปลอม
  sourceSelected?: string; // แหล่งข่าวที่ผู้ใช้เลือก
  endDecision?: string; // การเข้าร่วมลุ้นรางวัล
  endDecisionText?: string;
  // End sequence contact details
  contactName?: string;
  contactPhone?: string;
  contacts: number;
  // Stornaway variant
  stornawayVariantName?: string;
  // Share
  shareCount?: number;
  shareFirstTs?: string | null;
  shareLastTs?: string | null;
  // Meta
  ip?: string;
  userAgent?: string;
}

export async function computeSessionSummaries(
  limit = 100,
): Promise<SessionSummary[]> {
  const events = await readAllAppEvents();

  // Build per-session app events
  const bySession = new Map<string, AppEvent[]>();
  for (const ev of events) {
    const arr = bySession.get(ev.sessionId) || [];
    arr.push(ev);
    bySession.set(ev.sessionId, arr);
  }

  // Also parse video events: pick the first choice after the first story.start per session
  const firstStoryTs = new Map<string, number>();
  const firstChoiceAfterStory = new Map<string, { ts: number; name: string }>();
  // 1) Local file fallback
  try {
    const videoFile = path.join(DATA_DIR, "events.jsonl");
    const raw = await fs.promises.readFile(videoFile, "utf8");
    const lines = raw.split(/\n+/).filter(Boolean);
    for (const line of lines) {
      try {
        const j = JSON.parse(line);
        if (!j || !j.sessionId || !j.eventName) continue;
        const ts = new Date(j.timestamp || new Date().toISOString()).getTime();
        if (j.eventName === "sw.story.start") {
          const cur = firstStoryTs.get(j.sessionId);
          if (cur === undefined || ts < cur) firstStoryTs.set(j.sessionId, ts);
        }
      } catch {}
    }
    for (const line of lines) {
      try {
        const j = JSON.parse(line);
        if (!j || !j.sessionId || !j.eventName) continue;
        if (j.eventName !== "sw.choice.selected") continue;
        const ts = new Date(j.timestamp || new Date().toISOString()).getTime();
        const startTs = firstStoryTs.get(j.sessionId);
        if (startTs === undefined) continue;
        if (ts < startTs) continue;
        if (!firstChoiceAfterStory.has(j.sessionId)) {
          const name = (
            j.choiceText ||
            j.variantName ||
            j.variantId ||
            ""
          ).toString();
          if (name) firstChoiceAfterStory.set(j.sessionId, { ts, name });
        }
      } catch {}
    }
  } catch {}
  // 2) Firestore (if available) — read video events for additional session analysis
  try {
    initServerFirestore();
    if (firestoreDb) {
      const colDoc = doc(firestoreDb, "minigame1_events", "minigame1-di");
      const eventsCol = collection(colDoc, "events");
      const q = query(eventsCol, orderBy("createdAt", "asc"));
      const snap = await getDocs(q as any);
      const rows: any[] = [];
      snap.forEach((d) => rows.push(d.data()));
      for (const r of rows) {
        const sid = String(r.sessionID || r.sessionId || "");
        if (!sid) continue;
        const ts = new Date(
          r.timestamp || r.createdAt || new Date().toISOString(),
        ).getTime();
        if (r.eventName === "sw.story.start" || r.event === "sw.story.start") {
          const cur = firstStoryTs.get(sid);
          if (cur === undefined || ts < cur) firstStoryTs.set(sid, ts);
        }
      }
      for (const r of rows) {
        const sid = String(r.sessionID || r.sessionId || "");
        if (!sid) continue;
        const en = r.eventName || r.event;
        if (en !== "sw.choice.selected") continue;
        const ts = new Date(
          r.timestamp || r.createdAt || new Date().toISOString(),
        ).getTime();
        const startTs = firstStoryTs.get(sid);
        if (startTs === undefined) continue;
        if (ts < startTs) continue;
        if (!firstChoiceAfterStory.has(sid)) {
          const name = String(
            r.choiceText ??
              r.choice_text ??
              r.variantName ??
              r.variant_name ??
              r.variantId ??
              r.variant_id ??
              "",
          );
          if (name) firstChoiceAfterStory.set(sid, { ts, name });
        }
      }
    }
  } catch (e) {
    console.warn(
      "Failed to read video events from Firestore for session summaries",
      e,
    );
  }

  const summaries: SessionSummary[] = [];
  for (const [sid, arr] of bySession) {
    arr.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
    const firstSeen = arr[0]?.timestamp || new Date().toISOString();
    const lastSeen = arr[arr.length - 1]?.timestamp || firstSeen;

    let introWho: string | undefined;
    let travelMethod: string | undefined;
    let opinionLevel: string | undefined;
    let ask02Choice: string | undefined;
    let ask02CustomReason: string | undefined;
    let reasonOther01: string | undefined;
    let keyMessage1: string | undefined;
    let mn1Selected: string[] = [];
    const mn2Selections: Record<string, string[]> = {};
    let mn3Selected: string[] = [];
    let mn3BudgetAllocation: Record<string, number> | undefined;
    let mn3BudgetTotal: number | undefined;
    let satisfactionLevel: string | undefined;
    let ask05Comment: string | undefined;
    let fakeNewsResponse: string | undefined;
    let sourceSelected: string | undefined;
    let endDecision: string | undefined;
    let endDecisionText: string | undefined;
    let contactName: string | undefined;
    let contactPhone: string | undefined;
    let contacts = 0;
    let shareCount = 0;
    let shareFirstTs: string | null = null;
    let shareLastTs: string | null = null;
    let ip: string | undefined;
    let userAgent: string | undefined;

    for (const ev of arr) {
      ip = ev.ip || ip;
      userAgent = ev.userAgent || userAgent;
      if (ev.event === "INTRO_WHO_CHOICE") {
        const label = sanitizeThai(
          (ev.payload?.choiceText || ev.payload?.choice || "").toString(),
        );
        if (label) introWho = label;
      }
      if (ev.event === "ASK01_CHOICE") {
        const choice = sanitizeThai(
          (ev.payload?.choice || ev.payload?.choiceText || "").toString(),
        );
        if (choice) opinionLevel = choice;
      }
      if (ev.event === "ASK02_CHOICE") {
        const reason = sanitizeThai(
          (ev.payload?.choice || ev.payload?.choiceText || "").toString(),
        );
        if (reason) ask02Choice = reason;
      }
      if (ev.event === "ASK02_2_SUBMIT") {
        const txt = sanitizeThai((ev.payload?.customReason || "").toString());
        if (txt) ask02CustomReason = txt;
      }
      if (ev.event === "REASON_OTHER_01") {
        const txt = sanitizeThai((ev.payload?.text || "").toString());
        if (txt) reasonOther01 = txt;
      }
      if (ev.event === "TRAVEL_METHOD") {
        const txt = sanitizeThai((ev.payload?.method || "").toString());
        if (txt) travelMethod = txt;
      }
      if (ev.event === "MN1_COMPLETE" || ev.event === "BUDGET_STEP1_COMPLETE") {
        mn1Selected = Array.isArray(ev.payload?.selectedPolicies)
          ? ev.payload!.selectedPolicies
          : [];
      }
      if (ev.event === "MN2_STEP") {
        const priority = (ev.payload?.priority || "").toString();
        const raw = Array.isArray(ev.payload?.selectedGroups)
          ? (ev.payload!.selectedGroups as any[])
          : [];
        const groups: string[] = raw.map((x) =>
          x === null || x === undefined ? "" : String(x),
        );
        if (priority) mn2Selections[priority] = groups;
      }
      if (ev.event === "MN3_SELECT") {
        mn3Selected = Array.isArray(ev.payload?.selectedPolicies)
          ? ev.payload!.selectedPolicies
          : [];
      }
      if (ev.event === "MN3_BUDGET") {
        const alloc = ev.payload?.budgetAllocation as
          | Record<string, number>
          | undefined;
        if (alloc) {
          mn3BudgetAllocation = {};
          for (const [k, v] of Object.entries(alloc)) {
            mn3BudgetAllocation[k] = Number(v) || 0;
          }
          mn3BudgetTotal = Object.values(mn3BudgetAllocation).reduce(
            (a, b) => a + (Number(b) || 0),
            0,
          );
        }
      }
      if (ev.event === "SATISFACTION_CHOICE") {
        const txt = sanitizeThai((ev.payload?.choice || "").toString());
        if (txt) satisfactionLevel = txt;
      }
      if (ev.event === "ASK05_COMMENT") {
        const c = sanitizeThai((ev.payload?.comment || "").toString());
        if (c) ask05Comment = c;
      }
      if (ev.event === "FAKENEWS_CHOICE") {
        const ch = (ev.payload?.choice || "").toString();
        fakeNewsResponse =
          ch === "search"
            ? "หาทางต่อ"
            : ch === "ignore"
              ? "ไม่ทำอะไร"
              : undefined;
      }
      if (ev.event === "SOURCE_SELECTION") {
        const src = sanitizeThai(
          (ev.payload?.source || ev.payload?.sourceLabel || "").toString(),
        );
        if (src) sourceSelected = src;
      }
      if (ev.event === "ENDSEQ_DECISION") {
        const choice = sanitizeThai(ev.payload?.choice as string | undefined);
        const text = sanitizeThai((ev.payload?.choiceText || "").toString());
        if (choice) endDecision = choice;
        if (text) endDecisionText = text;
      }
      if (ev.event === "ENDSEQ_CONTACT") {
        contacts += 1;
        const name = sanitizeThai((ev.payload?.name || "").toString());
        const phone = sanitizeThai((ev.payload?.phone || "").toString());
        if (name) contactName = name;
        if (phone) contactPhone = phone;
      }
      if (ev.event === "SHARE") {
        shareCount += 1;
        if (!shareFirstTs) shareFirstTs = ev.timestamp;
        shareLastTs = ev.timestamp;
      }
    }

    const stornawayVariantName =
      firstChoiceAfterStory.get(sid)?.name || undefined;
    keyMessage1 = keyMessage1 || stornawayVariantName;

    summaries.push({
      sessionId: sid,
      firstSeen,
      lastSeen,
      introWho,
      travelMethod,
      opinionLevel,
      ask02Choice,
      ask02CustomReason,
      reasonOther01,
      keyMessage1,
      mn1Selected,
      mn2Selections: Object.keys(mn2Selections).length
        ? mn2Selections
        : undefined,
      mn3Selected,
      mn3BudgetAllocation,
      mn3BudgetTotal,
      satisfactionLevel,
      ask05Comment,
      fakeNewsResponse,
      sourceSelected,
      endDecision,
      endDecisionText,
      contactName,
      contactPhone,
      contacts,
      stornawayVariantName,
      shareCount,
      shareFirstTs,
      shareLastTs,
      ip,
      userAgent,
    });
  }
  summaries.sort((a, b) => (a.lastSeen < b.lastSeen ? 1 : -1));
  return summaries.slice(0, Math.max(1, limit));
}

export async function getAppIngestStatus(): Promise<{
  count: number;
  lastTs: string | null;
}> {
  const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), ".data");
  const APP_EVENTS_FILE = path.join(DATA_DIR, "app-events.jsonl");
  try {
    const raw = await fs.promises.readFile(APP_EVENTS_FILE, "utf8");
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

export interface UserJourneyStats {
  introWho: Record<string, number>;
  mn1: Record<string, number>;
  mn2ByMn1: Record<string, Record<string, number>>;
  mn3Selection: Record<string, number>;
  mn3Budgets: Record<string, { total: number; count: number; avg: number }>;
  ask05Count: number;
  ask05Samples: string[];
  endseq: { participate: number; decline: number; contacts: number };
  ipCount: number;
}

export async function computeUserJourneyStats(
  videoEvents: Array<{
    sessionId: string;
    eventName: string;
    variantName?: string;
  }>,
): Promise<UserJourneyStats & { stornawayVariants: Record<string, number> }> {
  const appEvents = await readAllAppEvents();

  // Intro
  const introWho: Record<string, number> = {};
  for (const ev of appEvents) {
    if (ev.event === "INTRO_WHO_CHOICE") {
      const label = sanitizeThai(
        (ev.payload?.choiceText || ev.payload?.choice || "").toString(),
      );
      if (!label) continue;
      introWho[label] = (introWho[label] || 0) + 1;
    }
  }

  // MN1
  const mn1: Record<string, number> = {};
  const mn1BySession = new Map<string, string[]>();
  for (const ev of appEvents) {
    if (ev.event === "MN1_COMPLETE" || ev.event === "BUDGET_STEP1_COMPLETE") {
      const arr: string[] = Array.isArray(ev.payload?.selectedPolicies)
        ? ev.payload!.selectedPolicies
        : [];
      mn1BySession.set(ev.sessionId, arr);
      for (const p of arr) mn1[p] = (mn1[p] || 0) + 1;
    }
  }

  // MN2 correlation
  const mn2ByMn1: Record<string, Record<string, number>> = {};
  for (const ev of appEvents) {
    if (ev.event === "MN2_STEP") {
      const priority = ev.payload?.priority as string | undefined;
      const groups: string[] = Array.isArray(ev.payload?.selectedGroups)
        ? ev.payload!.selectedGroups
        : [];
      if (!priority) continue;
      if (!mn2ByMn1[priority]) mn2ByMn1[priority] = {};
      for (const g of groups)
        mn2ByMn1[priority][g] = (mn2ByMn1[priority][g] || 0) + 1;
    }
  }

  // MN3 selection and budgets
  const mn3Selection: Record<string, number> = {};
  const mn3Budgets: Record<
    string,
    { total: number; count: number; avg: number }
  > = {};
  for (const ev of appEvents) {
    if (ev.event === "MN3_SELECT") {
      const arr: string[] = Array.isArray(ev.payload?.selectedPolicies)
        ? ev.payload!.selectedPolicies
        : [];
      for (const p of arr) mn3Selection[p] = (mn3Selection[p] || 0) + 1;
    }
    if (ev.event === "MN3_BUDGET") {
      const alloc = ev.payload?.budgetAllocation as
        | Record<string, number>
        | undefined;
      if (alloc) {
        for (const [policy, amount] of Object.entries(alloc)) {
          const cur = mn3Budgets[policy] || { total: 0, count: 0, avg: 0 };
          cur.total += Number(amount) || 0;
          cur.count += 1;
          cur.avg = cur.count ? cur.total / cur.count : 0;
          mn3Budgets[policy] = cur;
        }
      }
    }
  }

  // Ask05 comments
  const comments = appEvents
    .filter((e) => e.event === "ASK05_COMMENT")
    .map((e) => sanitizeThai((e.payload?.comment || "").toString()))
    .filter(Boolean);

  // End sequence
  let participate = 0,
    decline = 0,
    contacts = 0;
  for (const ev of appEvents) {
    if (ev.event === "ENDSEQ_DECISION") {
      const choice = ev.payload?.choice;
      if (choice === "participate") participate += 1;
      else if (choice === "decline") decline += 1;
    }
    if (ev.event === "ENDSEQ_CONTACT") contacts += 1;
  }

  // IP count
  const ips = new Set(appEvents.map((e) => e.ip).filter(Boolean) as string[]);

  // Stornaway selections (count only explicit choices)
  const stornawayVariants: Record<string, number> = {};
  for (const ve of videoEvents) {
    if (ve.eventName === "sw.choice.selected") {
      const name = sanitizeThai((ve.choiceText || "").toString());
      if (!name) continue;
      stornawayVariants[name] = (stornawayVariants[name] || 0) + 1;
    }
  }

  return {
    introWho,
    mn1,
    mn2ByMn1,
    mn3Selection,
    mn3Budgets,
    ask05Count: comments.length,
    ask05Samples: comments.slice(-5),
    endseq: { participate, decline, contacts },
    ipCount: ips.size,
    stornawayVariants,
  } as any;
}
