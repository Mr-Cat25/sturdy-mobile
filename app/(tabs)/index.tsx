// app/(tabs)/index.tsx  — Dashboard (home tab)
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { useActiveChild } from '@/lib/useActiveChild';
import { colors, spacing, radius, shadow } from '@/lib/theme';

export default function DashboardScreen() {
  const router = useRouter();
  const { session, loading } = useRequireAuth();
  const child = useActiveChild();
  const [scriptsRemaining, setScriptsRemaining] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadUsage = async () => {
      // TODO: implement usage loading logic
    };

    loadUsage();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !session) return null;

  const showUpgrade = (feature: string) => {
    Alert.alert(
      '🔒 Premium Feature',
      `${feature} is available on the Sturdy Premium plan.\n\nUpgrade to unlock proactive guidance, progress tracking, and multiple child profiles.`,
      [{ text: 'Not now' }, { text: 'Learn more', onPress: () => {} }],
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>
            {child ? `Hi, ${child.name}'s parent 👋` : 'Welcome to Sturdy 👋'}
          </Text>
          <Text style={styles.greetingSubtitle}>What do you need right now?</Text>
        </View>

        {/* Usage banner (Free tier) */}
        <View style={styles.usageBanner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.usageTitle}>Free plan</Text>
            <Text style={styles.usageSub}>
              {scriptsRemaining === null ? 'Loading usage…' : `${scriptsRemaining} scripts left`}
            </Text>
          </View>

          <TouchableOpacity style={styles.usageBtn} onPress={() => showUpgrade('Unlimited scripts')}>
            <Text style={styles.usageBtnText}>Upgrade</Text>
          </TouchableOpacity>
        </View>

        {/* Free quick actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.card, styles.cardCrisis]}
            onPress={() => router.push('/(tabs)/crisis')}
          >
            <Text style={styles.cardIcon}>🆘</Text>
            <Text style={styles.cardTitle}>Crisis Support</Text>
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>Free</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.cardProfile]}
            onPress={() => router.push(child ? '/(tabs)/profile' : '/onboarding')}
          >
            <Text style={styles.cardIcon}>👧</Text>
            <Text style={styles.cardTitle}>Child Profile</Text>
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>Free</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Premium locked features */}
        <Text style={styles.sectionTitle}>Premium Features</Text>

        <TouchableOpacity
          style={[styles.premiumCard, shadow.card]}
          onPress={() => showUpgrade('Guidance Mode')}
        >
          <Text style={styles.premiumIcon}>💡</Text>
          <View style={styles.premiumText}>
            <Text style={styles.premiumTitle}>Guidance Mode</Text>
            <Text style={styles.premiumSub}>Proactive strategies for calm moments</Text>
          </View>
          <Text style={styles.lockIcon}>🔒</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.premiumCard, shadow.card]}
          onPress={() => showUpgrade('Progress Tracking')}
        >
          <Text style={styles.premiumIcon}>📊</Text>
          <View style={styles.premiumText}>
            <Text style={styles.premiumTitle}>Progress Tracking</Text>
            <Text style={styles.premiumSub}>See patterns and growth over time</Text>
          </View>
          <Text style={styles.lockIcon}>🔒</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.premiumCard, shadow.card]}
          onPress={() => showUpgrade('Multiple Child Profiles')}
        >
          <Text style={styles.premiumIcon}>👨‍👩‍👧‍👦</Text>
          <View style={styles.premiumText}>
            <Text style={styles.premiumTitle}>Multiple Children</Text>
            <Text style={styles.premiumSub}>Support all your kids in one plan</Text>
          </View>
          <Text style={styles.lockIcon}>🔒</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  greeting: { marginBottom: spacing.lg, paddingTop: spacing.sm },
  greetingTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 4 },
  greetingSubtitle: { fontSize: 14, color: colors.textSecondary },
  usageBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  usageTitle: { fontSize: 12, fontWeight: '800', color: colors.grayLight, textTransform: 'uppercase' },
  usageSub: { fontSize: 14, fontWeight: '700', color: colors.text, marginTop: 4 },
  usageBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  usageBtnText: { color: colors.paper, fontSize: 13, fontWeight: '800' },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.grayLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  row: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  card: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardCrisis: { backgroundColor: '#F5EDE9' },
  cardProfile: { backgroundColor: '#E9EFF4' },
  cardIcon: { fontSize: 34 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.text, textAlign: 'center' },
  freeBadge: {
    backgroundColor: colors.sage,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  freeBadgeText: { color: colors.paper, fontSize: 11, fontWeight: '600' },
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  premiumIcon: { fontSize: 28 },
  premiumText: { flex: 1 },
  premiumTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 2 },
  premiumSub: { fontSize: 12, color: colors.textSecondary },
  lockIcon: { fontSize: 20 },
});
