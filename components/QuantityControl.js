import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Reusable −  0  + widget. Controlled component: parent owns the value,
// this just renders it and calls onChange with the new number.
export default function QuantityControl({ value, onChange, disabled }) {
  const decrease = () => {
    if (disabled) return;
    if (value > 0) onChange(value - 1);
  };

  const increase = () => {
    if (disabled) return;
    onChange(value + 1);
  };

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <TouchableOpacity
        style={styles.button}
        onPress={decrease}
        disabled={disabled || value === 0}
      >
        <Text style={styles.buttonText}>−</Text>
      </TouchableOpacity>

      <Text style={styles.value}>{value}</Text>

      <TouchableOpacity style={styles.button} onPress={increase} disabled={disabled}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F0EB',
    borderRadius: 8,
    paddingHorizontal: 4,
    width: 90,
  },
  disabled: {
    opacity: 0.5,
  },
  button: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 20,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D1B12',
    minWidth: 20,
    textAlign: 'center',
  },
});
