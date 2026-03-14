# User Experience Flow

This document describes the end-to-end user journey through the Sturdy mobile app — from first launch to receiving a parenting script in a crisis moment.

---

## Overview

Sturdy is optimised for **high-stress, real-time use**. Every screen is designed to minimise input friction and maximise speed-to-script. The flow below covers the full lifecycle of a parent session.

---

## 1. First Launch

1. App opens to the **Landing / Auth gate** (`app/index.tsx`).
2. Parent taps **Get Started** or **Sign In**.
3. Routed to **Auth Screen** (`app/auth/index.tsx`).

---

## 2. Authentication — Email OTP

| Step | Action | Notes |
|------|--------|-------|
| 1 | Parent enters email address | Validated client-side (must contain `@`) |
| 2 | Taps **Continue** | `supabase.auth.signInWithOtp()` sends a 6-digit code |
| 3 | Parent opens email, copies code | Email delivered via Supabase Auth (custom SMTP optional for production) |
| 4 | Enters 6-digit OTP | `supabase.auth.verifyOtp()` |
| 5 | OTP verified | Session created; Supabase JWT stored locally |

**Post-login routing:**

- No Supabase `profiles.username` → **Account Setup** (`/setup-account`)
- No active child profile → **Onboarding** (`/onboarding`)
- Has active child → **Dashboard** (`/(tabs)`)

**Resend cooldown:** 60 seconds between resend attempts (client-enforced).

---

## 3. Account Setup

- Parent sets a display username.
- Stored in `profiles` table via Supabase.
- On completion → routed to Onboarding.

---

## 4. Onboarding — Child Profile

The onboarding flow collects three pieces of information about the child:

| Screen | Input | Storage |
|--------|-------|---------|
| `onboarding/index.tsx` | Child's first name | AsyncStorage |
| `onboarding/age.tsx` | Age group (`2-4`, `5-7`, `8-12`) | AsyncStorage |
| `onboarding/neurotype.tsx` | Neurotype tags (e.g. ADHD, Autism, Anxiety, Sensory, None) | AsyncStorage |
| `onboarding/summary.tsx` | Review & confirm | Calls `addChild()` |

**Free tier:** One child profile permitted. A second profile triggers `FREE_LIMIT_CHILD` error, directing parents to upgrade.

After onboarding → **Dashboard**.

---

## 5. Dashboard

The dashboard (`app/(tabs)/index.tsx`) is the parent's home base.

**Free tier elements:**
- Greeting with child's name
- Usage banner (scripts remaining this month)
- **Crisis Support** quick-action card
- **Child Profile** quick-action card

**Premium (locked) elements shown as upgrade prompts:**
- Guidance Mode
- Progress Tracking
- Multiple Children

---

## 6. Crisis Support Flow

This is the **core product flow** — the reason Sturdy exists.

```
Crisis tab opened
      │
      ▼
Select trigger category (TriggerGrid)
      │
      ▼
Describe the moment (free-text textarea, optional)
      │
      ▼
Tap "Get Support"
      │
      ▼
generateScript() called → Supabase Edge Function
      │
      ├── Safety check (server-side prompt rules)
      ├── Child context injected (age, neurotype)
      ├── Gemini AI generates JSON script
      │
      ▼
Script rendered:
  ┌─────────────────────────┐
  │  REGULATE (parent)      │
  │  CONNECT  (child)       │
  │  GUIDE    (child)       │
  │  WHAT IF  (escalation)  │
  └─────────────────────────┘
      │
      ▼
Parent optionally saves script to Library (max 5 free)
```

**Error states:**
- Quota exceeded (5 free scripts/month) → Emergency script prompt with 24-hour cooldown
- Network / AI error → Friendly error message, retry prompt

---

## 7. Library

- `app/(tabs)/library.tsx`
- Displays up to **5 saved scripts** (free tier).
- Each entry shows: trigger, situation snippet, Regulate/Connect/Guide/What-If sections.
- Parent can delete individual saved scripts.

---

## 8. Profile

- `app/(tabs)/profile.tsx`
- Shows active child profile (name, age, neurotype).
- Option to edit child details or sign out.

---

## 9. Tab Navigation

Four tabs at the bottom of the app:

| Tab | Route | Description |
|-----|-------|-------------|
| Home | `/(tabs)/index` | Dashboard |
| Crisis | `/(tabs)/crisis` | Script generator |
| Library | `/(tabs)/library` | Saved scripts |
| Profile | `/(tabs)/profile` | Child & account |

---

## 10. Session Persistence

- Auth session managed by Supabase (`src/lib/useAuthSession.ts`).
- Child profile stored in `AsyncStorage` under key `sturdy:active_child`.
- Saved scripts stored under `sturdy:saved_scripts`.
- On app restart, `useRequireAuth` redirects unauthenticated users to auth screen.

---

## Key UX Principles

1. **Crisis-first** — screens are minimal; input is fast.
2. **No jargon** — plain language throughout.
3. **Exact-age & neurotype aware** — scripts adapted to child's profile automatically.
4. **Safety-first escalation** — dangerous situations trigger escalated guidance.
5. **Offline resilience** — saved scripts accessible without network.