import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#FAF6F0" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
