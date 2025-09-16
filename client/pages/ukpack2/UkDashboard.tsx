import React, { useEffect, useMemo, useState } from "react";
import {
  getLoggedEvents,
  getEventSummary,
  exportEventsAsCSV,
  clearEventLogs,
} from "../../services/dataLogger.js";

const UkDashboard: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [sessionFilter, setSessionFilter] = useState("");
  const [summary, setSummary] = useState<any | null>(null);

  const reload = () => {
    setEvents(getLoggedEvents());
    setSummary(getEventSummary());
  };

  useEffect(() => {
    reload();
  }, []);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const q = query.trim().toLowerCase();
      const matchesQuery = !q
        ? true
        : JSON.stringify(e).toLowerCase().includes(q);
      const matchesSession = sessionFilter ? e.sessionID === sessionFilter : true;
      return matchesQuery && matchesSession;
    });
  }, [events, query, sessionFilter]);

  const handleExport = () => {
    const csv = exportEventsAsCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ukpack2-events-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm("ลบข้อมูลทั้งหมดในเบราว์เซอร์นี้?")) {
      clearEventLogs();
      reload();
    }
  };

  const uniqueSessions = useMemo(() => {
    const values = events.map((e) => e.sessionID || "(none)");
    return Array.from(new Set(values));
  }, [events]);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        <header className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-prompt font-semibold">UKPack2 Dashboard</h1>
          <div className="flex gap-2">
            <button onClick={reload} className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded">รีเฟรช</button>
            <button onClick={handleExport} className="bg-[#ffe000] text-[#000d59] px-3 py-2 rounded font-semibold">Export CSV</button>
            <button onClick={handleClear} className="bg-red-600 px-3 py-2 rounded">ลบทั้งหมด</button>
          </div>
        </header>

        {summary && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="bg-white/5 rounded p-3"><div className="opacity-70">Events</div><div className="text-xl font-semibold">{summary.totalEvents}</div></div>
            <div className="bg-white/5 rounded p-3"><div className="opacity-70">Sessions</div><div className="text-xl font-semibold">{summary.totalSessions}</div></div>
            <div className="bg-white/5 rounded p-3 col-span-2"><div className="opacity-70">ช่วงเวลา</div><div>{summary.dateRange?.first || '-'} → {summary.dateRange?.last || '-'}</div></div>
          </section>
        )}

        <section className="flex flex-wrap gap-3 items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหา..."
            className="bg-white/10 rounded px-3 py-2 outline-none flex-1 min-w-[200px]"
          />
          <select value={sessionFilter} onChange={(e)=>setSessionFilter(e.target.value)} className="bg-white/10 rounded px-3 py-2 outline-none">
            <option value="">ทุก session</option>
            {uniqueSessions.map((sid) => (
              <option key={sid} value={sid}>{sid}</option>
            ))}
          </select>
        </section>

        <section className="overflow-auto rounded border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/10">
              <tr>
                <th className="text-left p-2">เวลา</th>
                <th className="text-left p-2">Session</th>
                <th className="text-left p-2">Event</th>
                <th className="text-left p-2">รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td className="p-3 opacity-70" colSpan={4}>ไม่มีข้อมูล</td></tr>
              ) : (
                filtered.slice().reverse().map((e, idx) => (
                  <tr key={idx} className="odd:bg-white/5">
                    <td className="p-2 whitespace-nowrap">{new Date(e.timestamp).toLocaleString()}</td>
                    <td className="p-2 whitespace-nowrap font-mono text-xs">{e.sessionID}</td>
                    <td className="p-2 whitespace-nowrap">{e.event}</td>
                    <td className="p-2 text-white/90"><pre className="whitespace-pre-wrap break-words">{JSON.stringify(e.payload || {}, null, 2)}</pre></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default UkDashboard;
