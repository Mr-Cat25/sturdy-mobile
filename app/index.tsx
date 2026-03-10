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
    <SafeAreaView style={s.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        onScroll={(e) => setShowStickyBar(e.nativeEvent.contentOffset.y > 300)}
        scrollEventThrottle={16}
      >
        {/* ── Nav ── */}
        <View style={s.nav}>
          <SturdyLogo width={110} height={44} />
          <TouchableOpacity style={s.navPill} onPress={goToAppOrAuth} activeOpacity={0.85}>
            <Text style={s.navPillText}>Get Started</Text>
          </TouchableOpacity>
        </View>

        {/* ── Hero ── */}
        <View style={s.heroCard}>
          <View style={s.illustrationShell}>
            <Animated.View style={animatedIllustrationStyle}>
              <FamilyIllustration width={260} height={190} />
            </Animated.View>
          </View>

          <Text style={s.heroTitle}>
            The words you need,{'\n'}when you need them.
          </Text>
          <Text style={s.heroSub}>
            Instant parenting scripts for real moments.{'\n'}
            Grounded in Conscious Discipline & Attachment Theory.
          </Text>

          <TouchableOpacity style={s.ctaBtn} onPress={goToAppOrAuth} activeOpacity={0.88}>
            <Text style={s.ctaBtnText}>Start Free — Create Account</Text>
          </TouchableOpacity>

          {child ? (
            <View style={s.childChip}>
              <Text style={s.childChipText}>
                For {child.name}
                {child.age ? ` · ${child.age}` : ''}
                {child.neurotype && !child.neurotype.includes('None')
                  ? ` · ${child.neurotype.join(', ')}`
                  : ''}
              </Text>
            </View>
          ) : (
            <TouchableOpacity onPress={goToAppOrAuth}>
              <Text style={s.addChildText}>+ Add a child profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Social Proof ── */}
        <View style={s.proofBar}>
          <View style={s.proofItem}>
            <Text style={s.proofEmoji}>👨‍👩‍👧</Text>
            <Text style={s.proofText}>Trusted by parents everywhere</Text>
          </View>
          <View style={s.proofDot} />
          <View style={s.proofItem}>
            <Text style={s.proofEmoji}>⭐</Text>
            <Text style={s.proofText}>4.9 average rating</Text>
          </View>
          <View style={s.proofDot} />
          <View style={s.proofItem}>
            <Text style={s.proofEmoji}>🧠</Text>
            <Text style={s.proofText}>Real developmental science</Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* ── Section: Features ── */}
        <View style={s.section}>
          <Text style={s.sectionEyebrow}>WHAT YOU GET</Text>
          <Text style={s.sectionTitle}>What Sturdy gives you</Text>

          <View style={s.featuresGrid}>
            <View style={[s.featureCard, s.featureWarm]}>
              <View style={s.featureIconBox}>
                <Text style={s.featureIcon}>⚡</Text>
              </View>
              <Text style={s.featureLabel}>Crisis scripts in 3 taps</Text>
              <Text style={s.featureSub}>When it&apos;s already escalated</Text>
            </View>
            <View style={[s.featureCard, s.featureCool]}>
              <View style={s.featureIconBox}>
                <Text style={s.featureIcon}>🤍</Text>
              </View>
              <Text style={s.featureLabel}>Tailored to your child</Text>
              <Text style={s.featureSub}>Age, name & neurotype aware</Text>
            </View>
            <View style={[s.featureCard, s.featureNeutral]}>
              <View style={s.featureRowInline}>
                <View style={s.featureIconBox}>
                  <Text style={s.featureIcon}>📖</Text>
                </View>
                <View style={s.featureTextWrap}>
                  <Text style={s.featureLabel}>Guidance for the calm moments</Text>
                  <Text style={s.featureSub}>Build long-term strategies with steady support</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={s.divider} />

        {/* ── Section: Crisis Demo ── */}
        <View style={s.section}>
          <CrisisDemo />
        </View>

        <View style={s.divider} />

        {/* ── Section: Plans ── */}
        <View style={s.section}>
          <PlanComparison onStartFree={goToAppOrAuth} onTryPremium={goToAppOrAuth} />
        </View>

        <View style={s.divider} />

        {/* ── Section: Testimonials ── */}
        <View style={s.section}>
          <TestimonialSlider />
        </View>

        <View style={s.divider} />

        {/* ── Section: Mode Cards ── */}
        <View style={s.section}>
          <Text style={s.sectionEyebrow}>TWO MODES</Text>
          <Text style={s.sectionTitle}>Choose how Sturdy helps</Text>

          <View style={s.modesRow}>
            <TouchableOpacity
              style={[s.modeCard, s.modeRed]}
              onPress={goToAppOrAuth}
              activeOpacity={0.85}
            >
              <Text style={s.modeIcon}>🆘</Text>
              <Text style={s.modeTitle}>Crisis Mode</Text>
              <Text style={s.modeBadge}>Always Free</Text>
              <Text style={s.modeSub}>Fast help when it&apos;s already escalated</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.modeCard, s.modeTeal]}
              onPress={goToAppOrAuth}
              activeOpacity={0.85}
            >
              <Text style={s.modeIcon}>💡</Text>
              <Text style={s.modeTitle}>Guidance Mode</Text>
              <Text style={s.modeBadge}>Premium</Text>
              <Text style={s.modeSub}>Long-term coaching for calmer homes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={s.footerBlock}>
          <Text style={s.footerTitle}>
            Parenting is hard.{'\n'}The words shouldn&apos;t be.
          </Text>
          <Text style={s.footerSub}>
            Crisis Mode is always free. Premium unlocks deeper guidance.
          </Text>
          <TouchableOpacity style={s.footerCta} onPress={goToAppOrAuth} activeOpacity={0.88}>
            <Text style={s.footerCtaText}>Get Started Free</Text>
          </TouchableOpacity>
        </View>

        <View style={s.stickyBarSpacer} />
      </ScrollView>

      {showStickyBar && (
        <View style={s.stickyBar}>
          <TouchableOpacity style={s.stickyBtn} onPress={goToAppOrAuth} activeOpacity={0.88}>
            <Text style={s.stickyBtnText}>Get Started Free</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

/* ═══════════════════════════  STYLES  ═══════════════════════════ */

const CREAM = '#FAF6F0';
const AMBER = '#E8A040';
const BLACK = '#1C1C1E';
const GRAY = '#6B6B6B';
const GRAY_LIGHT = '#8B8580';
const BORDER = '#E8E0D5';

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CREAM },
  scrollContent: { paddingBottom: 32 },

  /* ── Nav ── */
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
  },
  navPill: {
    backgroundColor: AMBER,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  navPillText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  /* ── Hero Card ── */
  heroCard: {
    marginHorizontal: 16,
    marginTop: 4,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: '#F0E6D9',
    alignItems: 'center',
  },
  illustrationShell: {
    width: '100%',
    height: 210,
    borderRadius: 22,
    backgroundColor: '#F3E8D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: BLACK,
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: -0.6,
    marginBottom: 10,
  },
  heroSub: {
    fontSize: 14,
    color: GRAY,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  ctaBtn: {
    backgroundColor: AMBER,
    borderRadius: 999,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: AMBER,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  childChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: BORDER,
  },
  childChipText: { fontSize: 13, color: '#4A453E', fontWeight: '500' },
  addChildText: { fontSize: 13, color: GRAY, textDecorationLine: 'underline' },

  /* ── Social Proof ── */
  proofBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 6,
  },
  proofItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  proofEmoji: { fontSize: 14 },
  proofText: { fontSize: 12, color: GRAY_LIGHT },
  proofDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: BORDER,
  },

  /* ── Divider ── */
  divider: {
    height: 1,
    backgroundColor: '#EDE5DA',
    marginHorizontal: 32,
    marginVertical: 8,
  },

  /* ── Section ── */
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: GRAY_LIGHT,
    textAlign: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: BLACK,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.3,
  },

  /* ── Features Grid ── */
  featuresGrid: { gap: 12 },
  featureCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F0E8DE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  featureWarm: { backgroundColor: '#FFF9F2' },
  featureCool: { backgroundColor: '#F7FBF8' },
  featureNeutral: { backgroundColor: '#FFFFFF' },
  featureIconBox: {
    width: 44,
    height: 44,
    backgroundColor: '#FFF0D9',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  featureIcon: { fontSize: 20 },
  featureLabel: { fontSize: 16, fontWeight: '700', color: BLACK, marginBottom: 4 },
  featureSub: { fontSize: 13, color: GRAY, lineHeight: 19 },
  featureRowInline: { flexDirection: 'row', alignItems: 'center' },
  featureTextWrap: { flex: 1, marginLeft: 14 },

  /* ── Mode Cards ── */
  modesRow: { flexDirection: 'row', gap: 12 },
  modeCard: {
    flex: 1,
    borderRadius: 22,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  modeRed: { backgroundColor: '#FBE6E8' },
  modeTeal: { backgroundColor: '#DFF1F4' },
  modeIcon: { fontSize: 30, marginBottom: 8 },
  modeTitle: { fontSize: 16, fontWeight: '800', color: BLACK, marginBottom: 4 },
  modeBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: AMBER,
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  modeSub: { fontSize: 12, color: GRAY, textAlign: 'center', lineHeight: 17 },

  /* ── Footer ── */
  footerBlock: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: BLACK,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 8,
  },
  footerSub: {
    fontSize: 13,
    color: GRAY_LIGHT,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  footerCta: {
    backgroundColor: AMBER,
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: 'center',
    shadowColor: AMBER,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  footerCtaText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  /* ── Sticky CTA ── */
  stickyBarSpacer: { height: 80 },
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(250, 246, 240, 0.96)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  stickyBtn: {
    backgroundColor: AMBER,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: AMBER,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  stickyBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
