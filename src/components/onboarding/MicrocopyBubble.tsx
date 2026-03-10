import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface MicrocopyBubbleProps {
  text: string;
  emoji?: string;
}

export function MicrocopyBubble({ text, emoji = '💬' }: MicrocopyBubbleProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

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
    marginTop: 16,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 13,
    color: '#8B8580',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
