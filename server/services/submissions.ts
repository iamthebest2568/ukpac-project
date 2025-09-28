import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getDatabase,
  ref,
  get,
  query as rQuery,
  orderByChild,
  limitToLast,
} from "firebase/database";
import admin from "firebase-admin";
import {
  getApps as getFirebaseApps,
  getApp as getFirebaseApp,
  initializeApp,
} from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit as limitFn,
  getDocs,
} from "firebase/firestore";

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
      databaseURL:
        process.env.FIREBASE_DATABASE_URL ||
        "https://uk-pact-default-rtdb.asia-southeast1.firebasedatabase.app",
    } as any;
    let app;
    if (getFirebaseApps && getFirebaseApps().length > 0) app = getFirebaseApp();
    else app = initializeApp(firebaseConfig as any);
    db = getDatabase(app as any);
  } catch (e) {
    console.warn("Init Realtime DB failed", e);
    db = null;
  }
}

// Try Firestore first when Realtime DB isn't used
async function listPublicSubmissionsFromFirestore(limit = 20) {
  try {
    // Initialize admin SDK if service account provided
    if (!admin.apps || admin.apps.length === 0) {
      const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (svc) {
        try {
          const parsed = typeof svc === "string" ? JSON.parse(svc) : svc;
          admin.initializeApp({
            credential: admin.credential.cert(parsed as any),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
          } as any);
        } catch (e) {
          // ignore and fallback to client SDK below
        }
      }
    }

    let firestore: any = null;
    if (admin.apps && admin.apps.length > 0) {
      firestore = admin.firestore();
    } else {
      try {
        const firebaseConfig = {
          apiKey: process.env.FIREBASE_API_KEY || "",
          authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
          projectId: process.env.FIREBASE_PROJECT_ID || "",
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
          messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
          appId: process.env.FIREBASE_APP_ID || "",
        } as any;
        let app;
        if (getFirebaseApps && getFirebaseApps().length > 0)
          app = getFirebaseApp();
        else app = initializeApp(firebaseConfig as any);
        firestore = getFirestore(app as any);
      } catch (e) {
        console.warn("Firestore client init failed", e);
        firestore = null;
      }
    }

    if (!firestore) return [];

    // Try known collections written by client: prefer kpact-gamebus-imagedesign-events
    const candidates = [
      "kpact-gamebus-imagedesign-events",
      "ukpact-gamebus-imagedesign-events",
    ];
    for (const colName of candidates) {
      try {
        const colRef = collection(firestore as any, colName);
        const q = query(
          colRef as any,
          orderBy("createdAt", "desc"),
          limitFn(limit),
        );
        const snap = await getDocs(q as any);
        if (!snap || snap.empty) continue;
        const items: any[] = [];
        snap.forEach((d: any) => {
          const data = d.data() || {};
          items.push({
            id: d.id,
            chassis: data.chassis || null,
            seating: data.seating || data.design?.seating || null,
            amenities: data.amenities || data.amenities || null,
            paymentMethods: data.paymentMethods || data.payment || null,
            doorConfig: data.doorConfig || data.doors || null,
            exterior: data.exterior || data.design?.exterior || null,
            serviceInfo: data.serviceInfo || null,
            userEngagement: data.userEngagement || null,
            timestamp: data.timestamp || data.createdAt || null,
            imageUrl: data.imageUrl || data.image || null,
          });
        });
        return items.slice(0, limit);
      } catch (e) {
        // try next candidate
        continue;
      }
    }

    return [];
  } catch (e) {
    console.warn("Failed to list submissions from Firestore", e);
    return [];
  }
}

export async function listPublicSubmissions(limit = 20) {
  try {
    // If FIREBASE_DATABASE_URL is explicitly set to a real-time DB, prefer Realtime path
    const useRealtime = !!process.env.FIREBASE_DATABASE_URL;
    if (useRealtime) {
      initRealtime();
      if (db) {
        const r = ref(db, "submissions");
        const q = rQuery(r, limitToLast(limit as any));
        const snap = await get(q as any);
        const val = snap.val();
        if (!val) return [];
        const items: any[] = [];
        for (const k of Object.keys(val)) {
          const v = val[k];
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
        items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        return items.slice(0, limit);
      }
    }

    // Otherwise attempt to read from Firestore
    const fromFs = await listPublicSubmissionsFromFirestore(limit);
    if (Array.isArray(fromFs) && fromFs.length > 0) return fromFs;

    // Fallback: empty
    return [];
  } catch (e) {
    console.warn("Failed to list public submissions", e);
    return [];
  }
}
