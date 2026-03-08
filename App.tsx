// This file is not the active app entry point.
// The app is powered by expo-router, which is configured via "main": "expo-router/entry"
// in package.json. That means expo-router takes over routing entirely.
//
// App structure is defined in:
//   - app/_layout.tsx   (root layout: SafeAreaProvider, StatusBar, Stack navigator)
//   - app/index.tsx     (landing/marketing page at route "/")
//
// This file is kept only because index.ts references it via registerRootComponent.
// Neither index.ts nor this file is loaded at runtime when expo-router/entry is used.

import { View } from 'react-native';
export default function App() {
  return <View />;
}
