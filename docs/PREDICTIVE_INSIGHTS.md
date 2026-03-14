# Predictive Insights

This document describes Sturdy's planned Predictive Insights feature — a Premium capability that surfaces patterns from a parent's history of hard moments to help them anticipate and prepare for future situations.

---

## Overview

After a family has used Sturdy for several weeks, patterns begin to emerge:

- Meltdowns cluster around transitions (leaving school, bedtime)
- A specific trigger (screen time ending) accounts for 60% of crises
- Hard moments spike on Mondays and after late nights

Predictive Insights transforms this data into actionable guidance that parents can act on *before* the next crisis — not just during it.

---

## Goals

1. **Reduce crisis frequency** by helping parents anticipate high-risk moments.
2. **Build parenting confidence** by showing patterns and progress over time.
3. **Drive Premium retention** — this is a Premium-only feature with high perceived value.
4. **Personalise the experience** beyond one-size-fits-all parenting advice.

---

## Planned Data Sources

All insights are derived from data Sturdy already collects (with consent):

| Source | Data Points |
|--------|------------|
| `script_usage` table | Timestamp of each script generation |
| Script trigger category | Which trigger type was selected |
| Script save events | Which scripts were saved (proxy for usefulness) |
| Child profile | Age group, neurotype |
| Time of day / day of week | Derived from timestamps |

No new data collection is required for the initial insights feature. Child data remains on-device; insights are computed from server-side `script_usage` rows only in the MVP.

---

## Insight Types

### 1. Top Triggers

> "Your most common hard moment is **leaving the park** — it accounted for 4 of your last 7 scripts."

- Computed by counting trigger category labels in saved or generated scripts.
- Displayed as a ranked list with count and percentage.

### 2. Time-of-Day Patterns

> "Hard moments most often happen around **5–7 PM** on weekdays."

- Derived from `created_at` timestamps in `script_usage`.
- Displayed as a simple chart (bar or sparkline) or natural-language summary.

### 3. Day-of-Week Patterns

> "Mondays tend to be harder. This could be related to the transition back from the weekend."

- Count of scripts per day of week over the past 30 days.

### 4. Frequency Trends

> "This week you used Sturdy 2 times — down from 5 last week."

- Simple week-over-week script count comparison.
- Framed positively: fewer scripts = fewer hard moments.

### 5. Escalation Patterns (Advanced)

> "3 of your last 5 **bedtime refusal** scripts needed a 'What If' — this might be worth exploring with a sleep consultant."

- Detects when the same trigger type consistently escalates (proxy: parent used `what_if` section heavily).
- This requires saving richer script interaction data in Phase 3.

---

## Proactive Suggestions

Based on detected patterns, Sturdy can surface proactive scripts before the hard moment:

> "It's 4:45 PM. You're heading into your highest-risk window. Here's a Guidance Mode script to prepare for the park pickup."

This is the **Guidance Mode** feature (listed as a Premium locked item on the Dashboard). Guidance Mode scripts are generated using a different prompt variant (calm-moment, proactive framing rather than crisis framing).

---

## Data Requirements (Phase 3)

To power Predictive Insights, the following changes are needed:

### New: `script_interactions` table (planned)

```sql
CREATE TABLE public.script_interactions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_id     uuid REFERENCES public.script_usage(id) ON DELETE SET NULL,
  trigger_slug text,          -- e.g. 'leaving-park', 'bedtime-refusal'
  situation    text,          -- truncated, anonymised
  saved        boolean DEFAULT false,
  sections_read text[],       -- e.g. ['regulate', 'connect', 'what_if']
  created_at   timestamptz NOT NULL DEFAULT now()
);
```

**Privacy note:** The `situation` field should be stored in truncated or hashed form, or not stored at all, depending on the privacy policy in effect at the time of implementation. User consent must be obtained.

### Client Changes (Phase 3)

- Track which script sections were expanded/read (analytics event)
- Record save events with trigger metadata
- Sync trigger slug from TriggerGrid selection to the server

---

## Privacy Considerations

1. **Transparency:** The Predictive Insights feature must be clearly explained to users before enabling data collection beyond what is currently stored.
2. **Opt-in:** Users should opt in to pattern tracking, not be enrolled by default.
3. **Data minimisation:** Insights are derived from timestamps and trigger categories only. Situation text (free-form) should not be used for pattern analysis.
4. **Deletion:** Deleting an account must cascade-delete all `script_usage` and `script_interactions` rows.

---

## UI Concept

The insights surface is a new section on the Dashboard (Premium) or a dedicated tab:

```
┌─────────────────────────────────────┐
│  📊 Your Patterns                   │
├─────────────────────────────────────┤
│  Most common trigger                │
│  🏞️  Leaving the park    ████░░  4  │
│  📺 Screen time          ███░░░  3  │
│  🛏️  Bedtime refusal      ██░░░░  2  │
├─────────────────────────────────────┤
│  Hard moments this week: 2          │
│  ↓ Down from 5 last week 🌱         │
├─────────────────────────────────────┤
│  💡 Proactive tip                   │
│  Pickup time is in 30 min.          │
│  [Prepare for Transition →]         │
└─────────────────────────────────────┘
```

---

## Roadmap Placement

| Phase | Item |
|-------|------|
| Phase 3 | Top Triggers and Time-of-Day patterns (read-only, from existing `script_usage` data) |
| Phase 3 | `script_interactions` table + client tracking |
| Phase 4 | Proactive suggestions / Guidance Mode integration |
| Phase 5 | Advanced escalation pattern detection |
