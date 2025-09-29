/**
 * UK PACK - Central Data Logging Service
 * Collects real user interaction data for dashboard analytics
 */

// Generate unique session ID if not provided
function generateSessionID() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get or create session ID (safe for iframes/private mode)
function getSessionID() {
  try {
    if (typeof window === "undefined") return generateSessionID();
    if (!("sessionStorage" in window)) return generateSessionID();
    let sessionID = null;
    try {
      sessionID = window.sessionStorage.getItem("ukPackSessionID");
    } catch (_) {
      // storage may be unavailable (3rd-party iframe, privacy mode)
      return generateSessionID();
    }
    if (!sessionID) {
      sessionID = generateSessionID();
      try {
        window.sessionStorage.setItem("ukPackSessionID", sessionID);
      } catch (_) {
        // ignore write failures
      }
    }
    return sessionID;
  } catch (_) {
    return generateSessionID();
  }
}

/**
 * Main event logging function
 * @param {Object} eventData - The event data to log
 * @param {string} eventData.event - Event type (e.g., 'ASK01_CHOICE', 'MINIGAME_MN1_COMPLETE')
 * @param {Object} eventData.payload - Event-specific data
 */
import { sendEventToFirestore } from "../lib/firebase";

// Helper: format timestamp to Thailand time (Asia/Bangkok) in ISO-like YYYY-MM-DD HH:mm:ss
function formatToBangkok(ts) {
  try {
    if (!ts) return "";
    const d = new Date(ts);
    if (isNaN(d.getTime())) return String(ts);
    // Use sv-SE locale to get YYYY-MM-DD HH:mm:ss format and apply Bangkok TZ
    return d.toLocaleString("sv-SE", { timeZone: "Asia/Bangkok" });
  } catch (e) {
    return String(ts || "");
  }
}

export function logEvent(eventData) {
  try {
    // 1. Retrieve existing events from localStorage, or start a new array (safe parse)
    const raw = localStorage.getItem("ukPackEvents");
    let existingEvents = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) existingEvents = parsed;
      } catch (_) {
        existingEvents = [];
      }
    }

    // 2. Prepare the event with required metadata
    const now = Date.now();
    const enrichedEvent = {
      // canonical fields
      sessionID: getSessionID(),
      timestamp: new Date(now).toISOString(),
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      url: typeof window !== "undefined" ? window.location.href : undefined,
      viewport:
        typeof window !== "undefined"
          ? { width: window.innerWidth, height: window.innerHeight }
          : undefined,
      // default event type when not provided
      event: eventData && eventData.event ? eventData.event : "UNKNOWN",
      // include original payload if any
      payload: eventData && eventData.payload ? eventData.payload : {},
      // merge other custom fields
      ...eventData,
    };

    // attach project tag based on path if not set
    try {
      const path =
        (enrichedEvent.url && new URL(enrichedEvent.url).pathname) ||
        (typeof window !== "undefined" &&
          window.location &&
          window.location.pathname) ||
        "";
      if (!enrichedEvent.payload) enrichedEvent.payload = {};
      if (!enrichedEvent.payload.project) {
        if (
          String(path).startsWith("/ukpack2") ||
          String(path).startsWith("/mydreambus")
        )
          enrichedEvent.payload.project = "mydreambus";
        else if (String(path).startsWith("/beforecitychange")) {
          // support both legacy 'ukpack1' and explicit 'beforecitychange' tags
          enrichedEvent.payload.project = "beforecitychange";
          enrichedEvent.payload.projectName = "ukpack1";
        } else enrichedEvent.payload.project = "site";
      }
    } catch (_) {}

    // Attach PDPA from session flag if present so events are marked when user accepted on start
    try {
      const sessionPdpa =
        typeof window !== "undefined" &&
        sessionStorage.getItem("pdpa_accepted") === "true";
      if (sessionPdpa) {
        enrichedEvent.PDPA = true;
        enrichedEvent.payload = enrichedEvent.payload || {};
        enrichedEvent.payload.PDPA = true;
      }
    } catch (_) {}

    // Ensure event type normalization
    try {
      const t = (enrichedEvent.event || "").toString().toUpperCase();
      enrichedEvent.event = t;
    } catch (_) {}

    // 3. Add the new event
    existingEvents.push(enrichedEvent);

    // 4. Save the updated array back to localStorage (tolerate failures)
    try {
      localStorage.setItem("ukPackEvents", JSON.stringify(existingEvents));
    } catch (_) {
      /* ignore */
    }

    // 5. Also log to console for debugging (can be removed in production)
    console.log("📊 Event Logged:", enrichedEvent);

    // 6. If PDPA accepted, try to send event to Firestore (client-side)
    try {
      const p = enrichedEvent.payload || {};
      const pdpa = p.PDPA || p.pdpa || enrichedEvent.PDPA || enrichedEvent.pdpa;
      if (pdpa === true || pdpa === "accepted" || pdpa === "1") {
        // choose collection based on project tag
        const project = p.project || "site";
        let target = "minigame1_events/minigame1-di";
        if (project === "ukpack2" || project === "mydreambus")
          target = "minigame2_events/minigame2-di";
        // fire-and-forget
        try {
          // call and swallow any promise rejection to prevent uncaught errors
          const p = sendEventToFirestore(enrichedEvent, target);
          if (p && typeof p.then === "function") p.catch(() => {});
        } catch (e) {
          /* ignore */
        }
      }
    } catch (e) {
      /* ignore */
    }

    // Event logged successfully to localStorage
  } catch (error) {
    console.error("Failed to log event:", error);

    // Fallback: try to clear corrupted data and retry once
    try {
      try {
        localStorage.removeItem("ukPackEvents");
      } catch (_) {}
      try {
        localStorage.setItem(
          "ukPackEvents",
          JSON.stringify([
            {
              sessionID: getSessionID(),
              timestamp: new Date().toISOString(),
              ...eventData,
            },
          ]),
        );
      } catch (_) {}
    } catch (retryError) {
      // swallow
    }
  }
}

