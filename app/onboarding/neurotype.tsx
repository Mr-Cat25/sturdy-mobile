// app/onboarding/neurotype.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChildProfile, Neurotype } from '@/types/child';
import { addChild } from '@/lib/childProfile';

const NEURO_OPTIONS: Neurotype[] = [
  'ADHD',
  'Autistic',
  'Highly sensitive',
  'Not sure yet',
  'None',
];

export default function OnboardingNeurotype() {
  const router = useRouter();
  const params = useLocalSearchParams<{ draft?: string }>();

  const draft: ChildProfile | null = useMemo(() => {
    if (!params.draft) return null;
    try {
      return JSON.parse(params.draft as string) as ChildProfile;
    } catch {
      return null;
    }
  }, [params.draft]);

  const [selected, setSelected] = useState<Neurotype | null>(
    draft?.neurotype ?? null
  );
  const [saving, setSaving] = useState(false);

  if (!draft) {
    router.replace('/onboarding');
    return null;
  }

  const handleNext = async () => {
    if (!selected || saving) return;
    setSaving(true);

    const updated: ChildProfile = {
      ...draft,
      neurotype: selected,
      updatedAt: new Date().toISOString(),
    };

    await addChild(updated);
    router.replace('/'); // Done: back to home with active child
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Top row */}
        <View className="topRow" style={styles.topRow}>
          <TouchableOpacity onPress={handleBack} style={styles.backTouch}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.stepText}>Step 3 of 3</Text>
        </View>

        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Anything we should know about their neurotype?
          </Text>
          <Text style={styles.subtitle}>
            This helps scripts be more sensitive to how their brain works.
          </Text>
        </View>

        {/* Pills */}
        <View style={styles.pills}>
          {NEURO_OPTIONS.map((option) => {
            const active = selected === option;
            return (
              <TouchableOpacity
                key={option}
                style={[styles.pill, active && styles.pillActive]}
                onPress={() => setSelected(option)}
              >
                <Text
                  style={[styles.pillLabel, active && styles.pillLabelActive]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Helper */}
        <Text style={styles.helper}>
          Not sure is totally okay. We’ll keep language gentle and flexible.
        </Text>

        {/* Next */}
        <View style={styles.bottom}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              (!selected || saving) && styles.nextDisabled,
            ]}
            onPress={handleNext}
            disabled={!selected || saving}
          >
            <Text style={styles.nextText}>
              {saving ? 'Saving…' : 'Done'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF6F0' },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backTouch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  backText: { fontSize: 18, color: '#6B6B6B' },
  stepText: { fontSize: 13, color: '#A0A0A0', fontWeight: '500' },
  header: { marginTop: 8, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#1C1C1E', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#6B6B6B', lineHeight: 20 },
  pills: {
    marginTop: 8,
    gap: 10,
  },
  pill: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E0D5',
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: '#E8A040',
    borderColor: '#E8A040',
  },
  pillLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A453E',
  },
  pillLabelActive: {
    color: '#FFFFFF',
  },
  helper: {
    marginTop: 16,
    fontSize: 13,
    color: '#A0A0A0',
  },
  bottom: { marginTop: 'auto' },
  nextButton: {
    backgroundColor: '#E8A040',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextDisabled: { opacity: 0.4 },
  nextText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
