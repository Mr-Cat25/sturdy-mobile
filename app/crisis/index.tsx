import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, StyleSheet, Alert
} from 'react-native';
import { generateScript } from '@/lib/api/generateScript';
import type { ScriptResult } from '@/lib/api/generateScript';

export default function CrisisScreen() {
  const [situation, setSituation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScriptResult | null>(null);

  const handleGenerate = async () => {
    if (!situation.trim()) return Alert.alert('Please describe what\'s happening');
    setLoading(true);
    setResult(null);
    try {
      const script = await generateScript({
        situation,
        childName: 'Tyler',       // hardcoded for now — will come from profile
        childAge: 5,
        neurotype: 'Autistic',
        tonePreference: 'Calm',
        mode: 'crisis',
      });
      setResult(script);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🆘 What's happening?</Text>
      <Text style={styles.sub}>Describe the situation in your own words</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. He's refusing to put on shoes and screaming..."
        multiline
        numberOfLines={4}
        value={situation}
        onChangeText={setSituation}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleGenerate}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Get My Script</Text>
        }
      </TouchableOpacity>

      {result && (
        <View style={styles.resultContainer}>
          <Section emoji="🧘" label="Regulate (You first)" text={result.regulate} color="#FEF3C7" />
          <Section emoji="🤝" label="Connect" text={result.connect} color="#DBEAFE" />
          <Section emoji="🧭" label="Guide" text={result.guide} color="#D1FAE5" />
          <Section emoji="💛" label="Repair" text={result.repair} color="#FCE7F3" />
        </View>
      )}
    </ScrollView>
  );
}

function Section({ emoji, label, text, color }: {
  emoji: string; label: string; text: string; color: string;
}) {
  return (
    <View style={[styles.section, { backgroundColor: color }]}>
      <Text style={styles.sectionLabel}>{emoji} {label}</Text>
      <Text style={styles.sectionText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 6, color: '#1f2937' },
  sub: { fontSize: 14, color: '#6b7280', marginBottom: 16 },
  input: {
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12,
    padding: 14, fontSize: 15, minHeight: 100, textAlignVertical: 'top',
    marginBottom: 16, backgroundColor: '#f9fafb',
  },
  button: {
    backgroundColor: '#ef4444', borderRadius: 12,
    padding: 16, alignItems: 'center', marginBottom: 24,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  resultContainer: { gap: 12 },
  section: { borderRadius: 12, padding: 16, marginBottom: 4 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 6 },
  sectionText: { fontSize: 15, color: '#1f2937', lineHeight: 22 },
});
