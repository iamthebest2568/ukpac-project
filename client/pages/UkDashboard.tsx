import React, { useEffect, useMemo, useState } from "react";
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
  variants: { name: string; count: number; avgTimeSeconds: number; dropoutRate: number }[];
  choices: { name: string; count: number }[];
};

function secondsToHuman(sec: number) {
  const s = Math.round(sec);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m} นาที ${rem} วินาที`;
}

export default function UkDashboard() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/video-stats");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: StatsResponse = await res.json();
      setStats(data);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "โหลดข้อมูลล้มเหลว");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  const COLORS = useMemo(() => ["#EFBA31", "#8884d8", "#82ca9d", "#ff7f50", "#00C49F", "#FFBB28", "#FF8042"], []);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white font-[Prompt]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl md:text-3xl font-semibold mb-6">แดชบอร์ดวิเคราะห์วิดีโอ</h1>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SummaryCard title="จำนวนเซสชันทั้งหมด" value={stats?.totals.totalSessions ?? 0} />
          <SummaryCard title="จำนวนการเล่นทั้งหมด" value={stats?.totals.totalPlays ?? 0} />
          <SummaryCard title="อัตราการดูจบ" value={`${((stats?.totals.completionRate ?? 0) * 100).toFixed(1)}%`} />
          <SummaryCard title="เวลาเฉลี่ยต่อเซสชัน" value={secondsToHuman(stats?.totals.avgSessionLengthSeconds ?? 0)} />
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
                    <Tooltip contentStyle={{ background: "#111", border: "1px solid #333" }} />
                    <Line type="monotone" dataKey="plays" stroke="#EFBA31" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Bar chart */}
            <Card title="ฉากที่ถูกดูมากที่สุด">
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.variants.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#aaa" hide={false} interval={0} angle={-15} textAnchor="end" height={60} />
                    <YAxis stroke="#aaa" />
                    <Tooltip contentStyle={{ background: "#111", border: "1px solid #333" }} />
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
                    <Pie data={stats.choices} dataKey="count" nameKey="name" outerRadius={100} label>
                      {stats.choices.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip contentStyle={{ background: "#111", border: "1px solid #333" }} />
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
                      <th className="py-2 pr-4">เวลาเฉลี่ยที่ใช้</th>
                      <th className="py-2 pr-4">อัตราการออกกลางคัน</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.variants.map((v) => (
                      <tr key={v.name} className="border-t border-white/10">
                        <td className="py-2 pr-4">{v.name}</td>
                        <td className="py-2 pr-4">{v.count}</td>
                        <td className="py-2 pr-4">{secondsToHuman(v.avgTimeSeconds)}</td>
                        <td className="py-2 pr-4">{(v.dropoutRate * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Export */}
            <div className="flex justify-end">
              <button
                className="rounded-full bg-[#EFBA31] text-black font-medium px-5 py-2 border border-black hover:scale-105 transition"
                onClick={async () => {
                  const res = await fetch("/api/video-stats");
                  const data = await res.json();
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "video-stats.json";
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                }}
              >
                ดาวน์โหลด CSV
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <div className="text-lg font-medium mb-3">{title}</div>
      {children}
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <div className="text-sm text-white/70">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
