# Roadmap

This document tracks Sturdy's planned features, organised by release phase. Priorities are subject to change based on user feedback and business needs.

---

## Current Status — MVP (In Development)

The MVP scope covers the core crisis-response loop for parents on mobile. Items marked ✅ are implemented in the codebase; the app may not yet be in public production.

### Shipped

- [x] Email OTP authentication (Supabase Auth)
- [x] Account setup (username)
- [x] Child profile onboarding (name, age group, neurotype)
- [x] Crisis script generation (Gemini AI via Supabase Edge Function)
- [x] Regulate → Connect → Guide → What If script format
- [x] Age-group adaptation (2–4, 5–7, 8–12)
- [x] Neurotype-aware prompting (ADHD, Autism, Anxiety, Sensory)
- [x] Free-tier quota enforcement (5 scripts/month)
- [x] Emergency script fallback with 24-hour cooldown
- [x] Save to Library (up to 5 scripts, local storage)
- [x] Four-tab navigation (Home, Crisis, Library, Profile)
- [x] Safety escalation in AI prompt rules

---

## Phase 2 — Core Growth

### Authentication & Onboarding

- [ ] Google / Apple Sign-In (OAuth)
- [ ] Username uniqueness validation against Supabase `profiles` table
- [ ] Re-onboarding flow for parents who skip child setup

### Child Profiles

- [ ] Multiple child profiles (Premium tier)
- [ ] Child profile editing from Profile tab
- [ ] Support for children with multiple neurotype tags active simultaneously
- [ ] Age-based reminders to update the child's age group

### Script Generation

- [ ] Mode selection: Crisis vs. Guidance (proactive, calm-moment advice)
- [ ] Script regeneration (try again with same inputs)
- [ ] Confidence rating / feedback on generated script
- [ ] Trigger history (most-used triggers per child)

---

## Phase 3 — Engagement & Retention

### Saved Scripts & Library

- [ ] Unlimited saved scripts (Premium)
- [ ] Organise library by trigger or date
- [ ] Share script via native share sheet
- [ ] Print / export script as PDF

### Progress & Insights

- [ ] Weekly usage summary (scripts used, most frequent triggers)
- [ ] Pattern detection: recurring triggers flagged for parents
- [ ] Predictive insights (see `PREDICTIVE_INSIGHTS.md`)
- [ ] Streak tracking: how many days this week a parent reached out for support

### Notifications

- [ ] Daily check-in push notification (opt-in)
- [ ] "Calm moment" reminder to try Guidance Mode
- [ ] Usage quota warning (1 script remaining)

---

## Phase 4 — Premium Monetisation

### RevenueCat Integration

- [ ] In-app purchase flow (monthly / annual Premium)
- [ ] Server-side receipt validation via RevenueCat webhooks
- [ ] Replace unverified `x-sturdy-premium` header with signed entitlement token
- [ ] Restore purchases flow

### Premium Features

- [ ] Unlimited scripts per month
- [ ] Multiple child profiles (up to 5)
- [ ] Guidance Mode (proactive strategies)
- [ ] Progress Tracking dashboard
- [ ] Priority AI response (lower latency tier)

---

## Phase 5 — Platform Expansion

### Web App

- [ ] Responsive web version of Crisis Support (PWA)
- [ ] Marketing landing page with live CrisisDemo component
- [ ] Plan comparison table
- [ ] Testimonial slider

### API & Integrations

- [ ] Webhook for therapist / coach dashboard integrations (B2B)
- [ ] Export data for parenting coaches

### Internationalisation

- [ ] French (Canada) language support
- [ ] Spanish (US) language support
- [ ] RTL layout support

---

## Known Technical Debt

| Item | Priority | Notes |
|------|----------|-------|
| `x-sturdy-premium` header bypass | High | Not cryptographically verified; any client can claim premium status |
| `loadUsage` TODO in Dashboard | Medium | Usage count not displayed in real time |
| Child profile stored only in AsyncStorage | Medium | Lost on device reinstall; no Supabase sync |
| No server-side neurotype validation | Low | Prompt injection via neurotype field is theoretically possible |

---

## Out of Scope (Intentionally Excluded)

- Medical diagnosis or advice
- Real-time crisis hotline integration (see `SAFETY_SYSTEM.md` for escalation approach)
- Child-facing UI
- Therapist clinical notes feature
