import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDVdwGgTkZF1qGyk3PrhWr9cXFjK0p83aE",
  authDomain: "mobilechat-ce4d9.firebaseapp.com",
  projectId: "mobilechat-ce4d9",
  storageBucket: "mobilechat-ce4d9.firebasestorage.app",
  messagingSenderId: "385669810481",
  appId: "1:385669810481:web:bf210fd4d1aa84f8b80810",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;