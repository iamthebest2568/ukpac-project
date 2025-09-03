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

function secondsToHuman(sec: number) {
  const s = Math.round(sec);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m} นาที ${rem} วินาที`;
}

type VideoEvent = {
  sessionId: string;
  eventName: string;
  timestamp: string;
  choiceText?: string;
  variantId?: string | number;
  variantName?: string;
};

export default function UkDashboard() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [recent, setRecent] = useState<VideoEvent[]>([]);
  const [journey, setJourney] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

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
    try {
      setLoading(true);
      const qs = new URLSearchParams();
      if (from) qs.set("from", from);
      if (to) qs.set("to", to);
      const res = await fetch(`/api/video-stats?${qs.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: StatsResponse = await res.json();
      setStats(data);
      const ev = await fetch(`/api/video-events?limit=50`);
      if (ev.ok) setRecent(await ev.json());
      const j = await fetch(`/api/user-journey-stats`);
      if (j.ok) setJourney(await j.json());
      setError(null);
      setLastUpdated(new Date().toLocaleString());
    } catch (e: any) {
      setError(e?.message || "โหลดข้อมูลล้มเหลว");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authed) return;
    load();
    let id: any;
    if (autoRefresh) id = setInterval(load, 5000);
    return () => id && clearInterval(id);
  }, [authed, from, to, autoRefresh]);

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

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white font-[Prompt]">
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
              <h1 className="text-2xl md:text-3xl font-semibold">
                แดชบอร์ดวิเคราะห์วิดีโอ
              </h1>
              <div className="text-white/60 text-sm mt-1">
                อัปเดตล่าสุด: {lastUpdated || "-"}
              </div>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-white/70">จาก</label>
                <input
                  type="date"
                  className="rounded bg-black/40 border border-white/15 px-2 py-1"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
                <label className="text-sm text-white/70">ถึง</label>
                <input
                  type="date"
                  className="rounded bg-black/40 border border-white/15 px-2 py-1"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
              <button
                className="rounded-md bg.white/10 hover:bg-white/15 border border-white/15 px-3 py-2 text-sm"
                onClick={load}
              >
                ร��เฟรช
              </button>
              <label className="flex items-center gap-2 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />{" "}
                อ��ปเดตอัตโนมัติ
              </label>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <SummaryCard
              title="จำนวนเซสชันทั้งหมด"
              value={stats?.totals.totalSessions ?? 0}
            />
            <SummaryCard
              title="จำนวนการเล่นทั้งหมด"
              value={stats?.totals.totalPlays ?? 0}
            />
            <SummaryCard
              title="อัตราการดูจบ"
              value={`${((stats?.totals.completionRate ?? 0) * 100).toFixed(1)}%`}
            />
            <SummaryCard
              title="เวลาเฉลี่ยต่อเซสชัน"
              value={secondsToHuman(stats?.totals.avgSessionLengthSeconds ?? 0)}
            />
          </div>

          {loading && <div className="text-white/80">กำลังโหลดข้อมูล...</div>}
          {error && <div className="text-red-400">เกิดข้อผิดพลาด: {error}</div>}

          {stats && (
            <div className="space-y-6">
              {/* Line chart */}
              <Card title="จำนวนการเล่นต่อวัน">
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.timeseries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#aaa" />
                      <YAxis stroke="#aaa" />
                      <Tooltip
                        contentStyle={{
                          background: "#111",
                          border: "1px solid #333",
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

              {/* User Journey Summary */}
              {journey && (
                <Card title="สรุปพฤติกรรมผู้ใช้ (User Journey)">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-white/80 mb-2">
                        Intro: คุณเป็นใคร
                      </div>
                      <ul className="space-y-1 text-sm">
                        {Object.entries(journey.introWho || {}).map(
                          ([k, v]) => (
                            <li key={k} className="flex justify-between">
                              <span>{k}</span>
                              <span className="text-white/70">{v as any}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                    <div>
                      <div className="text-white/80 mb-2">
                        Stornaway: ฉากที่เข้า
                      </div>
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
                      <div className="text-white/80 mb-2">
                        MN1: นโยบายที่เลือก
                      </div>
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
                      <div className="text-white/80 mb-2">
                        MN3: งบประมาณเฉลี่ย
                      </div>
                      <ul className="space-y-1 text-sm">
                        {Object.entries(journey.mn3Budgets || {}).map(
                          ([k, v]: any) => (
                            <li key={k} className="flex justify-between">
                              <span>{k}</span>
                              <span className="text-white/70">
                                {Math.round(v.avg)}
                              </span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-white/80 mb-2">
                        Ask05: ความคิดเห็นล่าสุด
                      </div>
                      <ul className="space-y-1 text-sm">
                        {(journey.ask05Samples || []).map(
                          (c: string, i: number) => (
                            <li key={i} className="truncate">
                              • {c}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </Card>
              )}

              {/* Bar chart */}
              <Card title="ฉากที่ถูกดูมากที่สุด">
                <div className="w-full h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.variants.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis
                        dataKey="name"
                        stroke="#aaa"
                        hide={false}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis stroke="#aaa" />
                      <Tooltip
                        contentStyle={{
                          background: "#111",
                          border: "1px solid #333",
                        }}
                      />
                      <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Pie chart */}
              <Card title="การเลือกของผู้ชม">
                <div className="w-full h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.choices}
                        dataKey="count"
                        nameKey="name"
                        outerRadius={100}
                        label
                      >
                        {stats.choices.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip
                        contentStyle={{
                          background: "#111",
                          border: "1px solid #333",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Table */}
              <Card title="รายละเอียดฉาก">
                <div className="overflow-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-white/80">
                        <th className="py-2 pr-4">ชื่อฉาก</th>
                        <th className="py-2 pr-4">จำนวนครั้งที่ดู</th>
                        <th className="py-2 pr-4">เวล���เฉลี่ยที่ใช้</th>
                        <th className="py-2 pr-4">อัต��าการออกกลางคัน</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.variants.map((v) => (
                        <tr key={v.name} className="border-t border-white/10">
                          <td className="py-2 pr-4">{v.name}</td>
                          <td className="py-2 pr-4">{v.count}</td>
                          <td className="py-2 pr-4">
                            {secondsToHuman(v.avgTimeSeconds)}
                          </td>
                          <td className="py-2 pr-4">
                            {(v.dropoutRate * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Recent events */}
              <Card title="เหตุการณ์ล่าสุด">
                <div className="overflow-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-white/80">
                        <th className="py-2 pr-4">เวลา</th>
                        <th className="py-2 pr-4">เซสชัน</th>
                        <th className="py-2 pr-4">อีเวนต์</th>
                        <th className="py-2 pr-4">ชื่อฉาก</th>
                        <th className="py-2 pr-4">ตัวเลือก</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent.map((e, idx) => (
                        <tr key={idx} className="border-t border-white/10">
                          <td className="py-2 pr-4 whitespace-nowrap">
                            {new Date(e.timestamp).toLocaleString()}
                          </td>
                          <td className="py-2 pr-4">
                            {e.sessionId.slice(0, 10)}…
                          </td>
                          <td className="py-2 pr-4">{e.eventName}</td>
                          <td className="py-2 pr-4">{e.variantName || "-"}</td>
                          <td className="py-2 pr-4">{e.choiceText || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Export */}
              <div className="flex flex-wrap gap-3 justify-end">
                <button
                  className="rounded-full bg-[#EFBA31] text.black font-medium px-5 py-2 border border-black hover:scale-105 transition"
                  onClick={() =>
                    exportCsv("variants.csv", [
                      [
                        "ชื่อฉาก",
                        "จำนวนครั้งที่ดู",
                        "เวลาเฉลี่ยที่ใช้(วินาที)",
                        "อัตราการออกกลางคัน(%)",
                      ],
                      ...(stats?.variants || []).map((v) => [
                        v.name,
                        v.count,
                        Math.round(v.avgTimeSeconds),
                        (v.dropoutRate * 100).toFixed(1),
                      ]),
                    ])
                  }
                >
                  ดาวน์โหลด CSV (ฉาก)
                </button>
                <button
                  className="rounded-full bg-[#EFBA31] text.black font-medium px-5 py-2 border border-black hover:scale-105 transition"
                  onClick={() =>
                    exportCsv("choices.csv", [
                      ["ตัวเลือก", "จำนวน"],
                      ...(stats?.choices || []).map((c) => [c.name, c.count]),
                    ])
                  }
                >
                  ดาวน์โหลด CSV (การเลือก)
                </button>
                <button
                  className="rounded-full bg-[#EFBA31] text.black font-medium px-5 py-2 border border-black hover:scale-105 transition"
                  onClick={() =>
                    exportCsv("plays_per_day.csv", [
                      ["วันที่", "จำนวนการเล่น"],
                      ...(stats?.timeseries || []).map((t) => [
                        t.date,
                        t.plays,
                      ]),
                    ])
                  }
                >
                  ดาวน์โหลด CSV (เล่นต่อวัน)
                </button>
              </div>
            </div>
          )}
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
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <div className="text-lg font-medium mb-3">{title}</div>
      {children}
    </div>
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
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <div className="text-sm text-white/70">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
