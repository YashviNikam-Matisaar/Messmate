import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import SplashScreen from './screens/SplashScreen';
import NameSetupScreen from './screens/NameSetupScreen';
import BottomTabs from './navigation/BottomTabs';
import { getSavedName, getSavedUserId } from './utils/storage';
import { registerPushToken } from './services/api';

// Foreground notifications still show a banner/alert
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// App states: 'splash' -> 'nameSetup' or 'main'
export default function App() {
  const [screen, setScreen] = useState('splash');
  const [currentUserName, setCurrentUserName] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const bootstrap = async () => {
      const savedName = await getSavedName();
      const savedUserId = await getSavedUserId();

      // Splash shows for a moment regardless, matches SplashScreen's animation
      setTimeout(async () => {
        if (savedName && savedUserId) {
          setCurrentUserName(savedName);
          setCurrentUserId(savedUserId);
          setScreen('main');
          registerForPushNotifications(savedUserId);
        } else {
          setScreen('nameSetup');
        }
      }, 1800);
    };
    bootstrap();
  }, []);

  const registerForPushNotifications = async (userId) => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;

      const tokenData = await Notifications.getExpoPushTokenAsync();
      await registerPushToken({ user_id: userId, token: tokenData.data });
    } catch (err) {
      console.error('Push registration failed:', err.message);
    }
  };

  const handleNameSetupComplete = (name, id) => {
    setCurrentUserName(name);
    setCurrentUserId(id);
    setScreen('main');
    registerForPushNotifications(id);
  };

  if (screen === 'splash') {
    return <SplashScreen />;
  }

  if (screen === 'nameSetup') {
    return <NameSetupScreen onComplete={handleNameSetupComplete} />;
  }

  return (
    <NavigationContainer>
      <BottomTabs currentUserName={currentUserName} currentUserId={currentUserId} />
    </NavigationContainer>
  );
}
