# Sturdy Responsive UX Specification

## Purpose

This document defines how Sturdy should behave across device sizes, orientations, accessibility settings, and interaction states.

`UI_SPEC.md` defines what screens contain.  
`RESPONSIVE_UX.md` defines how those screens adapt and feel in real use.

The goal is to ensure Sturdy is:

- fast under stress
- easy to read
- easy to tap
- consistent across devices
- calm and responsive

---

## Core UX Principle

Sturdy is a crisis-first product.

That means responsive behavior is not only about screen size. It is also about:

- reducing friction
- reducing delay
- reducing visual overload
- preserving clarity under stress

A responsive Sturdy experience should always answer:

**Can a stressed parent use this quickly, clearly, and comfortably on this device?**

---

## Supported Device Classes

Sturdy should be designed mobile-first, then expanded for larger layouts.

### Device Tiers

#### Tier 1 — Small Phones
Examples:
- older iPhones
- smaller Android phones

Approx width:

```text
320–374px
```

Priority:
- compact spacing
- larger tap targets
- shorter visible content chunks
- fewer side-by-side layouts

#### Tier 2 — Standard Phones
Examples:
- most modern iPhones
- most modern Android phones

Approx width:

```text
375–428px
```

Priority:
- default design target
- full primary layout
- full-size script cards
- comfortable reading width

#### Tier 3 — Large Phones / Foldables

Approx width:

```text
429–600px
```

Priority:
- preserve readability
- avoid stretching content too wide
- allow larger cards without increasing text density

#### Tier 4 — Tablets

Approx width:

```text
601px+
```

Priority:
- use centered content columns
- do not simply scale phone layouts
- maintain calm reading width
- optionally use split layouts where helpful

---

## Layout Rules by Device Size

### Small Phones

#### Layout Behavior
- use single column only
- keep horizontal padding tighter
- reduce decorative spacing before reducing text size
- stack all actions vertically if needed

#### Padding

```text
Horizontal: 16px
Vertical screen padding: 20px
Card padding: 16px
```

#### Typography Rule
Do not shrink scripts too aggressively. Script readability matters more than fitting everything above the fold.

#### Button Rule
Buttons should remain full width.

---

### Standard Phones

#### Layout Behavior
- single column
- default app layout
- script cards use full available width

#### Padding

```text
Horizontal: 24px
Vertical screen padding: 24px
Card padding: 20px
```

---

### Large Phones

#### Layout Behavior
- still primarily single column
- increase breathing room slightly
- keep max readable content width constrained

#### Max Content Width

```text
560px
```

If the screen is wider, content should be centered rather than stretched edge to edge.

---

### Tablets

#### Layout Behavior
Tablet layouts should not look like enlarged phones.

Use one of these patterns:

##### Pattern A — Centered Single Column
Best for:
- onboarding
- child profile setup
- script result view

```text
Max content width: 640px
Centered horizontally
```

##### Pattern B — Split Layout
Best for:
- conversation history + conversation detail
- child profile + insights
- saved scripts + preview

Example:

```text
Left rail: 280–320px
Right content: flexible
Gap: 24px
```

#### Tablet Rules
- avoid ultra-wide lines of text
- preserve script readability
- keep action buttons visible without crowding content

---

## Safe Area Rules

All screens must respect:
- top notches
- bottom home indicators
- Android navigation bars
- foldable insets where applicable

### Rules
- use safe-area-aware containers on every full screen
- bottom CTA buttons should never sit flush against the screen edge
- sticky bottom actions must include safe area padding
- top headers must not collide with notches

---

## Vertical Flow Rules

Sturdy is text-heavy in critical moments, so vertical rhythm matters.

### Screen Rhythm

Use consistent vertical spacing increments:

```text
4px
8px
12px
16px
24px
32px
48px
```

### Preferred Defaults
- between page sections: 24px
- between card title and body: 8px
- between body text and script text: 12px
- between stacked cards: 16px

---

## Reading Width Rules

Readable width matters more than maximizing screen fill.

### Text Width Limits

For body and script content:

```text
Ideal readable width: 36–42 characters per line for script-heavy sections
Maximum comfortable width: ~65 characters per line
```

