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
