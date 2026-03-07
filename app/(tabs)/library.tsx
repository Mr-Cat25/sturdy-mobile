import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export default function ScriptLibrary() {
  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center">
      <Text className="text-2xl font-bold text-gray-900">Saved Scripts</Text>
      <Text className="text-gray-500 mt-2">Past moments of connection live here.</Text>
    </SafeAreaView>
  );
}