On wide devices, cards should be centered with width constraints.

---

## Scroll Behavior

Scrolling should feel predictable and calm.

### General Rules
- every content-heavy screen must scroll vertically
- no nested vertical scroll areas unless absolutely necessary
- avoid horizontal scroll except for chips
- the main action area should appear early in the scroll

### Script Result Screen
The script result screen must:
- show the situation and first script section quickly
- keep the parent from feeling “lost in content”
- avoid large blank spaces before the response begins

### History Screens
- use lazy loading / pagination for long lists
- preserve scroll position when returning to a conversation list

---

## Interaction Design

Sturdy should feel responsive without feeling flashy.

### Button Feedback
All tappable components should provide:
- pressed-state opacity or color shift
- optional haptic feedback on key actions
- clear disabled states

### Recommended Haptics
Use subtle haptics for:
- successful save
- script generated
- feedback submitted
- switching tabs

Do not use strong or frequent haptics in a crisis flow.

---

## Motion Guidelines

Motion should reassure, not distract.

### Principles
- short and subtle
- never playful
- never bouncy
- never slow down urgent flows

### Recommended Motion
- fade in script cards
- subtle slide-up for bottom sheets
- soft loading shimmer or skeletons
- instant chip selection feedback

### Avoid
- long transitions
- excessive animation chaining
- distracting hero animations
- delayed CTA appearance

### Reduced Motion
If reduced motion is enabled:
- remove non-essential animations
- shorten transition durations
- prefer simple opacity changes

---

## Input UX Rules

Parents may be stressed, rushed, or using one hand.

### Text Inputs
- use large multiline fields for hard-moment input
- keep placeholder copy practical
- preserve typed input during accidental navigation if possible

### Keyboard Handling
- input fields must stay visible above the keyboard
- primary CTA must remain reachable
- use keyboard-safe layouts for small phones
- scroll to focused field when needed

### Suggested Placeholder Copy

Examples:
- “My child is screaming because we have to leave the park.”
- “My daughter is hitting because I said no more TV.”

---

## Action Density Rules

Never show too many actions at once.

### Primary Rule
Each screen should have:
- one main action
- up to three supporting actions
- optional secondary links below

### On the Script Screen
Recommended priority:
- Save Script
- Shorter Version
- Public Place Version

Any additional actions should go behind a menu or secondary surface.

---

## Quick Chip Behavior

Quick chips reduce typing and improve engagement.

### Chip Rules
- chips can scroll horizontally
- chips should wrap on larger screens if appropriate
- selected chips should have strong contrast
- chips should always be tappable with one thumb

### Minimum Touch Target

```text
44x44px
```

This applies to chips, buttons, icons, and tabs.

---

## Bottom Navigation Rules

Bottom nav is the main app anchor.

### Tabs

```text
Now
History
Saved
Child
```

### Rules
- always visible on core app screens
- use clear labels, not icon-only tabs
- keep tab count at four
- active tab must have high contrast
- support safe area padding on bottom devices

### Tablet Note
On tablet, bottom nav may become a side rail if needed later.

---

## Loading State Guidelines

Loading states strongly affect perceived quality.

### General Rule
Never leave the user looking at a blank screen without context.

### Preferred Loading Patterns

#### App startup
- simple calm splash
- no spinner-only dead space if avoidable

#### Script generation
Show:
- parent message
- “Sturdy is building your script...”
- subtle loading treatment

#### Lists
Use:
- skeleton cards
- shimmer placeholders
- or labeled loading blocks

Avoid tiny indefinite spinners as the only signal.

---

## Empty State Guidelines

Every empty state should tell the user what to do next.

### History Empty State
Example:
- “No conversations yet.”
- “Start with what’s hard right now.”

### Saved Scripts Empty State
Example:
- “No saved scripts yet.”
- “Save helpful scripts so they’re easy to reuse.”

### Child Insights Empty State
Example:
- “Insights will appear after a few conversations.”

---

## Error State Guidelines

Errors must be calm and actionable.

### Rules
- explain what happened in plain language
- provide one recovery action
- do not dump technical jargon into the UI

