// src/firebase/useMessages.js

import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  enableNetwork,
  disableNetwork,
} from 'firebase/firestore';

import { db } from './config';

// Custom hook untuk real-time messages
export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'asc')
    );

    // Mulai mendengarkan perubahan
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMessages(msgs);
        setLoading(false);
      },
      (error) => {
        console.error('Listener error:', error);
        setLoading(false);
      }
    );

    // PENTING: hentikan listener saat komponen unmount
    return () => unsubscribe();
  }, []);

  return { messages, loading };
};

// Matikan koneksi Firestore secara manual
export const turnOffFirestoreNetwork = async () => {
  await disableNetwork(db);
};

// Aktifkan kembali koneksi Firestore
export const turnOnFirestoreNetwork = async () => {
  await enableNetwork(db);
};