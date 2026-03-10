import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    paddingHorizontal: 16,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1.2,
    color: '#8B8580',
    textAlign: 'center',
    marginBottom: 8,
  },
  h2: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C1C1E',
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
    padding: 16,
    shadowColor: '#1C1C1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  freeColumn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E8E0D5',
  },
  premiumColumn: {
    backgroundColor: '#FFFBF4',
    borderWidth: 2,
    borderColor: '#E8A040',
    position: 'relative',
    paddingTop: 36,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -1,
    left: 0,
    right: 0,
    backgroundColor: '#E8A040',
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    paddingVertical: 5,
    alignItems: 'center',
  },
  recommendedText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.0,
  },
  planName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 14,
    textAlign: 'center',
  },
  premiumPlanName: {
    color: '#B87020',
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
    color: '#1C1C1E',
  },
  featureTextDimmed: {
    color: '#A0A0A0',
  },
  freeBtn: {
    marginTop: 16,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#1C1C1E',
    paddingVertical: 10,
    alignItems: 'center',
  },
  freeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  premiumBtn: {
    marginTop: 16,
    borderRadius: 999,
    backgroundColor: '#E8A040',
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#E8A040',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  footnote: {
    marginTop: 14,
    textAlign: 'center',
    fontSize: 11,
    color: '#A0A0A0',
    lineHeight: 16,
  },
});
