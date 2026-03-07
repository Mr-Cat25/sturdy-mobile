import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // For now, this just safely routes them to the main app dashboard
    // We will connect this to Supabase auth later!
    router.replace('/(tabs)'); 
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 px-6 justify-center"
      >
        <View className="mb-10 items-center">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome back.</Text>
          <Text className="text-lg text-gray-500 text-center">
            Take a deep breath. We're here to help you find the right words.
          </Text>
        </View>

        <View className="w-full gap-4">
          {/* Email Input */}
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-2 ml-1">Email</Text>
            <TextInput
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 text-lg"
              placeholder="parent@example.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password Input */}
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-2 ml-1">Password</Text>
            <TextInput
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 text-lg"
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            onPress={handleLogin}
            className="w-full bg-blue-600 py-4 rounded-xl mt-4 shadow-sm items-center"
          >
            <Text className="text-white font-bold text-lg">Log In</Text>
          </TouchableOpacity>
        </View>

        {/* Back to Home / Cancel */}
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mt-8 items-center"
        >
          <Text className="text-gray-500 font-medium text-base">Wait, go back</Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}