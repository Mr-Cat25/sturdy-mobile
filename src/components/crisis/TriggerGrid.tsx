import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TriggerGridProps {
  onSelect: (trigger: string) => void;
}

export function TriggerGrid({ onSelect }: TriggerGridProps) {
  // Using the exact categories from your gorgeous mockup
  const triggers = [
    { id: 'Big feelings', icon: '🖼️', color: '#FDF2E9' }, // Light orange tint
    { id: 'Aggression', icon: '👧', color: '#FEF9E7' },   // Light yellow tint
    { id: 'Sleep', icon: '🛌', color: '#EBF5FB' },        // Light blue tint
    { id: 'School', icon: '🎒', color: '#FDEDEC' },       // Light pink/red tint
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.question}>What feels hardest right now?</Text>
      
      <View style={styles.grid}>
        {triggers.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.card, { backgroundColor: item.color }]}
            onPress={() => onSelect(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.label}>{item.id}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 20,
  },
  question: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 24,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16, // Requires React Native 0.71+
  },
  card: {
    width: '47%', // Allows two items per row with space in between
    aspectRatio: 1, // Makes them perfect squares
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  icon: {
    fontSize: 40,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});