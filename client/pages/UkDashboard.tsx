import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { clearEventLogs } from "../services/dataLogger.js";

type StatsResponse = {
  totals: {
    totalSessions: number;
    totalPlays: number;
    completionRate: number;
    avgSessionLengthSeconds: number;
  };
  timeseries: { date: string; plays: number }[];
  variants: {
    name: string;
    count: number;
    avgTimeSeconds: number;
    dropoutRate: number;
  }[];
  choices: { name: string; count: number }[];
};

type SessionSummary = {
  sessionId: string;
  firstSeen: string;
  lastSeen: string;
  introWho?: string;
  mn1Selected: string[];
  mn2Selections?: Record<string, string[]>;
  mn3Selected?: string[];
  mn3BudgetAllocation?: Record<string, number>;
  mn3BudgetTotal?: number;
  ask05Comment?: string;
  endDecision?: string;
  endDecisionText?: string;
  contactName?: string;
  contactPhone?: string;
  contacts: number;
  stornawayVariantName?: string;
  ip?: string;
  userAgent?: string;
};

type IngestStatus = {
  app: { count: number; lastTs: string | null };
  video: { count: number; lastTs: string | null };
};

export default function UkDashboard() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [journey, setJourney] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [clearing, setClearing] = useState<boolean>(false);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [ingest, setIngest] = useState<IngestStatus | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailSession, setDetailSession] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<{
    appEvents: any[];
    videoEvents: any[];
  } | null>(null);

  // Password gate
  const expected = (import.meta as any).env?.VITE_DASHBOARD_PASSWORD as
    | string
    | undefined;
  const [authed, setAuthed] = useState<boolean>(
    () => sessionStorage.getItem("ukdash_authed") === "true",
  );
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    // Always set default stats so UI renders even if APIs fail
    setStats({
      totals: {
        totalSessions: 0,
        totalPlays: 0,
        completionRate: 0,
        avgSessionLengthSeconds: 0,
      },
      timeseries: [],
      variants: [],
      choices: [],
    });
    setError(null);
    try {
      const [jRes, ssRes, stRes] = await Promise.allSettled([
        fetch(`/api/user-journey-stats`),
        fetch(`/api/session-summaries?limit=100`),
        fetch(`/api/ingest-status`),
      ]);
      if (jRes.status === "fulfilled" && jRes.value.ok) {
        try {
          setJourney(await jRes.value.json());
        } catch {}
      }
      if (ssRes.status === "fulfilled" && ssRes.value.ok) {
        try {
          setSessions(await ssRes.value.json());
        } catch {}
      }
      if (stRes.status === "fulfilled" && stRes.value.ok) {
        try {
          setIngest(await stRes.value.json());
        } catch {}
      }
      setLastUpdated(new Date().toLocaleString());
    } catch (e: any) {
      setError(e?.message || "โหลดข้อมู��ล้มเหลว");
    } finally {
      setLoading(false);
    }
  }

  async function clearData() {
    if (
      !window.confirm(
        "ลบข้อมูลทั้งหมดในเ��ิร์ฟเวอร์? การกระทำนี้ย้อนกลับไม่ได้",
      )
    ) {
      return;
    }
    try {
      setClearing(true);
      const res = await fetch("/api/clear-data", { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // Clear client-side stored logs/session id
      try {
        clearEventLogs();
      } catch {}
      setJourney(null);
      await load();
    } catch (e: any) {
      alert(e?.message || "ลบข้อมูลล้มเหลว");
    } finally {
      setClearing(false);
    }
  }

  const COLORS = useMemo(
    () => [
      "#EFBA31",
      "#8884d8",
      "#82ca9d",
      "#ff7f50",
      "#00C49F",
      "#FFBB28",
      "#FF8042",
    ],
    [],
  );

  useEffect(() => {
    if (!authed) return;
    load();
    let id: any;
    if (autoRefresh) id = setInterval(load, 5000);
    return () => id && clearInterval(id);
  }, [authed, autoRefresh]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0b] to-[#111216] text-white font-[Prompt]">
      {!authed && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="text-xl font-semibold mb-3">ป้อนรหัสผ่าน</div>
            <div className="text-sm text-white/70 mb-4">
              หน้านี้ป้องกันด้วยรหัสผ่าน
            </div>
            <input
              type="password"
              className="w-full rounded-md bg-black/40 border border-white/15 px-3 py-2 outline-none"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="รหัสผ่าน"
            />
            {pwErr && <div className="text-red-400 text-sm mt-2">{pwErr}</div>}
            <button
              className="mt-4 w-full rounded-full bg-[#EFBA31] text-black font-medium px-5 py-2 border border-black"
              onClick={() => {
                if (!expected) {
                  setPwErr("ยังไม่ได้ตั้งรหัสผ่าน (VITE_DASHBOARD_PASSWORD)");
                  return;
                }
                if (pw === expected) {
                  sessionStorage.setItem("ukdash_authed", "true");
                  setAuthed(true);
                  setPwErr(null);
                } else {
                  setPwErr("รหัสผ่านไม่ถูกต้อง");
                }
              }}
            >
              เข้าสู่แดชบอร์ด
            </button>
          </div>
        </div>
      )}
      {authed && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                แดชบอร์ดวิเคราะห���วิดีโอ
              </h1>
              <div className="text-white/70 text-sm mt-2">
                อัปเดตล่าสุด: {lastUpdated || "-"}
              </div>
              {ingest && (
                <div className="text-white/60 text-xs mt-1">
                  การเก็บข้อมูล • App: {ingest.app.count} เหตุการณ์, ล่าสุด{" "}
                  {ingest.app.lastTs
                    ? new Date(ingest.app.lastTs).toLocaleString()
                    : "-"}{" "}
                  • วิดีโอ: {ingest.video.count} เหตุการณ์, ล่าสุด{" "}
                  {ingest.video.lastTs
                    ? new Date(ingest.video.lastTs).toLocaleString()
                    : "-"}
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <button
                className="rounded-md bg.white/10 hover:bg-white/15 border border-white/15 px-3 py-2 text-sm"
                onClick={load}
              >
                รีเฟร���
              </button>
              <button
                className="rounded-md bg-red-600/80 hover:bg-red-600 border border-red-500 px-3 py-2 text-sm"
                onClick={clearData}
                disabled={clearing}
                title="ลบ events.jsonl และ app-events.jsonl ในเซิร์ฟเวอร์"
              >
                {clearing ? "กำลังลบ..." : "ลบข้อมูลทั้งหมด"}
              </button>
              <label className="flex items-center gap-2 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />{" "}
                อัปเดตอัตโนมัติ
              </label>
            </div>
          </div>

          {loading && <div className="text-white/80">กำลั��โหลดข้อมูล...</div>}
          {error && <div className="text-red-400">เกิดข้อผิดพลาด: {error}</div>}

          {stats && (
            <div className="space-y-6">
              {/* User Journey: Topics + Details */}
              {journey && (
                <>
                  <Card title="หัวข้อข้อมูล (Topics)">
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <li className="rounded-md border border-white/10 bg-white/5 p-3">Intro: คุณเป็นใคร</li>
                      <li className="rounded-md border border-white/10 bg-white/5 p-3">Stornaway: ฉากที่เข้า</li>
                      <li className="rounded-md border border-white/10 bg-white/5 p-3">MN1: นโยบายที่เลือก</li>
                      <li className="rounded-md border border-white/10 bg-white/5 p-3">MN3: งบประมาณเฉลี่ย</li>
                      <li className="rounded-md border border-white/10 bg-white/5 p-3 md:col-span-3">Ask05: ความคิดเห็นล่าสุด</li>
                    </ul>
                  </Card>

                  <Card title="รายละเอียดข้อมูล (Details)">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-white/80 mb-2">Intro: คุณเป็นใคร</div>
                        <ul className="space-y-1 text-sm">
                          {Object.entries(journey.introWho || {}).map(([k, v]) => (
                            <li key={k} className="flex justify-between">
                              <span>{k}</span>
                              <span className="text-white/70">{v as any}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-white/80 mb-2">Stornaway: ฉากที่เข้า</div>
                        <ul className="space-y-1 text-sm">
                          {Object.entries(journey.stornawayVariants || {})
                            .slice(0, 8)
                            .map(([k, v]) => (
                              <li key={k} className="flex justify-between">
                                <span>{k}</span>
                                <span className="text-white/70">{v as any}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-white/80 mb-2">MN1: นโยบายที่เลือก</div>
                        <ul className="space-y-1 text-sm">
                          {Object.entries(journey.mn1 || {}).map(([k, v]) => (
                            <li key={k} className="flex justify-between">
                              <span>{k}</span>
                              <span className="text-white/70">{v as any}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-white/80 mb-2">MN3: งบประมาณเฉลี่ย</div>
                        <ul className="space-y-1 text-sm">
                          {Object.entries(journey.mn3Budgets || {}).map(([k, v]: any) => (
                            <li key={k} className="flex justify-between">
                              <span>{k}</span>
                              <span className="text-white/70">{Math.round(v.avg)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-white/80 mb-2">Ask05: ความคิดเห็นล่าสุด</div>
                        <ul className="space-y-1 text-sm">
                          {(journey.ask05Samples || []).map((c: string, i: number) => (
                            <li key={i} className="truncate">• {c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </>
              )}

              {/* Per-user (individual) results */}
              <Card title="ผลรายบุคคล (ล่าสุด)">
                <div className="overflow-auto">
                  <table className="min-w-full text-sm rounded-md overflow-hidden">
                    <thead className="bg-white/5 backdrop-blur">
                      <tr className="text-left text-white/80">
                        <th className="py-2 pr-4">เวลา</th>
                        <th className="py-2 pr-4">Session</th>
                        <th className="py-2 pr-4">Intro</th>
                        <th className="py-2 pr-4">MN1</th>
                        <th className="py-2 pr-4">ตัดสินใจ</th>
                        <th className="py-2 pr-4">ติดต่อ</th>
                        <th className="py-2 pr-4">ความคิดเห็น</th>
                        <th className="py-2 pr-4">ดู</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {sessions.slice(0, 50).map((s) => (
                        <tr key={s.sessionId}>
                          <td className="py-2 pr-4 whitespace-nowrap">
                            {new Date(s.lastSeen).toLocaleString()}
                          </td>
                          <td className="py-2 pr-4">
                            {s.sessionId.slice(0, 10)}…
                          </td>
                          <td className="py-2 pr-4">{s.introWho || "-"}</td>
                          <td className="py-2 pr-4">
                            {s.mn1Selected?.join(", ") || "-"}
                          </td>
                          <td className="py-2 pr-4">{s.endDecision || "-"}</td>
                          <td className="py-2 pr-4">{s.contacts || 0}</td>
                          <td className="py-2 pr-4 truncate max-w-[240px]">
                            {s.ask05Comment || "-"}
                          </td>
                          <td className="py-2 pr-4">
                            <button
                              className="text-xs rounded bg-white/10 hover:bg-white/20 px-2 py-1 shadow-sm"
                              onClick={async () => {
                                setDetailSession(s.sessionId);
                                setDetailOpen(true);
                                setDetailData(null);
                                const resp = await fetch(
                                  `/api/session/${s.sessionId}`,
                                );
                                if (resp.ok) setDetailData(await resp.json());
                              }}
                            >
                              รายละเอียด
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Export */}
              <div className="flex flex-wrap gap-3 justify-end">
                <button
                  className="rounded-full bg-[#EFBA31] text-black font-medium px-5 py-2 border border-black hover:scale-105 transition shadow-sm"
                  onClick={() =>
                    exportCsv("uk_export.csv", [
                      [
                        "User",
                        "Access Time",
                        "Profile",
                        "เมื่อได้ยินข่าวนี้ คุณคิดยังไง",
                        "Minigame 1: ตัวเลือกนโยบาย",
                        "Minigame 2 : จ��บคู่",
                        "Minigame 3 : นโยบายที่เลือก",
                        "Minigame 3 : เงินที่ใส่",
                        "ข้อคิดเห็นอื่นๆ",
                        "ลุ้นรางวัล",
                        "ชื่อ",
                        "เบอร์โทร",
                      ],
                      ...sessions.map((s) => {
                        const mn2 = (() => {
                          const m = s.mn2Selections || {};
                          const mn1 = s.mn1Selected || [];
                          const parts = mn1.map((p) => {
                            const gs = Array.isArray(m[p]) ? m[p] : [];
                            return `${p}: ${gs.length ? gs.join(" | ") : "-"}`;
                          });
                          return parts.join(" ; ");
                        })();
                        const mn3sel = (s.mn3Selected || []).join(" | ");
                        const mn3money = (() => {
                          const alloc = s.mn3BudgetAllocation || {};
                          const order =
                            s.mn3Selected && s.mn3Selected.length
                              ? s.mn3Selected
                              : Object.keys(alloc);
                          const seen = new Set<string>();
                          const pairs: string[] = [];
                          for (const p of order) {
                            seen.add(p);
                            const val = (alloc as any)[p];
                            pairs.push(
                              `${p}: ${typeof val === "number" ? val : "-"}`,
                            );
                          }
                          for (const p of Object.keys(alloc)) {
                            if (seen.has(p)) continue;
                            const val = (alloc as any)[p];
                            pairs.push(
                              `${p}: ${typeof val === "number" ? val : "-"}`,
                            );
                          }
                          return pairs.join(" ; ");
                        })();
                        const decision =
                          s.endDecisionText || s.endDecision || "";
                        return [
                          s.ip || "",
                          s.firstSeen,
                          s.introWho || "",
                          s.stornawayVariantName || "",
                          (s.mn1Selected || []).join(" | "),
                          mn2,
                          mn3sel,
                          mn3money,
                          s.ask05Comment || "",
                          decision,
                          s.contactName || "",
                          s.contactPhone || "",
                        ];
                      }),
                    ])
                  }
                >
                  ดาวน์โหลด CSV (รายบุคคล)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {detailOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setDetailOpen(false)}
        >
          <div
            className="bg-gradient-to-b from-[#121214] to-[#0f0f10] border border-white/10 rounded-xl w-[92vw] max-w-4xl max-h-[80vh] overflow-auto p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-medium">
                รายละเอียด���ซสชัน: {detailSession?.slice(0, 12)}…
              </div>
              <button
                className="text-white/70 hover:text-white"
                onClick={() => setDetailOpen(false)}
              >
                ปิด
              </button>
            </div>
            {!detailData && (
              <div className="text-white/70 text-sm">กำลังโหลด...</div>
            )}
            {detailData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-white/80 mb-1">App Events</div>
                  <ul className="space-y-1">
                    {detailData.appEvents.map((e, i) => (
                      <li key={i} className="border-b border-white/10 py-1">
                        <div className="text-white/60 text-xs">
                          {new Date(e.timestamp).toLocaleString()}
                        </div>
                        <div className="font-medium">{e.event}</div>
                        {e.payload && (
                          <pre className="text-xs whitespace-pre-wrap break-words text-white/70">
                            {JSON.stringify(e.payload)}
                          </pre>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-white/80 mb-1">Video Events</div>
                  <ul className="space-y-1">
                    {detailData.videoEvents.map((e, i) => (
                      <li key={i} className="border-b border-white/10 py-1">
                        <div className="text-white/60 text-xs">
                          {new Date(e.timestamp).toLocaleString()}
                        </div>
                        <div className="font-medium">{e.eventName}</div>
                        <div className="text-white/70 text-xs">
                          {e.variantName || e.choiceText || "-"}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function exportCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((r) =>
      r
        .map((x) => {
          const s = String(x ?? "");
          return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
        })
        .join(","),
    )
    .join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.05] backdrop-blur-sm shadow-sm">
      <header className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-base md:text-lg font-semibold tracking-tight">{title}</h2>
      </header>
      <div className="p-4 md:p-5">{children}</div>
    </section>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.05] backdrop-blur-sm shadow-sm p-4">
      <div className="text-sm text-white/70">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </section>
  );
}
