import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from './screens/SplashScreen';
import NameSetupScreen from './screens/NameSetupScreen';
import BottomTabs from './navigation/BottomTabs';
import { getSavedName, getSavedUserId, getSavedIsAdmin } from './utils/storage';
import { scheduleAllDailyReminders } from './utils/notifications';

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [currentUserName, setCurrentUserName] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      const savedName = await getSavedName();
      const savedUserId = await getSavedUserId();
      const savedIsAdmin = await getSavedIsAdmin();

      setTimeout(async () => {
        if (savedName && savedUserId) {
          setCurrentUserName(savedName);
          setCurrentUserId(savedUserId);
          setIsAdmin(savedIsAdmin);
          setScreen('main');
          scheduleAllDailyReminders();
        } else {
          setScreen('nameSetup');
        }
      }, 1800);
    };
    bootstrap();
  }, []);

  const handleNameSetupComplete = (name, id, admin) => {
    setCurrentUserName(name);
    setCurrentUserId(id);
    setIsAdmin(admin);
    setScreen('main');
    scheduleAllDailyReminders();
  };

  if (screen === 'splash') {
    return <SplashScreen />;
  }

  if (screen === 'nameSetup') {
    return <NameSetupScreen onComplete={handleNameSetupComplete} />;
  }

  return (
    <NavigationContainer>
      <BottomTabs
        currentUserName={currentUserName}
        currentUserId={currentUserId}
        isAdmin={isAdmin}
      />
    </NavigationContainer>
  );
}