// app/onboarding/age.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChildProfile } from '@/types/child';

const AGE_OPTIONS = Array.from({ length: 15 }, (_, i) => 3 + i); // 3..17

export default function OnboardingAge() {
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

  const [selectedAge, setSelectedAge] = useState<number | null>(
    draft?.age ?? null
  );

  if (!draft) {
    router.replace('/onboarding');
    return null;
  }

  const handleNext = () => {
    if (!selectedAge) return;
    const updated: ChildProfile = {
      ...draft,
      age: selectedAge,
      updatedAt: new Date().toISOString(),
    };

    router.push({
      pathname: '/onboarding/neurotype',
      params: { draft: JSON.stringify(updated) },
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Top row */}
        <View style={styles.topRow}>
          <TouchableOpacity onPress={handleBack} style={styles.backTouch}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.stepText}>Step 2 of 4</Text>
        </View>

        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.title}>How old are they?</Text>
          <Text style={styles.subtitle}>
            Choose their age so we can match scripts to their stage.
          </Text>
        </View>

        {/* Age grid */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        >
          {AGE_OPTIONS.map((age) => {
            const active = selectedAge === age;
            return (
              <TouchableOpacity
                key={age}
                style={[styles.ageChip, active && styles.ageChipActive]}
                onPress={() => setSelectedAge(age)}
              >
                <Text
                  style={[styles.ageLabel, active && styles.ageLabelActive]}
                >
                  {age}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.helper}>
          Under 3? Choose 3 and we’ll keep scripts focused on you, not them.
        </Text>

        {/* Next button */}
        <View style={styles.bottom}>
          <TouchableOpacity
            style={[styles.nextButton, !selectedAge && styles.nextDisabled]}
            onPress={handleNext}
            disabled={!selectedAge}
          >
            <Text style={styles.nextText}>Next</Text>
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
  title: { fontSize: 24, fontWeight: '800', color: '#1C1C1E', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#6B6B6B', lineHeight: 20 },
  scroll: { flex: 1, marginTop: 8 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  ageChip: {
    width: 64,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E0D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageChipActive: {
    backgroundColor: '#E8A040',
    borderColor: '#E8A040',
  },
  ageLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A453E',
  },
  ageLabelActive: {
    color: '#FFFFFF',
  },
  helper: {
    marginTop: 12,
    fontSize: 13,
    color: '#A0A0A0',
  },
  bottom: { marginTop: 16 },
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
