import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/lib/theme';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      router.replace('/');
    } catch (e: any) {
      Alert.alert('Sign out failed', e?.message ?? 'Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.title}>Child Profiles</Text>
        <Text style={styles.subtitle}>Manage settings and neurotypes here.</Text>

        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontSize: 24, fontWeight: '700', color: colors.black },
  subtitle: { fontSize: 14, color: colors.gray, marginTop: 8, textAlign: 'center' },

  signOutBtn: {
    marginTop: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E8E0D5',
    backgroundColor: '#FFF',
  },
  signOutText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '700',
  },
});