### Example
Bad:
- “Function invocation failed.”

Good:
- “We couldn’t generate a script right now.”
- “Try again.”

---

## Accessibility Standards

Sturdy must be highly accessible.

### Text
- support dynamic type / larger text sizes
- avoid hard-coded clipped layouts
- preserve readability under font scaling

### Contrast
- body text should meet accessible contrast standards
- script text should have especially strong contrast
- avoid low-contrast muted text for key guidance

### Touch Targets

Minimum:

```text
44x44px
```

### Screen Readers
All key elements need labels:
- buttons
- tabs
- chips
- save actions
- feedback controls

### Focus Order
Focus order should match visual hierarchy.

---

## Large Text Behavior

When accessibility font scaling is enabled:

### Rules
- cards should expand vertically
- buttons may wrap text if needed
- avoid truncating scripts
- tabs may shorten only as a last resort
- keep core action readable without overlap

---

## One-Handed Use Rules

Many users will use Sturdy one-handed while managing a child.

### Design Implications
- keep primary actions low enough to reach
- avoid tiny controls in far top corners for critical actions
- key actions should not depend on two-handed precision

### Best Practice
Use sticky bottom action areas for critical actions on longer screens if needed.

---

## Script Screen Optimization

This is the most important screen in the product.

### Priority Order
1. Situation summary
2. Parent tone
3. Regulate
4. Connect
5. Guide
6. Avoid saying
7. Notes
8. Feedback
9. Secondary actions

### Why
The parent should reach the useful language immediately.

### Responsive Behavior
- cards stack vertically on all phones
- on tablets, actions may appear in a right-side utility column
- keep “Say” text visually stronger than “Do” text

---

## History Screen Optimization

### Phones
- simple grouped list
- open conversation on tap

### Tablets
Use split view:
- left: conversation list
- right: selected conversation detail

This reduces friction and improves browsing.

---

## Saved Scripts Optimization

### Phones
- stacked cards
- optional search at top
- filters in a horizontal chip row

### Tablets
- list on left
- selected script preview on right

---

## Child Screen Optimization

This screen becomes more valuable over time.

### Layout Priority
- Child identity
- common triggers
- what works
- things to avoid
- insights

### Device Rule
On tablets, “what works” and “things to avoid” can sit side by side.

---

## Performance Guidelines

Responsiveness is also performance.

### Rules
- keep first screen lightweight
- defer non-critical data loads
- paginate long histories
- cache recent child data
- minimize large image use
- avoid unnecessary re-renders in chat/history flows

### Perceived Performance
The product should feel fast even when generation takes a moment.

Use:
- visible progress states
- message echo before AI completion
- skeleton content instead of blank waiting

---

## Offline / Weak Network Behavior

Hard-moment tools should degrade gracefully.

### Rules
- detect offline state
- show a clear offline message
- allow access to saved scripts offline if possible
- never silently fail on send

### Ideal Future Behavior
If offline:
- open saved scripts
- show cached recent scripts
- preserve unsent user text

---

## Device Testing Matrix

At minimum, Sturdy should be tested on:

### Small Phone

```text
iPhone SE size / small Android
```

### Standard Phone

```text
iPhone 13/14/15 class
Pixel / Samsung standard phone
```

### Large Phone

```text
Pro Max / Plus class
```

### Tablet

```text
iPad portrait and landscape
Android tablet
```

### Key States to Test
- keyboard open
- large text enabled
- reduced motion enabled
- dark environment visibility
- poor network
- long script output
- long child names
- multiple neurotype tags

---

## Quality Checklist

A screen is not ready unless it passes these checks:

- Is the main action obvious?
- Is the text readable under stress?
- Can the screen handle smaller phones?
- Can it handle larger text?
- Are touch targets large enough?
- Does it avoid visual clutter?
- Does it feel fast?
- Is the next step clear?

---

## Final Principle

Responsive UX in Sturdy is not about making layouts merely “fit.”

It is about preserving the product promise on every device:

**fast, calm, practical parenting support in hard moments**

---

FILE: DESIGN.md

