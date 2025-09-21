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
    const enrichedEvent = {
      sessionID: getSessionID(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      ...eventData,
    };

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
      const pdpa = (enrichedEvent.payload && (enrichedEvent.payload.PDPA || enrichedEvent.payload.pdpa)) || enrichedEvent.PDPA || enrichedEvent.pdpa;
      if (pdpa === true || pdpa === "accepted" || pdpa === "1") {
        // fire-and-forget
        try { sendEventToFirestore(enrichedEvent); } catch (e) { /* ignore */ }
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

  const headers = ["sessionID", "timestamp", "event", "url", "data"];
  const csvRows = [headers.join(",")];

  events.forEach((event) => {
    const row = [
      event.sessionID,
      event.timestamp,
      event.event || "UNKNOWN",
      event.url || "",
      JSON.stringify(event.payload || {}).replace(/"/g, '""'),
    ];
    csvRows.push(row.map((field) => `"${field}"`).join(","));
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
    "sessionID",
    "ip",
    "firstTimestamp",
    "lastTimestamp",
    "PDPA_acceptance",
    "chassis_type",
    "total_seats",
    "special_seats",
    "children_elder_count",
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
  ];

  const csvRows = [headers.join(",")];

  Object.keys(sessions).forEach((sid) => {
    const evs = sessions[sid].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

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
      if (row.PDPA_acceptance === "" && (p.PDPA === true || p.pdpa === true || p.PDPA === "accepted" || p.pdpa === "accepted")) row.PDPA_acceptance = "1";
      if (row.PDPA_acceptance === "" && (p.PDPA === false || p.pdpa === false || p.PDPA === "declined")) row.PDPA_acceptance = "0";

      // chassis
      if (!row.chassis_type && (p.chassis || (p.design && p.design.chassis) || p.chassisType)) row.chassis_type = p.chassis || (p.design && p.design.chassis) || p.chassisType;

      // seating
      if (!row.total_seats) {
        if (p.seating && p.seating.totalSeats) row.total_seats = String(p.seating.totalSeats);
        else if (p.totalSeats) row.total_seats = String(p.totalSeats);
      }
      if (!row.special_seats && p.seating && p.seating.specialSeats) row.special_seats = String(p.seating.specialSeats);

      // demographics counts
      if (!row.children_elder_count && p.seating && p.seating.children) row.children_elder_count = String(p.seating.children);
      if (!row.pregnant_count && (p.seating && p.seating.pregnant || p.pregnant)) row.pregnant_count = String((p.seating && p.seating.pregnant) || p.pregnant || "");
      if (!row.monk_count && (p.seating && p.seating.monk || p.monk)) row.monk_count = String((p.seating && p.seating.monk) || p.monk || "");

      // features (amenities)
      if (Array.isArray(p.amenities)) row.features = Array.from(new Set((row.features || []).concat(p.amenities)));
      if (Array.isArray(p.features)) row.features = Array.from(new Set((row.features || []).concat(p.features)));

      // payment
      if (Array.isArray(p.payment)) row.payment_types = Array.from(new Set((row.payment_types || []).concat(p.payment)));
      if (p.paymentType) row.payment_types = Array.from(new Set((row.payment_types || []).concat([p.paymentType])));

      // doors
      if (!row.doors && (p.doors || p.doorChoice || (p.doors && p.doors.doorChoice))) {
        if (typeof p.doors === 'string') row.doors = p.doors;
        else if (p.doorChoice) row.doors = p.doorChoice;
        else if (p.doors && p.doors.doorChoice) row.doors = p.doors.doorChoice;
      }

      // color
      if (!row.color && (p.color && p.color.colorHex || (p.exterior && p.exterior.color && p.exterior.color.colorHex) || p.colorHex)) row.color = (p.color && p.color.colorHex) || (p.exterior && p.exterior.color && p.exterior.color.colorHex) || p.colorHex || "";

      // schedule
      if (!row.frequency && (p.interval || p.frequency)) row.frequency = p.interval || p.frequency;
      if (!row.route && (p.route)) row.route = p.route;
      if (!row.area && (p.area)) row.area = p.area;

      // decision use service
      if (!row.decision_use_service && (p.decisionUseService !== undefined || p.useService !== undefined)) row.decision_use_service = (p.decisionUseService ?? p.useService) ? "1" : "0";

      // reason not use
      if (!row.reason_not_use && (p.reasonNotUse || p.reason || p.reason_not_use)) row.reason_not_use = p.reasonNotUse || p.reason || p.reason_not_use;

      // prize fields
      if (!row.decision_enter_prize && (p.enterPrize !== undefined || p.prizeEnter !== undefined || p.wantsPrize !== undefined)) row.decision_enter_prize = (p.enterPrize ?? p.prizeEnter ?? p.wantsPrize) ? "1" : "0";
      if (!row.prize_name && (p.prizeName || p.name)) row.prize_name = p.prizeName || p.name;
      if (!row.prize_phone && (p.prizePhone || p.phone)) row.prize_phone = p.prizePhone || p.phone;
      if (!row.prize_timestamp && e.timestamp && (p.prizeName || p.prizePhone || p.enterPrize || p.wantsPrize)) row.prize_timestamp = e.timestamp;

      // shared
      if (!row.shared_with_friends && (p.shared === true || p.sharedTo)) row.shared_with_friends = "1";
      if (!row.shared_timestamp && (p.shared === true || p.sharedTo)) row.shared_timestamp = e.timestamp;
    });

    const featuresStr = Array.isArray(row.features) ? row.features.join(" | ") : (row.features || "");
    const paymentStr = Array.isArray(row.payment_types) ? row.payment_types.join(" | ") : (row.payment_types || "");

    const vals = [
      row.sessionID,
      row.ip || "",
      row.firstTimestamp,
      row.lastTimestamp,
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
  if (!events || events.length === 0) return { sentCount: 0, skippedCount: 0, errors: [], sampleSent: [] };

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

  let sentCount = 0;
  let skippedCount = events.length - toSend.length;
  const errors = [];
  const sampleSent = [];

  // chunk and send
  for (let i = 0; i < toSend.length; i += batchSize) {
    const chunk = toSend.slice(i, i + batchSize);
    // send concurrently within chunk
    const promises = chunk.map((ev) => {
      try {
        return sendEventToFirestore(ev);
      } catch (e) {
        return Promise.reject(e);
      }
    });
    try {
      await Promise.all(promises.map((p) => p.catch((e) => ({ __err: String(e) }))));
      sentCount += chunk.length;
      for (const ev of chunk) {
        if (sampleSent.length < 5) sampleSent.push(ev);
      }
    } catch (e) {
      // should not reach here because we handle rejects, but capture generic
      errors.push(String(e));
    }
  }

  return { sentCount, skippedCount, errors, sampleSent };
}

// Initialize logging service
console.log("📊 UK PACK Data Logger initialized");

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
