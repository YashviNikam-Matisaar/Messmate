import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from './screens/SplashScreen';
import NameSetupScreen from './screens/NameSetupScreen';
import BottomTabs from './navigation/BottomTabs';
import { getSavedName, getSavedUserId } from './utils/storage';
import { scheduleAllDailyReminders } from './utils/notifications';

// App states: 'splash' -> 'nameSetup' or 'main'
export default function App() {
  const [screen, setScreen] = useState('splash');
  const [currentUserName, setCurrentUserName] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const bootstrap = async () => {
      const savedName = await getSavedName();
      const savedUserId = await getSavedUserId();

      // Splash shows for a moment regardless
      setTimeout(async () => {
        if (savedName && savedUserId) {
          setCurrentUserName(savedName);
          setCurrentUserId(savedUserId);
          setScreen('main');
          scheduleAllDailyReminders();
        } else {
          setScreen('nameSetup');
        }
      }, 1800);
    };
    bootstrap();
  }, []);

  const handleNameSetupComplete = (name, id) => {
    setCurrentUserName(name);
    setCurrentUserId(id);
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
      <BottomTabs currentUserName={currentUserName} currentUserId={currentUserId} />
    </NavigationContainer>
  );

}