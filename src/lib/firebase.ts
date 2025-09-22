// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration (provided by user)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApJ4Ublk1YtLVzRFwjYdAGA_Zop8Ccyy8",
  authDomain: "muftee-cebc7.firebaseapp.com",
  projectId: "muftee-cebc7",
  storageBucket: "muftee-cebc7.firebasestorage.app",
  messagingSenderId: "1080980425234",
  appId: "1:1080980425234:web:74efa5c673132621b0e6cb",
  measurementId: "G-MKK7HKNNYV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// If you need backward compatibility:
export const _analytics = analytics;
