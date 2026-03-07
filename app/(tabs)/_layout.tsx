import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#EAA05B', // Your signature Sturdy orange
        tabBarInactiveTintColor: '#9CA3AF', // A soft, calming gray
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          height: 85, // Slightly taller for easier tapping in stressful moments
          paddingBottom: 25,
          paddingTop: 10,
          backgroundColor: '#FFFFFF',
        },
        headerShown: false, // We will let individual screens handle their own top headers
      }}
    >
      {/* Tab 1: The SOS Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Support',
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart-half-outline" size={28} color={color} />
          ),
        }}
      />
      
      {/* Tab 2: Saved Scripts (History) */}
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => (
            <Ionicons name="bookmarks-outline" size={26} color={color} />
          ),
        }}
      />

      {/* Tab 3: Child Profiles & Settings */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}