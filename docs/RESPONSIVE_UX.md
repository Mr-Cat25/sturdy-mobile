# Responsive UX

This document covers how Sturdy's UI adapts across devices, screen sizes, orientations, and platform differences.

---

## Target Platforms

| Platform | Status | Notes |
|----------|--------|-------|
| iOS (iPhone) | Primary | Designed first |
| Android | Supported | Metro / Expo build |
| iPad / Android tablet | Stretch goal | Layouts not currently optimised |
| Web (PWA) | Planned | Phase 5 |

---

## Screen Size Strategy

Sturdy targets the most common phone viewport range: **375 pt – 430 pt width**.

### Approach: Fluid, not Fixed

- Use `flex` layouts rather than fixed pixel widths wherever possible.
- Horizontal padding is set via `spacing.xl` (32 pt) on most screens, giving breathing room on narrow phones and more natural proportions on wider phones.
- Cards in the Dashboard use a **two-column row** with equal `flex: 1` to automatically split the available width.
- The script result card is full-width, never constrained to a fixed max-width on mobile. On wider surfaces (tablet / web), introduce `maxWidth: 640` with `alignSelf: 'center'`.

---

## Keyboard Avoidance

All screens with text inputs must use `KeyboardAvoidingView`:

```tsx
<KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.select({ ios: 'padding', android: undefined })}
>
```

- On iOS, `behavior="padding"` shifts the view up when the keyboard appears.
- On Android, `android:windowSoftInputMode="adjustResize"` in the manifest handles this natively; setting `behavior` causes double-shift and must be avoided.

---

## Safe Areas

All root screen components wrap content in `<SafeAreaView>` from `react-native-safe-area-context`.

- This handles iPhone notch, Dynamic Island, and Android cutouts automatically.
- Bottom padding is extended with `paddingBottom: spacing.xxl` (48 pt) inside `ScrollView` to ensure content is not hidden behind the tab bar or home indicator.

---

## ScrollView Usage

Long-form screens (Dashboard, Library, Profile) use `ScrollView` with:

```tsx
<ScrollView
  contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xxl }}
  showsVerticalScrollIndicator={false}
>
```

- `showsVerticalScrollIndicator={false}` keeps the UI clean.
- `paddingBottom: spacing.xxl` (48 pt) provides scroll headroom.

Screens that must stay on a single page (Auth, OTP entry) use `KeyboardAvoidingView + View` without a `ScrollView` to prevent accidental scroll.

---

## Tab Bar

The bottom tab bar is rendered by `app/(tabs)/_layout.tsx` via Expo Router's `<Tabs>` component.

- Tab bar background: `paper` (`#FFFDF9`)
- Active tab tint: `primary` (`#3C5A73`)
- Inactive tab tint: `grayLight` (`#9CA3AF`)
- The tab bar is always present on authenticated screens; it is hidden on auth, onboarding, and setup screens.

---

## Touch Targets

All interactive elements must meet the **44 × 44 pt minimum touch target** (Apple HIG / Material guidelines).

- Primary buttons are `paddingVertical: spacing.lg` (24 pt) with full-width layout, ensuring a tall touch area.
- Icon-only buttons (e.g. delete in Library) must include `padding: spacing.sm` (8 pt) to expand the touch target beyond the icon size.
- Tab bar items are handled by Expo Router / React Navigation and meet the minimum automatically.

---

## Orientation

Sturdy is **portrait-only** in the MVP. Landscape mode is not actively tested or supported. If `expo-screen-orientation` is added in future, add an orientation lock:

```ts
import * as ScreenOrientation from 'expo-screen-orientation';
ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
```

---

## Density-Independent Pixels

React Native's layout system operates in **logical pixels (dp/pt)**, not physical pixels. No manual DPI scaling is required. Assets (`assets/`) should be provided at 1×, 2×, and 3× for icons and images to ensure sharpness on all devices.

---

## Dark Mode

Dark mode is **not supported in the MVP**. All colour tokens are defined for light mode only. If dark mode is added:

1. Add dark-mode variants to `src/lib/theme.ts` using `useColorScheme()`.
2. Replace all static `colors.*` references with a dynamic hook.

---

## Web Responsive (Phase 5)

When the marketing landing page and PWA are built:

- Breakpoints: `sm` 640 px, `md` 768 px, `lg` 1024 px, `xl` 1280 px.
- Landing-page components (`src/components/landing/`) are written for a web context with CSS-style responsive props.
- `CrisisDemo`, `PlanComparison`, and `TestimonialSlider` should stack vertically on mobile web and lay out side-by-side on `md+`.
- Max content width: 1200 px, centred, with `paddingHorizontal: spacing.xl`.
