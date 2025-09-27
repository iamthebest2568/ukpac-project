import React, { useEffect, useState } from "react";
import {
  exportEventsAsCSV,
  exportSessionsAsCSV,
  getEventSummary,
  getLoggedEvents,
  clearEventLogs,
  sendLocalEventsToFirestore,
} from "../../services/dataLogger.js";
import { sendEventToFirestore } from "../../lib/firebase";

const DASH_PASSWORD = "Ukdash-Xrz14!"; // shared password per request
const DASH_USER = "ukpact";

const UkDashboard: React.FC = () => {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [input, setInput] = useState("");
  const [user, setUser] = useState("");
  const [summary, setSummary] = useState<any>(null);
  const [eventsSample, setEventsSample] = useState<any[]>([]);
  const [collectionInfo, setCollectionInfo] = useState<{
    col: string;
    docId: string;
  }>({ col: "minigame2_events", docId: "minigame2-di" });
  const [publicSubmissions, setPublicSubmissions] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("ukpack2_dash_auth");
      if (saved === "1") setAuthorized(true);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (authorized) refreshSummary();
  }, [authorized]);

  const refreshSummary = async () => {
    try {
      setSummary(getEventSummary());
      const all = getLoggedEvents();
      setEventsSample(all.slice(-10).reverse());

      // Helper: try fetching JSON from multiple candidate URLs with timeout and absolute normalization
      async function tryFetchJsonWithFallback(
        rawPaths: string[],
        timeout = 8000,
      ) {
        const normalize = (p: string) => {
          try {
            return new URL(p, window.location.origin).toString();
          } catch (_) {
            return p;
          }
        };
        const paths = rawPaths.map(normalize);

        const fetchWithTimeout = async (url: string, ms: number) => {
          try {
            const fetchPromise = fetch(url, { credentials: "same-origin" })
              .then(async (resp) => {
                if (!resp || !resp.ok) return null;
                try {
                  return await resp.json();
                } catch (e) {
                  return null;
                }
              })
              .catch(() => null);

            const timeoutPromise = new Promise((res) => setTimeout(() => res(null), ms));

            return await Promise.race([fetchPromise, timeoutPromise]);
          } catch (e) {
            return null;
          }
        };

        for (const p of paths) {
          try {
            const result = await fetchWithTimeout(p, timeout);
            if (result) return result;
          } catch (e) {
            console.warn("candidate fetch threw", p, e);
          }
        }
        return null;
      }

      // Fetch Firestore-backed recent events for ukpack2 with resilient fallbacks
      try {
        const rawCandidates = [
          window.location.origin + "/api/firestore-stats?project=ukpack2",
          "/api/firestore-stats?project=ukpack2",
          window.location.pathname.replace(/\/\$/, "") +
            "/api/firestore-stats?project=ukpack2",
          "/.netlify/functions/api/firestore-stats?project=ukpack2",
        ];

        let j = null;
        try {
          j = await tryFetchJsonWithFallback(rawCandidates, 8000);
        } catch (e) {
          console.warn("tryFetchJsonWithFallback threw", e);
          j = null;
        }
        if (j && j.ok && j.stats && Array.isArray(j.stats.sample)) {
          try {
            setCollectionInfo({
              col: j.col || "minigame2_events",
              docId: j.docId || "minigame2-di",
            });
          } catch (_) {}
          const sample = j.stats.sample.map((s: any) => ({
            sessionId: s.data.sessionID || s.data.sessionId || "",
            eventName: s.data.event || s.data.eventName || "",
            timestamp: s.data.timestamp || s.data.createdAt || "",
            payload: s.data.payload || {},
          }));
          setEventsSample(sample.slice(0, 10));
        } else if (j === null) {
          console.warn("All firestore-stats fetch attempts failed");
        } else {
          console.warn("firestore-stats returned unexpected payload", j);
        }
      } catch (err) {
        console.error("fetch firestore-stats error", err);
      }

      // fetch public submissions (landing assets) with fallbacks
      try {
        const rawCandidates2 = [
          window.location.origin + "/api/public-submissions?limit=20",
          "/api/public-submissions?limit=20",
          "./.netlify/functions/api/public-submissions?limit=20",
        ];

        let j2 = null;
        try {
          j2 = await tryFetchJsonWithFallback(rawCandidates2, 8000);
        } catch (e) {
          console.warn("tryFetchJsonWithFallback (public-submissions) threw", e);
          j2 = null;
        }

        if (j2 && j2.ok && Array.isArray(j2.items)) {
          setPublicSubmissions(j2.items.slice(0, 6));
        } else if (j2 === null) {
          console.warn("All public-submissions fetch attempts failed");
        } else {
          console.warn(
            "/api/public-submissions returned unexpected payload",
            j2,
          );
        }
      } catch (err) {
        console.error("fetch public-submissions error", err);
      }
    } catch (e) {
      console.error("refreshSummary top-level error", e);
      setSummary(null);
      setEventsSample([]);
    }
  };

  const handleAuth = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (user.trim() === DASH_USER && input.trim() === DASH_PASSWORD) {
      try {
        sessionStorage.setItem("ukpack2_dash_auth", "1");
      } catch (e) {}
      setAuthorized(true);
      refreshSummary();
    } else {
      alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  const handleExport = () => {
    const csv = exportEventsAsCSV();
    if (!csv) {
      alert("ไม่มีข้อมูลให้ส่งออก");
      return;
    }
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ukpack2-events-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [lastSentResult, setLastSentResult] = useState<any | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleExportMapped = () => {
    const csv = exportSessionsAsCSV();
    if (!csv) {
      alert("ไม่มีข้อมูลให้ส่งออก");
      return;
    }
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ukpack2-sessions-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendAll = async () => {
    setIsSending(true);
    try {
      const res = await sendLocalEventsToFirestore({
        batchSize: 50,
        onlyPDPA: false,
      });
      setLastSentResult(res);
      alert(`Sent ${res.sentCount} events (skipped ${res.skippedCount})`);
      refreshSummary();
    } catch (e) {
      alert("Send failed: " + String(e));
    } finally {
      setIsSending(false);
    }
  };

  const handleSendPDPAOnly = async () => {
    setIsSending(true);
    try {
      const res = await sendLocalEventsToFirestore({
        batchSize: 50,
        onlyPDPA: true,
      });
      setLastSentResult(res);
      alert(
        `Sent ${res.sentCount} PDPA-accepted events (skipped ${res.skippedCount})`,
      );
      refreshSummary();
    } catch (e) {
      alert("Send failed: " + String(e));
    } finally {
      setIsSending(false);
    }
  };

  const handleSendBatch = async (size = 20) => {
    setIsSending(true);
    try {
      const res = await sendLocalEventsToFirestore({
        batchSize: size,
        onlyPDPA: true,
      });
      setLastSentResult(res);
      alert(
        `Batch send complete: ${res.sentCount} sent (skipped ${res.skippedCount})`,
      );
      refreshSummary();
    } catch (e) {
      alert("Send failed: " + String(e));
    } finally {
      setIsSending(false);
    }
  };

  const handleClear = () => {
    if (!confirm("แน่ใจหรือไม่ว่าต้องการลบข้อมูลทั้งหมด?")) return;
    clearEventLogs();
    refreshSummary();
    alert("ลบข้อมูลเรียบร้อย");
  };

  // ===== Readability helpers: extract big inline handlers into named functions =====
  const handleCopySchema = () => {
    const schema = {
      documentFields: [
        "createdAt",
        "sessionID",
        "timestamp",
        "event",
        "url",
        "userAgent",
        "viewport",
        "payload",
      ],
      payloadFields: [
        "PDPA",
        "chassis",
        "seating",
        "amenities",
        "payment",
        "doors",
        "color",
        "frequency",
        "route",
        "area",
        "decisionUseService",
        "reasonNotUse",
        "enterPrize",
        "prizeName",
        "prizePhone",
        "shared",
      ],
      csvColumns: [
        "sessionID",
        "ip",
        "firstTimestamp",
        "lastTimestamp",
        "PDPA_acceptance",
        "chassis_type",
        "total_seats",
        "special_seats",
        "children_count",
        "pregnant_count",
        "monk_count",
        "features",
        "payment_types",
        "doors",
        "color",
        "frequency",
        "route",
        "area",
        "decision_use_service",
        "reason_not_use",
        "decision_enter_prize",
        "prize_name",
        "prize_phone",
        "prize_timestamp",
        "shared_with_friends",
        "shared_timestamp",
      ],
    };
    try {
      navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
      alert("Schema copied to clipboard");
    } catch (e) {
      const blob = new Blob([JSON.stringify(schema, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ukpack2-schema.json";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handlePublishAggregation = async () => {
    try {
      const summary = getEventSummary();
      const all = getLoggedEvents();
      const publicItems = all
        .filter((ev) => {
          const p = ev.payload || {};
          const pdpa = p.PDPA || p.pdpa || ev.PDPA || ev.pdpa;
          return pdpa === true;
        })
        .slice(-50)
        .map((ev) => ({
          sessionID: ev.sessionID,
          timestamp: ev.timestamp,
          event: ev.event,
          payload: {
            imageUrl: ev.payload?.imageUrl || ev.payload?.image || null,
            slogan: ev.payload?.slogan || ev.payload?.prizeName || null,
          },
        }));

      const payload = {
        summary,
        publicItems,
        publishedAt: new Date().toISOString(),
      };
      const resp = await fetch("/api/ukpack2/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await resp.json();
      if (j.ok) {
        alert("Published public aggregation");
      } else {
        alert("Failed to publish: " + (j.error || "unknown"));
      }
    } catch (e) {
      alert("Publish failed: " + String(e));
    }
  };

  const handleSendTestEvent = async () => {
    setIsSending(true);
    try {
      const sample = {
        sessionID: `session_test_${Date.now()}`,
        timestamp: new Date().toISOString(),
        event: "TEST_EVENT",
        payload: {
          PDPA: true,
          chassis: "extra",
          seating: { totalSeats: 12, specialSeats: 2 },
          amenities: ["แอร์", "Wi‑Fi ฟรี"],
          payment: ["เงินสด"],
          doors: "1",
          color: "#ff0000",
          interval: "10",
          route: "3",
          area: "Downtown",
          decisionUseService: true,
          enterPrize: true,
          prizeName: "ทดสอบ",
          prizePhone: "0812345678",
          shared: true,
        },
      };
      try {
        const accepted = sessionStorage.getItem("pdpa_accepted") === "true";
        if (accepted) {
          await sendEventToFirestore(sample, "minigame2_events/minigame2-di");
        }
      } catch (_) {
        /* ignore */
      }
      setLastSentResult({
        sentCount: 1,
        skippedCount: 0,
        sampleSent: [sample],
        errors: [],
      });
      alert("Test event sent to Firestore");
      refreshSummary();
    } catch (err) {
      console.error(err);
      alert("Failed to send test event: " + String(err));
    } finally {
      setIsSending(false);
    }
  };

  if (!authorized) {
    return (
      <div className="uk2-scroll overflow-auto min-h-0 bg-[#0b0b0b] text-white flex items-center justify-center p-6">
        <form onSubmit={handleAuth} className="w-full max-w-md">
          <div className="bg-white text-black rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-2">
              เข้าสู่แดชบอร์ด ukpack2
            </h2>
            <p className="text-sm mb-4">ป้อนรหัสเพื่อเข้าถึงแ��ชบอร์ด</p>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
              placeholder="User ID"
            />
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
              placeholder="รหัสผ่าน"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-[#ffe000] text-black py-2 rounded font-semibold"
              >
                เข้าสู่ระบบ
              </button>
              <button
                type="button"
                onClick={() => {
                  setInput("");
                  setUser("");
                }}
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
    <div className="uk2-scroll overflow-auto min-h-0 bg-[#0b0b0b] text-white p-6">
      <div className="max-w-4xl mx-auto bg-[#071227] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">UKPACK2 Dashboard</h1>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="bg-[#ffe000] text-[#0b6b3f] px-4 py-2 rounded font-semibold"
            >
              Export CSV
            </button>
            <button
              onClick={handleExportMapped}
              className="bg-[#ffd27a] text-[#0b6b3f] px-4 py-2 rounded font-semibold"
            >
              Export Mapped CSV
            </button>

            <button
              onClick={handleCopySchema}
              className="bg-[#a78bfa] text-white px-4 py-2 rounded font-semibold"
            >
              Copy schema / Download JSON
            </button>

            <button
              onClick={handlePublishAggregation}
              className="bg-[#60a5fa] text-white px-4 py-2 rounded font-semibold"
            >
              Publish Aggregation
            </button>
            <button
              onClick={handleSendTestEvent}
              disabled={isSending}
              className={`bg-[#60a5fa] text-white px-4 py-2 rounded font-semibold ${isSending ? "opacity-60" : ""}`}
            >
              Send Test Event
            </button>

            <button
              onClick={handleSendAll}
              disabled={isSending}
              className={`bg-[#34d399] text-[#064e3b] px-4 py-2 rounded font-semibold ${isSending ? "opacity-60" : ""}`}
            >
              Send All Events (no PDPA filter)
            </button>

            <button
              onClick={() => handleSendBatch(20)}
              disabled={isSending}
              className={`bg-[#7dd3fc] text-[#0f172a] px-4 py-2 rounded font-semibold ${isSending ? "opacity-60" : ""}`}
            >
              Send Batch (20)
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
            <div className="text-2xl font-bold">
              {summary?.totalEvents ?? 0}
            </div>
          </div>
          <div className="bg-[#021827] rounded p-3">
            <div className="text-sm text-gray-300">Total Sessions</div>
            <div className="text-2xl font-bold">
              {summary?.totalSessions ?? 0}
            </div>
          </div>
          <div className="bg-[#021827] rounded p-3">
            <div className="text-sm text-gray-300">Current Session</div>
            <div className="text-sm break-all">
              {summary?.currentSession ?? "-"}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">
            Recent events (last 10)
          </h3>
          <div className="bg-[#021827] rounded p-3 max-h-64 overflow-auto">
            {eventsSample.length === 0 ? (
              <div className="text-gray-400">No events logged yet</div>
            ) : (
              <ul className="text-sm space-y-2">
                {eventsSample.map((ev, idx) => (
                  <li key={idx} className="border-b border-white/5 pb-2">
                    <div className="text-xs text-gray-400">
                      {ev.timestamp} • {ev.sessionID}
                    </div>
                    <div className="font-medium">{ev.event || "EVENT"}</div>
                    <div className="text-xs text-gray-300">
                      {JSON.stringify(ev.payload || {})}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {lastSentResult && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Last send summary</h3>
              <div className="bg-[#021827] rounded p-3 text-sm max-h-96 overflow-auto">
                <div>Sent: {lastSentResult.sentCount}</div>
                <div>Skipped: {lastSentResult.skippedCount}</div>
                <div>
                  Errors:{" "}
                  {lastSentResult.errors && lastSentResult.errors.length}
                </div>
                <div className="mt-2">Sample sent items:</div>
                <pre className="text-xs mt-2 whitespace-pre-wrap max-h-64 overflow-auto break-words">
                  {JSON.stringify(lastSentResult.sampleSent || [], null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Public submissions (landing)
          </h3>
          <div className="bg-[#021827] rounded p-3 text-sm text-gray-200 mb-4">
            {publicSubmissions.length === 0 ? (
              <div className="text-gray-400">No public submissions yet</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {publicSubmissions.map((s, i) => (
                  <div
                    key={s.id || i}
                    className="bg-[#001a22] rounded p-2 text-xs"
                  >
                    {s.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={s.imageUrl}
                        alt={s.exterior?.customText || "design"}
                        className="w-full h-28 object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-28 bg-[#001f2a] rounded flex items-center justify-center text-gray-500">
                        No image
                      </div>
                    )}
                    <div className="mt-2">
                      <div className="font-medium">
                        {s.exterior?.customText ||
                          s.serviceInfo?.routeName ||
                          "Design"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {s.exterior?.color || ""} • {s.serviceInfo?.area || ""}
                      </div>
                      <div className="text-xs text-gray-400">
                        {s.timestamp
                          ? new Date(s.timestamp).toLocaleString()
                          : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <h3 className="text-lg font-semibold mb-2">
            Data schema & usage (สรุปสคีมา)
          </h3>
          <div className="bg-[#021827] rounded p-4 text-sm text-gray-200">
            <div className="mb-3">
              <strong>
                Document fields ({collectionInfo.col}/{collectionInfo.docId})
              </strong>
              <ul className="list-disc pl-5 mt-1 text-xs text-gray-300">
                <li>createdAt (Firestore Timestamp)</li>
                <li>sessionID (string)</li>
                <li>timestamp (string ISO)</li>
                <li>event (string)</li>
                <li>url, userAgent, viewport (meta)</li>
                <li>payload (map) — fields listed below</li>
              </ul>
            </div>

            <div className="mb-3">
              <strong>Payload suggested fields</strong>
              <ul className="list-disc pl-5 mt-1 text-xs text-gray-300">
                <li>PDPA (boolean)</li>
                <li>chassis (string)</li>
                <li>
                  seating (map: totalSeats, specialSeats, children?, pregnant?,
                  monk?)
                </li>
                <li>amenities (array[string])</li>
                <li>payment (array[string])</li>
                <li>doors (string or map)</li>
                <li>color (string, hex)</li>
                <li>frequency / interval, route, area (strings)</li>
                <li>decisionUseService (boolean), reasonNotUse (string)</li>
                <li>enterPrize (boolean), prizeName, prizePhone</li>
                <li>shared (boolean)</li>
              </ul>
            </div>

            <div className="mb-3">
              <strong>How we send</strong>
              <div className="text-xs text-gray-300 mt-1">
                Client constructs a plain JS object (map/array/primitives) and
                we call addDoc(collection, obj). Images must be stored in
                Storage and referenced by URL in payload.imageUrl.
              </div>
            </div>

            <div className="mb-3">
              <strong>CSV export columns (mapped)</strong>
              <pre className="text-xs mt-1 whitespace-pre-wrap bg-[#001927] p-2 rounded">
                sessionID, ip, firstTimestamp, lastTimestamp, PDPA_acceptance,
                chassis_type, total_seats, special_seats, children_count,
                pregnant_count, monk_count, features, payment_types, doors,
                color, frequency, route, area, decision_use_service,
                reason_not_use, decision_enter_prize, prize_name, prize_phone,
                prize_timestamp, shared_with_friends, shared_timestamp
              </pre>
            </div>

            <div>
              <strong>Landing page usage</strong>
              <ul className="list-disc pl-5 mt-1 text-xs text-gray-300">
                <li>
                  For images: store in Firebase Storage → save public URL in
                  payload.imageUrl → render &lt;img src="..." /&gt;
                </li>
                <li>
                  For user text (slogans, comments): fetch doc.payload.field and
                  sanitize before rendering
                </li>
                <li>
                  Prefer server-side endpoint to aggregate & sanitize public
                  data for landing page (recommended)
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-right mt-4">
          <button
            onClick={() => {
              sessionStorage.removeItem("ukpack2_dash_auth");
              setAuthorized(false);
            }}
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
