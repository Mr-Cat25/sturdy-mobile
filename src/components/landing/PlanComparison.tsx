import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing, radius, shadow } from '@/lib/theme';

type FeatureItem = {
  text: string;
  included: boolean;
};

const FREE_FEATURES: FeatureItem[] = [
  { text: 'Crisis Mode', included: true },
  { text: '1 Child Profile', included: true },
  { text: 'Save up to 5 Scripts', included: true },
  { text: 'Guidance Mode', included: false },
  { text: 'Multiple Children', included: false },
  { text: 'Progress Tracking', included: false },
];

const PREMIUM_FEATURES: FeatureItem[] = [
  { text: 'Everything in Free', included: true },
  { text: 'Guidance Mode — proactive strategies', included: true },
  { text: 'Unlimited Saved Scripts', included: true },
  { text: 'Multiple Child Profiles', included: true },
  { text: 'Progress Tracking', included: true },
  { text: 'Priority Support', included: true },
];

type Props = {
  onStartFree: () => void;
  onTryPremium: () => void;
};

export function PlanComparison({ onStartFree, onTryPremium }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>PLANS</Text>
      <Text style={styles.h2}>Start free. Grow when you're ready.</Text>

      <View style={styles.columnsRow}>
        {/* Free column */}
        <View style={[styles.column, styles.freeColumn]}>
          <Text style={styles.planName}>Free Forever</Text>
          {FREE_FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={[styles.featureIcon, f.included ? styles.iconIncluded : styles.iconExcluded]}>
                {f.included ? '✅' : '❌'}
              </Text>
              <Text style={[styles.featureText, !f.included && styles.featureTextDimmed]}>
                {f.text}
              </Text>
            </View>
          ))}
          <TouchableOpacity style={styles.freeBtn} onPress={onStartFree}>
            <Text style={styles.freeBtnText}>Start Free</Text>
          </TouchableOpacity>
        </View>

        {/* Premium column */}
        <View style={[styles.column, styles.premiumColumn]}>
          <View style={styles.recommendedBadge}>
            <Text style={styles.recommendedText}>RECOMMENDED</Text>
          </View>
          <Text style={[styles.planName, styles.premiumPlanName]}>Premium</Text>
          {PREMIUM_FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureIcon}>✅</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.premiumBtn} onPress={onTryPremium}>
            <Text style={styles.premiumBtnText}>Try Premium</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.footnote}>No hidden fees. Pricing handled securely through Google Play.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: spacing.md,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1.2,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  h2: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  columnsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  column: {
    flex: 1,
    borderRadius: 18,
    padding: spacing.md,
    ...shadow.soft,
  },
  freeColumn: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.border,
  },
  premiumColumn: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
    position: 'relative',
    paddingTop: 36,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -1,
    left: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    paddingVertical: 5,
    alignItems: 'center',
  },
  recommendedText: {
    color: colors.paper,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.0,
  },
  planName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 14,
    textAlign: 'center',
  },
  premiumPlanName: {
    color: colors.primary,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 12,
    marginTop: 1,
  },
  iconIncluded: {},
  iconExcluded: {
    opacity: 0.5,
  },
  featureText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: colors.text,
  },
  featureTextDimmed: {
    color: colors.grayLight,
  },
  freeBtn: {
    marginTop: 16,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.text,
    paddingVertical: 10,
    alignItems: 'center',
  },
  freeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  premiumBtn: {
    marginTop: 16,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.paper,
  },
  footnote: {
    marginTop: 14,
    textAlign: 'center',
    fontSize: 11,
    color: colors.grayLight,
    lineHeight: 16,
  },
});
