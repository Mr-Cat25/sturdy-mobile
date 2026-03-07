import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, StyleSheet, Alert
} from 'react-native';
import { generateScript } from '../../src/lib/api/generateScript';
import type { ScriptResult } from '../../src/lib/api/generateScript';
import { useActiveChild } from '../../src/lib/useActiveChild';
import { TriggerGrid } from '../../src/components/crisis/TriggerGrid';
export default function CrisisScreen() {
  const child = useActiveChild(); 
  
  // New State to track where we are in the flow
  const [step, setStep] = useState(1);
  const [selectedTrigger, setSelectedTrigger] = useState('');
  
  const [situation, setSituation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScriptResult | null>(null);

  const handleTriggerSelect = (trigger: string) => {
    setSelectedTrigger(trigger);
    setStep(2); // Move to the next screen instantly!
  };

 const handleGenerate = async () => {
    if (!situation.trim()) return Alert.alert("Please describe what's happening");
    setLoading(true);
    setResult(null);
    try {
      const fullContext = `Trigger Category: ${selectedTrigger}. Specifics: ${situation}`;
      
      const script = await generateScript({
        situation: fullContext,
        // 1. Force age to be a string, fixing the number error:
        childAge: String(child?.age || 'unknown'),
        // 2. Safely check if neurotype is an array before joining, fixing the join error:
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

  function resetFlow() {
    setStep(1);
    setSelectedTrigger('');
    setSituation('');
    setResult(null);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Header logic - changes based on the step */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>
          {step === 1 ? '🆘 Support' : step === 2 ? 'Details' : 'Your Script'}
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

      {/* STEP 1: The Trigger Grid */}
      {step === 1 && (
        <TriggerGrid onSelect={handleTriggerSelect} />
      )}

      {/* STEP 2: The Specifics (Temporarily a text input) */}
      {step === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.promptText}>
            You selected: <Text style={{fontWeight: 'bold'}}>{selectedTrigger}</Text>
          </Text>
          <Text style={styles.promptSub}>What exactly is happening right now?</Text>
          
          <TextInput
            style={styles.input}
            placeholder="e.g. He's refusing to put on shoes..."
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
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Generate Script</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* STEP 3: The Result */}
      {step === 3 && result && (
        <View style={styles.resultContainer}>
          <Section emoji="🧘" label="Regulate (You first)" text={result.regulate} color="#FEF3C7" />
          <Section emoji="🤝" label="Connect" text={result.connect} color="#DBEAFE" />
          <Section emoji="🧭" label="Guide" text={result.guide} color="#D1FAE5" />
          <Section emoji="🛡️" label="What If (They push back)" text={result.what_if} color="#FCE7F3" />
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
  container: { padding: 20, backgroundColor: '#FAF8F5', flexGrow: 1, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  header: { fontSize: 24, fontWeight: '700', color: '#1A1A1A' },
  resetText: { color: '#EAA05B', fontSize: 16, fontWeight: '600' },
  sub: { fontSize: 16, color: '#888', marginBottom: 20 },
  stepContainer: { marginTop: 10 },
  promptText: { fontSize: 18, color: '#333', marginBottom: 8 },
  promptSub: { fontSize: 14, color: '#666', marginBottom: 16 },
  input: {
    borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 12,
    padding: 16, fontSize: 16, minHeight: 120, textAlignVertical: 'top',
    marginBottom: 20, backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#EAA05B', borderRadius: 30,
    padding: 18, alignItems: 'center', marginBottom: 24,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  resultContainer: { gap: 12, marginTop: 10 },
  section: { borderRadius: 16, padding: 16, marginBottom: 8 },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 8 },
  sectionText: { fontSize: 16, color: '#1A1A1A', lineHeight: 24 },
});