import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

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

export async function computeStats(): Promise<StatsResponse> {
  ensureDir();
  let lines: string[] = [];
  try {
    const raw = await fs.promises.readFile(EVENTS_FILE, "utf8");
    lines = raw.split(/\n+/).filter(Boolean);
  } catch {
    // no file yet
  }
  const events: VideoEvent[] = [];
  for (const line of lines) {
    try {
      const j = JSON.parse(line);
      if (j && j.sessionId && j.eventName) {
        const ts = j.timestamp || new Date().toISOString();
        events.push({ ...j, timestamp: ts });
      }
    } catch {}
  }
  // Group by session
  const sessionsMap = new Map<string, VideoEvent[]>();
  for (const ev of events) {
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
