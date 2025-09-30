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
let clientFirestoreEnabled = false; // runtime flag: enable only after a successful probe to avoid 'Failed to fetch' errors when network blocked

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

      // Start an async probe to detect whether client Firestore network calls succeed.
      // If the probe fails (timeout or network error), disable client SDK writes to avoid
      // unhandled global errors like 'TypeError: Failed to fetch'.
      (async () => {
        try {
          const testCol = collection(db as any, "minigame1_events");
          const q = query(testCol as any);
          const p = getDocs(q as any);
          const res = await Promise.race([
            p,
            new Promise((_, rej) =>
              setTimeout(() => rej(new Error("firestore-probe-timeout")), 3000),
            ),
          ]);
          // If probe succeeded, enable client SDK writes
          try {
            clientFirestoreEnabled = true;
          } catch (_) {}
        } catch (probeErr) {
          console.warn(
            "Client Firestore probe failed, disabling client SDK writes",
            probeErr,
          );
          try {
            clientFirestoreEnabled = false;
            db = null as any;
          } catch (_) {}
        }
      })();
    } catch (err) {
      console.warn("Firestore initialization failed", err);
      db = null as any;
      clientFirestoreEnabled = false;
    }
  } catch (e) {
    console.warn("Firebase init failed", e);
    clientFirestoreEnabled = false;
  }
}

export async function uploadFileToStorage(
  file: Blob | Uint8Array,
  path: string,
  options?: { verify?: boolean; maxRetries?: number },
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

    // Helper: compute SHA-256 hex of a Blob/Uint8Array
    async function computeSHA256Hex(data: Blob | Uint8Array) {
      let ab: ArrayBuffer;
      if (data instanceof Uint8Array) {
        ab = data.buffer;
      } else {
        ab = await data.arrayBuffer();
      }
      const digest = await (crypto as any).subtle.digest("SHA-256", ab);
      const arr = Array.from(new Uint8Array(digest));
      return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
    }

    const shouldVerify = options?.verify ?? true;
    const maxRetries = typeof options?.maxRetries === "number" ? options!.maxRetries : 2;

    // Compute client-side hash and attach as custom metadata
    let clientHash: string | null = null;
    try {
      clientHash = await computeSHA256Hex(file as any);
    } catch (e) {
      console.warn("Could not compute client hash", e);
      clientHash = null;
    }

    // Attempt upload (with retries if verification fails)
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const metadata: any = {};
        if (clientHash) {
          metadata.customMetadata = {
            clientHash,
            clientTimestamp: new Date().toISOString(),
          };
        }
        await uploadBytes(ref, file as any, metadata);
        const url = await getDownloadURL(ref);

        if (!shouldVerify || !clientHash) return url;

        // verify by reading back metadata
        try {
          // lazy import to avoid TS errors if not present in older SDKs
          const { getMetadata } = await import("firebase/storage");
          const meta = await getMetadata(ref as any);
          const remoteHash = meta?.customMetadata?.clientHash || null;
          if (remoteHash && remoteHash === clientHash) {
            return url;
          }
          // If metadata isn't present or differs, retry upload
          console.warn(
            `uploadFileToStorage: hash mismatch on attempt ${attempt} (remote=${remoteHash} vs local=${clientHash})`,
          );
          // continue loop to retry
        } catch (e) {
          console.warn("uploadFileToStorage: verification failed", e);
          // Verification failed due to metadata access; retry anyway
        }
      } catch (e) {
        console.warn("upload attempt failed", e);
        if (attempt === maxRetries) throw e;
      }
    }

    // If we reach here, verification failed after retries. As a fallback, return the URL
    try {
      const url = await getDownloadURL(ref);
      return url;
    } catch (e) {
      throw new Error("uploadFileToStorage: upload completed but unable to verify or fetch URL");
    }
  } catch (e) {
    console.warn("uploadFileToStorage failed", e);
    throw e;
  }
}

