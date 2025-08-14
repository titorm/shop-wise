
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, indexedDBLocalPersistence, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "shopwise-a0041",
  "appId": "1:768312687397:web:8236b4c80f63be68a5b8cc",
  "storageBucket": "shopwise-a0041.firebasestorage.app",
  "apiKey": "AIzaSyBezn5Yx-ERcqS4ND2eKRwi1fXAYwpmpuU",
  "authDomain": "shopwise-a0041.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "768312687397"
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
  getAnalytics(app);
  getPerformance(app);
}


export { app, auth, db, googleProvider };
