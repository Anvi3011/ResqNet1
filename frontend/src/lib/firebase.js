import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app;
let auth;
let db;

try {
  // Only initialize if a real API key is provided
  if (firebaseConfig.apiKey && firebaseConfig.apiKey.startsWith("AIza")) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("✅ Firebase initialized successfully");
  } else {
    console.warn("⚠️ Firebase API Key is missing or invalid. Authentication features are disabled.");
    // Provide dummy objects to prevent crashes elsewhere
    auth = { onAuthStateChanged: (cb) => cb(null) };
    db = {};
  }
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
  auth = { onAuthStateChanged: (cb) => cb(null) };
  db = {};
}

export { auth, db };