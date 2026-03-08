// app/onboarding/index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function OnboardingStep1() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const isNextEnabled = name.trim().length >= 2;

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const handleNext = () => {
    if (!isNextEnabled) return;

    router.push({
      pathname: '/onboarding/age',
      params: { name: name.trim(), nickname: nickname.trim() },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <View style={styles.container}>
          {/* Step indicator */}
          <View style={styles.stepRow}>
            <Text style={styles.stepText}>Step 1 of 2</Text>
          </View>

          {/* Title */}
          <View style={styles.header}>
            <Text style={styles.title}>Who are we supporting?</Text>
            <Text style={styles.subtitle}>
              We'll use their name so scripts feel warm and personal.
            </Text>
          </View>

          {/* Illustration placeholder box */}
          <View style={styles.illustration}>
            <Text style={styles.illustrationEmoji}>👩‍👧</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Child name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Olivia"
              placeholderTextColor="#B0A9A0"
              autoCapitalize="words"
              autoCorrect={false}
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Nickname (optional)</Text>
            <TextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
              placeholder="What you usually call them"
              placeholderTextColor="#B0A9A0"
              autoCapitalize="words"
            />
          </View>

          {/* Bottom actions */}
          <View style={styles.bottom}>
            <TouchableOpacity
              style={[styles.nextButton, !isNextEnabled && styles.nextDisabled]}
              onPress={handleNext}
              disabled={!isNextEnabled}
            >
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSkip} style={styles.skipTouch}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF6F0' },
  flex: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  stepRow: {
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 13,
    color: '#A0A0A0',
    fontWeight: '500',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B6B6B',
    lineHeight: 20,
  },
  illustration: {
    height: 180,
    backgroundColor: '#F0E6D6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  illustrationEmoji: { fontSize: 72 },
  form: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A453E',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF',
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#E8E0D5',
  },
  bottom: {
    marginTop: 'auto',
  },
  nextButton: {
    backgroundColor: '#E8A040',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextDisabled: {
    opacity: 0.4,
  },
  nextText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  skipTouch: {
    marginTop: 12,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 14,
    color: '#6B6B6B',
    textDecorationLine: 'underline',
  },
});
