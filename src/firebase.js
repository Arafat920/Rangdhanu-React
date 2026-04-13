import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVCcLo4Da0xB0iK7t9JvxqEOCbH9AoKGI",
  authDomain: "rangdhanu-live-6f592.firebaseapp.com",
  projectId: "rangdhanu-live-6f592",
  storageBucket: "rangdhanu-live-6f592.firebasestorage.app",
  messagingSenderId: "672536353348",
  appId: "1:672536353348:web:18d09dd5ffa5fa49cd3a11",
  measurementId: "G-PDJ5SMXFEJ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // ডাটাবেস এক্সপোর্ট করা হলো
