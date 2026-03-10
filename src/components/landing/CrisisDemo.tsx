import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

type DemoStep = 0 | 1 | 2;

const STEPS: { label: string }[] = [
  { label: 'Type' },
  { label: 'Confirm' },
  { label: 'Your Script' },
];

const TYPE_TEXT = "He won't put his shoes on and keeps yelling NO.";

export function CrisisDemo() {
  const [step, setStep] = useState<DemoStep>(0);
  const [loopCount, setLoopCount] = useState(0);

  const fade = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const progress = useRef(new Animated.Value(0)).current;

  const isDone = loopCount >= 3;
  const stepDurationMs = 2600;
  const transitionMs = 300;

  // Animate progress bar across each step's duration
  useEffect(() => {
    if (isDone) return;
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: stepDurationMs,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [step, isDone, progress, stepDurationMs]);

  // Step transition timer
  useEffect(() => {
    if (isDone) return;

    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 0,
          duration: transitionMs,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.94,
          duration: transitionMs,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setStep((prev) => ((prev + 1) % 3) as DemoStep);
        setLoopCount((prev) => (step === 2 ? prev + 1 : prev));

        scale.setValue(1.04);
        Animated.parallel([
          Animated.timing(fade, {
            toValue: 1,
            duration: transitionMs,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: transitionMs,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, stepDurationMs);

    return () => clearTimeout(timeout);
  }, [fade, scale, isDone, step, stepDurationMs]);

  // Stop on final script frame after 3 loops
  useEffect(() => {
    if (!isDone) return;
    setStep(2);
  }, [isDone]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>SEE IT IN ACTION</Text>
      <Text style={styles.h2}>A messy moment in. Calm words out.</Text>
      <Text style={styles.sub}>One sentence is enough. No perfect wording needed.</Text>

      {/* Step indicators */}
      <View style={styles.stepsRow}>
        <View style={styles.stepConnector} />
        {STEPS.map((s, i) => (
          <View key={i} style={styles.stepItem}>
            <View style={[styles.stepDot, step === i && styles.stepDotActive]}>
              <Text style={[styles.stepNum, step === i && styles.stepNumActive]}>
                {i + 1}
              </Text>
            </View>
            <Text style={[styles.stepLabel, step === i && styles.stepLabelActive]}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Phone mockup */}
      <View style={styles.phoneShadowWrap}>
        <View style={styles.phoneMockup}>
          {/* Dark phone header / status bar */}
          <View style={styles.phoneHeader}>
            <View style={styles.headerDots}>
              <View style={styles.headerDot} />
              <View style={styles.headerDot} />
              <View style={styles.headerDot} />
            </View>
            <Text style={styles.phoneStepTitle}>
              {step === 0
                ? 'WHAT YOU TYPE'
                : step === 1
                  ? 'QUICK CHECK'
                  : 'YOUR CALM SCRIPT'}
            </Text>
          </View>

          {/* Content area */}
          <Animated.View style={[styles.phoneContent, { opacity: fade, transform: [{ scale }] }]}>
            {step === 0 ? (
              <WhatYouType />
            ) : step === 1 ? (
              <QuickCheck />
            ) : (
              <CalmScript />
            )}
          </Animated.View>

          {/* Progress bar */}
          {!isDone && (
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function WhatYouType() {
  return (
    <View style={styles.stepContent}>
      <View style={styles.inputBubble}>
        <Text style={styles.inputText}>"{TYPE_TEXT}"</Text>
      </View>
      <Text style={styles.microcopy}>One sentence is enough.</Text>
    </View>
  );
}

function QuickCheck() {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.prompt}>Sturdy: "Quick check — which is closer?"</Text>
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
    <View style={styles.stepContent}>
      <View style={styles.scriptRow}>
        <Text style={styles.scriptLabel}>REGULATE</Text>
        <Text style={styles.scriptText}>"I'm taking one breath."</Text>
      </View>
      <View style={styles.scriptRow}>
        <Text style={styles.scriptLabel}>CONNECT</Text>
        <Text style={styles.scriptText}>"You don't want to stop. That's hard."</Text>
      </View>
      <View style={styles.scriptRow}>
        <Text style={styles.scriptLabel}>GUIDE</Text>
        <Text style={styles.scriptText}>"Shoes on now. Red or blue?"</Text>
      </View>
      <View style={styles.scriptRowLast}>
        <Text style={styles.scriptLabel}>WHAT IF…</Text>
        <Text style={styles.scriptText}>"If they refuse: I'll help your body get started."</Text>
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
    marginBottom: 6,
  },
  sub: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B6B6B',
    textAlign: 'center',
    marginBottom: 20,
  },
  // Step indicators
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 16,
    position: 'relative',
    paddingHorizontal: 16,
  },
  stepConnector: {
    position: 'absolute',
    top: 14,
    left: '26%',
    right: '26%',
    height: 1,
    backgroundColor: '#E8E0D5',
    zIndex: 0,
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    zIndex: 1,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0E9E0',
    borderWidth: 1,
    borderColor: '#E8E0D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: '#E8A040',
    borderColor: '#E8A040',
  },
  stepNum: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B8580',
  },
  stepNumActive: {
    color: '#fff',
  },
  stepLabel: {
    fontSize: 11,
    color: '#8B8580',
    fontWeight: '500',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#1C1C1E',
    fontWeight: '700',
  },
  // Phone mockup
  phoneShadowWrap: {
    shadowColor: '#1C1C1E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    borderRadius: 24,
    marginHorizontal: 12,
  },
  phoneMockup: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D0C8BC',
    backgroundColor: '#fff',
  },
  phoneHeader: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerDots: {
    flexDirection: 'row',
    gap: 5,
  },
  headerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  phoneStepTitle: {
    fontSize: 11,
    letterSpacing: 1.0,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '700',
  },
  phoneContent: {
    backgroundColor: '#FEFCF8',
    minHeight: 160,
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#F0E9E0',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#E8A040',
  },
  // Step content
  stepContent: {
    padding: 16,
  },
  inputBubble: {
    backgroundColor: '#FAF6F0',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E0D5',
    padding: 14,
    marginBottom: 10,
  },
  inputText: {
    color: '#1C1C1E',
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  prompt: {
    fontSize: 14,
    color: '#4A453E',
    marginBottom: 12,
    lineHeight: 20,
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
  scriptRowLast: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 0,
  },
  scriptLabel: {
    width: 80,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: '#E8A040',
    paddingTop: 1,
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
    textAlign: 'center',
  },
});
