import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import UserRow from '../components/UserRow';
import StatusBadge from '../components/StatusBadge';
import SaveButton from '../components/SaveButton';
import { getAllPreferences, savePreference, setLeaveStatus } from '../services/api';

const today = () => new Date().toISOString().split('T')[0];

export default function MainScreen({ currentUserName, currentUserId, isAdmin }) {
  const [date] = useState(today());
  const [preferences, setPreferences] = useState([]);
  const [status, setStatus] = useState({ lunch: 'CLOSED', dinner: 'CLOSED' });
  const [totals, setTotals] = useState({ lunch: 0, dinner: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingLunch, setSavingLunch] = useState(false);
  const [savingDinner, setSavingDinner] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState(currentUserId);
  const [selectedLunch, setSelectedLunch] = useState(0);
  const [selectedDinner, setSelectedDinner] = useState(0);

  const loadData = useCallback(async () => {
    try {
      const data = await getAllPreferences(date);
      setPreferences(data.preferences);
      setStatus(data.status);
      setTotals(data.totals);

      const activeId = selectedUserId || currentUserId;
      const active = data.preferences.find((p) => p.user_id === activeId);
      if (active) {
        setSelectedLunch(active.lunch);
        setSelectedDinner(active.dinner);
      }
    } catch (err) {
      Alert.alert('Error', 'Could not load data: ' + err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [date, currentUserId, selectedUserId]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleSelectRow = (userId) => {
    if (!isAdmin) return;
    setSelectedUserId(userId);
    const row = preferences.find((p) => p.user_id === userId);
    if (row) {
      setSelectedLunch(row.lunch);
      setSelectedDinner(row.dinner);
    }
  };

  const handleToggleLunchLeave = async (userId, value) => {
    try {
      await setLeaveStatus(userId, { lunch_leave: value });
      await loadData();
    } catch (err) {
      Alert.alert('Could not update lunch leave status', err.message);
    }
  };

  const handleToggleDinnerLeave = async (userId, value) => {
    try {
      await setLeaveStatus(userId, { dinner_leave: value });
      await loadData();
    } catch (err) {
      Alert.alert('Could not update dinner leave status', err.message);
    }
  };

  const handleSaveLunch = async () => {
    setSavingLunch(true);
    try {
      await savePreference({
        user_id: selectedUserId || currentUserId,
        date,
        meal_type: 'lunch',
        quantity: selectedLunch,
      });
      await loadData();
    } catch (err) {
      Alert.alert('Could not save lunch', err.message);
    } finally {
      setSavingLunch(false);
    }
  };

  const handleSaveDinner = async () => {
    setSavingDinner(true);
    try {
      await savePreference({
        user_id: selectedUserId || currentUserId,
        date,
        meal_type: 'dinner',
        quantity: selectedDinner,
      });
      await loadData();
    } catch (err) {
      Alert.alert('Could not save dinner', err.message);
    } finally {
      setSavingDinner(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  const activeId = selectedUserId || currentUserId;
  const activeRow = preferences.find((p) => p.user_id === activeId);
  const activeName = activeRow?.name || currentUserName;
  const activeLunchLocked = !!activeRow?.lunch_leave;
  const activeDinnerLocked = !!activeRow?.dinner_leave;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MessMate</Text>
        <Text style={styles.cutoffInfo}>
          Lunch closes 10:00 PM (prev night) · Dinner closes 5:30 PM
        </Text>
        <View style={styles.badgeRow}>
          <View style={styles.badgeGroup}>
            <Text style={styles.badgeLabel}>Lunch</Text>
            <StatusBadge status={status.lunch} />
          </View>
          <View style={styles.badgeGroup}>
            <Text style={styles.badgeLabel}>Dinner</Text>
            <StatusBadge status={status.dinner} />
          </View>
        </View>
        {isAdmin && (
          <Text style={styles.adminHint}>
            Admin — editing: {activeName}
            {activeId === currentUserId ? ' (you)' : ''}
          </Text>
        )}
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Name</Text>
        <Text style={styles.tableHeaderText}>Lunch</Text>
        <Text style={styles.tableHeaderText}>Dinner</Text>
      </View>

      <FlatList
        data={preferences}
        keyExtractor={(item) => item.user_id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        renderItem={({ item }) => {
          const isMe = item.user_id === currentUserId;
          const isActive = item.user_id === activeId;
          const canEdit = isMe || (isAdmin && isActive);

          return (
            <UserRow
              name={item.name}
              lunch={isActive ? selectedLunch : item.lunch}
              dinner={isActive ? selectedDinner : item.dinner}
              onLunchChange={setSelectedLunch}
              onDinnerChange={setSelectedDinner}
              lunchDisabled={status.lunch === 'CLOSED'}
              dinnerDisabled={status.dinner === 'CLOSED'}
              isCurrentUser={canEdit}
              isSelected={isActive && isAdmin}
              onPress={isAdmin ? () => handleSelectRow(item.user_id) : undefined}
              lunchLeave={item.lunch_leave}
              dinnerLeave={item.dinner_leave}
              isAdmin={isAdmin}
              onToggleLunchLeave={(val) => handleToggleLunchLeave(item.user_id, val)}
              onToggleDinnerLeave={(val) => handleToggleDinnerLeave(item.user_id, val)}
            />
          );
        }}
      />

      <View style={styles.footer}>
        <View style={styles.totalsRow}>
          <Text style={styles.totalsText}>
            Total Tiffins — Lunch {totals.lunch} | Dinner {totals.dinner}
          </Text>
        </View>

        <View style={styles.saveRow}>
          <View style={styles.saveButtonWrap}>
            <SaveButton
              label={`Save Lunch${isAdmin ? ` (${activeName})` : ''}`}
              onPress={handleSaveLunch}
              disabled={status.lunch === 'CLOSED' || activeLunchLocked}
              saving={savingLunch}
            />
          </View>
          <View style={styles.saveButtonWrap}>
            <SaveButton
              label={`Save Dinner${isAdmin ? ` (${activeName})` : ''}`}
              onPress={handleSaveDinner}
              disabled={status.dinner === 'CLOSED' || activeDinnerLocked}
              saving={savingDinner}
            />
          </View>
        </View>

        <Text style={styles.policyText}>
          Data auto-deletes at the end of each month.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0EB' },
  center: { flex: 1, backgroundColor: '#F5F0EB', alignItems: 'center', justifyContent: 'center' },
  header: { padding: 16, backgroundColor: '#FF6B35' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  cutoffInfo: { fontSize: 12, color: '#FFE8DC', marginTop: 4 },
  badgeRow: { flexDirection: 'row', marginTop: 10, gap: 16 },
  badgeGroup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badgeLabel: { color: '#fff', fontSize: 13, fontWeight: '600' },
  adminHint: { color: '#fff', fontSize: 12, fontWeight: '600', marginTop: 8, fontStyle: 'italic' },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFD9C2',
  },
  tableHeaderText: { fontWeight: '700', color: '#2D1B12', fontSize: 13, width: 90, textAlign: 'center' },
  footer: { padding: 12, borderTopWidth: 1, borderTopColor: '#E8DFD3', backgroundColor: '#fff' },
  totalsRow: { marginBottom: 8 },
  totalsText: { fontSize: 14, fontWeight: '700', color: '#2D1B12', textAlign: 'center' },
  saveRow: { flexDirection: 'row', gap: 10 },
  saveButtonWrap: { flex: 1 },
  policyText: { fontSize: 11, color: '#9C8F80', textAlign: 'center', marginTop: 8 },
});