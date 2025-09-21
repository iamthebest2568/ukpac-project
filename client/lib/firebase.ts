// Client-side Firebase initialization (modular SDK)
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

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
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  // don't initialize analytics on server/environment where window may be undefined
} catch (e) {
  console.warn("Firebase init failed", e);
}

export async function sendEventToFirestore(event: any) {
  if (!db) throw new Error('Firestore not initialized');
  const col = collection(db, "ukpack2_events");
  // write enriched event; add server timestamp
  return addDoc(col, { ...event, createdAt: serverTimestamp() });
}
