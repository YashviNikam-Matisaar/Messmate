import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import QuantityControl from './QuantityControl';

export default function UserRow({
  name,
  lunch,
  dinner,
  onLunchChange,
  onDinnerChange,
  lunchDisabled,
  dinnerDisabled,
  isCurrentUser,
  isSelected,
  onPress,
  lunchLeave,
  dinnerLeave,
  isAdmin,
  onToggleLunchLeave,
  onToggleDinnerLeave,
}) {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={[
        styles.row,
        isCurrentUser && styles.currentUserRow,
        isSelected && styles.selectedRow,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.6 : 1}
    >
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>

      <View style={styles.mealCol}>
        {isAdmin && (
          <Switch
            value={!!lunchLeave}
            onValueChange={(val) => onToggleLunchLeave?.(val)}
            trackColor={{ false: '#E8DFD3', true: '#FF6B35' }}
            style={styles.tinySwitch}
          />
        )}
        <QuantityControl
          value={lunch}
          onChange={onLunchChange}
          disabled={lunchLeave || lunchDisabled || !isCurrentUser}
        />
      </View>

      <View style={styles.mealCol}>
        {isAdmin && (
          <Switch
            value={!!dinnerLeave}
            onValueChange={(val) => onToggleDinnerLeave?.(val)}
            trackColor={{ false: '#E8DFD3', true: '#FF6B35' }}
            style={styles.tinySwitch}
          />
        )}
        <QuantityControl
          value={dinner}
          onChange={onDinnerChange}
          disabled={dinnerLeave || dinnerDisabled || !isCurrentUser}
        />
      </View>
    </Wrapper>
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
  selectedRow: {
    backgroundColor: '#FFD9C2',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#2D1B12',
    marginRight: 8,
  },
  mealCol: {
    alignItems: 'center',
  },
  tinySwitch: {
    transform: [{ scale: 0.7 }],
    marginBottom: 2,
  },
}); 
