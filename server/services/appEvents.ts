import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

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

function ensureDir() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch {}
}

export async function appendAppEvent(ev: AppEvent) {
  ensureDir();
  const line = JSON.stringify(ev) + "\n";
  await fs.promises.appendFile(APP_EVENTS_FILE, line, "utf8");
}

export async function readAllAppEvents(): Promise<AppEvent[]> {
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
      const label = (
        ev.payload?.choiceText ||
        ev.payload?.choice ||
        ""
      ).toString();
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
    .map((e) => (e.payload?.comment || "").toString())
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

  // Stornaway variants from video events
  const stornawayVariants: Record<string, number> = {};
  for (const ve of videoEvents) {
    if (ve.eventName === "sw.variant.start") {
      const name = ve.variantName || "";
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
