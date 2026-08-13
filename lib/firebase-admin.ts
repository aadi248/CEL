import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function serviceAccount(): ServiceAccount | null {
  const encoded = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (encoded) {
    try {
      const raw = encoded.trim().startsWith("{")
        ? encoded
        : Buffer.from(encoded, "base64").toString("utf8");
      return JSON.parse(raw) as ServiceAccount;
    } catch {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY must be valid JSON or base64-encoded JSON.");
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) return null;
  return { projectId, clientEmail, privateKey };
}

export function hasFirebaseEnv() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      (process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
        (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY))
  );
}

export function firebaseDatabaseId() {
  return process.env.FIREBASE_DATABASE_ID?.trim() || "(default)";
}

export function explainFirebaseError(error: unknown): Error {
  const candidate = error as { code?: string | number; message?: string };
  if (candidate?.code === 5 || candidate?.code === "5" || candidate?.code === "not-found") {
    return new Error(
      `Firestore database "${firebaseDatabaseId()}" was not found in project "${process.env.FIREBASE_PROJECT_ID}". ` +
      "Create the database in Firebase Console → Build → Firestore Database, then restart the app."
    );
  }
  return error instanceof Error ? error : new Error("Firebase operation failed.");
}

let cached: Firestore | null = null;

export function firebaseDb() {
  if (cached) return cached;
  const credentials = serviceAccount();
  if (!credentials) throw new Error("Firebase Admin credentials are missing.");
  const app = getApps()[0] ?? initializeApp({
    credential: cert(credentials),
    projectId: process.env.FIREBASE_PROJECT_ID
  });
  cached = getFirestore(app, firebaseDatabaseId());
  return cached;
}
