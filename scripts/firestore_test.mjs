import adminPkg from "firebase-admin";
const admin = adminPkg;

try {
  const saRaw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!saRaw) throw new Error("FIREBASE_SERVICE_ACCOUNT env var not set");
  let sa;
  try {
    sa = JSON.parse(saRaw);
  } catch (e) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is not valid JSON");
  }

  admin.initializeApp({
    credential: admin.credential.cert(sa),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });

  const db = admin.firestore();

  const payload = {
    name: "test-upload.png",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/" +
      (process.env.FIREBASE_STORAGE_BUCKET || "uk-pact.firebasestorage.app") +
      "/o/test-upload.png?alt=media",
    width: 1132,
    height: 1417,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const col = "beforecitychange-imgposter-events";
  const docRef = await db.collection(col).add(payload);
  console.log("Wrote doc id:", docRef.id);

  const snap = await docRef.get();
  console.log("Written doc data:", snap.data());
  process.exit(0);
} catch (e) {
  console.error("Error", e);
  process.exit(1);
}
