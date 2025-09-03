import fs from "node:fs";
import path from "node:path";
import fetch from "node-fetch";
import type { VideoEvent } from "./videoAnalytics";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const EVENTS_FILE = path.join(DATA_DIR, "events.jsonl");

export async function listRecentEvents(limit = 50): Promise<VideoEvent[]> {
  const supabaseUrl = process.env.SUPABASE_URL as string | undefined;
  const supabaseKey = process.env.SUPABASE_ANON_KEY as string | undefined;
  if (supabaseUrl && supabaseKey) {
    const params = new URLSearchParams({ select: "*", order: "id.desc", limit: String(limit) });
    const res = await fetch(`${supabaseUrl}/rest/v1/video_events?${params.toString()}`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
    });
    if (res.ok) {
      const rows = await res.json();
      return (rows as any[]).map((r) => ({
        sessionId: r.session_id,
        eventName: r.event_name,
        timestamp: r.timestamp,
        choiceText: r.choice_text ?? undefined,
        variantId: r.variant_id ?? undefined,
        variantName: r.variant_name ?? undefined,
      }));
    }
  }
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch {}
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

export async function listVideoEventsBySession(sessionId: string): Promise<VideoEvent[]> {
  const supabaseUrl = process.env.SUPABASE_URL as string | undefined;
  const supabaseKey = process.env.SUPABASE_ANON_KEY as string | undefined;
  if (supabaseUrl && supabaseKey) {
    const params = new URLSearchParams({ select: "*", order: "id.asc" });
    params.append("session_id", `eq.${sessionId}`);
    const res = await fetch(`${supabaseUrl}/rest/v1/video_events?${params.toString()}`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
    });
    if (res.ok) {
      const rows = await res.json();
      return (rows as any[]).map((r) => ({
        sessionId: r.session_id,
        eventName: r.event_name,
        timestamp: r.timestamp,
        choiceText: r.choice_text ?? undefined,
        variantId: r.variant_id ?? undefined,
        variantName: r.variant_name ?? undefined,
      }));
    }
  }
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch {}
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
  evs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  return evs;
}

export async function getVideoIngestStatus(): Promise<{ count: number; lastTs: string | null }> {
  const supabaseUrl = process.env.SUPABASE_URL as string | undefined;
  const supabaseKey = process.env.SUPABASE_ANON_KEY as string | undefined;
  if (supabaseUrl && supabaseKey) {
    const params = new URLSearchParams({ select: "*", order: "id.desc", limit: "1" });
    const res = await fetch(`${supabaseUrl}/rest/v1/video_events?${params.toString()}`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "count=exact",
        Range: "0-0",
      } as any,
    });
    if (res.ok) {
      const cr = res.headers.get("content-range");
      const total = cr ? Number(cr.split("/")[1]) : NaN;
      const rows = await res.json();
      const lastTs = Array.isArray(rows) && rows[0]?.timestamp ? rows[0].timestamp : null;
      return { count: Number.isFinite(total) ? total : rows.length || 0, lastTs };
    }
  }
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch {}
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
