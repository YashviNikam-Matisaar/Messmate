import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
 
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
 
// Ask for permission once, on first launch.
export async function requestNotificationPermissions() {
  if (!Device.isDevice) return false;
 
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
 
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
 
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
 
  return finalStatus === 'granted';
}
 
// Schedules one notification to repeat daily at a fixed hour:minute.
// Uses a stable identifier per slot so re-running this doesn't create duplicates.
async function scheduleDaily(identifier, hour, minute, title, body) {
  await Notifications.cancelScheduledNotificationAsync(identifier).catch(() => {});
 
  await Notifications.scheduleNotificationAsync({
    identifier,
    content: { title, body, sound: 'default' },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}
 
// Sets up all 4 daily MessMate notifications. Call once on app launch.
export async function scheduleAllDailyReminders() {
  const granted = await requestNotificationPermissions();
  if (!granted) return;
 
  await scheduleDaily(
    'lunch-reminder',
    21,
    0,
    'Lunch reminder 🍛',
    "Please confirm tomorrow's lunch preference. Closes in 1 hour."
  );
 
  await scheduleDaily(
    'lunch-final',
    22,
    0,
    'Lunch finalized 🍱',
    'New update in Chat — check the breakdown.'
  );
 
  await scheduleDaily(
    'dinner-reminder',
    16,
    30,
    'Dinner reminder 🌙',
    "Please confirm today's dinner preference. Closes in 1 hour."
  );
 
  await scheduleDaily(
    'dinner-final',
    17,
    30,
    'Dinner finalized 🌙',
    'New update in Chat — check the breakdown.'
  );
}
 
// TEST ONLY — fires a one-off notification 10 seconds after being called.
// Use this to confirm permissions + scheduling actually work end-to-end,
// without waiting for the real fixed times (9PM/10PM/4:30PM/5:30PM).
// Safe to leave in the app; harmless if never triggered.
export async function sendTestNotification() {
  const granted = await requestNotificationPermissions();
  if (!granted) {
    console.log('Notification permission not granted — cannot send test.');
    return;
  }
 
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'MessMate test 🍱',
      body: 'If you see this, notifications are working!',
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 10,
      repeats: false,
    },
  });
}
 