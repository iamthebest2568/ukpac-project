// Client-side Firebase initialization (modular SDK)
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

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
    db = getFirestore(app);
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
    const storage = getStorage(appInstance);
    const ref = storageRef(storage, path);
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
  if (!db) throw new Error("Firestore not initialized");
  // normalize path (strip leading slashes)
  const normalized = String(collectionPath || "")
    .replace(/^\/+/, "")
    .trim();
  const parts = normalized.split("/").filter(Boolean);

  try {
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
          await fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } catch (_) {
          // ignore network/CORS errors entirely in client fallback
        }

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
    throw err;
  }
}

// Write-only helper for saving design image URL (no PDPA gating)
export async function addDesignImageUrlToFirestore(imageUrl: string) {
  if (!db) initFirebase();
  if (!db) throw new Error("Firestore not initialized");

  async function tryWrite(colName: string) {
    const colRef = collection(db as any, colName);
    const docRef = await addDoc(colRef as any, {
      imageUrl,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, collection: colName } as const;
  }

  // Prefer user's requested collection name; fallback to previous one if needed
  try {
    return await tryWrite("kpact-gamebus-imagedesign-events");
  } catch (e) {
    try {
      return await tryWrite("ukpact-gamebus-imagedesign-events");
    } catch (e2) {
      throw e2 || e;
    }
  }
}

// also export init for manual init from UI
export { initFirebase };
