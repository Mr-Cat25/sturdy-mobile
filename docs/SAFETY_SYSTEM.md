# Safety System

This document describes how Sturdy handles safety concerns — both in the AI prompt layer and in the product experience — to protect children, parents, and Sturdy's integrity as a responsible product.

---

## Guiding Principle

Sturdy is a **practical support tool**, not a crisis hotline or medical service. Its safety system is designed to:

1. Never give harmful advice
2. Never replace professional help when it is genuinely needed
3. Always escalate appropriately when a situation involves immediate danger
4. Protect vulnerable users from misleading or dangerous output

---

## Layer 1: AI Prompt Safety Rules

The `generate-script` Edge Function embeds hard rules in the system prompt that the Gemini model must follow for every single script:

### Aggression & Physical Safety

> "If aggression or safety is involved, prioritise safety and firm physical boundaries first."

When a situation involves a child hurting themselves, hurting others, or being in physical danger, the script's `guide` and `what_if` sections must prioritise the parent establishing safety before trying to connect or explain.

Example: A child hitting a sibling gets a script that leads with physical separation, not validation of the emotion.

### No Medical Advice

The prompt instructs the model to produce only parenting scripts — specific, situational spoken language — not medical advice, diagnosis suggestions, or treatment recommendations. If a situation implies a medical concern (e.g. a child describing chest pain, loss of consciousness, or a seizure), the model is expected to direct the parent to emergency services.

### No Shaming

> "Never shame the child or parent."

Scripts must validate the child's experience and the parent's difficulty without assigning blame, labelling the child as "bad", or making the parent feel inadequate.

### No Jargon or Theory

> "Do not give long explanations, theory, or blog-style advice."

The model must produce short, actionable, spoken-language scripts. Lengthy theoretical explanations are rejected at the prompt level.

### No Placeholders

> "Never use placeholders like [option A], [child], or template text."

Every script must be specific to the situation described. Generic filler is explicitly prohibited.

---

## Layer 2: Script Length and Clarity Rules

Each section of the script has enforced length limits:

| Section | Max Length | Reason |
|---------|-----------|--------|
| `regulate` | 1–2 sentences | Parent must absorb this in seconds |
| `connect` | 1–3 sentences | Must be sayable in a single breath |
| `guide` | 1–3 sentences | Concrete, unambiguous direction |
| `what_if` | 1–3 sentences | Tactical fallback — no room for ambiguity |

Keeping scripts short is itself a safety feature: a parent overwhelmed by a 10-sentence block of text cannot use it in the moment.

---

## Layer 3: Quota and Emergency Script Logic

The free-tier quota system includes a **safety-adjacent feature**: the emergency script.

When a parent has exhausted their 5 monthly free scripts, they are not left without support. Instead:

- One **emergency script** is permitted, bypassing the monthly quota.
- A **24-hour cooldown** applies between emergency scripts.
- The cooldown prevents abuse while ensuring no parent in a genuine crisis is turned away entirely.

**Emergency cooldown response (HTTP 429):**
```json
{
  "ok": false,
  "error": "Monthly script limit reached. Emergency script available in 3 hour(s).",
  "quota_exceeded": true,
  "next_emergency_at": "2026-03-15T08:00:00.000Z"
}
```

---

## Layer 4: Product-Level Escalation Copy

For situations that are clearly beyond the scope of a parenting script — for example, a child describing suicidal ideation, a parent describing domestic violence, or acute medical emergencies — the product (in a future phase) should surface escalation copy that directs the user to:

- **Emergency services:** 911 (US) / 999 (UK) / 000 (AU) or local equivalent
- **Crisis lines:** National Parent Helpline, Crisis Text Line
- **Paediatric advice lines:** Where available

In the MVP, escalation is handled within the AI prompt rules (the model is instructed to prioritise safety). Explicit in-app escalation UI is planned for Phase 3.

---

## Layer 5: No Child-Facing Surfaces

Sturdy is a **parent-only tool**. The app has no surface designed for a child to use. There are no child accounts, no child-facing UI, and no content targeted at children.

This is both a product decision (the tool is for the parent's nervous system regulation) and a safety decision (avoiding any COPPA / GDPR-K compliance concerns in the MVP).

---

## What Sturdy Does Not Do

| Scenario | Sturdy's Position |
|----------|------------------|
| Child discloses abuse | Outside scope; future escalation UI to direct to authorities |
| Parent describes domestic violence | Outside scope; future escalation UI to direct to resources |
| Medical emergency | Model directed to escalate to emergency services |
| Mental health crisis (parent or child) | Outside scope; future escalation to crisis lines |
| Ongoing therapy / treatment planning | Explicitly out of scope; Sturdy is not a therapeutic tool |

---

## Known Limitations

1. **No input filtering:** User input (the situation description) is passed directly to the Gemini prompt. A determined user could attempt prompt injection. Mitigation: the model is instructed with strict hard rules, and the response is parsed as JSON with field validation.
2. **No content moderation layer:** There is no separate toxicity or safety classifier on the input or output in the MVP. Adding a Perspective API or similar filter is a Phase 3 consideration.
3. **Premium header unverified:** The `x-sturdy-premium` bypass is not authenticated. This is a quota integrity issue, not a safety issue, but is noted here for completeness.

---

## Excluded Documents

The following documents are maintained separately and are not part of this technical documentation set:

- `AI_LIMITATIONS.md` — Disclosure of AI system limitations to users
- `MEDICAL_SAFETY_NOTICE.md` — Medical disclaimer
- `PRIVACY_POLICY.md` — User data privacy policy
- `TERMS_OF_SERVICE.md` — Terms of use
