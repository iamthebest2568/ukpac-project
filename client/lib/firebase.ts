// Client-side Firebase initialization (modular SDK)
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

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

function initFirebase() {
  if (db) return;
  try {
    // In case code runs in SSR or before window exists, guard
    if (typeof window === "undefined") return;
    let app;
    if (getApps && getApps().length > 0) {
      app = getApp();
    } else {
      app = initializeApp(firebaseConfig);
    }
    db = getFirestore(app);
  } catch (e) {
    console.warn("Firebase init failed", e);
  }
}

export async function sendEventToFirestore(
  event: any,
  collectionName: string = "minigame1_events",
) {
  if (!db) initFirebase();
  if (!db) throw new Error("Firestore not initialized");
  const col = collection(db, collectionName);
  // write enriched event; add server timestamp
  try {
    return await addDoc(col, { ...event, createdAt: serverTimestamp() });
  } catch (e: any) {
    const code = e?.code || e?.status || 'unknown';
    const message = e?.message || String(e);
    const err = new Error(`[${code}] ${message}`);
    try { (err as any).original = e; } catch (_) {}
    throw err;
  }
}

// also export init for manual init from UI
export { initFirebase };
