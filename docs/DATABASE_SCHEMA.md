# Database Schema

This document describes all database tables, columns, constraints, indexes, and Row-Level Security (RLS) policies used by Sturdy.

---

## Overview

Sturdy uses **Supabase (PostgreSQL)** as its database. The schema is minimal by design: sensitive child data is stored locally on the device (AsyncStorage) and is not synced to the server.

---

## Tables

### `auth.users` (Supabase managed)

Managed entirely by Supabase Auth. Sturdy reads `id`, `email`, and metadata from this table but never writes to it directly.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key; referenced by all app tables |
| `email` | `text` | User's email address |
| `created_at` | `timestamptz` | Account creation timestamp |

---

### `public.profiles`

Stores the user's chosen display name (username). Created when a new user completes the Account Setup screen.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | `uuid` | No | — | Primary key; foreign key → `auth.users.id` |
| `username` | `text` | No | — | Display name; must be unique |
| `created_at` | `timestamptz` | No | `now()` | |
| `updated_at` | `timestamptz` | Yes | `now()` | |

**Constraints:**
- `profiles.id` references `auth.users(id) ON DELETE CASCADE`
- `username` has a `UNIQUE` constraint

**RLS:**
- Users can read and update their own profile row (`auth.uid() = id`).
- No public read on other users' profiles.

---

### `public.script_usage`

Tracks AI script generation events for quota enforcement. Inserted by the Edge Function (using the service role key, bypassing RLS). Read by the client to display remaining quota.

**Source:** `supabase/migrations/20260308000000_create_script_usage.sql`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | `uuid` | No | `gen_random_uuid()` | Primary key |
| `user_id` | `uuid` | No | — | Foreign key → `auth.users(id)` |
| `script_type` | `text` | No | `'regular'` | Enum: `'regular'` or `'emergency'` |
| `created_at` | `timestamptz` | No | `now()` | Used for monthly quota window |

**Constraints:**
- `user_id` references `auth.users(id) ON DELETE CASCADE`
- `script_type` check: `script_type IN ('regular', 'emergency')`

**Indexes:**
```sql
CREATE INDEX script_usage_user_created_idx
  ON public.script_usage (user_id, created_at);
```
This index supports the monthly quota lookup:
```sql
SELECT count(*) FROM script_usage
WHERE user_id = $1
  AND script_type = 'regular'
  AND created_at >= <month_start>;
```

**RLS:**
```sql
ALTER TABLE public.script_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage"
  ON public.script_usage FOR SELECT
  USING (auth.uid() = user_id);
```

- SELECT: users can only read their own rows.
- INSERT: performed by the Edge Function with the service role key (bypasses RLS). No client INSERT policy is defined.
- UPDATE / DELETE: no policies defined; not permitted from client.

---

## Local Storage (AsyncStorage)

Child profile data and saved scripts are stored **on-device only** using `@react-native-async-storage/async-storage`. They are never synced to Supabase.

### Key: `sturdy:active_child`

Stores the serialised `ChildProfile` object.

```ts
interface ChildProfile {
  id: string;           // 'local-<random>' for locally created profiles
  name: string;
  nickname?: string;
  age: string;          // Age group: '2-4', '5-7', or '8-12'
  neurotype: string[];  // e.g. ['ADHD', 'Anxiety'] or []
  isActive: boolean;
  createdAt?: string;   // ISO 8601
  updatedAt?: string;   // ISO 8601
}
```

**Limit:** One active child profile (free tier). A second `addChild()` call throws `FREE_LIMIT_CHILD`.

### Key: `sturdy:saved_scripts`

Stores an array of `SavedScript` objects (most recent first).

```ts
interface SavedScript {
  id: string;       // 'script-<random>'
  trigger: string;  // Trigger category label
  situation: string;
  regulate: string;
  connect: string;
  guide: string;
  what_if: string;
  savedAt: string;  // ISO 8601
}
```

**Limit:** Maximum 5 saved scripts (free tier). `saveScript()` returns `{ ok: false, limitReached: true }` when the limit is reached.

---

## Quota Enforcement Logic

The Edge Function (`supabase/functions/generate-script/index.ts`) implements the following quota logic server-side:

```
Monthly regular quota:
  - Count rows in script_usage WHERE user_id = $uid
      AND script_type = 'regular'
      AND created_at >= start_of_current_month_UTC
  - If count >= 5: regular quota exhausted → check emergency eligibility

Emergency quota:
  - Find most recent row WHERE script_type = 'emergency'
  - If (now - last_emergency_created_at) < 24 hours:
      → Return 429 with hours_remaining
  - Else: allow one emergency script
```

**Premium bypass:** If the request header `x-sturdy-premium: true` is present, quota checks are skipped entirely. ⚠️ This is not cryptographically verified in the current implementation.

---

## Migration Files

| File | Description |
|------|-------------|
| `supabase/migrations/20260308000000_create_script_usage.sql` | Creates `script_usage` table, index, RLS, and policies |

To apply migrations locally:
```bash
supabase db push
```

To apply to a remote project:
```bash
supabase db push --linked
```
