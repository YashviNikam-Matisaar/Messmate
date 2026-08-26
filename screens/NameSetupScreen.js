import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getUsers } from '../services/api';
import { saveName, saveUserId } from '../utils/storage';

// Shown only on first launch. Validates the typed name against the
// predefined list from the backend — doesn't let just anyone in.
export default function NameSetupScreen({ onComplete }) {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) => Alert.alert('Error', 'Could not load user list: ' + err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleContinue = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Enter your name', 'Please type your name to continue.');
      return;
    }

    const match = users.find((u) => u.name.toLowerCase() === trimmed.toLowerCase());
    if (!match) {
      Alert.alert(
        'Name not found',
        'That name isn\'t on the team list. Please check the spelling and try again.'
      );
      return;
    }

    setSubmitting(true);
    await saveName(match.name);
    await saveUserId(match.id);
    setSubmitting(false);
    onComplete(match.name, match.id);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What's your name?</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        autoFocus
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleContinue}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0EB',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  center: {
    flex: 1,
    backgroundColor: '#F5F0EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D1B12',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E8DFD3',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
