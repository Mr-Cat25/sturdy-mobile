import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OnboardingAgeScreen() {
  const router = useRouter();
  const { name, nickname } = useLocalSearchParams(); 
  
  const [selectedAge, setSelectedAge] = useState<string | null>(null);

  const ageGroups = ['0-3', '4-7', '8-12', '13-17'];

  const handleNext = () => {
    router.push({
      pathname: '/onboarding/neurotype',
      params: { name, nickname, ageGroup: selectedAge }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sturdy</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.question}>How old are they?</Text>

        <View style={styles.grid}>
          {ageGroups.map((age) => {
            const isSelected = selectedAge === age;
            return (
              <TouchableOpacity
                key={age}
                style={[styles.ageCard, isSelected && styles.ageCardSelected]}
                onPress={() => setSelectedAge(age)}
              >
                <Text style={[styles.ageText, isSelected && styles.ageTextSelected]}>
                  {age}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.progressContainer}>
           <View style={[styles.dot, styles.dotActive]} />
           <View style={styles.dot} />
           <View style={styles.dot} />
        </View>

        <Text style={styles.footerText}>You can add more details later</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, !selectedAge && styles.buttonDisabled]} 
          onPress={handleNext}
          disabled={!selectedAge}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  question: {
    fontSize: 28,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 40,
  },
  ageCard: {
    backgroundColor: '#FFF',
    width: '40%',
    aspectRatio: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  ageCardSelected: {
    backgroundColor: '#EAA05B',
    borderColor: '#EAA05B',
  },
  ageText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  ageTextSelected: {
    color: '#FFF',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
  },
  dotActive: {
    backgroundColor: '#EAA05B',
  },
  footerText: {
    fontSize: 14,
    color: '#888',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#EAA05B',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#F0C79B',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});