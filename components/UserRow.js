import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QuantityControl from './QuantityControl';

// One row: name + lunch control + dinner control.
// The row itself doesn't know about saving — MainScreen owns that logic
// and passes down onLunchChange/onDinnerChange as local-state setters.
export default function UserRow({
  name,
  lunch,
  dinner,
  onLunchChange,
  onDinnerChange,
  lunchDisabled,
  dinnerDisabled,
  isCurrentUser,
}) {
  return (
    <View style={[styles.row, isCurrentUser && styles.currentUserRow]}>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      <QuantityControl
        value={lunch}
        onChange={onLunchChange}
        disabled={lunchDisabled || !isCurrentUser}
      />
      <QuantityControl
        value={dinner}
        onChange={onDinnerChange}
        disabled={dinnerDisabled || !isCurrentUser}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8DFD3',
  },
  currentUserRow: {
    backgroundColor: '#FFF3EC',
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#2D1B12',
    marginRight: 8,
  },
});
