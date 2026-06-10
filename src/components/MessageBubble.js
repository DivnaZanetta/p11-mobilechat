import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MessageBubble({ item, isMyMessage }) {
  return (
    <View
      style={[
        styles.bubble,
        isMyMessage ? styles.myBubble : styles.otherBubble,
      ]}
    >
      {!isMyMessage && (
        <Text style={styles.senderName}>{item.senderName}</Text>
      )}

      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 14,
    marginVertical: 5,
  },
  myBubble: {
    backgroundColor: '#dbeafe',
    alignSelf: 'flex-end',
  },
  otherBubble: {
    backgroundColor: '#e5e7eb',
    alignSelf: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
  },
});