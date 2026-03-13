import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, radius } from '@/lib/theme';

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
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 10,
  },
  h2: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  sub: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
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
    backgroundColor: colors.border,
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
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepNum: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  stepNumActive: {
    color: colors.paper,
  },
  stepLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: colors.text,
    fontWeight: '700',
  },
  // Phone mockup
  phoneShadowWrap: {
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    borderRadius: radius.lg,
    marginHorizontal: 12,
  },
  phoneMockup: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.paper,
  },
  phoneHeader: {
    backgroundColor: colors.text,
    paddingHorizontal: spacing.md,
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
    backgroundColor: colors.background,
    minHeight: 160,
  },
  progressTrack: {
    height: 3,
    backgroundColor: colors.border,
  },
  progressBar: {
    height: 3,
    backgroundColor: colors.primary,
  },
  // Step content
  stepContent: {
    padding: spacing.md,
  },
  inputBubble: {
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  inputText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  prompt: {
    fontSize: 14,
    color: colors.textSecondary,
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
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.paper,
    alignItems: 'center',
  },
  pillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  pillTextSelected: {
    color: colors.paper,
  },
  scriptRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    color: colors.primary,
    paddingTop: 1,
  },
  scriptText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  microcopy: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
