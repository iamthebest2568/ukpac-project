import React, { useEffect, useState } from "react";

// Simple, focused dashboard for mydreambus bus design project
// - fetches session summaries
// - allows export CSV with Thai headers mapped exactly to spec

type SessionSummary = any;

const THAI_HEADERS = [
  "IP (ip)",
  "เวลา (time_stamp)",
  "ยอมรับ PDPA (pdpa_accept)",

  // Bus details
  "ประเภทรถ (bus_type)",
  "ที่นั่งทั้งหมด (seat_total)",
  "ที่นั่งพิเศษ (seat_special)",
  "ที่นั่งเด็กหรือผู้สูงอายุ (seat_child_elder)",
  "ที่นั่งสตรีมีครรภ์ (seat_pregnant)",
  "ที่นั่งพระ (seat_monk)",
  "ฟีเจอร์ (features)",
  "การจ่าย (payment_type)",
  "ประตู (door_pos)",
  "สี (color)",
  "ความถี่ (frequency)",
  "สาย (bus_line)",
  "พื้นที่ (area)",

  // Summary / decision
  "ใช้บริการ (use_service)",
  "เหตุผลไม่ใช้ (reason_not_use)",

  // Prize
  "ลุ้นรางวัล (lucky_draw)",
  "ชื่อ (name)",
  "เบอร์ (phone)",
  "เวลาส่งฟอร์ม (time_stamp2)",
  "แชร์1 (share1)",

  // End
  "เวลาสิ้นสุดเกม (time_stamp3)",

  // Session id
  "Session ID",
];

function sanitizeCell(v: any) {
  if (v === null || v === undefined) return "";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "ใช่" : "ไม่";
  try {
    // normalize and strip control chars
    return String(v)
      .normalize("NFC")
      .replace(/[\u0000-\u001F\u007F]/g, "");
  } catch (e) {
    return String(v);
  }
}

