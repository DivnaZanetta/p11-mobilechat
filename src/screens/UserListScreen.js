// src/screens/UserListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, StyleSheet, Image, Alert } from 'react-native';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { signOut } from 'firebase/auth';

export default function UserListScreen({ navigation }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      setUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Logout gagal', error.message);
    }
  };

  const renderUser = ({ item }) => {
    const isMe = item.uid === auth.currentUser?.uid;
    return (
      <View style={styles.userItem}>
        <Image source={{ uri: item.photoURL }} style={styles.avatar} />
        <View>
          <Text style={styles.userName}>{item.name || item.email} {isMe ? '(Saya)' : ''}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Daftar Pengguna</Text>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <FlatList data={users} keyExtractor={item => item.id} renderItem={renderUser} />
      <TouchableOpacity style={styles.chatBtn} onPress={() => navigation.navigate('Chat')}>
        <Text style={styles.chatText}>Masuk ke Chat Room</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 12 },
  logoutBtn: { backgroundColor: '#ef4444', padding: 8, borderRadius: 8, marginBottom: 12 },
  logoutText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  chatBtn: { backgroundColor: '#2563eb', padding: 14, borderRadius: 10, marginTop: 12 },
  chatText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  userItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, marginBottom: 10 },
  userName: { fontWeight: 'bold', fontSize: 16 },
  userEmail: { color: '#666', marginTop: 4 },
  avatar: { width: 45, height: 45, borderRadius: 22.5, marginRight: 12 },
});