# Sturdy Design System

## Design Philosophy

Sturdy is designed to support parents during high-stress moments.

The interface must feel:

- calm
- clear
- supportive
- fast to use

The UI should never feel like a chatbot.

Instead it should feel like a structured parenting tool that gives clear guidance.

### Primary design principles

- Speed over complexity
- One clear action per screen
- Large readable text
- Minimal visual noise
- Practical language over explanations

The product experience should feel like:

**“A calm guide that tells you what to say next.”**

---

## Product Navigation

Bottom navigation structure:

**Now | History | Saved | Child**

### Now
Immediate help for current parenting moments.

### History
Past conversations and scripts.

### Saved
Reusable scripts parents found helpful.

### Child
Child profile and behavioral insights.

---

## Core Screens

### 1. Welcome Screen

**Purpose:** introduce the product simply.

#### Layout
- STURDY
- Support for hard parenting moments
- [ Get Started ]
- Already have an account? Sign in

---

### 2. Child Profile Setup

Child profile data personalizes AI responses.

#### Fields
- Child Name
- Age Range
- 2–4
- 5–7
- 8–12
- Neurotype (optional)
- ADHD
- Autism
- Anxiety
- Sensory

---

### 3. Home Screen (Now)

This is the main entry point.

#### Example layout
- Good evening
- What’s hard right now?
- [ Describe what’s happening ]
- Quick situations
- Leaving
- Bedtime
- Hitting
- Sibling conflict
- Refusing to listen
- Recent conversations
- Leaving the park
- Bedtime meltdown

#### Goals
- reduce typing
- allow immediate support
- show past usage

---

### 4. Hard Moment Input

Simple message input.

