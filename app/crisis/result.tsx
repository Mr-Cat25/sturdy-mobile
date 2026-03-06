// app/crisis/result.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useActiveChild } from '@/lib/useActiveChild';

export default function CrisisResultScreen() {
  const router = useRouter();
  const { situation } = useLocalSearchParams<{ situation?: string }>();
  const child = useActiveChild();

  const handleBack = () => {
    router.back();
  };

  const handleHome = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Top bar */}
        <View style={styles.topRow}>
          <TouchableOpacity onPress={handleBack} style={styles.backTouch}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Script preview</Text>
        </View>

        {/* Child chip */}
        {child && (
          <View style={styles.childChip}>
            <Text style={styles.childText}>
              For {child.name}
              {child.age ? ` · ${child.age}` : ''}
              {child.neurotype && child.neurotype !== 'None'
                ? ` · ${child.neurotype}`
                : ''}
            </Text>
          </View>
        )}

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollInner}>
          <Text style={styles.sectionLabel}>You shared:</Text>
          <Text style={styles.situationText}>{situation}</Text>

          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderTitle}>
              Script will appear here
            </Text>
            <Text style={styles.placeholderBody}>
              Next, we’ll connect this screen to your AI endpoint to generate a
              3-part script based on your child’s age, neurotype, and situation.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.bottom}>
          <TouchableOpacity style={styles.button} onPress={handleHome}>
            <Text style={styles.buttonText}>Back to home</Text>
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
  title: { fontSize: 18, fontWeight: '700', color: '#1C1C1E' },
  childChip: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E8E0D5',
  },
  childText: { fontSize: 13, color: '#4A453E' },
  scroll: { flex: 1, marginTop: 16 },
  scrollInner: { paddingBottom: 24 },
  sectionLabel: {
    fontSize: 13,
    color: '#A0A0A0',
    marginBottom: 4,
  },
  situationText: {
    fontSize: 15,
    color: '#1C1C1E',
    lineHeight: 22,
    marginBottom: 16,
  },
  placeholderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E0D5',
  },
  placeholderTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  placeholderBody: { fontSize: 14, color: '#6B6B6B', lineHeight: 20 },
  bottom: { marginTop: 16 },
  button: {
    backgroundColor: '#E8A040',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
