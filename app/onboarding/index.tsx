import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { useAuthSession } from '@/lib/useAuthSession';
import { colors } from '@/lib/theme';
import { ProgressDots } from '@/components/onboarding/ProgressDots';
import FamilyIllustration from '../../assets/family.svg';

export default function OnboardingWelcome() {
  const router = useRouter();
  const { session, loading } = useAuthSession();

  const goToAppOrAuth = () => {
    if (loading) return;
    router.push(session?.user ? '/(tabs)/crisis' : '/auth');
  };

  // Floating + breathing animation (same as landing page)
  const floatY = useSharedValue(0);
  const breathScale = useSharedValue(1);

  // Staggered text fade-in
  const line1Opacity = useSharedValue(0);
  const line1TranslateY = useSharedValue(12);
  const line2Opacity = useSharedValue(0);
  const line2TranslateY = useSharedValue(12);
  const line3Opacity = useSharedValue(0);
  const line3TranslateY = useSharedValue(12);

  useEffect(() => {
    // Float animation
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    breathScale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    // Staggered text
    const ease = { duration: 400, easing: Easing.out(Easing.ease) };
    line1Opacity.value = withDelay(500, withTiming(1, ease));
    line1TranslateY.value = withDelay(500, withTiming(0, ease));
    line2Opacity.value = withDelay(800, withTiming(1, ease));
    line2TranslateY.value = withDelay(800, withTiming(0, ease));
    line3Opacity.value = withDelay(1100, withTiming(1, ease));
    line3TranslateY.value = withDelay(1100, withTiming(0, ease));
  }, []);

  const illustrationStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }, { scale: breathScale.value }],
  }));

  const line1Style = useAnimatedStyle(() => ({
    opacity: line1Opacity.value,
    transform: [{ translateY: line1TranslateY.value }],
  }));
  const line2Style = useAnimatedStyle(() => ({
    opacity: line2Opacity.value,
    transform: [{ translateY: line2TranslateY.value }],
  }));
  const line3Style = useAnimatedStyle(() => ({
    opacity: line3Opacity.value,
    transform: [{ translateY: line3TranslateY.value }],
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Illustration */}
        <View style={styles.illustrationWrapper}>
          <Animated.View style={illustrationStyle}>
            <FamilyIllustration width={280} height={200} />
          </Animated.View>
        </View>

        {/* Text lines */}
        <View style={styles.textBlock}>
          <Animated.Text style={[styles.headline, styles.headlineBold, line1Style]}>
            Parenting is hard.
          </Animated.Text>
          <Animated.Text style={[styles.headline, styles.headlineEmphasis, line2Style]}>
            You're not failing.
          </Animated.Text>
          <Animated.Text style={[styles.subtitle, line3Style]}>
            Let's set up Sturdy so it knows your family.
          </Animated.Text>
        </View>

        {/* Bottom actions */}
        <View style={styles.bottom}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push('/onboarding/name')}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaText}>Let's Go →</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={goToAppOrAuth} style={styles.crisisTouch}>
            <Text style={styles.crisisText}>I need help RIGHT NOW</Text>
          </TouchableOpacity>

          <View style={styles.dotsRow}>
            <ProgressDots total={4} active={0} />
          </View>
        </View>
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
    paddingTop: 16,
    paddingBottom: 32,
  },
  illustrationWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    marginBottom: 32,
    alignItems: 'center',
  },
  headline: {
    fontSize: 28,
    textAlign: 'center',
    color: colors.black,
    marginBottom: 8,
  },
  headlineBold: {
    fontWeight: '800',
  },
  headlineEmphasis: {
    fontWeight: '700',
    color: colors.amber,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 4,
  },
  bottom: {
    alignItems: 'center',
  },
  ctaButton: {
    backgroundColor: colors.amber,
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
  },
  ctaText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  crisisTouch: {
    marginBottom: 24,
  },
  crisisText: {
    fontSize: 14,
    color: colors.gray,
    textDecorationLine: 'underline',
  },
  dotsRow: {
    marginTop: 8,
  },
});