- Alex • Age 6
- What’s happening right now?
- [ My child won't leave the park ]

---

### 5. Script Result Screen

This is the core product screen.

#### Layout
- Situation
- Leaving the park is overwhelming because the activity suddenly stops.
- Parent tone
- Low voice. Few words.
- REGULATE
- Do
- Take one breath and move closer.
- Say
- “I’m here. I won’t let you hit.”
- CONNECT
- Do
- Name the feeling briefly.
- Say
- “You really wanted to stay.”
- GUIDE
- Do
- Set the limit and next step.
- Say
- “We are leaving now. Hold my hand.”
- Avoid saying
- • Stop this right now
- • You're embarrassing me

#### Footer actions
- Did this help?
- 👍 Yes
- 👎 Not really
- Save script
- Shorter version
- Public place version

---

### 6. Conversation History

- Today
- Leaving the park
- Bedtime meltdown
- Yesterday
- Morning refusal
- Last week
- Sibling conflict

#### Purpose
- review past scripts
- continue conversations

---

### 7. Saved Scripts

Reusable scripts parents rely on frequently.

#### Example
- Saved Scripts
- ⭐ Bedtime script
- ⭐ Leaving the house
- ⭐ Morning routine

---

### 8. Child Profile Screen

This screen stores learning about the child.

#### Example
- Alex
- Age 5–7
- ADHD
- Common hard moments
- Leaving activities
- Bedtime transitions
- What has helped
- Countdown warnings
- Two clear choices
- Things to avoid
- Long explanations during escalation
- Sudden transitions

---

### 9. Child Insights (Future)

Insights are generated from past interactions.

#### Example
- Insights for Alex
- Most common trigger
- Transitions
- Strategies that worked
- Countdown warnings
- Offering two choices
- Suggestion
- Give a five minute warning before leaving the park.

---

## Design System

### Colors

#### Primary palette
- Background: `#F7F3EC`
- Paper: `#FFFDF9`
- Primary: `#3C5A73`
- Text: `#1E2430`
- Secondary text: `#4B5563`

#### Accent colors
- Sage: `#7C9A87`
- Amber: `#D9A441`
- Clay: `#C98B6B`
- Danger / Safety: `#B85C4B`

---

## Typography

Typography must prioritize readability.

### Headline
- large and calm

### Body
- medium weight

### Script text
- slightly larger than body

Parents must be able to read scripts quickly during stressful moments.

---

## Component System

Core components used throughout the app:

- Script Card  
  Displays Regulate / Connect / Guide content.

- Action Chips  
  Used for quick situations like:
  - Leaving
  - Bedtime
  - Hitting

- Feedback Bar  
  Captures whether a script helped.

- Pattern Card  
  Displays known child triggers and strategies.

- Safety Banner  
  Displayed when safety escalation occurs.

---

## UX Rules

The interface must follow these rules:

- never overwhelm the user
- prioritize large readable scripts
- keep explanations minimal
- always show a clear next step
- minimize typing
- make scripts easy to read aloud

---

## Long-Term UX Goal

Over time Sturdy should feel like it knows the child.

Parents should feel:

**“This app understands my kid.”**

This happens through:
- saved scripts
- conversation history
- behavioral pattern memory
- personalized insights

---

FILE: STURDY_MASTER_BLUEPRINT.md

# Sturdy Master Product Blueprint

## Purpose

This document is the master blueprint for the Sturdy product. It consolidates the core concepts behind:

- Product vision
- AI system
- Safety architecture
- User experience
- Data model
- Backend system
- Monetization
- Growth strategy

If other documentation is lost, this file should still contain enough information to rebuild the full product architecture.

---

## Product Vision

Sturdy is an AI-powered parenting support tool designed for high-stress parenting moments. It provides calm, practical scripts that parents can use immediately when a situation becomes difficult.

Core question Sturdy answers:

> “What should I say right now?”

Common high-stress moments include:

- Tantrums
- Sibling conflict
- Transitions
- Bedtime resistance
- Public meltdowns

Instead of searching the internet or reading long articles, Sturdy delivers short, practical guidance instantly.

---

## Core Product Principles

### 1) Crisis First
- The product must work quickly in stressful moments.
- Parents should receive helpful guidance within seconds.
- The system should avoid long explanations and focus on actionable scripts.

### 2) Calm and Non-Judgmental
Parents using Sturdy may already feel overwhelmed. The system must:

- Avoid blame
- Avoid therapy jargon
- Avoid lectures
- Maintain a calm tone

### 3) Structured Guidance
Every response follows the same structure:

1. Regulate
2. Connect
3. Guide

This predictable format helps parents quickly understand what to do.

### 4) Personalization
Over time, Sturdy learns patterns about a child:

- Common triggers
- Strategies that work
- Strategies that escalate conflict

This enables gradually improved personalization.

---

## AI Interaction Model

Sturdy is not designed as a general chatbot. Instead, it generates structured parenting scripts.

Typical interaction flow:

1. Parent describes situation
2. System evaluates safety risk
3. AI generates structured script
4. Parent tries script
5. Parent provides feedback
6. System learns from the interaction

---

## Response Structure

All AI responses follow the same format:

1. Situation
2. Parent tone
3. Regulate
   - Action
   - Script
4. Connect
   - Action
   - Script
5. Guide
   - Action
   - Script
6. Avoid saying
7. Notes

### Example

- **Situation:** Leaving the park can be overwhelming because a fun activity is ending.
- **Parent tone:** Low voice. Few words.
- **Regulate**
  - **Action:** Take a slow breath and move closer.
  - **Script:** “I'm here. I won't let you kick.”
- **Connect**
  - **Action:** Name the feeling briefly.
  - **Script:** “You really wanted to stay.”
- **Guide**
  - **Action:** Set the limit and next step.
  - **Script:** “We are leaving now. Hold my hand or I will carry you.”

---

## Safety Architecture

Because the app handles children and difficult situations, safety routing is required. Incoming messages are classified before AI generation.

### Classifications

- `SAFE`
- `ELEVATED_RISK`
- `CRISIS_RISK`
- `MEDICAL_EMERGENCY`

### Routing behavior

- `SAFE` → normal parenting script
- `ELEVATED_RISK` → safety support language
- `CRISIS_RISK` → de-escalation guidance
- `MEDICAL_EMERGENCY` → emergency recommendation

### Emergency example

> “My child is not breathing.”

In this case, the response must direct the user to emergency services rather than generating coaching advice.

---

## Personalization and Learning

Sturdy learns patterns about each child over time, including:

- Triggers
- Time of day
- Strategies used
- Success ratings

### Example pattern

- Child: Alex
- Age: 6
- Common trigger: transitions
- Effective strategies: countdown warnings, offering choices

Future scripts may reference these patterns.

Example:

> “Last time, countdown warnings helped during transitions.”

---

## Predictive Insights

Instead of claiming to predict behavior, Sturdy provides pattern-based insights.

### Examples

- “Transitions have been difficult recently.”
- “Countdown warnings have helped in several recent situations.”

These insights help parents prepare for difficult moments.

---

## Core Product Features

### Hard Moment Mode
Primary feature. Parent describes a current problem and receives a script.

### Saved Scripts
Parents can save scripts that worked well, creating a personal library of helpful phrases.

### Child Profiles
Each child profile contains:

- exact child age (single value)
- Neurotype tags
- Preferences
- Behavior patterns

### Conversation History
Parents can review previous interactions.

### Feedback System
After each script, parents can indicate whether the script helped. This feedback powers personalization.

### Child Insights
Over time, the system generates insights about:

- Common triggers
- Effective strategies
- Patterns in behavior

---

## Data Model Overview

Core entities:

- Users
- Child Profiles
- Conversations
- Messages
- Saved Scripts
- Behavior Patterns
- Safety Events
- Subscriptions

### Relationships

- User → multiple children
- Child → multiple conversations
- Conversation → multiple messages

---

## Backend Architecture

The backend uses Supabase.

### Components

- PostgreSQL database
- Supabase authentication
- Edge Functions for API logic

AI generation occurs within edge functions.

### Key function

- `chat-parenting-assistant`

### Responsibilities

- Validate authentication
- Check safety risk
- Load child context (including exact child age)
- Generate AI script
- Store conversation
- Return structured response

---

## AI Prompt System

The AI system follows strict prompting rules. The prompt includes:

- System identity
- Response structure instructions
- Child profile context (including exact single age)
- Conversation context
- Safety restrictions

The AI must generate short, practical scripts.

### Avoid

- Therapy language
- Diagnoses
- Long explanations
- Blame

---

## User Experience Philosophy

The app should feel calm and supportive.

### Design goals

- Minimal friction
- Fast responses
- Clear scripts
- Minimal text overload

### Primary navigation

- Now
- History
- Saved
- Child

The **Now** screen is the most important. Parents should be able to describe a situation and receive help quickly.

---

## Visual Design Theme

Sturdy should use calming design elements.

### Color palette

- Primary blue
- Soft neutral background
- Gentle green for positive feedback
- Soft amber for safety alerts

Animations should be subtle. Avoid loud or distracting visuals.

---

## Monetization Strategy

Sturdy follows a freemium model.

### Free plan

- Limited number of scripts per day
- One child profile
- Basic support features

### Premium plan

- Unlimited scripts
- Multiple child profiles
- Saved scripts library
- Child insights
- Predictive insights

Suggested price range: $8-$12 per month.

Annual plans can provide discounted pricing.

---

## Landing Page Strategy

The landing page should explain the product clearly.

### Suggested sections

- Hero section
- How it works
- Example script
- Why parents love it
- Download links

Hero message should communicate value instantly.

### Example headline

> “What should I say right now?”

---

## Growth Strategy

Early growth channels may include:

- Parenting TikTok creators
- Instagram parenting communities
- Reddit parenting forums
- Parenting newsletters
- Word-of-mouth sharing

Shareable scripts can encourage organic growth.

---

## Long-Term Vision

Over time, Sturdy becomes more than a script generator. It becomes a parenting support system that:

- Learns about each child
- Helps parents recognize patterns
- Suggests strategies proactively
- Provides emotional support during stressful moments

Long-term goal: help parents feel more confident and supported in difficult situations.

---

## Summary

Sturdy combines several systems:

- AI parenting guidance
- Safety-aware response routing
- Child-specific personalization (including exact-age adaptation)
- Pattern-based insights
- Calm, supportive user experience

Together, these create a product designed to help parents navigate difficult moments with their children more confidently.
