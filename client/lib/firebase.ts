// Client-side Firebase initialization (modular SDK)
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";

// Firebase config provided by user
const firebaseConfig = {
  apiKey: "AIzaSyBdMPQP9DVM1S9bh70dFuMAsyzPJPOYXnk",
  authDomain: "uk-pact.firebaseapp.com",
  projectId: "uk-pact",
  storageBucket: "uk-pact.firebasestorage.app",
  messagingSenderId: "534142958499",
  appId: "1:534142958499:web:3cf0b2380c055f7a747816",
  measurementId: "G-JDB6J91ETY",
};

let db: ReturnType<typeof getFirestore> | null = null;
let appInstance: any = null;

function initFirebase() {
  if (db && appInstance) return;
  try {
    // In case code runs in SSR or before window exists, guard
    if (typeof window === "undefined") return;
    let app;
    if (getApps && getApps().length > 0) {
      app = getApp();
    } else {
      app = initializeApp(firebaseConfig);
    }
    appInstance = app;
    try {
      // Initialize Firestore using long-polling transport to avoid gRPC 'idle stream' disconnects
      // which frequently occur behind proxies/load balancers in serverless hosts.
      db = initializeFirestore(app, {
        experimentalForceLongPolling: true,
      } as any);
    } catch (err) {
      console.warn("Firestore initialization failed", err);
      db = null as any;
    }
  } catch (e) {
    console.warn("Firebase init failed", e);
  }
}

export async function uploadFileToStorage(
  file: Blob | Uint8Array,
  path: string,
) {
  try {
    if (!appInstance) initFirebase();
    if (!appInstance) throw new Error("Firebase app not initialized");
    // Normalize path and ensure project-aware prefix when running in browser
    let finalPath = String(path || "");
    try {
      if (typeof window !== "undefined") {
        const p = window.location && window.location.pathname;
        if (p && String(p).startsWith("/beforecitychange")) {
          if (!finalPath.startsWith("beforecitychange/"))
            finalPath = `beforecitychange/${finalPath}`;
        } else if (
          p &&
          (String(p).startsWith("/mydreambus") ||
            String(p).startsWith("/ukpack2"))
        ) {
          if (!finalPath.startsWith("mydreambus/"))
            finalPath = `mydreambus/${finalPath}`;
        }
      }
    } catch (_) {}

    const storage = getStorage(appInstance);
    const ref = storageRef(storage, finalPath);
    await uploadBytes(ref, file as any);
    const url = await getDownloadURL(ref);
    return url;
  } catch (e) {
    console.warn("uploadFileToStorage failed", e);
    throw e;
  }
}

export async function sendEventToFirestore(
  event: any,
  collectionPath: string = "minigame1_events/minigame1-id",
) {
  if (!db) initFirebase();
  // normalize path (strip leading slashes)
  const normalized = String(collectionPath || "")
    .replace(/^\/+/, "")
    .trim();
  const parts = normalized.split("/").filter(Boolean);

  try {
    if (!db) {
      // Firestore unavailable: best-effort server fallback only
      try {
        const payload = {
          sessionId: event?.sessionID || event?.sessionId || null,
          event: event?.event || "UNKNOWN",
          timestamp: new Date().toISOString(),
          payload: event?.payload || {},
          userAgent: navigator.userAgent || null,
          page: window.location.pathname,
        };
        const ok = (() => {
          try {
            const blob = new Blob([JSON.stringify(payload)], {
              type: "application/json",
            });
            // sendBeacon returns boolean, does not throw on network errors
            return (
              navigator.sendBeacon && navigator.sendBeacon("/api/track", blob)
            );
          } catch (_) {
            return false;
          }
        })();
        void ok;
      } catch (_) {}
      return { ok: false, skipped: true } as any;
    }
    // If the target is the minigame2_events (used by mydreambus / ukpack2), prefer routing
    // per-event writes to the server tracking endpoint to avoid storing every event as a Firestore document.
    // This keeps Firestore smaller and ensures aggregation happens server-side.
    const targetIsMinigame2 =
      normalized.includes("minigame2_events") ||
      normalized.includes("minigame2");
    if (targetIsMinigame2) {
      try {
        const payload = {
          sessionId: event.sessionID || event.sessionId || null,
          event: event.event || "UNKNOWN",
          timestamp: event.timestamp
            ? typeof event.timestamp === "number"
              ? new Date(event.timestamp).toISOString()
              : event.timestamp
            : new Date().toISOString(),
          payload: event.payload || {},
          userAgent:
            event.userAgent ||
            (typeof navigator !== "undefined"
              ? navigator.userAgent
              : undefined) ||
            null,
          ip: event.ip || undefined,
          page:
            event.url ||
            (typeof window !== "undefined"
              ? window.location.pathname
              : undefined),
        };
        // Try sendBeacon first (fire-and-forget), fallback to fetch
        try {
          if (typeof navigator !== "undefined" && navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(payload)], {
              type: "application/json",
            });
            navigator.sendBeacon("/api/track", blob);
            return { ok: true, routed: "track" } as any;
          }
        } catch (_) {}
        // fallback
        try {
          await fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          return { ok: true, routed: "track" } as any;
        } catch (_) {
          // fall through to attempt Firestore write if network unavailable
        }
      } catch (_) {
        // ignore and fall through to direct Firestore write as last resort
      }
    }

    let colRef;
    if (parts.length === 0) {
      colRef = collection(db, "minigame1_events");
    } else if (parts.length === 1) {
      // simple collection
      colRef = collection(db, parts[0]);
    } else if (parts.length === 2) {
      // collection/document -> write to subcollection 'events' under that document
      const [colName, docId] = parts;
      const docRef = doc(db, colName, docId);
      colRef = collection(docRef, "events");
    } else {
      // For deeper paths, if even number of parts then last segment is a document id
      // so write to an 'events' subcollection under that document, otherwise
      // treat the provided path as a collection path.
      if (parts.length % 2 === 0) {
        const docRef = doc(db, ...parts);
        colRef = collection(docRef, "events");
      } else {
        colRef = collection(db, normalized);
      }
    }

    // write enriched event; add server timestamp
    return await addDoc(colRef, { ...event, createdAt: serverTimestamp() });
  } catch (e: any) {
    const code = e?.code || e?.status || "unknown";
    const message = e?.message || String(e);
    // If permission denied, attempt to fallback to server-side ingestion endpoint
    if (
      /permission|insufficient permissions|permission-denied/i.test(message)
    ) {
      try {
        // Fire a best-effort POST to /api/track so server can persist the event
        // Normalize event shape expected by server: sessionId vs sessionID
        const payload = {
          sessionId: event.sessionID || event.sessionId || null,
          event: event.event || "UNKNOWN",
          timestamp: event.timestamp
            ? typeof event.timestamp === "number"
              ? new Date(event.timestamp).toISOString()
              : event.timestamp
            : new Date().toISOString(),
          payload: event.payload || {},
          userAgent: event.userAgent || navigator.userAgent || null,
          ip: event.ip || undefined,
          page: event.url || window.location.pathname,
        };
        // fire-and-forget (tolerate sync and async failures)
        try {
          const blob = new Blob([JSON.stringify(payload)], {
            type: "application/json",
          });
          navigator.sendBeacon && navigator.sendBeacon("/api/track", blob);
        } catch (_) {}

        // return a sentinel so callers treat as success (event persisted server-side)
        return { ok: true, fallback: true } as any;
      } catch (_) {
        // ignore and fall through to throw original error
      }
    }

    const err = new Error(`[${code}] ${message}`);
    try {
      (err as any).original = e;
    } catch (_) {}
    // Never throw from client analytics path; return a soft-failure result
    return { ok: false, error: err.message } as any;
  }
}

