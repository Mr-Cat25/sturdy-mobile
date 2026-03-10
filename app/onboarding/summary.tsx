import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { colors, radius, shadow } from '@/lib/theme';

export default function OnboardingSummaryScreen() {
  const router = useRouter();
  const { name, nickname, age, neurotype } = useLocalSearchParams<{
    name: string;
    nickname: string;
    age: string;
    neurotype: string;
  }>();

  const displayName = nickname || name || 'Your child';
  const displayAge = age || 'Not set';
  const neurotypes = neurotype ? neurotype.split(',').filter(Boolean) : [];
  const displayNeurotype = neurotypes.length > 0 ? neurotypes.join(', ') : 'Not specified';

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);

  useEffect(() => {
    const ease = { duration: 500, easing: Easing.out(Easing.ease) };
    opacity.value = withDelay(100, withTiming(1, ease));
    translateY.value = withDelay(100, withTiming(0, ease));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const goToTabs = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Animated.View style={[styles.content, animStyle]}>
          {/* Celebration title */}
          <Text style={styles.emoji}>✨</Text>
          <Text style={styles.title}>You're all set.</Text>
          <Text style={styles.subtitle}>
            Sturdy will now generate scripts tuned for {displayName}.
          </Text>

          {/* Profile summary card */}
          <View style={styles.card}>
            <View style={styles.cardAccent} />
            <View style={styles.cardBody}>
              <Text style={styles.cardName}>{displayName}</Text>

              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Age</Text>
                <Text style={styles.cardValue}>{displayAge}</Text>
              </View>

              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Brain type</Text>
                <Text style={styles.cardValue}>{displayNeurotype}</Text>
              </View>
            </View>
          </View>

          {/* Primary CTA */}
          <TouchableOpacity style={styles.primaryButton} onPress={goToTabs}>
            <Text style={styles.primaryButtonText}>Try Crisis Mode — It's Free</Text>
          </TouchableOpacity>

          {/* Secondary link */}
          <TouchableOpacity onPress={goToTabs} style={styles.secondaryTouch}>
            <Text style={styles.secondaryText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </Animated.View>
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
    paddingTop: 40,
    paddingBottom: 32,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    ...shadow.card,
    marginBottom: 32,
    width: '100%',
    overflow: 'hidden',
  },
  cardAccent: {
    width: 4,
    backgroundColor: colors.amber,
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 14,
    color: colors.grayLight,
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
  primaryButton: {
    backgroundColor: colors.amber,
    borderRadius: radius.full,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryTouch: {
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 14,
    color: colors.gray,
    textDecorationLine: 'underline',
  },
});
