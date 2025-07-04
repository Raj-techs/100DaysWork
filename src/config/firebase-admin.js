import { cert, initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let db = null;

if (!getApps().length) {
  const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountStr) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY environment variable");
  }

  const serviceAccount = JSON.parse(serviceAccountStr);

  initializeApp({
    credential: cert(serviceAccount),
  });
}

db = getFirestore();

export { db };