// Write-only helper for saving design image URL (no PDPA gating)
export async function saveMinigameResult(
  file: Blob | Uint8Array,
  colorHex: string | null,
  userId?: string | null,
) {
  if (!appInstance) initFirebase();
  if (!appInstance) throw new Error("Firebase app not initialized");
  try {
    // try to determine user id from auth if not provided
    let uid = userId || null;
    try {
      const auth = getAuth(appInstance);
      if (auth && (auth as any).currentUser && !uid) {
        uid = (auth as any).currentUser.uid || null;
      }
    } catch (_) {}

    const ts = Date.now();
    const filename = `${ts}.png`;
    const path = `cars/${uid || "anonymous"}/${filename}`;

    const storage = getStorage(appInstance);
    const ref = storageRef(storage, path);

    await uploadBytes(ref, file as any);
    const url = await getDownloadURL(ref);

    if (!db) initFirebase();
    if (!db) throw new Error("Firestore not initialized");

    const colRef = collection(db as any, "minigameResults");
    const docRef = await addDoc(colRef as any, {
      userId: uid || null,
      color: colorHex || null,
      resultUrl: url,
      createdAt: serverTimestamp(),
    });

    return { docId: docRef.id, url } as const;
  } catch (e) {
    console.warn("saveMinigameResult failed", e);
    throw e;
  }
}

export async function addDesignImageUrlToFirestore(
  imageUrl: string,
  preferredCollection?: string,
) {
  if (!db) initFirebase();
  if (!db) throw new Error("Firestore not initialized");

  async function findOrWrite(colName: string) {
    const colRef = collection(db as any, colName);

    // Check for existing document with same imageUrl to avoid duplicates
    try {
      const q = query(colRef as any, where("imageUrl", "==", imageUrl));
      const snap = await getDocs(q as any);
      if (snap && snap.size > 0) {
        const docRef = snap.docs[0];
        return { id: docRef.id, collection: colName } as const;
      }
    } catch (err) {
      // ignore query errors and fall back to write
    }

    const docRef = await addDoc(colRef as any, {
      imageUrl,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, collection: colName } as const;
  }

  // Prefer user's requested collection name; fallback to previous ones if needed
  const candidates = [] as string[];
  if (preferredCollection && typeof preferredCollection === "string")
    candidates.push(preferredCollection);
  candidates.push(
    "kpact-gamebus-imagedesign-events",
    "ukpact-gamebus-imagedesign-events",
  );

  for (const colName of candidates) {
    try {
      return await findOrWrite(colName);
    } catch (_) {
      // try next
    }
  }
  throw new Error("failed to write design image to any candidate collection");
}

// also export init for manual init from UI
export { initFirebase };
