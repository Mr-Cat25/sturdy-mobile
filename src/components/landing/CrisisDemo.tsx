import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

type DemoStep = 0 | 1 | 2;

const TYPE_TEXT = "He won’t put his shoes on and keeps yelling NO.";

export function CrisisDemo() {
  const [step, setStep] = useState<DemoStep>(0);
  const [loopCount, setLoopCount] = useState(0);

  // animation values
  const fade = useRef(new Animated.Value(1)).current;
  const lift = useRef(new Animated.Value(0)).current;

  const isDone = loopCount >= 3;

  const stepDurationMs = 2600;
  const transitionMs = 350;

  const title = useMemo(() => {
    if (step === 0) return 'WHAT YOU TYPE';
    if (step === 1) return 'QUICK CHECK';
    return 'YOUR CALM SCRIPT (REGULATE → CONNECT → GUIDE → WHAT IF)';
  }, [step]);

  useEffect(() => {
    if (isDone) return;

    const timeout = setTimeout(() => {
      // transition out
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 0,
          duration: transitionMs,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(lift, {
          toValue: -6,
          duration: transitionMs,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // advance step / loop
        setStep((prev) => {
          const next = ((prev + 1) % 3) as DemoStep;
          return next;
        });

        setLoopCount((prev) => {
          // only increment when we complete a cycle and return to step 0
          const completedCycle = step === 2;
          return completedCycle ? prev + 1 : prev;
        });

        // transition in
        lift.setValue(6);
        Animated.parallel([
          Animated.timing(fade, {
            toValue: 1,
            duration: transitionMs,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(lift, {
            toValue: 0,
            duration: transitionMs,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, stepDurationMs);

    return () => clearTimeout(timeout);
    // NOTE: step is intentionally included so each step schedules its own timer.
  }, [fade, lift, isDone, step, stepDurationMs]);

  // Stop on final "script" frame after 3 loops.
  useEffect(() => {
    if (!isDone) return;
    setStep(2);
  }, [isDone]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>SEE IT IN ACTION</Text>
      <Text style={styles.h2}>A messy moment in. Calm words out.</Text>
      <Text style={styles.sub}>
        One sentence is enough. No perfect wording needed.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>

        <Animated.View style={{ opacity: fade, transform: [{ translateY: lift }] }}>
          {step === 0 ? <WhatYouType /> : step === 1 ? <QuickCheck /> : <CalmScript />}
        </Animated.View>
      </View>
    </View>
  );
}

function WhatYouType() {
  return (
    <View style={{ marginTop: 10 }}>
      <View style={styles.inputBubble}>
        <Text style={styles.inputText}>“{TYPE_TEXT}”</Text>
      </View>
      <Text style={styles.microcopy}>One sentence is enough.</Text>
    </View>
  );
}

function QuickCheck() {
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.prompt}>Sturdy: “Quick check — which is closer?”</Text>
      <View style={styles.pillsRow}>
        <View style={[styles.pill, styles.pillSelected]}>
          <Text style={[styles.pillText, styles.pillTextSelected]}>Refusing a task</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Power struggle</Text>
        </View>
      </View>
      <Text style={styles.microcopy}>One question — just enough to get it right.</Text>
    </View>
  );
}

function CalmScript() {
  return (
    <View style={{ marginTop: 10 }}>
      <View style={styles.scriptRow}>
        <Text style={styles.scriptLabel}>REGULATE</Text>
        <Text style={styles.scriptText}>“I’m taking one breath.”</Text>
      </View>
      <View style={styles.scriptRow}>
        <Text style={styles.scriptLabel}>CONNECT</Text>
        <Text style={styles.scriptText}>“You don’t want to stop. That’s hard.”</Text>
      </View>
      <View style={styles.scriptRow}>
        <Text style={styles.scriptLabel}>GUIDE</Text>
        <Text style={styles.scriptText}>“Shoes on now. Red or blue?”</Text>
      </View>
      <View style={styles.scriptRow}>
        <Text style={styles.scriptLabel}>WHAT IF…</Text>
        <Text style={styles.scriptText}>“If they refuse: I’ll help your body get started.”</Text>
      </View>
      <Text style={styles.microcopy}>Takes under 60 seconds when you need it most.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 18,
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1.2,
    color: '#8B8580',
    textAlign: 'center',
    marginBottom: 10,
  },
  h2: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B6B6B',
    textAlign: 'center',
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E8E0D5',
    borderRadius: 18,
    padding: 16,
  },
  cardTitle: {
    fontSize: 12,
    letterSpacing: 1.1,
    color: '#8B8580',
    fontWeight: '700',
  },
  inputBubble: {
    backgroundColor: '#FAF6F0',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E0D5',
    padding: 14,
  },
  inputText: {
    color: '#1C1C1E',
    fontSize: 14,
    lineHeight: 20,
  },
  prompt: {
    fontSize: 14,
    color: '#4A453E',
    marginBottom: 12,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  pill: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E8E0D5',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  pillSelected: {
    backgroundColor: '#1C1C1E',
    borderColor: '#1C1C1E',
  },
  pillText: {
    fontSize: 13,
    color: '#6B6B6B',
    fontWeight: '600',
  },
  pillTextSelected: {
    color: '#FFF',
  },
  scriptRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E9E0',
  },
  scriptLabel: {
    width: 92,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#8B8580',
  },
  scriptText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#1C1C1E',
  },
  microcopy: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
    color: '#8B8580',
  },
});