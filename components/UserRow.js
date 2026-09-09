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
  onLeave,
  isAdmin,
  onToggleLeave,
}) {
  const Wrapper = onPress ? TouchableOpacity : View;
  const locked = onLeave;

  return (
    <Wrapper
      style={[
        styles.row,
        isCurrentUser && styles.currentUserRow,
        isSelected && styles.selectedRow,
        locked && styles.leaveRow,
      ]}
      onPress={locked ? undefined : onPress}
      activeOpacity={onPress ? 0.6 : 1}
    >
      <View style={styles.nameCol}>
        <Text style={[styles.name, locked && styles.nameLocked]} numberOfLines={1}>
          {name}
        </Text>
        {isAdmin && (
          <View style={styles.leaveRowInline}>
            <Text style={styles.leaveLabel}>On leave</Text>
            <Switch
              value={!!onLeave}
              onValueChange={(val) => onToggleLeave?.(val)}
              trackColor={{ false: '#E8DFD3', true: '#FF6B35' }}
            />
          </View>
        )}
      </View>
      <QuantityControl
        value={lunch}
        onChange={onLunchChange}
        disabled={locked || lunchDisabled || !isCurrentUser}
      />
      <QuantityControl
        value={dinner}
        onChange={onDinnerChange}
        disabled={locked || dinnerDisabled || !isCurrentUser}
      />
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
  leaveRow: {
    backgroundColor: '#F0F0F0',
    opacity: 0.7,
  },
  nameCol: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2D1B12',
  },
  nameLocked: {
    color: '#9C8F80',
    fontStyle: 'italic',
  },
  leaveRowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  leaveLabel: {
    fontSize: 11,
    color: '#9C8F80',
  },
});
