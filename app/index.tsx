import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useActiveChild } from '@/lib/useActiveChild';
import { useAuthSession } from '@/lib/useAuthSession';
import { CrisisDemo } from '@/components/landing/CrisisDemo';
import { PlanComparison } from '@/components/landing/PlanComparison';
import { TestimonialSlider } from '@/components/landing/TestimonialSlider';
import FamilyIllustration from '../assets/family.svg';
import SturdyLogo from '../assets/logo.svg';

export default function LandingPage() {
  const router = useRouter();
  const child = useActiveChild();
  const { session, loading } = useAuthSession();
  const [showStickyBar, setShowStickyBar] = useState(false);

  const goToAppOrAuth = () => {
    if (loading) return;
    router.push(session?.user ? '/(tabs)' : '/auth');
  };

  // Floating + breathing animation for family illustration
  const floatY = useSharedValue(0);
  const breathScale = useSharedValue(1);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    breathScale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedIllustrationStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }, { scale: breathScale.value }],
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          const offsetY = e.nativeEvent.contentOffset.y;
          setShowStickyBar(offsetY > 300);
        }}
        scrollEventThrottle={16}
      >
        {/* 1. Nav */}
        <View style={styles.nav}>
          <SturdyLogo width={120} height={50} />
          <TouchableOpacity style={styles.navPill} onPress={goToAppOrAuth}>
            <Text style={styles.navPillText}>Get Started</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Hero */}
        <View style={styles.hero}>
          <View style={styles.illustration}>
            <Animated.View style={animatedIllustrationStyle}>
              <FamilyIllustration width={280} height={200} />
            </Animated.View>
          </View>
          <Text style={styles.heroTitle}>The words you need,{'\n'}when you need them.</Text>
          <Text style={styles.heroSub}>
            Instant parenting scripts for real moments. Grounded{'\n'}
            in Conscious Discipline and Attachment Theory.
          </Text>
          <TouchableOpacity style={styles.ctaBtn} onPress={goToAppOrAuth}>
            <Text style={styles.ctaBtnText}>Start Free — Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* 3. Social Proof Bar */}
        <View style={styles.socialProofBar}>
          <Text style={styles.socialProofText}>
            {'👨‍👩‍👧  Trusted by parents everywhere  ·  ⭐ 4.9 average rating'}
          </Text>
          <Text style={styles.socialProofText}>
            {'🧠  Built on real developmental science'}
          </Text>
        </View>

        {/* 4. Active Child Chip */}
        <View style={{ marginTop: 8, marginBottom: 16, alignItems: 'center' }}>
          {child ? (
            <View style={styles.childChip}>
              <Text style={styles.childChipText}>
                {'For '}
                {child.name}
                {child.age ? ` · ${child.age}` : ''}
                {child.neurotype && !child.neurotype.includes('None')
                  ? ` · ${child.neurotype.join(', ')}`
                  : ''}
              </Text>
            </View>
          ) : (
            <TouchableOpacity onPress={goToAppOrAuth}>
              <Text style={styles.addChildText}>Add a child profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 5. Features Card */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>What Sturdy gives you</Text>
          <View style={styles.featureRow}>
            <View style={styles.featureIconBox}>
              <Text style={styles.featureIconText}>⚡</Text>
            </View>
            <View>
              <Text style={styles.featureLabel}>Crisis scripts in 3 taps</Text>
              <Text style={styles.featureSub}>When it's already escalated</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.featureRow}>
            <View style={styles.featureIconBox}>
              <Text style={styles.featureIconText}>🤍</Text>
            </View>
            <View>
              <Text style={styles.featureLabel}>Tailored to your child</Text>
              <Text style={styles.featureSub}>Age, name, and neurotype aware</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.featureRow}>
            <View style={styles.featureIconBox}>
              <Text style={styles.featureIconText}>📖</Text>
            </View>
            <View>
              <Text style={styles.featureLabel}>Guidance for the calm moments</Text>
              <Text style={styles.featureSub}>Build long-term strategies</Text>
            </View>
          </View>
        </View>

        {/* 6. CrisisDemo */}
        <View style={styles.section}>
          <CrisisDemo />
        </View>

        {/* 7. Plan Comparison */}
        <View style={styles.section}>
          <PlanComparison onStartFree={goToAppOrAuth} onTryPremium={goToAppOrAuth} />
        </View>

        {/* 8. Testimonial Slider */}
        <View style={styles.section}>
          <TestimonialSlider />
        </View>

        {/* 9. Mode Cards */}
        <View style={styles.modesRow}>
          <TouchableOpacity style={[styles.modeCard, styles.modeRed]} onPress={goToAppOrAuth}>
            <Text style={styles.modeIcon}>🆘</Text>
            <Text style={styles.modeTitle}>Crisis Mode</Text>
            <Text style={styles.modeSub}>Always Free</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modeCard, styles.modeTeal]} onPress={goToAppOrAuth}>
            <Text style={styles.modeIcon}>💡</Text>
            <Text style={styles.modeTitle}>Guidance Mode</Text>
            <Text style={styles.modeSub}>Premium</Text>
          </TouchableOpacity>
        </View>

        {/* 10. Footer */}
        <Text style={styles.footer}>
          Crisis Mode is always free. Premium unlocks deep learning.
        </Text>

        {/* Bottom padding so sticky bar doesn't overlap last content */}
        <View style={styles.stickyBarSpacer} />
      </ScrollView>

      {/* 11. Sticky Bottom CTA */}
      {showStickyBar && (
        <View style={styles.stickyBar}>
          <TouchableOpacity style={styles.stickyBtn} onPress={goToAppOrAuth}>
            <Text style={styles.stickyBtnText}>Get Started Free</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF6F0' },

  // Nav
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  navPill: {
    backgroundColor: '#E8A040',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  navPillText: { color: '#fff', fontSize: 14, fontWeight: '600' },

  // Hero
  hero: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 8 },
  illustration: {
    width: '100%',
    height: 220,
    backgroundColor: '#F0E6D6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1C1C1E',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 12,
  },
  heroSub: {
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  ctaBtn: {
    backgroundColor: '#E8A040',
    borderRadius: 999,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: '#E8A040',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Social Proof Bar
  socialProofBar: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  socialProofText: {
    fontSize: 13,
    color: '#8B8580',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Child chip
  childChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E8E0D5',
  },
  childChipText: { fontSize: 13, color: '#4A453E' },
  addChildText: {
    fontSize: 13,
    color: '#6B6B6B',
    textDecorationLine: 'underline',
  },

  // Features Card
  featuresCard: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 4,
  },
  featureIconBox: {
    width: 44,
    height: 44,
    backgroundColor: '#FFF0D9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIconText: { fontSize: 20 },
  featureLabel: { fontSize: 15, fontWeight: '600', color: '#1C1C1E' },
  featureSub: { fontSize: 12, color: '#6B6B6B', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F0EAE0', marginVertical: 14 },

  // Shared section spacing
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },

  // Mode Cards
  modesRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  modeCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  modeRed: { backgroundColor: '#FADADD' },
  modeTeal: { backgroundColor: '#D4ECF0' },
  modeIcon: { fontSize: 32, marginBottom: 8 },
  modeTitle: { fontSize: 15, fontWeight: '700', color: '#1C1C1E', marginBottom: 4 },
  modeSub: { fontSize: 12, color: '#6B6B6B', fontWeight: '500' },

  // Footer
  footer: {
    textAlign: 'center',
    color: '#A0A0A0',
    fontSize: 12,
    paddingBottom: 8,
    paddingHorizontal: 24,
    lineHeight: 18,
  },

  // Spacer to ensure content isn't hidden behind sticky bar
  stickyBarSpacer: {
    height: 80,
  },

  // Sticky Bottom CTA
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(250, 246, 240, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E8E0D5',
    shadowColor: '#1C1C1E',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  stickyBtn: {
    backgroundColor: '#E8A040',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#E8A040',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  stickyBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
