import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  projectId: "stoic-af",
  appId: "1:86800269179:web:8ea1e241b951c535e187de",
  storageBucket: "stoic-af.firebasestorage.app",
  apiKey: "AIzaSyDnfzl9ed_kg8F-OUegiheehEXHGiapdUo",
  authDomain: "stoic-af.firebaseapp.com",
  messagingSenderId: "86800269179",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a time.
      console.warn('Firestore offline persistence failed: failed-precondition. Multiple tabs open?');
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      console.warn('Firestore offline persistence failed: unimplemented. Browser not supported.');
    }
  });


export { app, db };
