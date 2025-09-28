import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getDatabase,
  ref,
  get,
  query,
  orderByChild,
  limitToLast,
} from "firebase/database";

let db: ReturnType<typeof getDatabase> | null = null;
function initRealtime() {
  if (db) return;
  try {
    const firebaseConfig = {
      apiKey:
        process.env.FIREBASE_API_KEY ||
        "AIzaSyBdMPQP9DVM1S9bh70dFuMAsyzPJPOYXnk",
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || "uk-pact.firebaseapp.com",
      projectId: process.env.FIREBASE_PROJECT_ID || "uk-pact",
      storageBucket:
        process.env.FIREBASE_STORAGE_BUCKET || "uk-pact.firebasestorage.app",
      messagingSenderId:
        process.env.FIREBASE_MESSAGING_SENDER_ID || "534142958499",
      appId:
        process.env.FIREBASE_APP_ID ||
        "1:534142958499:web:3cf0b2380c055f7a747816",
      databaseURL: process.env.FIREBASE_DATABASE_URL || "https://uk-pact-default-rtdb.asia-southeast1.firebasedatabase.app",
    } as any;
    let app;
    if (getApps && getApps().length > 0) app = getApp();
    else app = initializeApp(firebaseConfig as any);
    db = getDatabase(app as any);
  } catch (e) {
    console.warn("Init Realtime DB failed", e);
    db = null;
  }
}

export async function listPublicSubmissions(limit = 20) {
  try {
    initRealtime();
    if (!db) return [];
    const r = ref(db, "submissions");
    // read last N
    const q = query(r, limitToLast(limit as any));
    const snap = await get(q as any);
    const val = snap.val();
    if (!val) return [];
    const items: any[] = [];
    for (const k of Object.keys(val)) {
      const v = val[k];
      // sanitize
      const out: any = {
        id: k,
        chassis: v.chassis || null,
        seating: v.seating || null,
        amenities: v.amenities || null,
        paymentMethods: v.paymentMethods || null,
        doorConfig: v.doorConfig || null,
        exterior: v.exterior || null,
        serviceInfo: v.serviceInfo || null,
        userEngagement: v.userEngagement || null,
        timestamp: v.timestamp || null,
        imageUrl: v.imageUrl || null,
      };
      items.push(out);
    }
    // return order by timestamp desc
    items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    return items.slice(0, limit);
  } catch (e) {
    console.warn("Failed to list public submissions", e);
    return [];
  }
}
