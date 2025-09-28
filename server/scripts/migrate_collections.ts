#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import admin from 'firebase-admin';

async function main() {
  const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!svc) {
    console.error('FIREBASE_SERVICE_ACCOUNT env required');
    process.exit(1);
  }
  const parsed = typeof svc === 'string' ? JSON.parse(svc) : svc;
  if (!admin.apps || admin.apps.length === 0) admin.initializeApp({ credential: admin.credential.cert(parsed as any), storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined } as any);
  const db = admin.firestore();

  const args = process.argv.slice(2);
  const fromArg = args.find(a => a.startsWith('--from=')) || '--from=minigame1_events/minigame1-di';
  const toArg = args.find(a => a.startsWith('--to=')) || '--to=beforecitychange_events/beforecitychange-di';
  const from = fromArg.split('=')[1];
  const to = toArg.split('=')[1];

  const [fromCol, fromDoc] = from.split('/').filter(Boolean);
  const [toCol, toDoc] = to.split('/').filter(Boolean);
  if (!fromCol || !fromDoc || !toCol || !toDoc) {
    console.error('Invalid from/to format. Use --from=collection/doc --to=collection/doc');
    process.exit(1);
  }

  console.log(`Migrating from ${fromCol}/${fromDoc}/events -> ${toCol}/${toDoc}/events`);

  const srcDocRef = db.collection(fromCol).doc(fromDoc);
  const srcEventsCol = srcDocRef.collection('events');
  const snap = await srcEventsCol.get();
  console.log(`Found ${snap.size} documents to migrate`);
  let migrated = 0;
  for (const doc of snap.docs) {
    try {
      const data = doc.data();
      // Remove metadata that might conflict
      const toDocRef = db.collection(toCol).doc(toDoc).collection('events').doc();
      await toDocRef.set(data);
      migrated++;
    } catch (e) {
      console.warn('Failed to migrate doc', doc.id, e);
    }
  }

  console.log(`Migrated ${migrated} documents`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
