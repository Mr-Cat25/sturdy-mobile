import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '@/lib/theme';

interface ProgressDotsProps {
  total: number;
  active: number; // 0-indexed
}

export function ProgressDots({ total, active }: ProgressDotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <Dot key={i} isActive={i === active} />
      ))}
    </View>
  );
}

function Dot({ isActive }: { isActive: boolean }) {
  const scale = useSharedValue(isActive ? 1.3 : 1);

  useEffect(() => {
    scale.value = withSpring(isActive ? 1.3 : 1, { damping: 15 });
  }, [isActive]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[styles.dot, isActive && styles.dotActive, animStyle]}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
  },
  dotActive: {
    backgroundColor: colors.amber,
  },
});
