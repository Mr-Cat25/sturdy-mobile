import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { getActiveChild } from '@/lib/childProfile';
import { colors, spacing, radius, shadow } from '@/lib/theme';

export default function AuthScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  // sentEmail is locked once the OTP is dispatched so it cannot change silently
  // between the send and verify steps.
  const [sentEmail, setSentEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up the interval when the component unmounts.
  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const startCooldown = (seconds = 60) => {
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    setCooldown(seconds);
    const id = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          cooldownRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    cooldownRef.current = id;
  };

  const handleSendOTP = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      Alert.alert('Please enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      console.log('[Auth] signInWithOtp → email:', trimmed);
      const { error } = await supabase.auth.signInWithOtp({ email: trimmed });
      console.log('[Auth] signInWithOtp ← error:', error);
      if (error) throw error;
      setSentEmail(trimmed);
      setStep('otp');
      startCooldown();
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.trim().length < 6) {
      Alert.alert('Please enter the 6-digit code from your email');
      return;
    }
    setLoading(true);
    try {
      console.log('[Auth] verifyOtp → email:', sentEmail);
      const { error } = await supabase.auth.verifyOtp({
        email: sentEmail,
        token: otp.trim(),
        type: 'email',
      });
      console.log('[Auth] verifyOtp ← error:', error);
      if (error) throw error;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Signed in, but user not found.');

      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .maybeSingle();

      if (profileErr) throw profileErr;

      if (!profile?.username) {
        router.replace('/setup-account' as any);
        return;
      }

      const child = await getActiveChild();
      router.replace(child ? '/(tabs)' : '/onboarding');
    } catch (e: any) {
      Alert.alert('Invalid code', e.message ?? 'Please check your email and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (cooldown > 0 || loading) return;
    setLoading(true);
    try {
      console.log('[Auth] resend signInWithOtp → email:', sentEmail);
      const { error } = await supabase.auth.signInWithOtp({ email: sentEmail });
      console.log('[Auth] resend signInWithOtp ← error:', error);
      if (error) throw error;
      startCooldown();
      Alert.alert('Code resent', 'A new 6-digit code has been sent to your email.');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Could not resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <View style={styles.container}>
          <View style={styles.heroCard}>
            <Text style={styles.eyebrow}>WELCOME</Text>
            <Text style={styles.title}>Sturdy</Text>
            <Text style={styles.subtitle}>
              {step === 'email'
                ? 'Sign in for calm, practical parenting support in hard moments.'
                : `We sent a 6-digit code to\n${sentEmail}`}
            </Text>
          </View>

          <View style={styles.formCard}>
            {step === 'email' ? (
              <>
                <Text style={styles.label}>Email address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="parent@example.com"
                  placeholderTextColor={colors.grayLight}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={[styles.buttonPrimary, loading && styles.buttonDisabled]}
                  onPress={handleSendOTP}
                  disabled={loading}
                  activeOpacity={0.88}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.paper} />
                  ) : (
                    <Text style={styles.buttonPrimaryText}>Continue</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.label}>Enter your 6-digit code</Text>
                <TextInput
                  style={[styles.input, styles.otpInput]}
                  value={otp}
                  onChangeText={setOtp}
                  placeholder="123456"
                  placeholderTextColor={colors.grayLight}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                />
                <TouchableOpacity
                  style={[styles.buttonPrimary, loading && styles.buttonDisabled]}
                  onPress={handleVerifyOTP}
                  disabled={loading}
                  activeOpacity={0.88}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.paper} />
                  ) : (
                    <Text style={styles.buttonPrimaryText}>Sign In</Text>
                  )}
                </TouchableOpacity>
                <Text style={styles.hint}>
                  {'Didn\'t get an email? Check your spam or promotions folder.\nNote: a custom SMTP configuration is required for reliable delivery.'}
                </Text>
                <TouchableOpacity
                  style={[styles.linkTouch, (cooldown > 0 || loading) && styles.linkDisabled]}
                  onPress={handleResendOTP}
                  disabled={cooldown > 0 || loading}
                >
                  <Text style={[styles.linkText, cooldown > 0 && styles.linkTextMuted]}>
                    {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.linkTouch} onPress={() => setStep('email')}>
                  <Text style={styles.linkText}>← Change email</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <TouchableOpacity style={styles.backTouch} onPress={() => router.back()}>
            <Text style={styles.backText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  heroCard: {
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  formCard: {
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    fontSize: 17,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  otpInput: {
    fontSize: 28,
    textAlign: 'center',
    letterSpacing: 8,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  buttonPrimaryText: {
    color: colors.paper,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  hint: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  linkTouch: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  linkDisabled: {
    opacity: 0.5,
  },
  linkTextMuted: {
    color: colors.grayLight,
  },
  backTouch: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  backText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
