import React, { useState, useEffect } from "react";
import { exportEventsAsCSV, getEventSummary, getLoggedEvents, clearEventLogs } from "../../services/dataLogger.js";

const DASH_PASSWORD = "ukpact2dash"; // access code as requested

const UkDashboard: React.FC = () => {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState<any>(null);
  const [eventsSample, setEventsSample] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("ukpack2_dash_auth");
      if (saved === "1") setAuthorized(true);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (authorized) refreshSummary();
  }, [authorized]);

  const refreshSummary = () => {
    try {
      setSummary(getEventSummary());
      const all = getLoggedEvents();
      setEventsSample(all.slice(-10).reverse());
    } catch (e) {
      setSummary(null);
      setEventsSample([]);
    }
  };

  const handleAuth = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim() === DASH_PASSWORD) {
      try {
        sessionStorage.setItem("ukpack2_dash_auth", "1");
      } catch (e) {}
      setAuthorized(true);
      refreshSummary();
    } else {
      alert("รหัสไม่ถูกต้อง");
    }
  };

  const handleExport = () => {
    const csv = exportEventsAsCSV();
    if (!csv) {
      alert("ไม่มีข้อมูลให้ส่งออก");
      return;
    }
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ukpack2-events-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (!confirm("แน่ใจหรือไม่ว่าต้องการลบข้อมูลทั้งหมด?")) return;
    clearEventLogs();
    refreshSummary();
    alert("ลบข้อมูลเรียบร้อย");
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center p-6">
        <form onSubmit={handleAuth} className="w-full max-w-md">
          <div className="bg-white text-black rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-2">เข้าสู่แดชบอร์ด ukpack2</h2>
            <p className="text-sm mb-4">ป้อนรหัสเพื่อเข้าถึงแดชบอร์ด</p>
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
              placeholder="รหัสเข้าระบบ"
              autoFocus
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-[#ffe000] text-black py-2 rounded font-semibold">
                เข้าสู่ระบบ
              </button>
              <button
                type="button"
                onClick={() => { setInput(""); }}
                className="flex-1 bg-[#e5e7eb] text-black py-2 rounded font-semibold"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-6">
      <div className="max-w-4xl mx-auto bg-[#071227] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">UKPACK2 Dashboard</h1>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="bg-[#ffe000] text-[#000d59] px-4 py-2 rounded font-semibold"
            >
              Export CSV
            </button>
            <button
              onClick={handleClear}
              className="bg-[#ef4444] text-white px-4 py-2 rounded font-semibold"
            >
              Clear Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#021827] rounded p-3">
            <div className="text-sm text-gray-300">Total Events</div>
            <div className="text-2xl font-bold">{summary?.totalEvents ?? 0}</div>
          </div>
          <div className="bg-[#021827] rounded p-3">
            <div className="text-sm text-gray-300">Total Sessions</div>
            <div className="text-2xl font-bold">{summary?.totalSessions ?? 0}</div>
          </div>
          <div className="bg-[#021827] rounded p-3">
            <div className="text-sm text-gray-300">Current Session</div>
            <div className="text-sm break-all">{summary?.currentSession ?? "-"}</div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Recent events (last 10)</h3>
          <div className="bg-[#021827] rounded p-3 max-h-64 overflow-auto">
            {eventsSample.length === 0 ? (
              <div className="text-gray-400">No events logged yet</div>
            ) : (
              <ul className="text-sm space-y-2">
                {eventsSample.map((ev, idx) => (
                  <li key={idx} className="border-b border-white/5 pb-2">
                    <div className="text-xs text-gray-400">{ev.timestamp} • {ev.sessionID}</div>
                    <div className="font-medium">{ev.event || 'EVENT'}</div>
                    <div className="text-xs text-gray-300">{JSON.stringify(ev.payload || {})}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="text-right mt-4">
          <button
            onClick={() => { sessionStorage.removeItem("ukpack2_dash_auth"); setAuthorized(false); }}
            className="text-sm underline text-gray-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UkDashboard;
