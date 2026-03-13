import React, { ReactNode, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '@/lib/theme';

interface AccordionCardProps {
  label: string;
  selectedText: string;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  maxHeight?: number;
}

export function AccordionCard({
  label,
  selectedText,
  expanded,
  onToggle,
  children,
  maxHeight = 300,
}: AccordionCardProps) {
  const progress = useSharedValue(expanded ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(expanded ? 1 : 0, { duration: 300 });
  }, [expanded]);

  const bodyStyle = useAnimatedStyle(() => ({
    height: interpolate(progress.value, [0, 1], [0, maxHeight]),
    opacity: progress.value,
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg`,
      },
    ],
  }));

  const displayText = selectedText || label;

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.header}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.headerText,
            selectedText ? styles.headerTextSelected : styles.headerTextPlaceholder,
          ]}
        >
          {displayText}
        </Text>
        <Animated.View style={chevronStyle}>
          <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[styles.body, bodyStyle]}>
        <View style={styles.divider} />
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
    overflow: 'hidden',
  },
  body: {
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 6,
  },
  headerText: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  headerTextPlaceholder: {
    color: colors.grayLight,
  },
  headerTextSelected: {
    color: colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
