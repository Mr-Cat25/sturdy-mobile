import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActiveChild } from '@/lib/useActiveChild';
import FamilyIllustration from '../assets/family.svg';
import { CrisisDemo } from '@/components/landing/CrisisDemo';
import { useAuthSession } from '@/lib/useAuthSession';

export default function LandingPage() {
  const router = useRouter();
  const child = useActiveChild();
  const { session, loading } = useAuthSession();

const goToAppOrAuth = () => {
  if (loading) return;
  router.push(session?.user ? '/(tabs)' : '/auth');
};
 const handleGuidancePress = () => {
  goToAppOrAuth();
};;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.nav}>
          <Text style={styles.logo}>Sturdy</Text>
          <TouchableOpacity style={styles.navPill} onPress={() => router.push('/auth')}>
            <Text style={styles.navPillText}>Get Started</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <View style={styles.illustration}>
            <FamilyIllustration width={280} height={200} />
          </View>
          <Text style={styles.heroTitle}>The words you need,{"\n"}when you need them.</Text>
          <Text style={styles.heroSub}>
            Instant parenting scripts for real moments. Grounded{"\n"}
            in Conscious Discipline and Attachment Theory.
          </Text>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/auth')}>
            <Text style={styles.ctaBtnText}>Start Free - Create Account</Text>
          </TouchableOpacity>

          {/* Active child chip */}
          <View style={{ marginTop: 16, alignItems: 'center' }}>
            {child ? (
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: '#FFF',
                  borderWidth: 1,
                  borderColor: '#E8E0D5',
                }}
              >
                <Text style={{ fontSize: 13, color: '#4A453E' }}>
                  For {child.name}
                  {child.age ? ` · ${child.age}` : ''}
                  {child.neurotype && !child.neurotype.includes('None')
                    ? ` · ${child.neurotype.join(', ')}`
                    : ''}
                </Text>
              </View>
            ) : (
              <TouchableOpacity onPress={() => router.push('/auth')}>
                <Text style={{ fontSize: 13, color: '#6B6B6B', textDecorationLine: 'underline' }}>
                  Add a child profile
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
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

        <CrisisDemo />

        <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/auth')}>
          <Text style={styles.ctaBtnText}>Try Crisis Mode</Text>
        </TouchableOpacity>
        <View style={styles.modesRow}>
          <TouchableOpacity style={[styles.modeCard, styles.modeRed]} onPress={() => router.push('/auth')}>
            <Text style={styles.modeIcon}>🆘</Text>
            <Text style={styles.modeTitle}>Crisis Mode</Text>
            <Text style={styles.modeSub}>Always Free</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modeCard, styles.modeTeal]} onPress={handleGuidancePress}>
            <Text style={styles.modeIcon}>💡</Text>
            <Text style={styles.modeTitle}>Guidance Mode</Text>
            <Text style={styles.modeSub}>Premium</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.testimonialCard}>
          <Text style={styles.stars}>★★★★★</Text>
          <Text style={styles.quote}>"I used it mid-tantrum and it actually worked."</Text>
          <Text style={styles.quoteAuthor}>- Sarah, mom of 3.</Text>
        </View>

        <Text style={styles.footer}>Crisis Mode is always free. Premium unlocks deep learning.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF6F0' },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  logo: { fontSize: 22, fontWeight: '700', color: '#1C1C1E' },
  navPill: { backgroundColor: '#E8A040', borderRadius: 999, paddingHorizontal: 18, paddingVertical: 8 },
  navPillText: { color: '#fff', fontSize: 14, fontWeight: '600' },
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
  heroSub: { fontSize: 14, color: '#6B6B6B', textAlign: 'center', lineHeight: 21, marginBottom: 24 },
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
  featuresTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C1E', textAlign: 'center', marginBottom: 20 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 4 },
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
  modesRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginBottom: 16 },
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
  testimonialCard: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  stars: { fontSize: 20, color: '#E8A040', marginBottom: 10, letterSpacing: 3 },
  quote: { fontSize: 14, fontStyle: 'italic', color: '#1C1C1E', textAlign: 'center', lineHeight: 22 },
  quoteAuthor: { fontSize: 13, color: '#6B6B6B', marginTop: 8 },
  footer: {
    textAlign: 'center',
    color: '#A0A0A0',
    fontSize: 12,
    paddingBottom: 32,
    paddingHorizontal: 24,
    lineHeight: 18,
  },
});