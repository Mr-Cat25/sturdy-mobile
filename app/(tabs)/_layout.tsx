import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRequireAuth } from '@/lib/useRequireAuth';

export default function TabLayout() {
  const { loading } = useRequireAuth();

  if (loading) return null;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#EAA05B',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
          backgroundColor: '#FFFFFF',
        },
        headerShown: false,
      }}
    >
      {/* Tab 1: Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={26} color={color} />
          ),
        }}
      />

      {/* Tab 2: Crisis / Support */}
      <Tabs.Screen
        name="crisis"
        options={{
          title: 'Support',
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart-half-outline" size={28} color={color} />
          ),
        }}
      />

      {/* Tab 3: Saved Scripts Library */}
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => (
            <Ionicons name="bookmarks-outline" size={26} color={color} />
          ),
        }}
      />

      {/* Tab 4: Child Profiles & Settings */}
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
