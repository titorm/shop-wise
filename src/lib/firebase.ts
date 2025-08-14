// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, indexedDBLocalPersistence, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOrtHuzAVLNTDpzT1cjjfbQiUW1sfPTE8",
  authDomain: "shopwise-90uxt.firebaseapp.com",
  projectId: "shopwise-90uxt",
  storageBucket: "shopwise-90uxt.firebasestorage.app",
  messagingSenderId: "995876205002",
  appId: "1:995876205002:web:d2ed7ef1984360e3579f33",
  measurementId: "G-KFXNRR3QJL"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = initializeAuth(app, {
  persistence: indexedDBLocalPersistence
});
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Analytics and Performance Monitoring on the client side
if (typeof window !== 'undefined') {
  if (firebaseConfig.measurementId) {
    getAnalytics(app);
  }
  getPerformance(app);
}


export { app, auth, db, googleProvider };
