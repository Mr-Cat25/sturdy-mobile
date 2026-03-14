# Architecture

This document describes the technical architecture of the Sturdy mobile application, including its infrastructure, code organisation, and data flow.

---

## System Overview

```
┌─────────────────────────────────────────┐
│            React Native App              │
│          (Expo / TypeScript)             │
│                                         │
│  app/          → Expo Router screens    │
│  src/          → Shared components,     │
│                  lib, types             │
└───────────────┬─────────────────────────┘
                │ Supabase JS Client
                │ (HTTPS + WebSocket)
                ▼
┌─────────────────────────────────────────┐
│            Supabase Platform            │
│                                         │
│  Auth     → Email OTP, session mgmt     │
│  Database → PostgreSQL (profiles,       │
│               script_usage)             │
│  Edge Fn  → Deno runtime                │
│               generate-script           │
└───────────────┬─────────────────────────┘
                │ HTTPS (Gemini REST API)
                ▼
┌─────────────────────────────────────────┐
│        Google Gemini 2.5 Flash          │
│     (generativelanguage.googleapis.com) │
└─────────────────────────────────────────┘
```

---

## Client — React Native (Expo)

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native via Expo SDK |
| Router | Expo Router (file-based routing) |
| Language | TypeScript |
| Auth client | `@supabase/supabase-js` |
| Local storage | `@react-native-async-storage/async-storage` |
| Bundler | Metro |
| Config | `app.json`, `babel.config.js`, `tsconfig.json` |

### Directory Structure

```
sturdy-mobile/
├── app/                        Expo Router screens
│   ├── _layout.tsx             Root layout (session guard)
│   ├── index.tsx               Entry / redirect
│   ├── auth/
│   │   └── index.tsx           Email OTP authentication
│   ├── setup-account.tsx       Username setup (post-auth)
│   ├── onboarding/
│   │   ├── index.tsx           Child name
│   │   ├── age.tsx             Age group selection
│   │   ├── neurotype.tsx       Neurotype selection
│   │   └── summary.tsx         Review and confirm
│   ├── crisis/
│   │   └── index.tsx           Script generation screen
│   └── (tabs)/
│       ├── _layout.tsx         Tab bar layout
│       ├── index.tsx           Dashboard (home)
│       ├── crisis.tsx          Crisis tab (re-exports crisis/index)
│       ├── library.tsx         Saved scripts
│       └── profile.tsx         Child profile & account
├── src/
│   ├── components/
│   │   ├── crisis/
│   │   │   └── TriggerGrid.tsx     Trigger category selector
│   │   ├── landing/
│   │   │   ├── CrisisDemo.tsx      Marketing demo
│   │   │   ├── PlanComparison.tsx  Free vs Premium table
│   │   │   └── TestimonialSlider.tsx
│   │   └── onboarding/
│   │       ├── AccordionCard.tsx   Expandable option card
│   │       ├── MicrocopyBubble.tsx Contextual tip bubble
│   │       └── ProgressDots.tsx    Step progress indicator
│   ├── lib/
│   │   ├── api/
│   │   │   └── generateScript.ts   Edge Function client wrapper
│   │   ├── childProfile.ts         AsyncStorage CRUD for child & scripts
│   │   ├── supabase.ts             Supabase client singleton
│   │   ├── theme.ts                Design tokens (colours, spacing, etc.)
│   │   ├── useActiveChild.ts       Hook: read active child from storage
│   │   ├── useAuthSession.ts       Hook: Supabase session subscription
│   │   └── useRequireAuth.ts       Hook: redirect unauthenticated users
│   └── types/
│       ├── child.ts                ChildProfile interface
│       └── script.ts               GenerateScriptParams, ScriptResult
├── supabase/
│   ├── functions/
│   │   └── generate-script/
│   │       └── index.ts            Deno Edge Function
│   └── migrations/
│       └── 20260308000000_create_script_usage.sql
├── assets/                     Images, splash, icons
├── App.tsx                     Root component
└── index.ts                    Expo entry point
```

### Path Aliases

`tsconfig.json` maps `@/` to `src/`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Import from `@/lib/theme` rather than relative paths.

---

## Backend — Supabase

### Auth

- **Provider:** Email OTP (magic code)
- **Session persistence:** Supabase JS client handles JWT refresh automatically
- **Tables touched:** `auth.users`, `public.profiles`

### Database

PostgreSQL hosted on Supabase. See `DATABASE_SCHEMA.md` for table definitions.

### Edge Functions (Deno)

The `generate-script` function is the only server-side compute layer.

- **Runtime:** Deno (Supabase Edge Runtime)
- **Entry point:** `supabase/functions/generate-script/index.ts`
- **Invoked by:** `supabase.functions.invoke('generate-script', { body: {...} })`
- **Environment secrets:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`

The function:
1. Validates the user's Bearer token
2. Enforces quota (or bypasses for premium)
3. Assembles and sends the Gemini request
4. Parses and validates the JSON response
5. Records usage in `script_usage`
6. Returns the script to the client

---

## AI Layer — Google Gemini

| Parameter | Value |
|-----------|-------|
| Model | `gemini-2.5-flash` |
| Endpoint | `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent` |
| Temperature | 0.55 |
| Response format | `application/json` (constrained JSON mode) |

See `PROMPT_SYSTEM.md` for full prompt specification.

---

## Data Flow: Script Generation

```
1. User taps trigger category + enters situation text
2. app: generateScript({ situation, childAge, neurotype, mode })
3. supabase.functions.invoke('generate-script', { body })
   → Attaches Bearer token from current session
4. Edge Function: validate token → check quota → call Gemini
5. Gemini: generate JSON script (title, regulate, connect, guide, what_if)
6. Edge Function: parse JSON → insert script_usage → return { ok: true, ...script }
7. app: render script in four sections
```

---

## Security Considerations

| Area | Current State | Risk |
|------|--------------|------|
| Premium bypass | `x-sturdy-premium: true` header (unverified) | Any client can claim premium status |
| Child data | Device-only (AsyncStorage) | Data lost on device wipe; no cloud backup |
| RLS | Enabled on `script_usage` | Users cannot read others' records |
| Service role key | Used only server-side in Edge Function | Not exposed to client |
| CORS | `Access-Control-Allow-Origin: *` on Edge Function | Acceptable for mobile API; review for web |

---

## Environment Configuration

| Variable | Location | Used By |
|----------|----------|---------|
| `EXPO_PUBLIC_SUPABASE_URL` | `.env` / app config | Supabase JS client |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | `.env` / app config | Supabase JS client |
| `SUPABASE_URL` | Supabase Secrets | Edge Function |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Secrets | Edge Function |
| `GEMINI_API_KEY` | Supabase Secrets | Edge Function → Gemini API |

---

## Local Development

```bash
# Install dependencies
npm install

# Start Expo dev server
npx expo start

# Start Supabase local stack
supabase start

# Serve Edge Function locally
supabase functions serve generate-script --env-file .env.local
```
