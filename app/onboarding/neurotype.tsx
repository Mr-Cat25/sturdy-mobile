import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { addChild } from '@/lib/childProfile';
import { colors, radius } from '@/lib/theme';
import { ProgressDots } from '@/components/onboarding/ProgressDots';
import { MicrocopyBubble } from '@/components/onboarding/MicrocopyBubble';
import { AccordionCard } from '@/components/onboarding/AccordionCard';

const NEUROTYPES = [
  'ADHD',
  'Autistic',
  'Highly Sensitive',
  'Sensory Processing',
  'Not sure yet — that\'s okay',
];

const NOT_SURE = 'Not sure yet — that\'s okay';

export default function OnboardingNeurotypeScreen() {
  const router = useRouter();
  const { name, nickname, age } = useLocalSearchParams<{
    name: string;
    nickname: string;
    age: string;
  }>();

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);

  const displayName = name || 'them';

  const toggleType = (type: string) => {
    if (type === NOT_SURE) {
      setSelectedTypes((prev) =>
        prev.includes(NOT_SURE) ? [] : [NOT_SURE],
      );
      return;
    }
    setSelectedTypes((prev) => {
      const withoutNotSure = prev.filter((t) => t !== NOT_SURE);
      if (withoutNotSure.includes(type)) {
        return withoutNotSure.filter((t) => t !== type);
      }
      return [...withoutNotSure, type];
    });
  };

  const getSelectedText = () => {
    if (selectedTypes.length === 0) return '';
    if (selectedTypes.length === 1) return selectedTypes[0];
    return `${selectedTypes.length} selected`;
  };

  const saveAndNavigate = async (neurotypes: string[]) => {
    if (saving) return;
    setSaving(true);
    try {
      await addChild({
        name: name ?? '',
        nickname: nickname ?? '',
        age: age ?? '',
        neurotype: neurotypes,
      });
      router.push({
        pathname: '/onboarding/summary',
        params: {
          name: name ?? '',
          nickname: nickname ?? '',
          age: age ?? '',
          neurotype: neurotypes.join(','),
        },
      });
    } catch (e: any) {
      if (e.message === 'FREE_LIMIT_CHILD') {
        Alert.alert(
          'Child profile already exists',
          'The free plan supports 1 child profile. Upgrade to add more.',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }],
        );
      } else {
        Alert.alert('Error', 'Could not save profile. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    const neurotypes =
      selectedTypes.length > 0 && !selectedTypes.includes(NOT_SURE)
        ? selectedTypes
        : [];
    saveAndNavigate(neurotypes);
  };

  const handleSkip = () => {
    saveAndNavigate([]);
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
        <Text style={styles.title}>
          Anything that makes {displayName}'s brain extra unique?
        </Text>

        {/* Accordion */}
        <View style={styles.accordionWrapper}>
          <AccordionCard
            label="Select neurotype(s)"
            selectedText={getSelectedText()}
            expanded={expanded}
            onToggle={() => setExpanded((v) => !v)}
            maxHeight={320}
          >
            <View>
              {NEUROTYPES.map((type) => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typeRow, isSelected && styles.typeRowSelected]}
                    onPress={() => toggleType(type)}
                  >
                    <Text style={[styles.typeRowText, isSelected && styles.typeRowTextSelected]}>
                      {type}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={18} color={colors.amber} />
                    )}
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setExpanded(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </AccordionCard>
        </View>

        {/* Microcopy */}
        <MicrocopyBubble text="No diagnosis needed. This just helps us adjust tone and expectations." />

        {/* Progress dots */}
        <View style={styles.dotsRow}>
          <ProgressDots total={4} active={3} />
        </View>

        {/* Bottom actions */}
        <View style={styles.bottom}>
          <TouchableOpacity
            style={[styles.nextButton, saving && styles.nextDisabled]}
            onPress={handleNext}
            disabled={saving}
          >
            <Text style={styles.nextText}>{saving ? 'Saving…' : 'Next →'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSkip} style={styles.skipTouch} disabled={saving}>
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
    lineHeight: 34,
  },
  accordionWrapper: {
    zIndex: 10,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  typeRowSelected: {
    backgroundColor: '#FFF8EE',
  },
  typeRowText: {
    fontSize: 16,
    color: colors.black,
    flex: 1,
    marginRight: 8,
  },
  typeRowTextSelected: {
    color: colors.amber,
    fontWeight: '600',
  },
  doneButton: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.amberLight,
  },
  doneButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.amber,
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
