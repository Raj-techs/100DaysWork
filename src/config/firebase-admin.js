import { cert, initializeApp as initializeAdminApp } from "firebase-admin/app";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!initializeAdminApp().apps.length) {
  initializeAdminApp({
    credential: cert(serviceAccount)
  });
}

export const db = getAdminFirestore();