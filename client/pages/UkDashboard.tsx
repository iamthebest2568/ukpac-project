import { useEffect, useMemo, useState } from "react";
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
  introWho?: string; // บ���บาทในการเดินทางเข้าเมือง
  travelMethod?: string; // ยาน��าห��ะที่ใช้
  opinionLevel?: string; // ระดับความคิดเห็น
  ask02Choice?: string; // เหตุผลหลัก
  ask02CustomReason?: string; // เหตุผลพิมพ์เอง
  reasonOther01?: string; // คำอธิบายเพิ่มเติม
  keyMessage1?: string; // Key message 1
  mn1Selected: string[]; // ลำดับความสำคัญของประเด็น
  mn2Selections?: Record<string, string[]>; // กลุ่มเป้าหมายที่ควรได้รับสิทธิ์
  mn3Selected?: string[]; // ประเด็นนโยบา��ที่ผู้ใช้เลือก
  mn3BudgetAllocation?: Record<string, number>; // การจัดสรรงบประมาณ
  mn3BudgetTotal?: number;
  satisfactionLevel?: string; // ระดับความพึงพอใจ
  ask05Comment?: string; // ข้อเสนอเพิ่มเติมต่อรัฐ
  fakeNewsResponse?: string; // การตอบสนองต่อข่าวปลอม
  sourceSelected?: string; // แหล่งข่าวที่ผู้��ช้เลือก
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

  // During development / preview in the beforecitychange mock, auto-enable the dashboard
  // if the path points to /beforecitychange/uk-dashboard so the admin can view it without manual password.
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const p =
          window.location && window.location.pathname
            ? window.location.pathname
            : "";
        if (
          p.startsWith("/beforecitychange/uk-dashboard") ||
          p.startsWith("/beforecitychange/ukdashboard.html")
        ) {
          sessionStorage.setItem("ukdash_authed", "true");
          setAuthed(true);
        }
      }
    } catch (e) {}
  }, []);

  // Add a component-lifetime unhandledrejection handler to silently ignore AbortError
  useEffect(() => {
    const onUnhandled = (ev: PromiseRejectionEvent) => {
      try {
        const reason = (ev && (ev.reason || (ev.detail && ev.detail.reason))) as any;
        if (!reason) return;
        const name = reason.name || (reason.constructor && reason.constructor.name) || '';
        const msg = String(reason && (reason.message || reason));
        if (name === 'AbortError' || /aborted|abort/i.test(msg)) {
          ev.preventDefault();
          console.debug('Ignored AbortError unhandled rejection in UkDashboard (lifetime)', reason);
        }
      } catch (e) {}
    };
    window.addEventListener('unhandledrejection', onUnhandled as any);
    return () => window.removeEventListener('unhandledrejection', onUnhandled as any);
  }, []);
  const [user, setUser] = useState("");
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState<string | null>(null);

  // Helper: escape CSV cell
  const escapeCell = (val: any) => {
    if (val === undefined || val === null) return "";
    const s = typeof val === "string" ? val : JSON.stringify(val);
    // remove control chars and normalize
    return String(s)
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .replace(/"/g, '""');
  };

  // Format a timestamp string to Thailand local time (Bangkok)
  const formatToBangkok = (ts?: string | number | Date) => {
    try {
      if (!ts) return "";
      const d = typeof ts === "string" || typeof ts === "number" ? new Date(ts) : (ts as Date);
      if (isNaN(d.getTime())) return String(ts || "");
      return d.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });
    } catch (e) {
      return String(ts || "");
    }
  };

  // Generate a compact filename timestamp in Bangkok timezone: YYYYMMDD_HHMMSS
  const filenameTimestampBangkok = (date = new Date()) => {
    try {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Bangkok",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).formatToParts(date as any);
      const map: any = {};
      for (const p of parts) map[p.type] = p.value;
      return `${map.year}${map.month}${map.day}_${map.hour}${map.minute}${map.second}`;
    } catch (e) {
      const d = new Date(date);
      return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}_${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}${String(d.getSeconds()).padStart(2, "0")}`;
    }
  };

  const apiUrl = (p: string) =>
    (typeof window !== "undefined" ? window.location.origin : "") + p;

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
      // Helper to perform safe fetch with timeout and avoid uncaught network errors
      const safeFetch = async (
        url: string,
        opts: RequestInit | undefined,
        ms = 8000,
      ) => {
        try {
          if (typeof navigator !== "undefined" && navigator.onLine === false) {
            console.debug("Offline: skipping fetch", url);
            return null;
          }
          const controller = new AbortController();
          // pass a reason where supported to avoid noisy "signal is aborted without reason" logs
          const id = setTimeout(() => {
            try {
              (controller as any).abort && (controller as any).abort('timeout');
            } catch (_) {
              try { controller.abort(); } catch (_) {}
            }
          }, ms);
          // Use relative URLs when possible to avoid origin mismatches in previews/deploys
          const fetchUrl = typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))
            ? url
            : (typeof url === 'string' ? url : String(url));
          const resp = await fetch(fetchUrl, {
            ...(opts || {}),
            signal: controller.signal,
          });
          clearTimeout(id);
          return resp;
        } catch (err) {
          console.debug("safeFetch failed", url, err);
          return null;
        }
      };

      // suppress global unhandled AbortError rejections from fetch timeouts in this component
      try {
        const onUnhandled = (ev: PromiseRejectionEvent) => {
          try {
            const reason = (ev && (ev.reason || (ev.detail && ev.detail.reason))) as any;
            if (!reason) return;
            const name = reason.name || (reason.constructor && reason.constructor.name) || '';
            const msg = String(reason && (reason.message || reason));
            if (name === 'AbortError' || /aborted|abort/i.test(msg)) {
              ev.preventDefault();
              console.debug('Ignored AbortError unhandled rejection in UkDashboard', reason);
            }
          } catch (e) {}
        };
        window.addEventListener('unhandledrejection', onUnhandled as any);
        // remove listener after 30s to avoid leaking during component lifetime
        setTimeout(() => window.removeEventListener('unhandledrejection', onUnhandled as any), 30 * 1000);
      } catch (_) {}

      const endpoints = [
        "/api/user-journey-stats",
        "/api/session-summaries?limit=100",
        "/api/ingest-status",
        "/api/video-stats",
      ];

      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const promises = endpoints.map((p) =>
        safeFetch(origin + p, undefined, 8000),
      );
      const [jRes, ssRes, stRes, vsRes] = await Promise.all(promises);

      if (jRes && jRes.ok) {
        try {
          setJourney(await jRes.json());
        } catch (e) {
          console.debug("parse journey failed", e);
        }
      }
      if (ssRes && ssRes.ok) {
        try {
          setSessions(await ssRes.json());
        } catch (e) {
          console.debug("parse sessions failed", e);
        }
      }
      if (stRes && stRes.ok) {
        try {
          setIngest(await stRes.json());
        } catch (e) {
          console.debug("parse ingest failed", e);
        }
      }
      if (vsRes && vsRes.ok) {
        try {
          setStats(await vsRes.json());
        } catch (e) {
          console.debug("parse stats failed", e);
        }
      }

      setLastUpdated(formatToBangkok(new Date()));
    } catch (e: any) {
      console.warn("load encountered error", e);
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
      "ประ��ด���นนโยบาย (policy_topic)",
      "กลุ่มเป้าหมาย (target_group)",
      "พัฒนา_ลำดับ (dev_priority)",
      "งบประมาณ (budget_alloc)",
      "ความพอใจ (satisfaction)",
      "ข้อเสนอรัฐ (gov_suggest)",
      "ข่าวปล���ม (fake_react)",
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
      const first = formatToBangkok(s.firstSeen) || "";
      const last = formatToBangkok(s.lastSeen) || "";
      const persona = s.introWho || "";
      const vehicle = s.travelMethod || "";
      const stornaway = s.keyMessage1 || "";
      const accept = s.opinionLevel || "";
      const reason_web = s.ask02Choice || "";
      const reason_other = [
        s.ask02CustomReason,
        s.reasonOther01,
        s.ask05Comment,
      ]
        .filter(Boolean)
        .join(" | ");
      const policy_topic = Array.isArray(s.mn3Selected)
        ? s.mn3Selected.join(" | ")
        : "";
      // mn2Selections is object mapping priority->array; stringify as JSON
      const target_group = s.mn2Selections
        ? JSON.stringify(s.mn2Selections)
        : "";
      const dev_priority = Array.isArray(s.mn1Selected)
        ? s.mn1Selected.join(" | ")
        : "";
      const budget_alloc = s.mn3BudgetAllocation
        ? JSON.stringify(s.mn3BudgetAllocation)
        : "";
      const satisfaction = s.satisfactionLevel || "";
      const gov_suggest = s.ask05Comment || "";
      const fake_react = s.fakeNewsResponse || "";
      const news_source = s.sourceSelected || "";
      const lucky_draw = s.endDecision || "";
      const user_name = s.contactName || "";
      const user_phone = s.contactPhone || "";
      const ts_form_submit = formatToBangkok(s.lastSeen) || "";
      const share_first = formatToBangkok(s.shareFirstTs) || "";
      const share_last = formatToBangkok(s.shareLastTs) || "";
      const exit_time = formatToBangkok(s.lastSeen) || "";

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
      ]
        .map((c) => `"${escapeCell(c)}"`)
        .join(",");
    });

    const csv = [headers.map((h) => `"${h}"`).join(","), ...rows].join("\n");
    // Prefix BOM so Excel recognizes UTF-8 properly
    const bom = "\uFEFF";
    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ukpack1_sessions_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  async function clearData() {
    if (
      !window.confirm("ลบข้อมูลทั้งหมดในเซ��ร์ฟเวอร์? การกระทำนี้ย้อนกลับไม่ได้")
    ) {
      return;
    }
    try {
      setClearing(true);
      const res = await fetch(apiUrl("/api/clear-data"), { method: "DELETE" });
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
    // call load and explicitly catch rejections to avoid unhandled promise rejections
    void load().catch((e) => console.debug("load initial call failed", e));
    let id: any;
    if (autoRefresh)
      id = setInterval(() => {
        load().catch((e) => {
          // don't spam console for AbortError caused by timeout; log others
          if (e && e.name === "AbortError") return;
          console.debug("periodic load failed", e);
        });
      }, 5000);
    return () => id && clearInterval(id);
  }, [authed, autoRefresh]);

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-b from-[#0a0a0b] to-[#111216] text-white font-[Prompt]">
      {!authed && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="text-xl font-semibold mb-3">ป้อนรหัสผ่าน</div>
            <div className="text-sm text-white/70 mb-4">
              หน้าน��้ป้องกันด้วยรหัสผ่าน
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
                const expectedPassword =
                  expected && expected.length > 0 ? expected : "Ukdash-Xrz14!";
                if (!expectedPassword) {
                  setPwErr("ยังไม่ได้ตั้งรหัสผ่าน (VITE_DASHBOARD_PASSWORD)");
                  return;
                }
                if (user.trim() === expectedUser && pw === expectedPassword) {
                  sessionStorage.setItem("ukdash_authed", "true");
                  setAuthed(true);
                  setPwErr(null);
                } else {
                  setPwErr("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
                }
              }}
            >
              เข้าสู่แดช���อร์ด
            </button>
          </div>
        </div>
      )}
      {authed && (
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                แ���ชบอร์ดวิเคร��ะห์วิดีโอ
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
                onClick={() =>
                  load().catch((e) => console.debug("manual load failed", e))
                }
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
                      page: "/beforecitychange/dashboard",
                      payload: {
                        PDPA: true,
                        note: "Test event from beforecitychange dashboard",
                      },
                    };
                    const resp = await fetch(apiUrl("/api/track"), {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(sample),
                    });
                    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                    alert("Test event sent to server (beforecitychange)");
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
                title="ส่งเหตุการณ์ทดสอบไปยัง beforecitychange"
              >
                {isSending
                  ? "กำลังส่..."
                  : "Send Test Event (beforecitychange)"}
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
                {clearing ? "กำลังลบ..." : "���บข้อมูลทั้งหมด"}
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


              {/* User Journey: Topics as accordion */}
              {false && (
                <Card title="หัวข้���ข้อมูล (Topics)">
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
                        Minigame 1: ตัวเลือก���โยบาย
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
                      <AccordionTrigger>Minigame 2 : ั��คู่</AccordionTrigger>
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
                      "ทำไมคุณถึงต้องเข้า���มืองบ่อย ๆ ?",
                      "คุณใช้รถแบบไหนเดินทางเข้าเมือง ?",
                      "คุ��คิดเห็นอย่างไรกับนโยบายนี้ ?",
                      "จากข้อความข้างต้น คุณมีควา���คิดเห็นอย่างไร (เห็นด้วย/กลางๆ/��ม่เห็นด้วย)",
                      "ทำไมคุณถึงคิดอย่างนั้น (นโยบายไม่ครอบคลุม / เก็บไปก็ไม่มีอะไรดีข���้น / อื่นๆ)",
                      "อธิบายอื่น ๆ ที่ช่วยอธิบายความคิดเห็น",
                      "บอกเร��หน่อยว่าคุณเดินทางเข้าเมือง��้วยวิธีการใดบ่อยที่ส��ด",
                      "จากนโยบายที่คุณฟังเมื่อสักครู่ คุณมีความคิดเห็นอย่าง��ร",
                      "คุณคิดว่าน���ยบายปัจจุบัน ควรปรับเปลี่ยนประเด็นอะไรบาง (ลดค่าโดยสา��, ปรับปรุงคุณภาพ, ขึ้น���าคา, เพ��่มขบวน, เพิ่มความถี่ ฯลฯ)",
                      "คุณคิดว่าใครควรได้รับการลดค่าโ���ยสารรถไฟฟ���า��้าง (ทุกคน, ผู้สูงอายุ, นักเรียน, คนทำงาน ฯลฯ)",
                      "คุณคิดว่าคว��ใช้เงินที่ได้จากการเก็บไปพัฒนาอะไร ก่อน 3 อันดับแรก",
                      "คุณจะให้งบประมาณแต่ละข้อเท่าไร (งบทั้งหมด 100)",
                      "คุณพอใจ��ับผลลัพธ์ที่เกิดขึ้นหรือไ��่ (พ���ใจ / ไม่พอใจ)",
                      "คุณคิดว่ารัฐควรทำอะไรที่จะทำให้นโยบายนี้เกิดขึ้นได้จริง และเป็นประโยชน์ต่อประชาชนอย่างแท้จริง",
                      "ตอนนี้มี��้อ��ูลที่ผิดพลาด เช่น ข่าวปลอมเกี่ยวกับนโยบาย คุณคิดว่าอย่างไร",
                      "คุณ��ะติดตามข่า��� ���รือเชื่อจากแหล่ง��หนมาก���ี่สุด",
                      "ขอบคุณที่ร่วมเป็นส่วนหนึ่ง → ��้องการล���้นรับรางวัลหรือไม่",
                      "กรอกข้อมูลเพื่อลุ้นรางวัล (ชื่อ)",
                      "กรอกข้อมูลเพื่อลุ้นรางวัล (เบอร์โทร)",
                      "Time Stamp (First)",
                      "แชร์ให้เพื่อนไหม (ครั้งแร���)",
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
                ร���ยละเอียดเซสชั: {detailSession?.slice(0, 12)}…
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
