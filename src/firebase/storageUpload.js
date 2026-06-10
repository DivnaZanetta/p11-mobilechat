// src/firebase/storageUpload.js

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

import * as ImagePicker from 'expo-image-picker';
import { storage } from './config';

// Fungsi upload foto profil dengan progress
export const uploadProfilePhoto = async (userId) => {
  // 1. Minta izin akses galeri
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    alert('Izin akses galeri diperlukan!');
    return null;
  }

  // 2. Buka image picker
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) return null;

  // 3. Konversi URI ke Blob
  const response = await fetch(result.assets[0].uri);
  const blob = await response.blob();

  // 4. Upload dengan progress tracking
  const storageRef = ref(storage, `profiles/${userId}/photo.jpg`);
  const uploadTask = uploadBytesResumable(storageRef, blob);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        console.log('Upload progress:', progress + '%');
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};