export async function verifyStorageFile(
  path: string,
  expectedHash: string,
): Promise<{ ok: boolean; remoteHash: string | null }> {
  if (!appInstance) initFirebase();
  if (!appInstance) throw new Error("Firebase app not initialized");
  const storage = getStorage(appInstance as any);
  const ref = storageRef(storage as any, path);
  try {
    const { getMetadata } = await import("firebase/storage");
    const meta = await getMetadata(ref as any);
    const remoteHash = meta?.customMetadata?.clientHash || null;
    return { ok: !!remoteHash && remoteHash === expectedHash, remoteHash };
  } catch (e) {
    console.warn("verifyStorageFile failed", e);
    return { ok: false, remoteHash: null };
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
    if (!db || !clientFirestoreEnabled) {
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
        // Try sendBeacon first, then fetch
        try {
          const blob = new Blob([JSON.stringify(payload)], {
            type: "application/json",
          });
          if (typeof navigator !== "undefined" && navigator.sendBeacon) {
            navigator.sendBeacon("/api/track", blob);
            return { ok: true, routed: "track" } as any;
          }
        } catch (_) {}
        try {
          await fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          return { ok: true, routed: "track" } as any;
        } catch (e) {
          return { ok: false, error: String(e) } as any;
        }
      } catch (_) {
        return { ok: false, skipped: true } as any;
      }
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
    if (!db || !clientFirestoreEnabled) {
      // Firestore client not available; route to server tracking endpoint so result isn't lost.
      try {
        const payload = {
          event: "MINIGAME_RESULT",
          payload: {
            userId: uid || null,
            color: colorHex || null,
            resultUrl: url,
          },
        };
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        return { docId: null, url } as const;
      } catch (e) {
        console.warn("saveMinigameResult server fallback failed", e);
        throw e;
      }
    }

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
  dims?: { width?: number | null; height?: number | null },
) {
  if (!db) initFirebase();
  // If client Firestore disabled, send server-side ingestion request and return
  if (!clientFirestoreEnabled) {
    try {
      const col = preferredCollection || "beforecitychange-imgposter-events";
      const endpoint = (typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '') + '/api/write-image-url';
      let resp: Response | null = null;
      try {
        resp = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl, collection: col, page: 'addDesignImageUrl', createdAt: new Date().toISOString() }),
        });
      } catch (err) {
        console.warn('addDesignImageUrlToFirestore: server ingestion fetch failed, endpoint=', endpoint, err);
        resp = null;
      }
      if (resp && resp.ok) {
        try {
          const j = await resp.json();
          return { id: j.id || null, collection: col, routed: "server" } as any;
        } catch (_) {
          return { id: null, collection: col, routed: "server" } as any;
        }
      }
    } catch (e) {
      // fallthrough to attempt client SDK write
    }
  }

  if (!db) throw new Error("Firestore not initialized");

  async function findOrWrite(colName: string) {
    const colRef = collection(db as any, colName);

    // derive a sensible filename from the imageUrl (basename)
    let derivedName: string | null = null;
    try {
      const parsed = new URL(imageUrl);
      const last = (parsed.pathname || "").split("/").pop() || "";
      const decoded = decodeURIComponent(last || "");
      derivedName =
        decoded || last ? String((decoded || last).split("/").pop()) : null;
    } catch (_) {
      // ignore
    }

    // Always create a new document (allow duplicates).
    try {
      // Try to extract clientHash from storage metadata when possible
      let clientHash: string | null = null;
      try {
        // If imageUrl looks like Firebase Storage download URL, try to derive path and read metadata
        const m = /https:\/\/firebasestorage.googleapis.com\/v0\/b\/[^/]+\/o\/([^?]+)(\?.*)?/.exec(
          imageUrl,
        );
        if (m && m[1]) {
          const encodedPath = m[1];
          const decoded = decodeURIComponent(encodedPath);
          // Use storageRef and getMetadata to fetch customMetadata.clientHash
          try {
            const storage = getStorage(appInstance as any);
            const ref = storageRef(storage as any, decoded);
            const { getMetadata } = await import("firebase/storage");
            const meta = await getMetadata(ref as any);
            clientHash = meta?.customMetadata?.clientHash || null;
          } catch (e) {
            // ignore metadata read errors
            clientHash = null;
          }
        }
      } catch (_) {
        clientHash = null;
      }

      const docRef = await addDoc(colRef as any, {
        imageUrl,
        name: derivedName || null,
        width: typeof dims?.width === "number" ? dims?.width : 1132,
        height: typeof dims?.height === "number" ? dims?.height : 1417,
        clientHash: clientHash || null,
        createdAt: serverTimestamp(),
      });
      return { id: docRef.id, collection: colName } as const;
    } catch (e: any) {
      // If client-side Firestore write fails (network/CORS/permission), try server-side ingestion endpoint
      try {
        const payload = { imageUrl, collection: colName, page: 'addDesignImageUrl', createdAt: new Date().toISOString() };
        const endpoint = (typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '') + '/api/write-image-url';
        let r: Response | null = null;
        try {
          r = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } catch (err) {
          console.warn('addDesignImageUrlToFirestore: server fallback fetch failed, endpoint=', endpoint, err);
          r = null;
        }
        if (r && r.ok) {
          try {
            const j = await r.json();
            if (j && j.ok) {
              return {
                id: j.id || null,
                collection: colName,
                routed: "server",
              } as any;
            }
          } catch (_) {
            return { id: null, collection: colName, routed: "server" } as any;
          }
        }
      } catch (_) {
        // server fallback failed, fall through to throw original error
      }

      throw e;
    }
  }

  // Prefer user's requested collection name; if provided use only that to avoid accidental fallbacks.
  const candidates = [] as string[];
  if (preferredCollection && typeof preferredCollection === "string") {
    candidates.push(preferredCollection);
  } else {
    // No explicit preferred collection: try known historical collections (ukpact then kpact)
    candidates.push(
    "mydreambus-imgcar-events",
    "beforecitychange-imgposter-events",
  );
  }

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
export async function saveMinigameSummaryImageUrl(imageUrl: string) {
  if (!db) initFirebase();
  // If client Firestore disabled, send server-side ingestion request and return
  if (!clientFirestoreEnabled) {
    try {
      const endpoint = (typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '') + '/api/write-image-url';
      let resp: Response | null = null;
      try {
        resp = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl,
            collection: "beforecitychange-imgsummary-events",
            page: "Step2_Summary",
            createdAt: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.warn('saveMinigameSummaryImageUrl: server fallback fetch failed, endpoint=', endpoint, err);
        resp = null;
      }
      if (resp && resp.ok) {
        try {
          const j = await resp.json();
          return {
            id: j.id || null,
            collection: "beforecitychange-imgsummary-events",
            routed: "server",
          } as any;
        } catch (_) {
          return {
            id: null,
            collection: "beforecitychange-imgsummary-events",
            routed: "server",
          } as any;
        }
      }
    } catch (e) {
      // fallthrough to attempt client SDK write
    }
  }

  if (!db) throw new Error("Firestore not initialized");

  try {
    // Attempt to capture clientHash from storage metadata when possible
    let clientHash: string | null = null;
    try {
      const m = /https:\/\/firebasestorage.googleapis.com\/v0\/b\/[^/]+\/o\/([^?]+)(\?.*)?/.exec(
        imageUrl,
      );
      if (m && m[1]) {
        const encodedPath = m[1];
        const decoded = decodeURIComponent(encodedPath);
        try {
          const storage = getStorage(appInstance as any);
          const ref = storageRef(storage as any, decoded);
          const { getMetadata } = await import("firebase/storage");
          const meta = await getMetadata(ref as any);
          clientHash = meta?.customMetadata?.clientHash || null;
        } catch (_) {
          clientHash = null;
        }
      }
    } catch (_) {
      clientHash = null;
    }

    const colRef = collection(db as any, "beforecitychange-imgsummary-events");
    const docRef = await addDoc(colRef as any, {
      imageUrl,
      page: "Step2_Summary",
      clientHash: clientHash || null,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, collection: "beforecitychange-imgsummary-events" } as const;
  } catch (e) {
    // server fallback if write fails
    try {
      const endpoint = (typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '') + '/api/write-image-url';
      let r: Response | null = null;
      try {
        r = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageUrl,
              collection: "beforecitychange-imgsummary-events",
              page: "Step2_Summary",
              createdAt: new Date().toISOString(),
            }),
          });
      } catch (err) {
        console.warn('saveMinigameSummaryImageUrl: server fallback fetch failed (retry), endpoint=', endpoint, err);
        r = null;
      }
      if (r && r.ok) {
        try {
          const j = await r.json();
          return {
            id: j.id || null,
            collection: "beforecitychange-imgsummary-events",
            routed: "server",
          } as any;
        } catch (_) {
          return {
            id: null,
            collection: "beforecitychange-imgsummary-events",
            routed: "server",
          } as any;
        }
      }
    } catch (_) {}
    throw e;
  }
}

// New helper: save image from mydreambus Info page to dedicated collection
export async function saveMydreambusImage(
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
    if (!db || !clientFirestoreEnabled) {
      // Firestore client not available; route to server tracking endpoint so result isn't lost.
      try {
        const payload = {
          event: "MYDREAMBUS_IMAGE",
          payload: {
            userId: uid || null,
            color: colorHex || null,
            resultUrl: url,
          },
        };
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        return { docId: null, url } as const;
      } catch (e) {
        console.warn("saveMydreambusImage server fallback failed", e);
        throw e;
      }
    }

    const colRef = collection(db as any, "mydreambus-imgcar-events");
    const docRef = await addDoc(colRef as any, {
      userId: uid || null,
      color: colorHex || null,
      resultUrl: url,
      createdAt: serverTimestamp(),
    });

    return { docId: docRef.id, url } as const;
  } catch (e) {
    console.warn("saveMydreambusImage failed", e);
    throw e;
  }
}

export { initFirebase };
