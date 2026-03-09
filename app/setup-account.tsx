import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function SetupAccountScreen() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const trimmedUsername = useMemo(() => username.trim(), [username]);

  const handleCreate = async () => {
    if (!trimmedUsername) {
      Alert.alert('Username required', 'Please choose a username.');
      return;
    }

    if (usePassword) {
      if (password.length < 8) {
        Alert.alert('Password too short', 'Use at least 8 characters.');
        return;
      }
      if (password !== confirm) {
        Alert.alert('Passwords do not match', 'Please re-enter your password.');
        return;
      }
    }

    setLoading(true);
    try {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr) throw userErr;
      if (!user) throw new Error('Not signed in. Please sign in again.');

      // Create/update profile. Defaults handle plan + scripts_remaining.
      const { error: profileErr } = await supabase.from('profiles').upsert({
        id: user.id,
        username: trimmedUsername,
      });

      if (profileErr) throw profileErr;

      // Optional: attach a password to this same account.
      if (usePassword) {
        const { error: passErr } = await supabase.auth.updateUser({ password });
        if (passErr) throw passErr;
      }

      router.replace('/onboarding');
    } catch (e: any) {
      Alert.alert('Could not create account', e?.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipPassword = () => {
    setUsePassword(false);
    setPassword('');
    setConfirm('');
    handleCreate();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Set up your account</Text>
        <Text style={styles.subtitle}>Choose a username. Add a password if you’d like.</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="e.g. sturdyparent"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setUsePassword((v) => !v)}
          disabled={loading}
        >
          <View style={[styles.checkbox, usePassword && styles.checkboxOn]} />
          <Text style={styles.toggleText}>Add a password (optional)</Text>
        </TouchableOpacity>

        {usePassword ? (
          <>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              secureTextEntry
            />

            <Text style={styles.label}>Confirm password</Text>
            <TextInput style={styles.input} value={confirm} onChangeText={setConfirm} secureTextEntry />
          </>
        ) : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create account</Text>}
        </TouchableOpacity>

        {!usePassword ? (
          <TouchableOpacity onPress={handleSkipPassword} disabled={loading} style={styles.linkTouch}>
            <Text style={styles.linkText}>Skip password for now</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF6F0' },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 48 },
  title: { fontSize: 28, fontWeight: '800', color: '#1C1C1E', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#6B6B6B', lineHeight: 22, marginBottom: 28 },
  label: { fontSize: 14, fontWeight: '600', color: '#4A453E', marginBottom: 8 },
  input: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    fontSize: 17,
    borderWidth: 1,
    borderColor: '#E8E0D5',
    marginBottom: 16,
  },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A9A29A',
    backgroundColor: '#FFF',
  },
  checkboxOn: { backgroundColor: '#E8A040', borderColor: '#E8A040' },
  toggleText: { fontSize: 14, color: '#4A453E', fontWeight: '600' },
  button: {
    backgroundColor: '#E8A040',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  linkTouch: { marginTop: 16, alignItems: 'center' },
  linkText: { fontSize: 14, color: '#6B6B6B' },
});