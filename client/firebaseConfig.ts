// Firebase config (placeholder values). Replace with real project keys.
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  databaseURL: "https://REPLACE_WITH_PROJECT_ID.firebaseio.com",
  projectId: "REPLACE_WITH_PROJECT_ID",
  storageBucket: "REPLACE_WITH_PROJECT_ID.appspot.com",
  messagingSenderId: "REPLACE_WITH_SENDER_ID",
  appId: "REPLACE_WITH_APP_ID",
};

// Only initialize here if the template values have been replaced.
let app = null;
let database = null;
try {
  const shouldInit =
    typeof firebaseConfig.projectId === "string" &&
    !firebaseConfig.projectId.includes("REPLACE_WITH");
  if (shouldInit) {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
  }
} catch (e) {
  // swallow — other module (client/lib/firebase.ts) will init properly
}

export { database };
export default app;
