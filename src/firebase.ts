import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAjFTWTiL34bfH0t7AjKQgVHUpegrQWdP0",
  authDomain: "language-learning-dashboard.firebaseapp.com",
  projectId: "language-learning-dashboard",
  storageBucket: "language-learning-dashboard.firebasestorage.app",
  messagingSenderId: "221257407258",
  appId: "1:221257407258:web:c4926bc8d11fba03542aa3",
  measurementId: "G-YW13FK7VHE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export default app;
