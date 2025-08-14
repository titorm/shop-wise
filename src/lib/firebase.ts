
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, indexedDBLocalPersistence, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOrtHuzAVLNTDpzT1cjjfbQiUW1sfPTE8",
  authDomain: "shopwise-90uxt.firebaseapp.com",
  projectId: "shopwise-90uxt",
  storageBucket: "shopwise-90uxt.firebasestorage.app",
  messagingSenderId: "995876205002",
  appId: "1:995876205002:web:d2ed7ef1984360e3579f33"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/*
// Initialize App Check
if (typeof window !== 'undefined') {
  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('YOUR_RECAPTCHA_V3_SITE_KEY'), // TODO: Replace with your site key
    isTokenAutoRefreshEnabled: true
  });
}
*/


const auth = initializeAuth(app, {
  persistence: indexedDBLocalPersistence
});

const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };

