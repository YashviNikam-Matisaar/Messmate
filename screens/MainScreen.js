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
import { getAllPreferences, savePreference } from '../services/api';

const today = () => new Date().toISOString().split('T')[0];

export default function MainScreen({ currentUserName, currentUserId }) {
  const [date] = useState(today());
  const [preferences, setPreferences] = useState([]);
  const [status, setStatus] = useState({ lunch: 'CLOSED', dinner: 'CLOSED' });
  const [totals, setTotals] = useState({ lunch: 0, dinner: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingLunch, setSavingLunch] = useState(false);
  const [savingDinner, setSavingDinner] = useState(false);

  // local edits for the CURRENT user's own row, before Save is tapped
  const [myLunch, setMyLunch] = useState(0);
  const [myDinner, setMyDinner] = useState(0);

  const loadData = useCallback(async () => {
    try {
      const data = await getAllPreferences(date);
      setPreferences(data.preferences);
      setStatus(data.status);
      setTotals(data.totals);

      const mine = data.preferences.find((p) => p.user_id === currentUserId);
      if (mine) {
        setMyLunch(mine.lunch);
        setMyDinner(mine.dinner);
      }
    } catch (err) {
      Alert.alert('Error', 'Could not load data: ' + err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [date, currentUserId]);

  useEffect(() => {
    loadData();
    // Auto-refresh every 60s so everyone sees everyone else's updates
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleSaveLunch = async () => {
    setSavingLunch(true);
    try {
      await savePreference({
        user_id: currentUserId,
        date,
        meal_type: 'lunch',
        quantity: myLunch,
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
        user_id: currentUserId,
        date,
        meal_type: 'dinner',
        quantity: myDinner,
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
          return (
            <UserRow
              name={item.name}
              lunch={isMe ? myLunch : item.lunch}
              dinner={isMe ? myDinner : item.dinner}
              onLunchChange={setMyLunch}
              onDinnerChange={setMyDinner}
              lunchDisabled={status.lunch === 'CLOSED'}
              dinnerDisabled={status.dinner === 'CLOSED'}
              isCurrentUser={isMe}
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
              label="Save Lunch"
              onPress={handleSaveLunch}
              disabled={status.lunch === 'CLOSED'}
              saving={savingLunch}
            />
          </View>
          <View style={styles.saveButtonWrap}>
            <SaveButton
              label="Save Dinner"
              onPress={handleSaveDinner}
              disabled={status.dinner === 'CLOSED'}
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
  container: {
    flex: 1,
    backgroundColor: '#F5F0EB',
  },
  center: {
    flex: 1,
    backgroundColor: '#F5F0EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#FF6B35',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  cutoffInfo: {
    fontSize: 12,
    color: '#FFE8DC',
    marginTop: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 16,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFD9C2',
  },
  tableHeaderText: {
    fontWeight: '700',
    color: '#2D1B12',
    fontSize: 13,
    width: 90,
    textAlign: 'center',
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8DFD3',
    backgroundColor: '#fff',
  },
  totalsRow: {
    marginBottom: 8,
  },
  totalsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D1B12',
    textAlign: 'center',
  },
  saveRow: {
    flexDirection: 'row',
    gap: 10,
  },
  saveButtonWrap: {
    flex: 1,
  },
  policyText: {
    fontSize: 11,
    color: '#9C8F80',
    textAlign: 'center',
    marginTop: 8,
  },
});