async function fetchSessionDetail(id: string) {
  try {
    const res = await fetch(`/api/session/${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json; // { appEvents, videoEvents }
  } catch (e) {
    return null;
  }
}

export default function BusDashboard() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // cache of merged payloads per session for table UI
  const [perSessionData, setPerSessionData] = useState<
    Record<string, Record<string, any>>
  >({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const resp = await fetch("/api/session-summaries?limit=500");
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        if (!mounted) return;
        setSessions(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message || "โหลดข้อมูลล้มเห��ว");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch per-session merged payloads in background (limited)
  useEffect(() => {
    let mounted = true;
    const limit = 200; // safe cap
    const toFetch = sessions.slice(0, limit);
    (async () => {
      const results: Record<string, Record<string, any>> = {};
      for (const s of toFetch) {
        const sid =
          s.sessionId || s.sessionId === 0
            ? String(s.sessionId)
            : s.sessionId || "";
        if (!sid) continue;
        try {
          const detail = await fetchSessionDetail(sid);
          const appEvents = detail?.appEvents || [];
          const merged: Record<string, any> = {};
          for (const ev of appEvents) {
            try {
              if (ev && ev.payload && typeof ev.payload === "object") {
                for (const k of Object.keys(ev.payload)) {
                  if (merged[k] === undefined) merged[k] = ev.payload[k];
                }
              }
              if (ev && ev.event === "PDPA_ACCEPT") {
                merged["pdpa_accept"] = ev.payload?.accepted === true;
              }
            } catch (_) {}
          }
          results[sid] = merged;
        } catch (_) {
          // ignore errors per session
        }
        if (!mounted) break;
      }
      if (mounted) setPerSessionData((prev) => ({ ...prev, ...results }));
    })();
    return () => {
      mounted = false;
    };
  }, [sessions]);

  const exportCsv = async () => {
    if (!sessions || sessions.length === 0) {
      alert("ไม่มีข้อมูลสำหรับดาวน์โหลด");
      return;
    }
    setExporting(true);
    try {
      const rows: string[][] = [];
      rows.push(THAI_HEADERS);

      // iterate sessions and fetch per-session details to map fields
      for (let i = 0; i < sessions.length; i++) {
        const s = sessions[i];
        const sid =
          s.sessionId || s.sessionId === 0
            ? String(s.sessionId)
            : s.sessionId || s.sessionId || "";
        // basic meta
        const ip = sanitizeCell(s.ip || "");
        const time_stamp = sanitizeCell(s.firstSeen || "");
        // fetch detail events
        const detail = await fetchSessionDetail(sid);
        const appEvents = detail?.appEvents || [];
        // Merge payloads: find keys by exact field names or common variants
        const merged: Record<string, any> = {};
        // Also look for top-level keys
        for (const ev of appEvents) {
          try {
            if (ev.payload && typeof ev.payload === "object") {
              for (const k of Object.keys(ev.payload)) {
                if (ev.payload[k] !== undefined && merged[k] === undefined) {
                  merged[k] = ev.payload[k];
                }
              }
            }
            // also copy event-specific fields
            if (ev.event && ev.event === "PDPA_ACCEPT") {
              merged["pdpa_accept"] =
                ev.payload?.accepted === true ? true : merged["pdpa_accept"];
            }
          } catch (e) {}
        }

        // helper to read many possible key names
        const pick = (keys: string[]) => {
          for (const k of keys) {
            if (merged[k] !== undefined) return merged[k];
            // also try s (summary) top-level
            if ((s as any)[k] !== undefined) return (s as any)[k];
          }
          return undefined;
        };

        const pdpa_accept = pick(["pdpa_accept", "PDPA", "pdpa"]) || "";
        const bus_type = pick(["bus_type", "ประเภทรถ"]) || "";
        const seat_total = pick(["seat_total", "ที่นั่งทั้งหมด"]) || "";
        const seat_special = pick(["seat_special", "ที่นั่งพิเศษ"]) || "";
        const seat_child_elder =
          pick(["seat_child_elder", "seat_child_elder"]) || "";
        const seat_pregnant = pick(["seat_pregnant"]) || "";
        const seat_monk = pick(["seat_monk"]) || "";
        const features = pick(["features"]) || "";
        const payment_type = pick(["payment_type", "การจ่าย"]) || "";
        const door_pos = pick(["door_pos", "ประตู"]) || "";
        const color = pick(["color", "สี"]) || "";
        const frequency = pick(["frequency", "ความถี่"]) || "";
        const bus_line = pick(["bus_line", "สาย"]) || "";
        const area = pick(["area", "พื้นที่"]) || "";

        const use_service = pick(["use_service"]) || "";
        const reason_not_use = pick(["reason_not_use"]) || "";

        const lucky_draw = pick(["lucky_draw"]) || "";
        const name = pick(["name"]) || pick(["user_name"]) || "";
        const phone = pick(["phone"]) || pick(["user_phone"]) || "";
        const time_stamp2 =
          pick(["time_stamp2"]) ||
          pick(["formSubmittedAt"]) ||
          s.lastSeen ||
          "";
        const share1 = pick(["share1"]) || "";
        const time_stamp3 = pick(["time_stamp3"]) || s.lastSeen || "";

        // Normalize arrays / objects to readable strings
        const toStr = (v: any) => {
          if (v === null || v === undefined) return "";
          if (Array.isArray(v)) return v.join(" | ");
          if (typeof v === "object") return JSON.stringify(v);
          return String(v);
        };

        const row = [
          sanitizeCell(ip),
          sanitizeCell(time_stamp),
          sanitizeCell(pdpa_accept),

          sanitizeCell(bus_type),
          sanitizeCell(seat_total),
          sanitizeCell(seat_special),
          sanitizeCell(seat_child_elder),
          sanitizeCell(seat_pregnant),
          sanitizeCell(seat_monk),
          sanitizeCell(toStr(features)),
          sanitizeCell(toStr(payment_type)),
          sanitizeCell(door_pos),
          sanitizeCell(color),
          sanitizeCell(frequency),
          sanitizeCell(bus_line),
          sanitizeCell(area),

          sanitizeCell(use_service),
          sanitizeCell(reason_not_use),

          sanitizeCell(lucky_draw),
          sanitizeCell(name),
          sanitizeCell(phone),
          sanitizeCell(time_stamp2),
          sanitizeCell(share1),

          sanitizeCell(time_stamp3),

          sanitizeCell(s.sessionId || ""),
        ];

        rows.push(row);
      }

      // build CSV
      const csv = rows
        .map((r) =>
          r
            .map((c) => {
              const s = String(c ?? "");
              if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
              return s;
            })
            .join(","),
        )
        .join("\n");

      const bom = "\uFEFF";
      const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mydreambus_bus_export_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      alert("ดาวน์โหลดเสร็จสิ้น");
    } catch (e: any) {
      console.error(e);
      alert("การดาวน์โหลดล้มเหลว: " + (e?.message || "error"));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">
        mydreambus — Bus Dashboard (เรียบง่าย)
      </h1>
      <div className="mb-4">
        <button
          className="mr-2 rounded bg-[#EFBA31] px-4 py-2 font-medium"
          onClick={exportCsv}
          disabled={exporting}
        >
          {exporting ? "กำลังดาวน์โหลด..." : "ดาวน์โหลด CSV (สรุป ภาษาไทย)"}
        </button>
        <button
          className="rounded bg-gray-200 px-3 py-2"
          onClick={() => window.location.reload()}
        >
          รีเฟรช
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="overflow-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr>
              {THAI_HEADERS.map((h) => (
                <th key={h} className="text-left px-2 py-1 border-b">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.sessionId} className="odd:bg-white/5">
                <td className="px-2 py-1">{s.ip || ""}</td>
                <td className="px-2 py-1">{s.firstSeen || ""}</td>
                <td className="px-2 py-1">
                  {perSessionData[String(s.sessionId || "")]?.pdpa_accept
                    ? "ใช่"
                    : "ไม่"}
                </td>
                <td className="px-2 py-1">
                  {perSessionData[String(s.sessionId || "")]?.bus_type || ""}
                </td>
                <td className="px-2 py-1">
                  {perSessionData[String(s.sessionId || "")]?.seat_total ?? ""}
                </td>
                <td className="px-2 py-1">
                  {perSessionData[String(s.sessionId || "")]?.seat_special ??
                    ""}
                </td>
                <td className="px-2 py-1">
                  {perSessionData[String(s.sessionId || "")]
                    ?.seat_child_elder ?? ""}
                </td>
                <td className="px-2 py-1">
                  {perSessionData[String(s.sessionId || "")]?.seat_pregnant ??
                    ""}
                </td>
                <td className="px-2 py-1">
                  {perSessionData[String(s.sessionId || "")]?.seat_monk ?? ""}
                </td>
                <td className="px-2 py-1">
                  {Array.isArray(
                    perSessionData[String(s.sessionId || "")]?.features,
                  )
                    ? perSessionData[String(s.sessionId || "")]?.features.join(
                        " | ",
                      )
                    : perSessionData[String(s.sessionId || "")]?.features || ""}
                </td>
                <td className="px-2 py-1">
                  {Array.isArray(
                    perSessionData[String(s.sessionId || "")]?.payment_type,
                  )
                    ? perSessionData[
                        String(s.sessionId || "")
                      ]?.payment_type.join(" | ")
                    : perSessionData[String(s.sessionId || "")]?.payment_type ||
                      ""}
                </td>
                <td className="px-2 py-1">
                  {perSessionData[String(s.sessionId || "")]?.door_pos || ""}
                </td>
                <td className="px-2 py-1">
                  {perSessionData[String(s.sessionId || "")]?.color || ""}
                </td>
                <td className="px-2 py-1">
                  {perSessionData[String(s.sessionId || "")]?.frequency ?? ""}
                </td>
                <td className="px-2 py-1">
                  {perSessionData[String(s.sessionId || "")]?.bus_line || ""}
                </td>
                <td className="px-2 py-1">
                  {perSessionData[String(s.sessionId || "")]?.area || ""}
                </td>
                <td className="px-2 py-1">
                  {perSessionData[String(s.sessionId || "")]?.use_service || ""}
                </td>
                <td className="px-2 py-1">
                  {perSessionData[String(s.sessionId || "")]?.reason_not_use ||
                    ""}
                </td>
                <td className="px-2 py-1">
                  {perSessionData[String(s.sessionId || "")]?.lucky_draw || ""}
                </td>
                <td className="px-2 py-1">{s.contactName || ""}</td>
                <td className="px-2 py-1">{s.contactPhone || ""}</td>
                <td className="px-2 py-1">{s.lastSeen || ""}</td>
                <td className="px-2 py-1">
                  {perSessionData[String(s.sessionId || "")]?.share1
                    ? "ใช่"
                    : "ไม่"}
                </td>
                <td className="px-2 py-1">{s.lastSeen || ""}</td>
                <td className="px-2 py-1">{s.sessionId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
