import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius, shadow } from '@/lib/theme';

interface TriggerGridProps {
  onSelect: (trigger: string) => void;
}

export function TriggerGrid({ onSelect }: TriggerGridProps) {
  const triggers = [
    { id: 'Big feelings', icon: '🖼️', color: '#F5EFE8' },
    { id: 'Aggression', icon: '👧', color: '#EDF4EF' },
    { id: 'Sleep', icon: '🛌', color: '#EBF1F6' },
    { id: 'School', icon: '🎒', color: '#F6EDE9' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.question}>What feels hardest right now?</Text>

      <View style={styles.grid}>
        {triggers.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, { backgroundColor: item.color }, shadow.soft]}
            onPress={() => onSelect(item.id)}
            activeOpacity={0.75}
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
    paddingVertical: spacing.lg,
  },
  question: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
    lineHeight: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  card: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 38,
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});