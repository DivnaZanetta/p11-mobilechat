// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Peringatan', 'Nama, email, dan password wajib diisi.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Peringatan', 'Password minimal 6 karakter.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      const dummyAvatar = 'https://i.pravatar.cc/150?u=' + userId;

      // Set display name
      await updateProfile(userCredential.user, { displayName: name });

      // Simpan data user di Firestore
      await setDoc(doc(db, 'users', userId), {
        uid: userId,
        name,
        email,
        photoURL: dummyAvatar,
        isOnline: true,
        createdAt: serverTimestamp(),
      });

      // Alert sukses saja, jangan navigate ke Login
      Alert.alert('Berhasil', 'Akun berhasil dibuat.');
    } catch (error) {
      Alert.alert('Register gagal', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Buat Akun</Text>
      <TextInput
        placeholder="Nama"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 14, marginBottom: 12 },
  button: { backgroundColor: '#2563eb', padding: 14, borderRadius: 10, marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});