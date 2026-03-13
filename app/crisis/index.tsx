import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, StyleSheet, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateScript } from '../../src/lib/api/generateScript';
import type { ScriptResult } from '../../src/lib/api/generateScript';
import { useActiveChild } from '../../src/lib/useActiveChild';
import { useRequireAuth } from '../../src/lib/useRequireAuth';
import { saveScript } from '../../src/lib/childProfile';
import { TriggerGrid } from '../../src/components/crisis/TriggerGrid';
import { colors, spacing, radius, shadow } from '../../src/lib/theme';

export default function CrisisScreen() {
  const child = useActiveChild();
  const { session, loading: authLoading } = useRequireAuth();

  const [step, setStep] = useState(1);
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [situation, setSituation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScriptResult | null>(null);
  const [saved, setSaved] = useState(false);

  if (authLoading || !session) return null;

  const handleTriggerSelect = (trigger: string) => {
    setSelectedTrigger(trigger);
    setStep(2);
  };

  const handleGenerate = async () => {
    if (!situation.trim()) return Alert.alert("Please describe what's happening");
    setLoading(true);
    setResult(null);
    setSaved(false);
    try {
      const fullContext = `Trigger Category: ${selectedTrigger}. Specifics: ${situation}`;

      const script = await generateScript({
        situation: fullContext,
        childAge: String(child?.age || 'unknown'),
        neurotype: Array.isArray(child?.neurotype)
          ? child.neurotype.join(', ')
          : String(child?.neurotype || 'none'),
        mode: 'crisis',
      });

      setResult(script);
      setStep(3);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    const res = await saveScript({
      trigger: selectedTrigger,
      situation,
      regulate: result.regulate,
      connect: result.connect,
      guide: result.guide,
      what_if: result.what_if,
    });
    if (res.ok) {
      setSaved(true);
      Alert.alert('Saved!', 'This script has been added to your Library.');
    } else if (res.limitReached) {
      Alert.alert(
        '🔒 Library full',
        'Free plan allows saving up to 5 scripts. Remove an old one from Library or upgrade to save more.',
      );
    }
  };

  function resetFlow() {
    setStep(1);
    setSelectedTrigger('');
    setSituation('');
    setResult(null);
    setSaved(false);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>
            {step === 1 ? 'Support' : step === 2 ? 'Details' : 'Your Script'}
          </Text>
          {step > 1 && (
            <TouchableOpacity onPress={resetFlow}>
              <Text style={styles.resetText}>Start Over</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.sub}>
          Supporting {child?.nickname || child?.name || 'your child'}
        </Text>

        {step === 1 && <TriggerGrid onSelect={handleTriggerSelect} />}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.promptText}>
              You selected: <Text style={styles.promptBold}>{selectedTrigger}</Text>
            </Text>
            <Text style={styles.promptSub}>What exactly is happening right now?</Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. He's refusing to put on shoes..."
              placeholderTextColor={colors.grayLight}
              multiline
              numberOfLines={4}
              value={situation}
              onChangeText={setSituation}
              autoFocus
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.paper} />
              ) : (
                <Text style={styles.buttonText}>Generate Script</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && result && (
          <View style={styles.resultContainer}>
            <Section emoji="🧘" label="Regulate (You first)" text={result.regulate} tint="#F0EDE8" accent={colors.clay} />
            <Section emoji="🤝" label="Connect" text={result.connect} tint="#EAF0F4" accent={colors.primary} />
            <Section emoji="🧭" label="Guide" text={result.guide} tint="#EBF2EE" accent={colors.sage} />
            <Section emoji="🛡️" label="What If (They push back)" text={result.what_if} tint="#F4EDEB" accent={colors.danger} />

            <TouchableOpacity
              style={[styles.saveButton, saved && styles.saveButtonSaved]}
              onPress={handleSave}
              disabled={saved}
            >
              <Text style={styles.saveButtonText}>{saved ? '✓ Saved to Library' : '📖 Save to Library'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ emoji, label, text, tint, accent }: {
  emoji: string; label: string; text: string; tint: string; accent: string;
}) {
  return (
    <View style={[styles.section, { backgroundColor: tint, borderLeftColor: accent }]}>
      <Text style={[styles.sectionLabel, { color: accent }]}>{emoji} {label}</Text>
      <Text style={styles.sectionText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.xxl, flexGrow: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  header: { fontSize: 24, fontWeight: '700', color: colors.text },
  resetText: { color: colors.primary, fontSize: 15, fontWeight: '600' },
  sub: { fontSize: 15, color: colors.textSecondary, marginBottom: spacing.md },
  stepContainer: { marginTop: spacing.sm },
  promptText: { fontSize: 17, color: colors.text, marginBottom: spacing.sm },
  promptBold: { fontWeight: '700' },
  promptSub: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.md },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: spacing.lg,
    backgroundColor: colors.paper,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.paper, fontSize: 17, fontWeight: '700' },
  resultContainer: { gap: spacing.sm, marginTop: spacing.sm },
  section: {
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xs,
    borderLeftWidth: 3,
  },
  sectionLabel: { fontSize: 13, fontWeight: '700', marginBottom: spacing.sm, letterSpacing: 0.3 },
  sectionText: { fontSize: 16, color: colors.text, lineHeight: 24 },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  saveButtonSaved: { backgroundColor: colors.sage },
  saveButtonText: { color: colors.paper, fontSize: 15, fontWeight: '700' },
});
