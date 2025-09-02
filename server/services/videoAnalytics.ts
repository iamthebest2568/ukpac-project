import fs from "node:fs";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import fetch from "node-fetch";

export const EventSchema = z.object({
  sessionId: z.string(),
  eventName: z.string(),
  timestamp: z.string().optional(),
  choiceText: z.string().optional(),
  variantId: z.union([z.string(), z.number()]).optional(),
  variantName: z.string().optional(),
});
export type VideoEvent = z.infer<typeof EventSchema> & { timestamp: string };

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const EVENTS_FILE = path.join(DATA_DIR, "events.jsonl");

function ensureDir() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch {}
}

export async function appendEvent(ev: VideoEvent) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    // PostgREST insert
    const res = await fetch(`${supabaseUrl}/rest/v1/video_events`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        session_id: ev.sessionId,
        event_name: ev.eventName,
        timestamp: ev.timestamp,
        choice_text: ev.choiceText ?? null,
        variant_id: (ev.variantId ?? null)?.toString() ?? null,
        variant_name: ev.variantName ?? null,
      }),
    });
    if (!res.ok) {
      // fallback to file
      ensureDir();
      const line = JSON.stringify(ev) + "\n";
      await fs.promises.appendFile(EVENTS_FILE, line, "utf8");
    }
    return;
  }
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
  variants: Array<{ name: string; count: number; avgTimeSeconds: number; dropoutRate: number }>;
  choices: Array<{ name: string; count: number }>;
}

export async function computeStats(fromISO?: string, toISO?: string): Promise<StatsResponse> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  let events: VideoEvent[] = [];
  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/video_events?select=*`, {
        headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
      });
      if (res.ok) {
        const rows = await res.json();
        events = (rows as any[]).map((r) => ({
          sessionId: r.session_id,
          eventName: r.event_name,
          timestamp: r.timestamp,
          choiceText: r.choice_text ?? undefined,
          variantId: r.variant_id ?? undefined,
          variantName: r.variant_name ?? undefined,
        }));
      }
    } catch {}
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
  let totalSessionDuration = 0;

  for (const [sid, sess] of sessionsMap) {
    // sort by time
    sess.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const first = sess[0];
    const last = sess[sess.length - 1];
    const dur = (new Date(last.timestamp).getTime() - new Date(first.timestamp).getTime()) / 1000;
    if (isFinite(dur)) totalSessionDuration += Math.max(0, dur);

    for (const e of sess) {
      if (e.eventName === "sw.story.start") {
        totalPlays += 1;
        const day = e.timestamp.slice(0, 10);
        playPerDay.set(day, (playPerDay.get(day) || 0) + 1);
      }
      if (e.eventName === "sw.story.complete" || e.eventName === "sw.story.end") {
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
  const avgSessionLengthSeconds = totalSessions > 0 ? totalSessionDuration / totalSessions : 0;

  // Build arrays
  const timeseries = Array.from(playPerDay.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, plays]) => ({ date, plays }));

  const variants = Array.from(variantStarts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => {
      // approximate dropout per variant: sessions with variant start that did not complete story
      const sessionsWithVariant = variantSessionStarts.get(name) || new Set<string>();
      let dropoutSessions = 0;
      for (const sid of sessionsWithVariant) {
        const sess = sessionsMap.get(sid) || [];
        const completed = sess.some(
          (e) => e.eventName === "sw.story.complete" || e.eventName === "sw.story.end",
        );
        if (!completed) dropoutSessions += 1;
      }
      const dropoutRate = sessionsWithVariant.size > 0 ? dropoutSessions / sessionsWithVariant.size : 0;
      return { name, count, avgTimeSeconds: avgSessionLengthSeconds, dropoutRate };
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
