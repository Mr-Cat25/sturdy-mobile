import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/lib/theme';
import { ProgressDots } from '@/components/onboarding/ProgressDots';
import { MicrocopyBubble } from '@/components/onboarding/MicrocopyBubble';
import { AccordionCard } from '@/components/onboarding/AccordionCard';

const AGES = Array.from({ length: 16 }, (_, i) => String(i + 2));

export default function OnboardingAgeScreen() {
  const router = useRouter();
  const { name, nickname } = useLocalSearchParams<{ name: string; nickname: string }>();

  const [selectedAge, setSelectedAge] = useState<string>('');
  const [expanded, setExpanded] = useState(false);

  const displayName = name || 'them';

  const handleSelectAge = (age: string) => {
    setSelectedAge(age);
    setExpanded(false);
  };

  const handleNext = () => {
    router.push({
      pathname: '/onboarding/neurotype',
      params: { name: name ?? '', nickname: nickname ?? '', age: selectedAge },
    });
  };

  const handleSkip = () => {
    router.push({
      pathname: '/onboarding/neurotype',
      params: { name: name ?? '', nickname: nickname ?? '', age: '' },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
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
        <Text style={styles.title}>How old is {displayName}?</Text>

        {/* Accordion */}
        <View style={styles.accordionWrapper}>
          <AccordionCard
            label="Select age"
            selectedText={selectedAge ? `${selectedAge} years old` : ''}
            expanded={expanded}
            onToggle={() => setExpanded((v) => !v)}
            maxHeight={300}
          >
            <ScrollView
              style={styles.ageScroll}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {AGES.map((age) => {
                const isSelected = selectedAge === age;
                return (
                  <TouchableOpacity
                    key={age}
                    style={[styles.ageRow, isSelected && styles.ageRowSelected]}
                    onPress={() => handleSelectAge(age)}
                  >
                    <Text style={[styles.ageRowText, isSelected && styles.ageRowTextSelected]}>
                      {age} years old
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={18} color={colors.amber} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </AccordionCard>
        </View>

        {/* Microcopy */}
        <MicrocopyBubble text="This helps us match the right words to their stage." />

        {/* Progress dots */}
        <View style={styles.dotsRow}>
          <ProgressDots total={4} active={2} />
        </View>

        {/* Bottom actions */}
        <View style={styles.bottom}>
          <TouchableOpacity
            style={[styles.nextButton, !selectedAge && styles.nextDisabled]}
            onPress={handleNext}
            disabled={!selectedAge}
          >
            <Text style={styles.nextText}>Next →</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSkip} style={styles.skipTouch}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
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
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.black,
    marginBottom: 20,
  },
  accordionWrapper: {
    zIndex: 10,
  },
  ageScroll: {
    maxHeight: 292,
  },
  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ageRowSelected: {
    backgroundColor: '#FFF8EE',
  },
  ageRowText: {
    fontSize: 16,
    color: colors.black,
  },
  ageRowTextSelected: {
    color: colors.amber,
    fontWeight: '600',
  },
  dotsRow: {
    marginTop: 24,
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
    backgroundColor: '#F0C79B',
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
