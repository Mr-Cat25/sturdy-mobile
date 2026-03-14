# UI Specification

This document defines the visual and interaction specifications for every screen in the Sturdy mobile app.

---

## Design Language

Sturdy's UI communicates **calm, warmth, and clarity**. Every surface is designed to feel approachable during a stressful parenting moment. Avoid clinical aesthetics; prefer warm neutrals, readable type, and generous whitespace.

---

## Colour Tokens

All colours are defined in `src/lib/theme.ts` and must be imported from there. Never use hard-coded hex values in component files.

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#F7F3EC` | Page/screen backgrounds |
| `paper` | `#FFFDF9` | Cards, modals, inputs |
| `primary` | `#3C5A73` | Primary buttons, active states, links |
| `text` | `#1E2430` | Body text, headings |
| `textSecondary` | `#4B5563` | Subtitles, captions, labels |
| `sage` | `#7C9A87` | Free-tier badges, success states |
| `amber` | `#D9A441` | Warnings, highlights |
| `clay` | `#C98B6B` | Warm accents |
| `danger` | `#B85C4B` | Errors, destructive actions |
| `border` | `#E8E0D5` | Card borders, input borders, dividers |
| `grayLight` | `#9CA3AF` | Placeholder text, disabled states |

---

## Spacing Scale

From `src/lib/theme.ts`:

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4 px | Tight gaps between inline elements |
| `sm` | 8 px | Gap between related elements |
| `md` | 16 px | Standard padding, section gaps |
| `lg` | 24 px | Card padding, section spacing |
| `xl` | 32 px | Screen-level padding |
| `xxl` | 48 px | Bottom safe-area padding, hero sections |

---

## Border Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 8 px | Small tags, badges |
| `md` | 16 px | Form inputs, small cards |
| `lg` | 24 px | Feature cards, hero sections |
| `xl` | 32 px | Large modals |
| `full` | 999 px | Pills, rounded buttons, avatars |

---

## Shadow Tokens

```ts
shadow.card   // Standard card elevation (elevation: 3)
shadow.soft   // Subtle lift for secondary cards (elevation: 2)
```

---

## Typography

There is no custom font loaded in the current build. Use `System` (San Francisco on iOS, Roboto on Android).

| Role | Size | Weight |
|------|------|--------|
| Screen title | 22–32 px | 800 |
| Section label (all-caps) | 13 px | 700, letterSpacing: 1 |
| Card title | 14–15 px | 700 |
| Body / subtitle | 14–16 px | 400–600 |
| Caption / hint | 12 px | 400–600 |
| OTP input | 28 px | 400, letterSpacing: 8 |

---

## Component Specifications

### Primary Button

```
backgroundColor: primary (#3C5A73)
borderRadius:    full (999)
paddingVertical: lg (24)
textColor:       paper (#FFFDF9)
fontSize:        16
fontWeight:      700
disabledOpacity: 0.6
```

### Form Input

```
height:           54
borderRadius:     md (16)
backgroundColor:  background (#F7F3EC)
paddingHorizontal: lg (24)
fontSize:         17
borderWidth:      1
borderColor:      border (#E8E0D5)
placeholderColor: grayLight (#9CA3AF)
```

### Card (Feature / Quick Action)

```
borderRadius:  lg (24)
padding:       md (16)
borderWidth:   1
borderColor:   border (#E8E0D5)
shadow:        shadow.card or shadow.soft
```

**Variant colours:**
- Crisis card: `#F5EDE9` (warm peach)
- Profile card: `#E9EFF4` (cool blue-grey)

### Free Badge

```
backgroundColor: sage (#7C9A87)
borderRadius:    full
paddingHorizontal: 10
paddingVertical:   2
text: 11 px, weight 600, color paper
```

### Premium Locked Card

```
flexDirection:   row
alignItems:      center
backgroundColor: paper
borderRadius:    md
gap:             sm
Lock icon (🔒) at trailing edge
```

### Usage Banner

```
flexDirection: row
backgroundColor: paper
borderRadius: md
padding: md
borderWidth: 1
borderColor: border
shadow: shadow.soft
Title: 12 px, weight 800, uppercase, grayLight
Value: 14 px, weight 700, text
```

---

## Screen Specifications

### Auth Screen (`app/auth/index.tsx`)

- Full-screen `SafeAreaView` on `background`
- `KeyboardAvoidingView` (padding on iOS, undefined on Android)
- **Hero card**: eyebrow label "WELCOME", large "Sturdy" title, subtitle
- **Form card**: email input → Continue button or OTP input → Sign In button
- **Resend** link with 60-second cooldown
- **Change email** link
- **Go back** link at bottom

### Dashboard (`app/(tabs)/index.tsx`)

- `SafeAreaView` → `ScrollView`
- Greeting (child name if available)
- Usage banner
- Two quick-action cards (2-column row): Crisis Support, Child Profile
- Section heading "Premium Features"
- Three premium locked cards: Guidance Mode, Progress Tracking, Multiple Children

### Onboarding Screens

- **Progress dots** component at top (`src/components/onboarding/ProgressDots.tsx`)
- **Accordion cards** for selecting options (`src/components/onboarding/AccordionCard.tsx`)
- **Microcopy bubble** for contextual tips (`src/components/onboarding/MicrocopyBubble.tsx`)
- Large "Next" / "Done" primary button at bottom

### Crisis Screen

- Trigger grid (2-column) via `src/components/crisis/TriggerGrid.tsx`
- Free-text `TextInput` (multiline) for situation description
- "Get Support" primary button
- Loading state with `ActivityIndicator`
- Script result card with four sections: Regulate, Connect, Guide, What If
- Save to Library action

---

## Accessibility

- All interactive elements have a minimum touch target of 44 × 44 pt.
- `accessibilityLabel` props should be set on icon-only buttons.
- Colour contrast must meet WCAG AA (4.5:1 for text, 3:1 for UI components).
- `primary` on `paper` achieves ≈ 7:1.
- `text` on `background` achieves ≈ 13:1.

---

## Safe Area Handling

Wrap every root screen component in `<SafeAreaView>` from `react-native-safe-area-context`. Do not use the built-in `SafeAreaView` from React Native core.
