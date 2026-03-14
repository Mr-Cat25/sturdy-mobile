# Sturdy Master Blueprint

This document is the single authoritative reference for what Sturdy is, how it works, and how every part of the system fits together. It is the entry point for new contributors and the north star for product decisions.

---

## 1. What Is Sturdy?

Sturdy is a **crisis-first parenting response tool** for hard moments.

When a child is melting down, refusing to leave the park, hitting a sibling, or escalating past a parent's ability to respond calmly — Sturdy gives that parent **exact, spoken words** within seconds.

Sturdy is **not:**
- A therapy tool or diagnostic tool
- A parenting course or blog
- A general AI chatbot
- A tool for the child to use

Sturdy is **for:**
- Parents of children aged 2–12
- Real-time use during or immediately after a hard moment
- Parents who want practical scripts, not theory

---

## 2. Core Product Philosophy

| Principle | Description |
|-----------|-------------|
| **Crisis-first** | Optimised for high-stress, fast-load, minimal-input situations |
| **Literal reflection** | Plain language; no therapy jargon, no judgment |
| **Human, not choppy** | Natural spoken language; scripts sound like something a real parent would say |
| **Structured** | Focused scripts in a fixed format; not open-ended conversation |
| **Exact-age aware** | Adapted to the child's specific age group |
| **Neurotype aware** | Adapted for ADHD, Autism, Anxiety, Sensory differences |
| **Safety-aware** | Escalates for immediate danger or medical urgency |

---

## 3. The Regulate → Connect → Guide Framework

Every Sturdy script follows this four-part structure:

```
REGULATE
  ↓
The parent settles their own nervous system first.
One or two internal instructions ("Take a slow breath. You're the adult here.").

CONNECT
  ↓
Words for the parent to say out loud that acknowledge the child's feeling
without removing the boundary.
("You really wanted to stay. That's hard.")

GUIDE
  ↓
Words for the parent to say that include a concrete next step, limit, or
simple choice.
("We're going home now. You can walk with me or I'll carry you.")

WHAT IF
  ↓
Words or actions if the child refuses or escalates.
Tactical and firm. Does not shame the child.
("If you stay on the ground, I'll pick you up and carry you to the car.
That's okay. You don't have to like this.")
```

This framework is grounded in attachment theory, co-regulation research, and respectful boundary-setting.

---

## 4. System Architecture (Summary)

```
React Native App (Expo)
        │
        │  Supabase JS Client
        │
        ▼
Supabase Platform
  ├── Auth (Email OTP)
  ├── Database (PostgreSQL)
  │     ├── profiles
  │     └── script_usage
  └── Edge Functions (Deno)
        └── generate-script
                │
                │  Gemini API
                │
                ▼
        Google Gemini 2.5 Flash
```

See `ARCHITECTURE.md` for full detail.

---

## 5. Data Model (Summary)

| Store | Contents |
|-------|----------|
| `AsyncStorage` (device) | Active child profile, saved scripts (up to 5) |
| Supabase `profiles` | User display name |
| Supabase `script_usage` | Per-user AI script quota records |

See `DATABASE_SCHEMA.md` for full detail.

---

## 6. Two Product Surfaces

### Mobile App
- Where parents use the product daily
- Expo / React Native, targeting iOS and Android
- Four tabs: Home, Crisis, Library, Profile

### Web Landing Page (Planned)
- Marketing and conversion surface
- Components exist in `src/components/landing/`
- Features: CrisisDemo, PlanComparison, TestimonialSlider

---

## 7. The AI Script Generation Pipeline

```
1. Parent describes situation (free-text + trigger category)
2. Active child profile looked up (age group, neurotype)
3. System prompt assembled with adaptation rules
4. User prompt assembled with situation details
5. Gemini 2.5 Flash called (temperature 0.55, JSON mode)
6. Response parsed and validated
7. Script returned to app
8. Usage record inserted into script_usage
```

See `PROMPT_SYSTEM.md` for the full prompt specification.

---

## 8. Quota & Monetisation Model

| Tier | Scripts/month | Emergency scripts | Child profiles |
|------|--------------|-------------------|----------------|
| Free | 5 regular | 1 (24-hr cooldown) | 1 |
| Premium | Unlimited | Unlimited | Up to 5 |

Premium is enforced by the Edge Function. **Note:** The `x-sturdy-premium` header bypass is not yet cryptographically verified. RevenueCat integration is planned in Phase 4.

---

## 9. Safety Architecture

Sturdy's safety approach operates at three layers:

1. **Prompt rules** — The AI system prompt instructs the model to prioritise safety and firm physical boundaries when aggression is involved, and never to give medical advice.
2. **No medical advice policy** — Scripts never suggest a diagnosis or treatment. Parents are directed to seek professional help for ongoing concerns.
3. **Escalation copy** — For situations that indicate immediate danger, the script copy directs the parent to emergency services.

See `SAFETY_SYSTEM.md` for full detail.

---

## 10. Documentation Index

| Document | Purpose |
|----------|---------|
| `ARCHITECTURE.md` | System architecture and infrastructure |
| `API_SPEC.md` | Edge Function API reference |
| `DATABASE_SCHEMA.md` | Database tables and RLS policies |
| `DESIGN.md` | Visual design system and brand |
| `UI_SPEC.md` | Component and screen UI specifications |
| `RESPONSIVE_UX.md` | Cross-device and platform UX rules |
| `USER_EXPERIENCE_FLOW.md` | End-to-end user journey |
| `PROMPT_SYSTEM.md` | AI prompt specification |
| `SAFETY_SYSTEM.md` | Safety policies and escalation |
| `PREDICTIVE_INSIGHTS.md` | Planned predictive insights feature |
| `ROADMAP.md` | Feature roadmap by phase |
| `STURDY_MASTER_BLUEPRINT.md` | This document — top-level overview |

---

## 11. Key Constraints

1. **Speed over features.** A parent in crisis will abandon the app if it is slow. Every design decision must be evaluated against load time and input friction.
2. **No blank scripts.** The AI must always return a usable, specific script. Vague filler ("You've got this") is explicitly prohibited by the prompt.
3. **Privacy by default.** Child data stays on the device (AsyncStorage). Only quota records are stored server-side, and they contain no identifying child information.
4. **No shaming.** Neither the parent nor the child is shamed in any script or UI copy.
