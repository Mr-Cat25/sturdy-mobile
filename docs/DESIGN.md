# Design

This document captures Sturdy's visual design system, brand principles, and design decision rationale.

---

## Brand Identity

**Product name:** Sturdy

**Tagline:** Calm, practical parenting support for hard moments.

**Brand personality:**
- Steady — never panicked, never dismissive
- Warm — empathetic, non-judgmental
- Practical — concrete words, not theory
- Clear — plain language, no jargon

---

## Visual Foundations

### Palette

Sturdy's palette is built around warm neutrals and muted, sophisticated accent colours. The goal is to feel like a calm, trusted voice — not a flashy consumer app or a clinical medical tool.

| Role | Token | Hex | Rationale |
|------|-------|-----|-----------|
| Background | `background` | `#F7F3EC` | Warm off-white; reduces eye strain in stressful moments |
| Surface / paper | `paper` | `#FFFDF9` | Near-white card surface, slightly warm |
| Brand / CTA | `primary` | `#3C5A73` | Deep slate-blue; calm authority |
| Heading text | `text` | `#1E2430` | Near-black with slight warmth |
| Secondary text | `textSecondary` | `#4B5563` | Readable grey for supporting copy |
| Success / free | `sage` | `#7C9A87` | Muted green; positive without alarm |
| Warning / highlight | `amber` | `#D9A441` | Warm amber for notices |
| Warm accent | `clay` | `#C98B6B` | Earthy clay for crisis-card tint |
| Error / danger | `danger` | `#B85C4B` | Muted red; serious but not alarming |
| Dividers / borders | `border` | `#E8E0D5` | Warm light grey |

### What the palette avoids

- **Saturated blues / greens** that feel corporate or techy
- **Bright red** that increases anxiety
- **Pure white** backgrounds that feel clinical
- **Dark themes** in MVP (too much contrast for bleary-eyed 2 am use)

---

## Typography

### Typeface

System default typeface (San Francisco on iOS, Roboto on Android). Sturdy's voice is expressed through weight, size, and spacing — not a decorative typeface.

### Scale

| Level | Size | Weight | Notes |
|-------|------|--------|-------|
| Hero title | 32 px | 800 | Auth screen "Sturdy" wordmark |
| Screen title | 22 px | 800 | Dashboard greeting |
| Card heading | 15 px | 700 | Feature card title |
| Body | 14–16 px | 400–600 | General copy |
| Section label | 13 px | 700 | Uppercase, letterSpacing: 1 |
| Caption / hint | 12 px | 400–600 | Form hints, badge text |

### Principles

- **Line height** of `1.5–1.6×` for body copy (e.g. `lineHeight: 24` for `fontSize: 16`).
- **No italic** in the MVP; italics can feel anxious or uncertain.
- **Bold sparingly** — reserve weight 800 for titles; weight 700 for UI labels; weight 400–600 for body.

---

## Iconography

Sturdy uses **emoji** for icons in the MVP. Emoji are universally recognisable, require no custom asset pipeline, and reinforce the warm, human tone.

| Context | Emoji |
|---------|-------|
| Crisis Support | 🆘 |
| Child Profile | 👧 |
| Guidance Mode | 💡 |
| Progress | 📊 |
| Multiple children | 👨‍👩‍👧‍👦 |
| Locked / Premium | 🔒 |

When custom icons are introduced, use a **2 px stroke, rounded cap, rounded join** style at 24 × 24 pt. Provide at 1×, 2×, 3× or as SVG.

---

## Layout Principles

### Generous whitespace

Crowded screens increase cognitive load. Every screen has generous padding (`spacing.xl` = 32 pt horizontal) and spacing between sections.

### Cards over lists

Content is presented in rounded cards with subtle shadows, never in flat table rows. Cards feel friendly and approachable; tables feel bureaucratic.

### Full-width CTAs

Primary action buttons span the full width of the container. This makes them easy to tap in a rushed moment and focuses attention on a single next step.

### Visual hierarchy

Each screen has a single primary action. Secondary actions (resend code, change email, go back) are presented as plain text links, not buttons.

---

## Motion & Animation

In the MVP, Sturdy uses React Native's built-in transitions only (screen push/pop). No custom animations are implemented.

Future animation principles:
- **Micro-interactions** for button press (opacity 0.88 on `activeOpacity`).
- **Loading states** use `ActivityIndicator` in `primary` colour.
- No decorative animations that could distract a stressed parent.

---

## Accessibility Design

- **Colour is never the only signal.** Errors also use text labels; success states also use textual confirmation.
- **Touch target minimum:** 44 × 44 pt.
- **Font size:** No text below 12 px in the app.
- **System font scaling:** Views should flex to accommodate larger system font sizes. Avoid fixed heights on containers that hold text.

---

## Design File

*The Figma / design source file link will be added here when available. Until then, this document and `UI_SPEC.md` serve as the primary design reference.*