/**
 * Get all logged events
 * @returns {Array} Array of all logged events
 */
export function getLoggedEvents() {
  try {
    const raw = localStorage.getItem("ukPackEvents");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    // Do not spam console with parse errors; fallback gracefully
    return [];
  }
}

/**
 * Get events for current session
 * @returns {Array} Array of events for current session
 */
export function getCurrentSessionEvents() {
  const sessionID = getSessionID();
  const allEvents = getLoggedEvents();
  return allEvents.filter((event) => event.sessionID === sessionID);
}

/**
 * Clear all logged events (for testing/reset)
 */
export function clearEventLogs() {
  try {
    localStorage.removeItem("ukPackEvents");
  } catch (_) {}
  try {
    sessionStorage.removeItem("ukPackSessionID");
  } catch (_) {}
  console.log("🗑️ Event logs cleared");
}

/**
 * Get summary statistics of logged data
 * @returns {Object} Summary statistics
 */
export function getEventSummary() {
  const events = getLoggedEvents();
  const sessions = new Set(events.map((e) => e.sessionID));
  const eventTypes = {};

  events.forEach((event) => {
    const eventType = event.event || "UNKNOWN";
    eventTypes[eventType] = (eventTypes[eventType] || 0) + 1;
  });

  return {
    totalEvents: events.length,
    totalSessions: sessions.size,
    currentSession: getSessionID(),
    eventTypes,
    dateRange: {
      first: events[0]?.timestamp,
      last: events[events.length - 1]?.timestamp,
    },
  };
}

/**
 * Export events as CSV for analysis
 * @returns {string} CSV formatted data
 */
