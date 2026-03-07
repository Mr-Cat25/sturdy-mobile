import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center">
      <Text className="text-2xl font-bold text-gray-900">Child Profiles</Text>
      <Text className="text-gray-500 mt-2">Manage settings and neurotypes here.</Text>
    </SafeAreaView>
  );
}