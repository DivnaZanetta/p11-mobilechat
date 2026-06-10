// src/utils/notifications.js

import * as Notifications from 'expo-notifications';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

// Konfigurasi tampilan notifikasi
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Minta izin & dapatkan token
export const registerForPushNotifications = async () => {
  // Cek izin saat ini
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  // Minta izin jika belum diberikan
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Notifikasi tidak diizinkan oleh pengguna');
    return null;
  }

  // Dapatkan Expo Push Token
  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: 'your-expo-project-id',
  });

  // Simpan token ke Firestore
  if (auth.currentUser) {
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      pushToken: tokenData.data,
    });
  }

  return tokenData.data;
};

// Kirim notifikasi via Expo Push API
export const sendPushNotification = async (expoPushToken, title, body) => {
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data: {
        withSome: 'data',
      },
    }),
  });
};