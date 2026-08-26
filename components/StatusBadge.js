import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatusBadge({ status }) {
  const isOpen = status === 'OPEN';
  return (
    <View style={[styles.badge, isOpen ? styles.open : styles.closed]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  open: {
    backgroundColor: '#4CAF50',
  },
  closed: {
    backgroundColor: '#f44336',
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});
