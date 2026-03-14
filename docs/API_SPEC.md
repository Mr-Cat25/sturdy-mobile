# API Specification

This document is the reference for Sturdy's backend API — currently the single Supabase Edge Function `generate-script`.

---

## Base URL

```
https://<project-ref>.supabase.co/functions/v1
```

The project reference is available in the Supabase dashboard and in `supabase/.temp/project-ref`.

---

## Authentication

All endpoints require a Supabase user JWT in the `Authorization` header:

```
Authorization: Bearer <supabase_jwt>
```

The JWT is obtained from `supabase.auth.getSession()` in the client. The Edge Function verifies it using `supabase.auth.getUser(token)` with the service role client.

---

## Endpoints

### `POST /generate-script`

Generates an AI parenting script for a described situation.

#### Request

**Headers:**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <jwt>` |
| `Content-Type` | Yes | `application/json` |
| `x-sturdy-premium` | No | `"true"` to bypass quota (⚠️ unverified in MVP) |

**Body:**

```json
{
  "situation": "string",
  "childAge": "string",
  "neurotype": "string",
  "mode": "string"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `situation` | string | Yes | Free-text description of the hard moment |
| `childAge` | string | Yes | Age group: `"2-4"`, `"5-7"`, or `"8-12"` |
| `neurotype` | string | No | Neurotype tag: `"ADHD"`, `"Autism"`, `"Anxiety"`, `"Sensory"`, or `"none"` |
| `mode` | string | No | Script mode: `"crisis"` (default) or `"guidance"` (planned) |

**Example request:**

```json
{
  "situation": "My 4-year-old is throwing toys because I said no to another snack",
  "childAge": "2-4",
  "neurotype": "none",
  "mode": "crisis"
}
```

---

#### Responses

##### `200 OK` — Script generated successfully

```json
{
  "ok": true,
  "title": "Snack Refusal Meltdown",
  "regulate": "Take a breath. This is big feelings, not bad behaviour. You can handle this.",
  "connect": "You really wanted more snack. That feels so unfair right now.",
  "guide": "No more snack tonight. You can have a sip of water or a hug. Which one?",
  "what_if": "If the throwing continues, say calmly: 'Toys stay on the floor or I'll put them away.' Then follow through quietly.",
  "script_type": "regular"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `ok` | boolean | Always `true` for a successful response |
| `title` | string | 2–4 word description of the moment |
| `regulate` | string | Internal instruction for the parent |
| `connect` | string | Words to say to the child (validates feeling) |
| `guide` | string | Words to say with a concrete next step |
| `what_if` | string | Words/actions if the child escalates |
| `script_type` | string | `"regular"` or `"emergency"` |

---

##### `401 Unauthorized` — Missing or invalid token

```json
{
  "ok": false,
  "error": "Authentication required"
}
```

```json
{
  "ok": false,
  "error": "Invalid or expired token"
}
```

---

##### `429 Too Many Requests` — Quota exceeded

```json
{
  "ok": false,
  "error": "Monthly script limit reached. Emergency script available in 3 hour(s).",
  "quota_exceeded": true,
  "next_emergency_at": "2026-03-15T08:00:00.000Z"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `ok` | boolean | `false` |
| `error` | string | Human-readable quota message |
| `quota_exceeded` | boolean | `true` |
| `next_emergency_at` | string | ISO 8601 timestamp when next emergency script is available |

---

##### `500 Internal Server Error` — Unexpected error

```json
{
  "ok": false,
  "error": "Gemini request failed: ..."
}
```

Common causes:
- `GEMINI_API_KEY` not configured in Supabase Secrets
- Gemini API returned a non-200 response
- Model returned invalid JSON
- Database error when checking or recording usage

---

#### CORS

The function accepts cross-origin requests from any origin (`Access-Control-Allow-Origin: *`). Preflight `OPTIONS` requests are handled and return `200 OK` with the appropriate CORS headers.

Allowed headers: `authorization`, `x-client-info`, `apikey`, `content-type`, `x-sturdy-premium`

---

## Quota Rules

| Tier | Monthly regular scripts | Emergency scripts | Cooldown |
|------|------------------------|-------------------|---------|
| Free | 5 | 1 | 24 hours |
| Premium | Unlimited | Unlimited | None |

The quota window resets on the **1st of each calendar month (UTC)**.

---

## Client SDK Usage

The Edge Function is called via the Supabase JS client in `src/lib/api/generateScript.ts`:

```ts
const { data, error } = await supabase.functions.invoke('generate-script', {
  body: { situation, childAge, neurotype, mode },
});
```

The Supabase client automatically attaches the current user's JWT as the `Authorization` header.

---

## Future Endpoints (Planned)

| Endpoint | Phase | Description |
|----------|-------|-------------|
| `POST /verify-premium` | Phase 4 | Validate RevenueCat receipt and return signed entitlement |
| `GET /usage-summary` | Phase 3 | Return scripts used, remaining, and reset date for the current user |
| `POST /feedback` | Phase 3 | Submit script rating / feedback |
| `GET /insights` | Phase 3–4 | Return pattern insights for the current user |

---

## Supabase Auth Endpoints (Pass-Through)

Sturdy uses the Supabase Auth REST API directly via the JS client. The following auth operations are used:

| Operation | Method | Notes |
|-----------|--------|-------|
| Send OTP | `supabase.auth.signInWithOtp({ email })` | Triggers email with 6-digit code |
| Verify OTP | `supabase.auth.verifyOtp({ email, token, type: 'email' })` | Exchanges code for session |
| Get user | `supabase.auth.getUser()` | Returns current authenticated user |
| Sign out | `supabase.auth.signOut()` | Clears local session |

These calls go directly to the Supabase Auth service and are not routed through the Edge Function.
