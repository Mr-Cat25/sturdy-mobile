import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { colors, spacing } from '@/lib/theme';

interface MicrocopyBubbleProps {
  text: string;
  emoji?: string;
}

export function MicrocopyBubble({ text, emoji = '💬' }: MicrocopyBubbleProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <Text style={styles.text}>
        {emoji} {text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  text: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
