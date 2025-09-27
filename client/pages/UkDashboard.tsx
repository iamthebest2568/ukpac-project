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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  introWho?: string; // บทบาทในการเดินทางเข้าเมือง
  travelMethod?: string; // ยาน��าหนะที่ใช้
  opinionLevel?: string; // ระดับความคิดเห็น
  ask02Choice?: string; // เหตุผลหลัก
  ask02CustomReason?: string; // เหตุผลพิมพ์เอง
  reasonOther01?: string; // คำอธิบายเพิ่มเติม
  keyMessage1?: string; // Key message 1
  mn1Selected: string[]; // ลำดับความสำคัญของประเด็น
  mn2Selections?: Record<string, string[]>; // กลุ่มเป้าหมายที��ควรได้รับสิทธิ์
  mn3Selected?: string[]; // ประเด็นนโยบายที่ผู้ใช้เลือก
  mn3BudgetAllocation?: Record<string, number>; // การจัดสรรงบประมาณ
  mn3BudgetTotal?: number;
  satisfactionLevel?: string; // ระดับความพึงพอใจ
  ask05Comment?: string; // ข้อเสนอเพิ่มเติมต่อรัฐ
  fakeNewsResponse?: string; // การตอบสนองต่อข่าวปลอม
  sourceSelected?: string; // แหล่งข่าวที่ผู้ใช้เลือก
  endDecision?: string; // การเข้าร่วมลุ้นรางวัล
  endDecisionText?: string;
  contactName?: string;
  contactPhone?: string;
  contacts: number;
  stornawayVariantName?: string;
  shareCount?: number;
  shareFirstTs?: string | null;
  shareLastTs?: string | null;
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
  const [firstLoad, setFirstLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [clearing, setClearing] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [ingest, setIngest] = useState<IngestStatus | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailSession, setDetailSession] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<{
    appEvents: any[];
    videoEvents: any[];
  } | null>(null);

  // Responsive helpers for charts/labels
  const [winW, setWinW] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  useEffect(() => {
    const onResize = () => setWinW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Password gate — use fixed credentials per request (do not rely on runtime API)
  const [expected, setExpected] = useState<string | undefined>("Ukdash-Xrz14!");
  const [authed, setAuthed] = useState<boolean>(
    () => sessionStorage.getItem("ukdash_authed") === "true",
  );
  const [user, setUser] = useState("");
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState<string | null>(null);

  // Helper: escape CSV cell
  const escapeCell = (val: any) => {
    if (val === undefined || val === null) return "";
    const s = typeof val === "string" ? val : JSON.stringify(val);
    // remove control chars and normalize
    return String(s).replace(/[\u0000-\u001F\u007F]/g, "").replace(/"/g, '""');
  };

  async function load() {
    if (firstLoad) setLoading(true);
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
      const [jRes, ssRes, stRes, vsRes] = await Promise.allSettled([
        fetch(`/api/user-journey-stats`),
        fetch(`/api/session-summaries?limit=100`),
        fetch(`/api/ingest-status`),
        fetch(`/api/video-stats`),
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
      if (vsRes.status === "fulfilled" && vsRes.value.ok) {
        try {
          setStats(await vsRes.value.json());
        } catch {}
      }
      setLastUpdated(new Date().toLocaleString());
    } catch (e: any) {
      setError(e?.message || "โหลดข้อมูลล้มเหลว");
    } finally {
      if (firstLoad) setLoading(false);
      setFirstLoad(false);
    }
  }

  // Map sessions to CSV with Thai headers per spec
  const exportMappedCsv = (items: any[]) => {
    if (!items || !items.length) {
      alert("ไม่มีข้อมูลสำหรับดาวน์โหลด");
      return;
    }

    const headers = [
      "รหัสเซสชัน (sessionID)",
      "IP (ip)",
      "เวลา (time_stamp)",
      "บทบาท (persona)",
      "ยานพาหนะ (vehicle)",
      "เหตุผล_Stornaway (Stornaway)",
      "ความยอมรับ (accept)",
      "เหตุผล_Webapp (reason)",
      "เหตุผล_อื่นๆ_Webapp (reason_other)",
      "ประเด็นนโยบาย (policy_topic)",
      "กลุ่มเป้าหมาย (target_group)",
      "พัฒนา_ลำดับ (dev_priority)",
      "งบประมาณ (budget_alloc)",
      "ความพอใจ (satisfaction)",
      "ข้อเสนอรัฐ (gov_suggest)",
      "ข่าวปลอม (fake_react)",
      "แหล่งข่าว (news_source)",
      "ลุ้นรางวัล (lucky_draw)",
      "ผู้ใช้_ชื่อ (user_name)",
      "ผู้ใช้_เบอร์ (user_phone)",
      "เวลาส่งแบบฟอร์ม (ts_form_submit)",
      "แชร์_ครั้งแรก (share_first_ts)",
      "แชร์_ครั้งสุดท้าย (share_last_ts)",
      "เวลาจบเกม (Exit_Time)",
    ];

    const rows = items.map((s: any) => {
      // s is SessionSummary produced by computeSessionSummaries
      const ip = s.ip || "";
      const first = s.firstSeen || "";
      const last = s.lastSeen || "";
      const persona = s.introWho || "";
      const vehicle = s.travelMethod || "";
      const stornaway = s.keyMessage1 || "";
      const accept = s.opinionLevel || "";
      const reason_web = s.ask02Choice || "";
      const reason_other = [s.ask02CustomReason, s.reasonOther01, s.ask05Comment]
        .filter(Boolean)
        .join(" | ");
      const policy_topic = Array.isArray(s.mn3Selected) ? s.mn3Selected.join(" | ") : "";
      // mn2Selections is object mapping priority->array; stringify as JSON
      const target_group = s.mn2Selections ? JSON.stringify(s.mn2Selections) : "";
      const dev_priority = Array.isArray(s.mn1Selected) ? s.mn1Selected.join(" | ") : "";
      const budget_alloc = s.mn3BudgetAllocation ? JSON.stringify(s.mn3BudgetAllocation) : "";
      const satisfaction = s.satisfactionLevel || "";
      const gov_suggest = s.ask05Comment || "";
      const fake_react = s.fakeNewsResponse || "";
      const news_source = s.sourceSelected || "";
      const lucky_draw = s.endDecision || "";
      const user_name = s.contactName || "";
      const user_phone = s.contactPhone || "";
      const ts_form_submit = last || "";
      const share_first = s.shareFirstTs || "";
      const share_last = s.shareLastTs || "";
      const exit_time = last || "";

      return [
        s.sessionId || "",
        ip,
        first,
        persona,
        vehicle,
        stornaway,
        accept,
        reason_web,
        reason_other,
        policy_topic,
        target_group,
        dev_priority,
        budget_alloc,
        satisfaction,
        gov_suggest,
        fake_react,
        news_source,
        lucky_draw,
        user_name,
        user_phone,
        ts_form_submit,
        share_first,
        share_last,
        exit_time,
      ].map((c) => `"${escapeCell(c)}"`).join(",");
    });

    const csv = [headers.map((h) => `"${h}"`).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ukpack1_sessions_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  async function clearData() {
    if (
      !window.confirm("ลบข้อมูลทั้งหมดในเซิร์ฟเวอร์? การกระทำนี้ย้อนกลับไม่ได้")
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
      alert(e?.message || "ลบข้���มูลล้มเหลว");
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
    <div className="min-h-screen overflow-y-auto bg-gradient-to-b from-[#0a0a0b] to-[#111216] text-white font-[Prompt]">
      {!authed && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="text-xl font-semibold mb-3">ป้อนรหัสผ่าน</div>
            <div className="text-sm text-white/70 mb-4">
              หน้านี้ป้องกันด้วยรหัสผ่าน
            </div>
            <input
              type="text"
              className="w-full rounded-md bg-black/40 border border-white/15 px-3 py-2 outline-none mb-2"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="User ID"
            />
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
                const expectedUser = "ukpact";
                const expectedPassword = (expected && expected.length > 0) ? expected : "Ukdash-Xrz14!";
                if (!expectedPassword) {
                  setPwErr("ยังไม่ได้ตั้งรหัสผ่าน (VITE_DASHBOARD_PASSWORD)");
                  return;
                }
                if (user.trim() === expectedUser && pw === expectedPassword) {
                  sessionStorage.setItem("ukdash_authed", "true");
                  setAuthed(true);
                  setPwErr(null);
                } else {
                  setPwErr("ชื่อผู้ใช้หรือรหัสผ่า���ไม่ถูกต้อง");
                }
              }}
            >
              เข้าสู่แดชบอร์ด
            </button>
          </div>
        </div>
      )}
      {authed && (
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                แดชบอร์ดวิเคราะห์วิดีโอ
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
                รีเฟร
              </button>

              <button
                onClick={async () => {
                  try {
                    if (isSending) return;
                    setIsSending(true);
                    const sample = {
                      sessionId: `session_test_${Date.now()}`,
                      timestamp: new Date().toISOString(),
                      event: "TEST_EVENT",
                      page: "/ukpack1/dashboard",
                      payload: {
                        PDPA: true,
                        note: "Test event from ukpack1 dashboard",
                      },
                    };
                    const resp = await fetch("/api/track", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(sample),
                    });
                    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                    alert("Test event sent to server (ukpack1)");
                    await load();
                  } catch (e: any) {
                    alert(
                      "Failed to send test event: " + (e?.message || String(e)),
                    );
                  } finally {
                    setIsSending(false);
                  }
                }}
                className={`rounded-md bg-blue-600/80 hover:bg-blue-600 border border-blue-500 px-3 py-2 text-sm ${isSending ? "opacity-60" : ""}`}
                disabled={isSending}
                title="ส่งเหตุการณ์ทดสอบไปยัง ukpack1"
              >
                {isSending ? "กำลังส่..." : "Send Test Event (ukpack1)"}
              </button>

              <button
                className="rounded-md bg-yellow-400 text-black px-3 py-2 rounded font-semibold"
                onClick={() => exportMappedCsv(sessions)}
              >
                ดาวน์โหลด CSV (สรุป ภาษาไทย)
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

          {firstLoad && loading && (
            <div
              className="h-5 w-20 rounded bg-white/10 animate-pulse"
              aria-hidden="true"
            />
          )}
          {error && <div className="text-red-400">เกิดข้อผิดพลาด: {error}</div>}

          {stats && (
            <div className="space-y-6">
              {/* Totals summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <SummaryCard
                  title="Sessions"
                  value={stats.totals.totalSessions}
                />
                <SummaryCard title="Plays" value={stats.totals.totalPlays} />
                <SummaryCard
                  title="Completion"
                  value={`${Math.round((stats.totals.completionRate || 0) * 100)}%`}
                />
                <SummaryCard
                  title="Avg Session (s)"
                  value={Math.round(stats.totals.avgSessionLengthSeconds || 0)}
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card title="แนวโน้มการเล่น (รายวัน)">
                  <div className="w-full h-[240px] md:h-[320px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={(stats.timeseries || []).map((d) => ({
                          ...d,
                          plays: Number(d.plays || 0),
                        }))}
                        margin={{ top: 8, right: 12, left: -8, bottom: 8 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#ffffff22"
                        />
                        <XAxis
                          dataKey="date"
                          stroke="#bbb"
                          tick={{ fontSize: winW < 640 ? 10 : 12 }}
                          hide={winW < 380}
                        />
                        <YAxis
                          stroke="#bbb"
                          tick={{ fontSize: winW < 640 ? 10 : 12 }}
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "#151517",
                            border: "1px solid #2a2a2a",
                            color: "#fff",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="plays"
                          stroke="#EFBA31"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card title="เริ่มฉาก (Variants)">
                  <div className="w-full h-[260px] md:h-[320px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={(stats.variants || []).slice(0, 10)}
                        margin={{ top: 8, right: 12, left: -8, bottom: 8 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#ffffff22"
                        />
                        <XAxis
                          dataKey="name"
                          stroke="#bbb"
                          tick={{ fontSize: winW < 640 ? 10 : 11 }}
                          interval={0}
                          angle={winW < 640 ? 0 : -20}
                          height={winW < 640 ? 40 : 60}
                        />
                        <YAxis
                          stroke="#bbb"
                          tick={{ fontSize: winW < 640 ? 10 : 12 }}
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "#151517",
                            border: "1px solid #2a2a2a",
                            color: "#fff",
                          }}
                        />
                        <Bar dataKey="count" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card title="ตัวเลือก (Choices)">
                  <div className="w-full h-[260px] md:h-[320px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip
                          contentStyle={{
                            background: "#151517",
                            border: "1px solid #2a2a2a",
                            color: "#fff",
                          }}
                        />
                        <Pie
                          data={(stats.choices || []).slice(0, 8)}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={winW < 640 ? 70 : 90}
                          label={winW >= 480}
                        >
                          {stats.choices.slice(0, 8).map((_, i) => (
                            <Cell
                              key={i}
                              fill={
                                [
                                  "#EFBA31",
                                  "#8884d8",
                                  "#82ca9d",
                                  "#ff7f50",
                                  "#00C49F",
                                  "#FFBB28",
                                  "#FF8042",
                                  "#6ee7b7",
                                ][i % 8]
                              }
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* User Journey: Topics as accordion */}
              {journey && (
                <Card title="หัวข้อข้อมูล (Topics)">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    defaultValue="profile"
                  >
                    {/* User */}
                    <AccordionItem value="user">
                      <AccordionTrigger>User</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1 text-sm">
                          <li className="flex justify-between">
                            <span>ผู้ใช้ไม่ซ้ำ (IP)</span>
                            <span className="text-white/70">
                              {journey.ipCount || 0}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span>จำนวนเซสชัน</span>
                            <span className="text-white/70">
                              {sessions.length}
                            </span>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    {/* Access Time */}
                    <AccordionItem value="access">
                      <AccordionTrigger>Access Time</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1 text-sm">
                          {(() => {
                            const times = sessions.map((s) =>
                              new Date(s.lastSeen).getTime(),
                            );
                            const min = times.length
                              ? new Date(Math.min(...times)).toLocaleString()
                              : "-";
                            const max = times.length
                              ? new Date(Math.max(...times)).toLocaleString()
                              : "-";
                            return (
                              <>
                                <li className="flex justify-between">
                                  <span>ช่วงเวลา</span>
                                  <span className="text-white/70">
                                    {min} – {max}
                                  </span>
                                </li>
                                <li className="flex justify-between">
                                  <span>ลาสุด</span>
                                  <span className="text-white/70">{max}</span>
                                </li>
                              </>
                            );
                          })()}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    {/* Profile */}
                    <AccordionItem value="profile">
                      <AccordionTrigger>Profile</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1 text-sm">
                          {Object.entries(journey.introWho || {})
                            .sort(
                              (a: any, b: any) =>
                                (b[1] as number) - (a[1] as number),
                            )
                            .map(([k, v]) => (
                              <li key={k} className="flex justify-between">
                                <span>{String(k ?? "")}</span>
                                <span className="text-white/70">
                                  {v as any}
                                </span>
                              </li>
                            ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    {/* Stornaway choice */}
                    <AccordionItem value="stornaway">
                      <AccordionTrigger>
                        เมื่ได้ยิ��ข่าวนี้ คุณคิดยังไง
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1 text-sm">
                          {Object.entries(journey.stornawayVariants || {})
                            .sort(
                              (a: any, b: any) =>
                                (b[1] as number) - (a[1] as number),
                            )
                            .map(([k, v]) => (
                              <li key={k} className="flex justify-between">
                                <span>{String(k ?? "")}</span>
                                <span className="text-white/70">
                                  {v as any}
                                </span>
                              </li>
                            ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    {/* MN1 */}
                    <AccordionItem value="mn1">
                      <AccordionTrigger>
                        Minigame 1: ตัวเลือกนโยบาย
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1 text-sm">
                          {Object.entries(journey.mn1 || {})
                            .sort(
                              (a: any, b: any) =>
                                (b[1] as number) - (a[1] as number),
                            )
                            .map(([k, v]) => (
                              <li key={k} className="flex justify-between">
                                <span>{String(k ?? "")}</span>
                                <span className="text-white/70">
                                  {v as any}
                                </span>
                              </li>
                            ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    {/* MN2 */}
                    <AccordionItem value="mn2">
                      <AccordionTrigger>Minigame 2 : ับคู่</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1 text-sm">
                          {Object.entries(journey.mn2ByMn1 || {}).map(
                            ([priority, groups]: any) => (
                              <li
                                key={priority}
                                className="flex justify-between"
                              >
                                <span>{String(priority ?? "")}</span>
                                <span className="text-white/70">
                                  {Object.entries(
                                    groups as Record<string, number>,
                                  )
                                    .sort(
                                      (a: any, b: any) =>
                                        (b[1] as number) - (a[1] as number),
                                    )
                                    .slice(0, 3)
                                    .map(
                                      ([g, c]) => `${String(g ?? "")} (${c})`,
                                    )
                                    .join(" • ")}
                                </span>
                              </li>
                            ),
                          )}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    {/* MN3 selected */}
                    <AccordionItem value="mn3sel">
                      <AccordionTrigger>
                        Minigame 3 : นโยบายที่เลือก
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1 text-sm">
                          {Object.entries(journey.mn3Selection || {})
                            .sort(
                              (a: any, b: any) =>
                                (b[1] as number) - (a[1] as number),
                            )
                            .map(([k, v]) => (
                              <li key={k} className="flex justify-between">
                                <span>{String(k ?? "")}</span>
                                <span className="text-white/70">
                                  {v as any}
                                </span>
                              </li>
                            ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    {/* MN3 money */}
                    <AccordionItem value="mn3money">
                      <AccordionTrigger>
                        Minigame 3 : เงินท่ใส่
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1 text-sm">
                          {Object.entries(journey.mn3Budgets || {}).map(
                            ([k, v]: any) => (
                              <li key={k} className="flex justify-between">
                                <span>{String(k ?? "")}</span>
                                <span className="text-white/70">
                                  {Math.round((v as any).avg)}
                                </span>
                              </li>
                            ),
                          )}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    {/* Comments */}
                    <AccordionItem value="comments">
                      <AccordionTrigger>ข้อคิดเห็นอื่นๆ</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1 text-sm">
                          {(journey.ask05Samples || []).map(
                            (c: string, i: number) => (
                              <li key={i} className="truncate">
                                • {String(c ?? "")}
                              </li>
                            ),
                          )}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    {/* Rewards */}
                    <AccordionItem value="reward">
                      <AccordionTrigger>ลุ้นรางวัล</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1 text-sm">
                          <li className="flex justify-between">
                            <span>เข้าร่วม</span>
                            <span className="text-white/70">
                              {journey.endseq?.participate || 0}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span>ไม่เข้าร่วม</span>
                            <span className="text-white/70">
                              {journey.endseq?.decline || 0}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span>กรอกข้อมูลติดต่อ</span>
                            <span className="text-white/70">
                              {journey.endseq?.contacts || 0}
                            </span>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              )}

              {/* Per-user (individual) results */}
              <Card title="ผลรายบุคคล (ล่าสุด)">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm rounded-md overflow-hidden">
                    <thead className="bg-white/5 backdrop-blur">
                      <tr className="text-left text-white/80">
                        <th className="py-2 pr-4">ลา</th>
                        <th className="py-2 pr-4">Session</th>
                        <th className="py-2 pr-4">Intro</th>
                        <th className="py-2 pr-4">MN1</th>
                        <th className="py-2 pr-4">ตัดสินใจ</th>
                        <th className="py-2 pr-4">ติดต่อ</th>
                        <th className="py-2 pr-4">ควมคิดเห็น</th>
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
                          <td className="py-2 pr-4">{s.introWho ?? ""}</td>
                          <td className="py-2 pr-4">
                            {s.mn1Selected?.join(", ") || "-"}
                          </td>
                          <td className="py-2 pr-4">{s.endDecision || "-"}</td>
                          <td className="py-2 pr-4">{s.contacts || 0}</td>
                          <td className="py-2 pr-4 truncate max-w-[240px]">
                            {s.ask05Comment ?? ""}
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
                  onClick={() => {
                    const rows: (string | number)[][] = [];
                    // CSV headers aligned to user's questionnaire
                    rows.push([
                      "IP",
                      "Access Time",
                      "ทำไมคุณถึงต้องเข้าเมืองบ่อย ๆ ?",
                      "คุณใช้รถแบบไหนเดินทางเข้าเมือง ?",
                      "คุ��คิดเห็นอย่างไรกับนโยบายนี้ ?",
                      "จากข้อความข้างต้น คุณมีความคิดเห็นอย่างไร (เห็นด้วย/กลางๆ/ไม่เห็นด้วย)",
                      "ทำไมคุณถึงคิดอย่างนั้น (นโยบายไม่ครอบคลุม / เก็บไปก็ไม่มีอะไรดีข���้น / อื่นๆ)",
                      "อธิ���ายอื่น ๆ ที่ช่วยอธิบายความคิดเห็น",
                      "บอกเร��หน่อยว่าคุณเดินทางเข��าเมืองด้วยวิธีการใดบ่อยที่สุด",
                      "จากนโยบายที่คุณฟังเมื่อสักครู่ คุณมีความคิดเห็นอย่างไร",
                      "คุณคิดว่านโยบายปัจจุบัน ควรปรับเปลี่ยนประเด็นอะไรบาง (ลดค่าโดยสาร, ปรับปรุงคุณภาพ, ขึ้น���าคา, เพิ่มขบวน, เพิ่มความถี่ ฯลฯ)",
                      "คุณคิดว่าใครควรได้รับการลดค่าโดยสารรถไฟฟ���าบ้าง (ทุกคน, ผู้สูงอายุ, นักเรียน, คนทำงาน ฯลฯ)",
                      "คุณคิดว่าควรใช้เงินที่ได้จากการเก็บไปพัฒนาอะไร ก่อน 3 อันดับแรก",
                      "คุณจะให้งบประมาณแต่ละข้อเท่าไร (งบทั้งหมด 100)",
                      "คุณพอ��จกับผลลัพธ์ที่เกิดขึ้นหรือไม่ (พอใจ / ไม่พอใจ)",
                      "คุณคิดว่ารัฐควรทำอะไรที่จะทำให้นโยบายนี้เกิดขึ้นได้จริง และเป็นประโยชน์ต่อประชาชนอย่างแท้จริง",
                      "ตอนนี้มีข้อมูลที่ผิดพลาด เช่น ข่าวปลอมเกี่ยวกับนโยบาย คุณคิดว่าอย่างไร",
                      "คุณจะติดตามข่าว หรือเชื่อจากแหล่งไหนมาก���ี่สุด",
                      "ขอบคุณที่ร่วมเป็นส่วนหนึ่ง → ต้องการลุ้นรับรางวัลหรือไม่",
                      "กรอกข้อมูลเพื่อลุ้นรางวัล (ชื่อ)",
                      "กรอกข้อมูลเพื่อลุ้นรางวัล (เบอร์โทร)",
                      "Time Stamp (First)",
                      "แชร์ให้เพื่อนไหม (ครั้งแรก)",
                      "Time Stamp (Last)",
                      "แชร์ให้เพื่อนไหม (เคยแชร์ไหม)",
                      "Session ID",
                    ]);
                    const perRows = sessions.map((s) => {
                      const mn2 = (() => {
                        const m = s.mn2Selections || {};
                        const mn1 = s.mn1Selected || [];
                        const parts = mn1.map((p) => {
                          const gs = Array.isArray(m[p]) ? m[p] : [];
                          return `${p}: ${gs.length ? gs.join(" | ") : "-"}`;
                        });
                        return parts.join(" ; ");
                      })();
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
                      const decision = s.endDecisionText || s.endDecision || "";
                      return [
                        s.ip || "",
                        s.firstSeen || "",
                        s.introWho || "",
                        s.travelMethod || "",
                        s.opinionLevel || "",
                        s.opinionLevel || "",
                        s.ask02Choice || "",
                        [s.ask02CustomReason, s.reasonOther01]
                          .filter(Boolean)
                          .join(" | ") || "",
                        s.travelMethod || "",
                        s.opinionLevel || "",
                        (s.mn1Selected || []).join(" | "),
                        mn2,
                        (s.mn3Selected || []).join(" | "),
                        mn3money,
                        s.satisfactionLevel || "",
                        s.ask05Comment || "",
                        s.fakeNewsResponse || "",
                        s.sourceSelected || "",
                        decision,
                        s.contactName || "",
                        s.contactPhone || "",
                        s.firstSeen || "",
                        s.shareFirstTs || "",
                        s.lastSeen || "",
                        s.shareCount && s.shareCount > 0 ? "ใช่" : "ไม่",
                        s.sessionId || "",
                      ];
                    });
                    rows.push(...perRows);

                    exportCsv("uk_export_all.csv", rows);
                  }}
                >
                  ดาวน์โหด CSV (สรุปรวม)
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
                รายละเอียดเซสชั: {detailSession?.slice(0, 12)}…
              </div>
              <button
                className="text-white/70 hover:text-white"
                onClick={() => setDetailOpen(false)}
              >
                ปด
              </button>
            </div>
            {!detailData && (
              <div
                className="h-4 w-16 rounded bg-white/10 animate-pulse"
                aria-hidden="true"
              />
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

function exportJson(filename: string, data: any) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
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
        <h2 className="text-base md:text-lg font-semibold tracking-tight">
          {title}
        </h2>
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
