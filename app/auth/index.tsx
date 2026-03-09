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
    // Capture the id in the closure so the callback always clears the correct
    // interval, even if startCooldown is called again before it fires.
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

      // 1) If profile/username missing -> go setup-account
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
          <View style={styles.header}>
            <Text style={styles.title}>Sturdy</Text>
            <Text style={styles.subtitle}>
              {step === 'email'
                ? 'Create your free account or sign in.'
                : `We sent a 6-digit code to\n${sentEmail}`}
            </Text>
          </View>

          {step === 'email' ? (
            <>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="parent@example.com"
                placeholderTextColor="#B0A9A0"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSendOTP}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Continue</Text>
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
                placeholderTextColor="#B0A9A0"
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
              />
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleVerifyOTP}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
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

          <TouchableOpacity style={styles.backTouch} onPress={() => router.back()}>
            <Text style={styles.backText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF6F0' },
  flex: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  header: { marginBottom: 40 },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B6B6B',
    lineHeight: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A453E',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    fontSize: 17,
    color: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#E8E0D5',
    marginBottom: 16,
  },
  otpInput: {
    fontSize: 28,
    textAlign: 'center',
    letterSpacing: 8,
  },
  button: {
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
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  hint: {
    fontSize: 12,
    color: '#8B8580',
    lineHeight: 18,
    marginTop: 12,
    textAlign: 'center',
  },
  linkTouch: { marginTop: 16, alignItems: 'center' },
  linkText: { fontSize: 14, color: '#6B6B6B' },
  linkDisabled: { opacity: 0.5 },
  linkTextMuted: { color: '#B0A9A0' },
  backTouch: { marginTop: 'auto', alignItems: 'center' },
  backText: { fontSize: 14, color: '#A0A0A0' },
});
