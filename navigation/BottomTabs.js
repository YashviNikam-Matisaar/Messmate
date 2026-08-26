import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import MainScreen from '../screens/MainScreen';
import ChatScreen from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();

// Two tabs only: Main (the table) and Chat (read-only announcement feed).
// currentUserName/currentUserId are passed down from App.js so MainScreen
// knows which row belongs to "me" for editing permissions.
export default function BottomTabs({ currentUserName, currentUserId }) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#9C8F80',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Main"
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🍱</Text>,
        }}
      >
        {() => (
          <MainScreen currentUserName={currentUserName} currentUserId={currentUserId} />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>💬</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
