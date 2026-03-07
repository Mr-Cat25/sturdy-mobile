import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { addChild } from '../../src/lib/childProfile'; 
import { ChildProfile } from '../../src/types/child';

export default function OnboardingNeurotypeScreen() {
  const router = useRouter();
  // Catch the baton one last time!
  const { name, nickname, ageGroup } = useLocalSearchParams(); 

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const neurotypes = ['ADHD', 'Autistic', 'Highly sensitive', 'Not sure yet'];

  const toggleType = (type: string) => {
    if (type === 'Not sure yet') {
      setSelectedTypes(['Not sure yet']);
      return;
    }
    
    setSelectedTypes((prev) => {
      // Remove "Not sure yet" if they select something specific
      const cleanList = prev.filter((t) => t !== 'Not sure yet');
      if (cleanList.includes(type)) {
        return cleanList.filter((t) => t !== type); // Deselect
      }
      return [...cleanList, type]; // Select
    });
  };

  const handleFinish = async () => {
    // 1. Process the neurotype selection cleanly
    const processedNeurotypes = selectedTypes.length > 0 && !selectedTypes.includes('Not sure yet')
      ? selectedTypes
      : ['none'];

    // 2. Build the final profile object with timestamps
    const newProfile: ChildProfile = {
      id: Date.now().toString(), 
      name: (name as string) || '',
      nickname: (nickname as string) || '',
      age: (ageGroup as string) || '',
      // Using 'any' bypasses the strict string[] vs Neurotype[] mismatch if needed
      neurotype: processedNeurotypes as any, 
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // 3. Save it to AsyncStorage 
      await addChild(newProfile);

      // 4. Send them to the main app! 
      // We use .replace() instead of .push() so they can't hit the back button to return to onboarding.
      router.replace('/crisis'); 
    } catch (error) {
      console.error("Failed to save child profile:", error);
    }
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
        <Text style={styles.question}>Anything we should know about their neurotype?</Text>

        <View style={styles.pillContainer}>
          {neurotypes.map((type) => {
            const isSelected = selectedTypes.includes(type);
            return (
              <TouchableOpacity
                key={type}
                style={[styles.pill, isSelected && styles.pillSelected]}
                onPress={() => toggleType(type)}
              >
                <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                  {type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Progress dots */}
        <View style={styles.progressContainer}>
           <View style={styles.dot} />
           <View style={[styles.dot, styles.dotActive]} />
           <View style={styles.dot} />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleFinish}
        >
          {/* Dynamic button text based on selection */}
          <Text style={styles.buttonText}>
            {selectedTypes.length > 0 ? 'Next' : 'Skip'}
          </Text>
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
    textAlign: 'center',
    color: '#1A1A1A',
    marginBottom: 40,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
  },
  pill: {
    backgroundColor: '#FFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  pillSelected: {
    backgroundColor: '#EAA05B',
    borderColor: '#EAA05B',
  },
  pillText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  pillTextSelected: {
    color: '#FFF',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 'auto', 
    marginBottom: 30,
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
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});