import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import ChatBubble from '../components/ChatBubble';
import { getMessages } from '../services/api';

// Read-only feed of the last 7 days of automated breakdown messages.
// New messages appear at the bottom, like a chat log.
export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const listRef = useRef(null);

  const loadMessages = useCallback(async () => {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 60000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  if (messages.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No messages yet. Check back after cutoff time.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatBubble
            content={item.content}
            createdAt={item.created_at}
            mealType={item.meal_type}
          />
        )}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0EB',
  },
  center: {
    flex: 1,
    backgroundColor: '#F5F0EB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 14,
    color: '#9C8F80',
    textAlign: 'center',
  },
});
