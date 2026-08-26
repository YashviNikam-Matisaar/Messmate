import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// One automated message, styled like a system chat bubble.
// Read-only — no reply/interaction, just displays content + time.
export default function ChatBubble({ content, createdAt, mealType }) {
  const time = new Date(createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.bubble}>
      <Text style={styles.content}>{content}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: '#FFF3EC',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: '#FFD9C2',
  },
  content: {
    fontSize: 14,
    color: '#2D1B12',
    lineHeight: 20,
  },
  time: {
    fontSize: 11,
    color: '#9C8F80',
    marginTop: 6,
    textAlign: 'right',
  },
});
