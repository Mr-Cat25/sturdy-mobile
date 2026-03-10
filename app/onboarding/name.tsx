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
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/lib/theme';
import { ProgressDots } from '@/components/onboarding/ProgressDots';
import { MicrocopyBubble } from '@/components/onboarding/MicrocopyBubble';

const MIN_NAME_LENGTH = 2;

export default function OnboardingNameScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');

  const isNextEnabled = name.trim().length >= MIN_NAME_LENGTH;

  const handleNext = () => {
    if (!isNextEnabled) return;
    router.push({
      pathname: '/onboarding/age',
      params: { name: name.trim(), nickname: nickname.trim() },
    });
  };

  const handleSkip = () => {
    router.push({
      pathname: '/onboarding/age',
      params: { name: 'Buddy', nickname: '' },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <View style={styles.container}>
          {/* Header row */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sturdy</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Title */}
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Who's the little human{'\n'}we're helping with?</Text>
          </View>

          {/* Inputs */}
          <View style={styles.form}>
            <Text style={styles.label}>Their name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Olivia"
              placeholderTextColor="#B0A9A0"
              autoCapitalize="words"
              autoCorrect={false}
              autoFocus
            />

            <Text style={[styles.label, styles.labelSpaced]}>What you call them (optional)</Text>
            <TextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
              placeholder="e.g., Livvy, Bug, Bud…"
              placeholderTextColor="#B0A9A0"
              autoCapitalize="words"
            />
          </View>

          {/* Microcopy */}
          <MicrocopyBubble text="We'll use this so scripts sound like YOU, not a robot." />

          {/* Progress dots */}
          <View style={styles.dotsRow}>
            <ProgressDots total={4} active={1} />
          </View>

          {/* Bottom actions */}
          <View style={styles.bottom}>
            <TouchableOpacity
              style={[styles.nextButton, !isNextEnabled && styles.nextDisabled]}
              onPress={handleNext}
              disabled={!isNextEnabled}
            >
              <Text style={styles.nextText}>Next →</Text>
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
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSpacer: {
    width: 40,
  },
  titleBlock: {
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.black,
    lineHeight: 34,
  },
  form: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A453E',
    marginBottom: 6,
  },
  labelSpaced: {
    marginTop: 16,
  },
  input: {
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.black,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dotsRow: {
    marginTop: 24,
    marginBottom: 8,
  },
  bottom: {
    marginTop: 'auto',
    paddingTop: 16,
  },
  nextButton: {
    backgroundColor: colors.amber,
    borderRadius: radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  nextDisabled: {
    opacity: 0.4,
  },
  nextText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  skipTouch: {
    alignItems: 'center',
  },
  skipText: {
    fontSize: 14,
    color: colors.gray,
    textDecorationLine: 'underline',
  },
});
