import { collection, addDoc, doc, getDocs, getDoc, updateDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

// Tambah tugas baru
export const addTask = async (title) => {
  const docRef = await addDoc(collection(db, 'tasks'), {
    title,
    completed: false,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// Tampilkan semua tugas realtime
export const subscribeTasks = (callback) => {
  const unsubscribe = onSnapshot(collection(db, 'tasks'), (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(tasks);
  });
  return unsubscribe;
};

// Update status selesai
export const toggleTaskCompleted = async (taskId, completed) => {
  await updateDoc(doc(db, 'tasks', taskId), { completed });
};

// Hapus tugas
export const deleteTask = async (taskId) => {
  await deleteDoc(doc(db, 'tasks', taskId));
};