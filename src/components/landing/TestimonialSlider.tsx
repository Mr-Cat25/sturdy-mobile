import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, spacing, radius, shadow } from '@/lib/theme';

const TESTIMONIALS = [
  {
    text: 'I used it mid-tantrum and it actually worked.',
    author: 'Sarah',
    detail: 'Mom of 3',
    stars: 5,
  },
  {
    text: "Finally, words that don't sound like a textbook.",
    author: 'Marcus',
    detail: 'Dad of a 4-year-old',
    stars: 5,
  },
  {
    text: 'My daughter has ADHD. Sturdy gets it — the scripts actually fit her.',
    author: 'Priya',
    detail: 'Mom of 2',
    stars: 5,
  },
  {
    text: 'I was yelling less by the end of week one.',
    author: 'James',
    detail: 'Single dad',
    stars: 5,
  },
];

const AUTO_ADVANCE_MS = 5000;

export function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerWidthRef = useRef(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    containerWidthRef.current = width;
    setContainerWidth(width);
  };

  const goTo = useCallback(
    (index: number) => {
      const width = containerWidthRef.current;
      if (width === 0) return;
      const clamped = Math.max(0, Math.min(index, TESTIMONIALS.length - 1));
      scrollRef.current?.scrollTo({ x: clamped * width, animated: true });
      setCurrentIndex(clamped);
    },
    []
  );

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const width = containerWidthRef.current;
      setCurrentIndex((prev) => {
        const next = (prev + 1) % TESTIMONIALS.length;
        scrollRef.current?.scrollTo({ x: next * width, animated: true });
        return next;
      });
    }, AUTO_ADVANCE_MS);
  }, []);

  useEffect(() => {
    if (containerWidth === 0) return;
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, containerWidth, resetTimer]);

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const width = containerWidthRef.current;
    if (width === 0) return;
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>WHAT PARENTS SAY</Text>
      <Text style={styles.h2}>Real moments. Real relief.</Text>

      <View style={styles.sliderContainer} onLayout={handleLayout}>
        {containerWidth > 0 && (
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            snapToInterval={containerWidth}
            decelerationRate="fast"
          >
            {TESTIMONIALS.map((t, i) => (
              <View key={i} style={[styles.card, { width: containerWidth }]}>
                <Text style={styles.stars}>{'★'.repeat(t.stars)}</Text>
                <Text style={styles.quote}>"{t.text}"</Text>
                <View style={styles.authorRow}>
                  <Text style={styles.authorName}>{t.author}</Text>
                  <Text style={styles.authorDetail}> · {t.detail}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Dot indicators */}
      <View style={styles.dotsRow}>
        {TESTIMONIALS.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => goTo(i)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View style={[styles.dot, i === currentIndex && styles.dotActive]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 8,
    marginBottom: 8,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1.2,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  h2: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  sliderContainer: {
    width: '100%',
    minHeight: 150,
  },
  card: {
    backgroundColor: colors.paper,
    borderRadius: 18,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  stars: {
    fontSize: 18,
    color: colors.amber,
    letterSpacing: 3,
    marginBottom: 12,
  },
  quote: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  authorDetail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});