export function exportEventsAsCSV() {
  const events = getLoggedEvents();
  if (events.length === 0) return "";

  const headers = [
    "รหัสเซสชัน (sessionID)",
    "เวลา (timestamp)",
    "เหตุการณ์ (event)",
    "URL (url)",
    "ข้อมูล (data)",
  ];
  const csvRows = [
    headers.map((h) => `"${String(h || "").replace(/"/g, '""')}"`).join(","),
  ];

  events.forEach((event) => {
    const row = [
      event.sessionID,
      formatToBangkok(event.timestamp),
      event.event || "UNKNOWN",
      event.url || "",
      JSON.stringify(event.payload || {}).replace(/"/g, '""'),
    ];
    csvRows.push(
      row
        .map((field) => `"${String(field || "").replace(/\"/g, '""')}"`)
        .join(","),
    );
  });

  return csvRows.join("\n");
}

// New: export aggregated session CSV matching requested schema
export function exportSessionsAsCSV() {
  const events = getLoggedEvents();
  if (!events || events.length === 0) return "";

  // group by sessionID
  const sessions = {};
  events.forEach((ev) => {
    const sid = ev.sessionID || "unknown";
    sessions[sid] = sessions[sid] || [];
    sessions[sid].push(ev);
  });

  const headers = [
    "รหัสเซสชัน (sessionID)",
    "IP (ip)",
    "เ��ลาเริ่ม (firstTimestamp)",
    "เวลาสิ้นสุด (lastTimestamp)",
    "ยอมรับ PDPA (PDPA_acceptance)",
    "ประเภทรถ (chassis_type)",
    "จำนวนที่นั่ง��วม (total_seats)",
    "ที่นั่งพิเศษ (special_seats)",
    "จำนวนเด็ก/ผู้สูงอายุ (children_elder_count)",
    "จำนวนผู้ตั้งครรภ์ (pregnant_count)",
    "จำนวนพระ (monk_count)",
    "สิ่งอำนวยความสะดวก (features)",
    "ประเภทการชำระเง���น (payment_types)",
    "จำนวนประตู (doors)",
    "สี (color)",
    "ความถี่ (frequency)",
    "เส้นทาง (route)",
    "พื้นที่ (area)",
    "ตัดสินใจใช้บริการ (decision_use_service)",
    "เหตุผลไม่ใช���บริการ (reason_not_use)",
    "เข้าร่วมของรางวัล (decision_enter_prize)",
    "ชื่อผู้รับรางวัล (prize_name)",
    "เบอร์โทรผู้รับรางวัล (prize_phone)",
    "เว���าการรับรางวัล (prize_timestamp)",
    "แชร์กับเพื่อน (shared_with_friends)",
    "เวลาแชร์ (shared_timestamp)",
  ];

  const csvRows = [
    headers.map((h) => `"${String(h || "").replace(/"/g, '""')}"`).join(","),
  ];

  Object.keys(sessions).forEach((sid) => {
    const evs = sessions[sid].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    const row = {
      sessionID: sid,
      ip: "",
      firstTimestamp: evs[0]?.timestamp || "",
      lastTimestamp: evs[evs.length - 1]?.timestamp || "",
      PDPA_acceptance: "",
      chassis_type: "",
      total_seats: "",
      special_seats: "",
      children_elder_count: "",
      pregnant_count: "",
      monk_count: "",
      features: [],
      payment_types: [],
      doors: "",
      color: "",
      frequency: "",
      route: "",
      area: "",
      decision_use_service: "",
      reason_not_use: "",
      decision_enter_prize: "",
      prize_name: "",
      prize_phone: "",
      prize_timestamp: "",
      shared_with_friends: "",
      shared_timestamp: "",
    };

    evs.forEach((e) => {
      const p = e.payload || {};
      // PDPA
      if (
        row.PDPA_acceptance === "" &&
        (p.PDPA === true ||
          p.pdpa === true ||
          p.PDPA === "accepted" ||
          p.pdpa === "accepted")
      )
        row.PDPA_acceptance = "1";
      if (
        row.PDPA_acceptance === "" &&
        (p.PDPA === false || p.pdpa === false || p.PDPA === "declined")
      )
        row.PDPA_acceptance = "0";

      // chassis
      if (
        !row.chassis_type &&
        (p.chassis || (p.design && p.design.chassis) || p.chassisType)
      )
        row.chassis_type =
          p.chassis || (p.design && p.design.chassis) || p.chassisType;

      // seating
      if (!row.total_seats) {
        if (p.seating && p.seating.totalSeats)
          row.total_seats = String(p.seating.totalSeats);
        else if (p.totalSeats) row.total_seats = String(p.totalSeats);
      }
      if (!row.special_seats && p.seating && p.seating.specialSeats)
        row.special_seats = String(p.seating.specialSeats);

      // demographics counts
      if (!row.children_elder_count && p.seating && p.seating.children)
        row.children_elder_count = String(p.seating.children);
      if (
        !row.pregnant_count &&
        ((p.seating && p.seating.pregnant) || p.pregnant)
      )
        row.pregnant_count = String(
          (p.seating && p.seating.pregnant) || p.pregnant || "",
        );
      if (!row.monk_count && ((p.seating && p.seating.monk) || p.monk))
        row.monk_count = String((p.seating && p.seating.monk) || p.monk || "");

      // features (amenities)
      if (Array.isArray(p.amenities))
        row.features = Array.from(
          new Set((row.features || []).concat(p.amenities)),
        );
      if (Array.isArray(p.features))
        row.features = Array.from(
          new Set((row.features || []).concat(p.features)),
        );

      // payment
      if (Array.isArray(p.payment))
        row.payment_types = Array.from(
          new Set((row.payment_types || []).concat(p.payment)),
        );
      if (p.paymentType)
        row.payment_types = Array.from(
          new Set((row.payment_types || []).concat([p.paymentType])),
        );

      // doors
      if (
        !row.doors &&
        (p.doors || p.doorChoice || (p.doors && p.doors.doorChoice))
      ) {
        if (typeof p.doors === "string") row.doors = p.doors;
        else if (p.doorChoice) row.doors = p.doorChoice;
        else if (p.doors && p.doors.doorChoice) row.doors = p.doors.doorChoice;
      }

      // color
      if (
        !row.color &&
        ((p.color && p.color.colorHex) ||
          (p.exterior && p.exterior.color && p.exterior.color.colorHex) ||
          p.colorHex)
      )
        row.color =
          (p.color && p.color.colorHex) ||
          (p.exterior && p.exterior.color && p.exterior.color.colorHex) ||
          p.colorHex ||
          "";

      // schedule
      if (!row.frequency && (p.interval || p.frequency))
        row.frequency = p.interval || p.frequency;
      if (!row.route && p.route) row.route = p.route;
      if (!row.area && p.area) row.area = p.area;

      // decision use service
      if (
        !row.decision_use_service &&
        (p.decisionUseService !== undefined || p.useService !== undefined)
      )
        row.decision_use_service =
          (p.decisionUseService ?? p.useService) ? "1" : "0";

      // reason not use
      if (
        !row.reason_not_use &&
        (p.reasonNotUse || p.reason || p.reason_not_use)
      )
        row.reason_not_use = p.reasonNotUse || p.reason || p.reason_not_use;

      // prize fields
      if (
        !row.decision_enter_prize &&
        (p.enterPrize !== undefined ||
          p.prizeEnter !== undefined ||
          p.wantsPrize !== undefined)
      )
        row.decision_enter_prize =
          (p.enterPrize ?? p.prizeEnter ?? p.wantsPrize) ? "1" : "0";
      if (!row.prize_name && (p.prizeName || p.name))
        row.prize_name = p.prizeName || p.name;
      if (!row.prize_phone && (p.prizePhone || p.phone))
        row.prize_phone = p.prizePhone || p.phone;
      if (
        !row.prize_timestamp &&
        e.timestamp &&
        (p.prizeName || p.prizePhone || p.enterPrize || p.wantsPrize)
      )
        row.prize_timestamp = e.timestamp;

      // shared
      if (!row.shared_with_friends && (p.shared === true || p.sharedTo))
        row.shared_with_friends = "1";
      if (!row.shared_timestamp && (p.shared === true || p.sharedTo))
        row.shared_timestamp = e.timestamp;
    });

    const featuresStr = Array.isArray(row.features)
      ? row.features.join(" | ")
      : row.features || "";
    const paymentStr = Array.isArray(row.payment_types)
      ? row.payment_types.join(" | ")
      : row.payment_types || "";

    const vals = [
      row.sessionID,
      row.ip || "",
      formatToBangkok(row.firstTimestamp),
      formatToBangkok(row.lastTimestamp),
      row.PDPA_acceptance,
      row.chassis_type,
      row.total_seats,
      row.special_seats,
      row.children_elder_count,
      row.pregnant_count,
      row.monk_count,
      featuresStr,
      paymentStr,
      row.doors,
      row.color,
      row.frequency,
      row.route,
      row.area,
      row.decision_use_service,
      row.reason_not_use,
      row.decision_enter_prize,
      row.prize_name,
      row.prize_phone,
      row.prize_timestamp,
      row.shared_with_friends,
      row.shared_timestamp,
    ];

    const safe = vals.map((f) => `"${String(f || "").replace(/"/g, '""')}"`);
    csvRows.push(safe.join(","));
  });

  return csvRows.join("\n");
}

/**
 * Send local stored events to Firestore in batches.
 * options: { batchSize = 50, onlyPDPA = true }
 * Returns summary { sentCount, skippedCount, errors, sampleSent }
 */
export async function sendLocalEventsToFirestore(options = {}) {
  const { batchSize = 50, onlyPDPA = true } = options;
  const events = getLoggedEvents();
  if (!events || events.length === 0)
    return { sentCount: 0, skippedCount: 0, errors: [], sampleSent: [] };

  const toSend = events.filter((ev) => {
    if (!onlyPDPA) return true;
    try {
      const p = ev.payload || {};
      const pdpa = p.PDPA || p.pdpa || ev.PDPA || ev.pdpa;
      return pdpa === true || pdpa === "accepted" || pdpa === "1";
    } catch (e) {
      return false;
    }
  });

  // Detect if we should use session-level mapped storage (mydreambus)
  let isMydreambus = false;
  try {
    if (
      typeof window !== "undefined" &&
      window.location &&
      typeof window.location.pathname === "string"
    ) {
      if (window.location.pathname.indexOf("/mydreambus") === 0)
        isMydreambus = true;
    }
  } catch (_) {}

  // If mydreambus: aggregate by session and send mapped session docs to server
  if (isMydreambus) {
    const sessionsMap = {};
    toSend.forEach((ev) => {
      const sid = ev.sessionID || ev.sessionId || "unknown";
      if (!sessionsMap[sid]) sessionsMap[sid] = [];
      sessionsMap[sid].push(ev);
    });

    const items = [];
    Object.keys(sessionsMap).forEach((sid) => {
      const evs = sessionsMap[sid]
        .slice()
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        );
      const first = evs[0] || {};
      const last = evs[evs.length - 1] || {};

      // Helper to find first payload field matching candidates
      const findInEvs = function (candidates) {
        for (let i = 0; i < evs.length; i++) {
          const p = evs[i].payload || {};
          for (let j = 0; j < candidates.length; j++) {
            const k = candidates[j];
            if (p && p[k] !== undefined && p[k] !== null) return p[k];
            // nested checks
            if (k.indexOf(".") !== -1) {
              const parts = k.split(".");
              let cur = p;
              let ok = true;
              for (let pi = 0; pi < parts.length; pi++) {
                if (!cur) {
                  ok = false;
                  break;
                }
                cur = cur[parts[pi]];
              }
              if (ok && cur !== undefined && cur !== null) return cur;
            }
          }
        }
        return undefined;
      };

      const row = {
        sessionID: sid,
        ip: first.ip || (first.payload && first.payload.ip) || "",
        firstTimestamp: first.timestamp || "",
        lastTimestamp: last.timestamp || "",
        PDPA_acceptance: (function () {
          for (let i = 0; i < evs.length; i++) {
            const p = evs[i].payload || {};
            const v =
              p.PDPA !== undefined
                ? p.PDPA
                : p.pdpa !== undefined
                  ? p.pdpa
                  : evs[i].PDPA !== undefined
                    ? evs[i].PDPA
                    : undefined;
            if (v === true || v === "accepted" || v === "1") return "1";
            if (v === false || v === "declined" || v === "0") return "0";
          }
          return "";
        })(),
        chassis_type:
          findInEvs(["chassis", "design.chassis", "chassisType"]) || "",
        total_seats: (function () {
          const v = findInEvs(["seating.totalSeats", "totalSeats"]);
          return v === undefined ? "" : String(v);
        })(),
        special_seats: (function () {
          const v = findInEvs(["seating.specialSeats"]);
          return v === undefined ? "" : String(v);
        })(),
        children_elder_count: (function () {
          const v = findInEvs(["seating.children"]);
          return v === undefined ? "" : String(v);
        })(),
        pregnant_count: (function () {
          const v = findInEvs(["seating.pregnant", "pregnant"]);
          return v === undefined ? "" : String(v);
        })(),
        monk_count: (function () {
          const v = findInEvs(["seating.monk", "monk"]);
          return v === undefined ? "" : String(v);
        })(),
        features: (function () {
          const set = new Set();
          for (let i = 0; i < evs.length; i++) {
            const p = evs[i].payload || {};
            if (Array.isArray(p.amenities))
              p.amenities.forEach((x) => set.add(x));
            if (Array.isArray(p.features))
              p.features.forEach((x) => set.add(x));
          }
          return Array.from(set);
        })(),
        payment_types: (function () {
          const set = new Set();
          for (let i = 0; i < evs.length; i++) {
            const p = evs[i].payload || {};
            if (Array.isArray(p.payment)) p.payment.forEach((x) => set.add(x));
            if (p.paymentType) set.add(p.paymentType);
          }
          return Array.from(set);
        })(),
        doors: findInEvs(["doors", "doorChoice", "doors.doorChoice"]) || "",
        color: (function () {
          const v = findInEvs([
            "color.colorHex",
            "exterior.color.colorHex",
            "colorHex",
            "color",
          ]);
          return v === undefined ? "" : v;
        })(),
        frequency: findInEvs(["interval", "frequency"]) || "",
        route: findInEvs(["route"]) || "",
        area: findInEvs(["area"]) || "",
        decision_use_service: (function () {
          const v = findInEvs(["decisionUseService", "useService"]);
          if (v === undefined) return "";
          return v ? "1" : "0";
        })(),
        reason_not_use:
          findInEvs(["reasonNotUse", "reason", "reason_not_use"]) || "",
        decision_enter_prize: (function () {
          const v = findInEvs(["enterPrize", "prizeEnter", "wantsPrize"]);
          if (v === undefined) return "";
          return v ? "1" : "0";
        })(),
        prize_name: findInEvs(["prizeName", "name"]) || "",
        prize_phone: findInEvs(["prizePhone", "phone"]) || "",
        prize_timestamp: (function () {
          const v = findInEvs([
            "prizeName",
            "prizePhone",
            "enterPrize",
            "wantsPrize",
          ]);
          return v ? findInEvs(["timestamp"]) || "" : "";
        })(),
        shared_with_friends: (function () {
          const v = findInEvs(["shared", "sharedTo"]);
          return v ? "1" : "";
        })(),
        shared_timestamp: (function () {
          const v = findInEvs(["shared", "sharedTo"]);
          return v ? findInEvs(["timestamp"]) || "" : "";
        })(),
      };

      items.push(row);
    });

    let sentCount = 0;
    let skippedCount = 0;
    const errors = [];
    const sampleSent = [];

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      try {
        const resp = await fetch("/api/flush-pending", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(batch),
        });
        if (resp.ok) {
          sentCount += batch.length;
          for (let k = 0; k < batch.length && sampleSent.length < 5; k++)
            sampleSent.push(batch[k]);
        } else {
          let j = null;
          try {
            j = await resp.json();
          } catch (_) {
            j = null;
          }
          const msg = j && j.error ? j.error : "server returned " + resp.status;
          errors.push({ batch, error: msg });
        }
      } catch (e) {
        errors.push({ batch, error: String(e) });
      }
      await new Promise((r) => setTimeout(r, 200));
    }

    return { sentCount, skippedCount, errors, sampleSent };
  }

  // Default behavior: send individual events to Firestore as before
  let sentCount = 0;
  let skippedCount = events.length - toSend.length;
  const errors = [];
  const sampleSent = [];

  // chunk and send
  for (let i = 0; i < toSend.length; i += batchSize) {
    const chunk = toSend.slice(i, i + batchSize);
    // send concurrently within chunk
    // Send sequentially to avoid opening many concurrent write streams which can
    // cause transport errors in some network/environments. Introduce a small delay
    // between writes.
    for (const ev of chunk) {
      let attempt = 0;
      let success = false;
      let lastErr = null;
      while (attempt < 3 && !success) {
        try {
          await sendEventToFirestore(ev, "minigame2_events/minigame2-di");
          sentCount += 1;
          if (sampleSent.length < 5) sampleSent.push(ev);
          success = true;
          // polite delay between writes
          await new Promise((res) => setTimeout(res, 800));
        } catch (err) {
          lastErr = err;
          attempt += 1;
          const msg = String(err && err.message ? err.message : err);
          // If permission error, abort further attempts — rules likely blocking writes
          if (
            /permission|insufficient permissions|permission-denied/i.test(msg)
          ) {
            errors.push({ event: ev, error: msg });
            // abort whole send to avoid spamming errors
            return { sentCount, skippedCount, errors, sampleSent, fatal: true };
          }
          // exponential backoff
          await new Promise((res) => setTimeout(res, 500 * attempt));
        }
      }
      if (!success) {
        errors.push({ event: ev, error: String(lastErr) });
      }
    }
  }

  return { sentCount, skippedCount, errors, sampleSent };
}

// Initialize logging service
console.log("📊 Before City Change Data Logger initialized");

// Only run browser-specific code if we're in a browser environment
if (typeof window !== "undefined" && typeof document !== "undefined") {
  // Listen for page visibility changes to log session events
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      logEvent({
        event: "SESSION_PAUSE",
        payload: { reason: "page_hidden" },
      });
    } else {
      logEvent({
        event: "SESSION_RESUME",
        payload: { reason: "page_visible" },
      });
    }
  });

  // Log page load event
  window.addEventListener("load", () => {
    logEvent({
      event: "PAGE_LOAD",
      payload: {
        page: window.location.pathname,
        referrer: document.referrer,
      },
    });
  });
}
