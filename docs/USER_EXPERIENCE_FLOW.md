# Sturdy — User Experience Flow

## Overview

Sturdy is designed for high-stress parenting moments.  
The experience must be fast, calming, and require minimal thinking from the parent.

Parents should be able to open the app and receive useful guidance in under 10 seconds.

The core question Sturdy answers:

**“What should I say right now?”**

---

## Primary User Flow

This is the most important flow in the product.

```text
Parent experiences a difficult moment
↓
Parent opens Sturdy
↓
Parent describes the situation
↓
Sturdy generates a calm script
↓
Parent uses the script
↓
Parent optionally gives feedback
↓
Sturdy learns what worked
```

---

## Core Screens

The app should remain simple and focused.

Primary navigation includes four main areas:

- Now
- History
- Saved
- Child

---

## 1. Now Screen (Primary Screen)

The Now screen is the main entry point for parents.

**Goal:** allow the parent to quickly describe the situation.

### UI Elements

- text input
- optional quick tags
- submit button

### Example prompt

“What’s happening right now?”

### Example input

“My child is screaming because we have to leave the park.”

After submission, the request is sent to the backend AI function.

---

## 2. Script Response Screen

The system generates a structured script.

Every script follows the same format.

### Regulate

Short action for the parent.

Example:

“Take one slow breath and move closer.”

Script:

“I’m here. I won’t let you kick.”

### Connect

Name the feeling.

Script:

“You really wanted to stay.”

### Guide

Set the boundary and next step.

Script:

“We are leaving now. Hold my hand.”

### Additional elements on this screen

- Save script button
- Feedback buttons
- Share option

---

## 3. Feedback Interaction

After trying the script, parents can respond with:

- ✓ That helped
- ✗ That didn’t help

Feedback helps Sturdy learn patterns about the child.

### Data recorded

- situation type
- script used
- parent rating
- timestamp

---

## 4. Saved Scripts Screen

Parents can save scripts that worked well.

### Purpose

Create a personal library of helpful responses.

### Example saved scripts

- Leaving the park
- Bedtime
- Hitting sibling

Parents can reuse these scripts later.

---

## 5. Child Profile Screen

Parents create a profile for each child.

### Child data may include

- name
- age range
- neurotype tags
- preferences
- common triggers

### Example triggers

- transitions
- bedtime
- sharing toys

This information helps personalize scripts.

---

## 6. Conversation History

Parents can revisit previous interactions.

### History includes

- situation description
- script provided
- feedback rating
- timestamp

This allows parents to reflect on past moments.

---

## Example Real Usage

### Parent at park

Child refuses to leave.

Parent opens Sturdy and types:

“My child is screaming because we have to leave the park.”

Sturdy responds with a script:

**Regulate**  
“I’m here. I won’t let you hit.”

**Connect**  
“You really wanted to stay.”

**Guide**  
“We are leaving now. Hold my hand.”

Parent uses the script.

Later the parent taps:

✓ That helped

Sturdy records the event and learns.

---

## Design Principles

The UX should follow these rules.

### Fast

Parents must get help quickly.

**Target response time:** under 5 seconds.

### Calm

Language and visuals should feel supportive and steady.

Avoid:

- loud colors
- flashing animations
- long explanations

### Clear

Scripts should be:

- short
- practical
- easy to say aloud

### Minimal

Parents should not navigate through complex menus during stressful moments.

Most interactions happen through the Now screen.

---

## Long-Term UX Vision

Over time Sturdy evolves from a script generator into a parenting support system.

Future capabilities may include:

- pattern insights
- weekly child behavior summaries
- proactive suggestions
- routine building support

These features should appear gradually without complicating the core experience.

---

FILE: UI_SPEC.md

# Sturdy UI Specification

## Purpose

This document defines the exact UI structure for the Sturdy mobile app.

It specifies:

- screen hierarchy
- component structure
- layout rules
- spacing
- typography
- color usage
- UI copy

The goal is to ensure designers and engineers build a consistent and calm experience optimized for parents in stressful moments.

---

## Design Goals

The interface must feel:

- calm
- fast
- trustworthy
- readable under stress

The product should not feel like a chatbot.

Instead, it should feel like a structured parenting tool.

---

## Layout System

All screens follow a consistent layout grid.

### Base Grid

- Mobile width: 390px
- Padding: 24px horizontal
- Vertical rhythm: 16px increments

### Spacing Scale

- 4px
- 8px
- 12px
- 16px
- 24px
- 32px
- 48px

Spacing should use these values only.

---

## Typography

### Font hierarchy

#### Headline
- Size: 28
- Weight: Bold
- Line height: 34

#### Section title
- Size: 18
- Weight: Semibold

#### Body text
- Size: 16
- Weight: Regular

#### Script text
- Size: 18
- Weight: Medium
- Line height: 26

Scripts must be easy to read quickly.

---

## Color System

### Base

#### Background
`#F7F3EC`

#### Card surface
`#FFFDF9`

#### Primary text
`#1E2430`

#### Secondary text
`#4B5563`

### Brand

#### Primary
`#3C5A73`

#### Sage accent
`#7C9A87`

#### Amber accent
`#D9A441`

#### Clay accent
`#C98B6B`

#### Danger
`#B85C4B`

---

## Component Library

These components should be reusable.

### Button

#### Primary button
- Height: 48px
- Border radius: 12px

#### Style
- Background: Primary
- Text: White

#### Label examples
- Get Script
- Continue
- Save Script

### Action Chip

Used for quick situations.

- Height: 36px

#### Example chips
- Leaving
- Bedtime
- Hitting
- Sibling conflict

#### Style
- Background: light gray
- Border radius: 18px
- Padding: 12px horizontal

### Script Card

Used for Regulate / Connect / Guide sections.

#### Layout
- Padding: 20px
- Border radius: 16px
- Background: card surface
- Shadow: subtle

#### Structure
- Section title
- Action
- Say

### Feedback Bar

Displayed after script.

#### Layout
Did this help? 👍 Yes 👎 Not really

#### Spacing
16px between buttons

---

## Screen Specifications

### Screen 1 — Welcome

**Purpose:** introduce the product.

#### Layout
- Logo
- Headline
- Support for hard parenting moments
- Primary button: Get Started
- Secondary link: Sign In

#### Spacing
- Top padding: 120px
- Elements spaced by 24px

---

### Screen 2 — Child Profile Setup

#### Fields
- Child Name
- Age Range
- 2–4
- 5–7
- 8–12
- Neurotype
- ADHD
- Autism
- Anxiety
- Sensory

#### Primary action
- Continue

---

### Screen 3 — Home (Now)

#### Top section
- Greeting
- What’s hard right now?

#### Primary input
- Describe what’s happening

#### Quick situations
- Leaving
- Bedtime
- Hitting
- Sibling conflict
- Refusing to listen

#### Recent conversations
- Leaving the park
- Bedtime meltdown
- Morning refusal

---

### Screen 4 — Hard Moment Input

#### Header
- Alex · Age 6

#### Prompt
- What’s happening right now?

#### Input field
- Multiline text input

#### Button
- Get Script

---

### Screen 5 — Script Result

This is the most important screen.

#### Structure
- Situation summary
- Parent tone
- Regulate
- Action
- Script
- Connect
- Action
- Script
- Guide
- Action
- Script

#### Example script
“I’m here. I won’t let you hit.”

#### Below sections
- Avoid saying
- Notes

#### Actions
- Save script
- Shorter version
- Public place version

#### Footer
- Did this help?
- 👍 Yes
- 👎 Not really

---

### Screen 6 — Conversation History

Grouped by time.

- Today
- Yesterday
- Last week

#### List item structure
- Conversation title
- Timestamp
- Child name

---

### Screen 7 — Saved Scripts

#### List structure
- Script title
- Trigger
- Child name

#### Example
- Bedtime script
- Leaving the house
- Morning routine

---

### Screen 8 — Child Profile

#### Header
- Child name
- Age band
- Neurotype

#### Sections
- Common triggers
- What works
- Things to avoid

---

### Screen 9 — Child Insights

#### Example card
- Most common trigger: Transitions
- What helped: Countdown warnings
- Suggestion: Try a five minute warning before leaving activities

---

## Navigation

Bottom navigation bar.

### Tabs
- Now
- History
- Saved
- Child

Icons should be simple line icons.

---

## UX Rules

To preserve product clarity:

### Do not:
- show long paragraphs
- display large chat walls
- overload screens
- use bright colors excessively

### Always:
- highlight scripts clearly
- prioritize readability
- minimize typing
- keep decisions simple

---

## Product Principle

The UI must always reinforce this idea:

**Sturdy helps you know what to say next.**

That is the core product experience.

---

FILE: ROADMAP.md

# Sturdy Roadmap

## Product Direction

Sturdy is being built as a crisis-first AI parenting tool for real-life hard moments.

The roadmap is designed around one central idea:

**help parents faster, more clearly, and more personally in the moments that matter most**

The product will grow in stages, starting with the most useful core experience and expanding into memory, personalization, and long-term guidance.

---

## Guiding Priorities

Every roadmap decision should support at least one of these:

- faster support in high-stress moments
- more practical scripts
- stronger trust and safety
- better child-specific personalization
- higher parent retention through usefulness over time

---

## Phase 1 — Core MVP

### Goal

Deliver the first usable version of Sturdy that solves the core problem:

**a parent enters a hard moment and gets a calm, practical script immediately**

### Product Features

- user authentication
- child profile creation
- age band support
- neurotype support
- structured AI script generation
- hard moment mode
- safety escalation path
- conversation persistence
- mobile script display

### AI Capabilities

- constrained JSON response
- calm, firm, practical tone
- Regulate → Connect → Guide format
- basic safety detection
- brief “avoid saying” guidance
- brief “notes” section

### Technical Scope

- React Native app with Expo
- Supabase auth
- Postgres schema for child profiles, conversations, and messages
- one Edge Function for AI generation
- OpenAI integration
- row-level security

### Success Criteria

- parent can sign up
- parent can create a child profile
- parent can describe a situation
- parent receives a useful structured script
- response feels calm, clear, and practical
- data is stored safely

---

## Phase 2 — Better Product Usability

### Goal

Make the product feel like a real tool, not just a demo.

### Product Features

- conversation history screen
- conversation detail screen
- saved scripts
- retry / regenerate response
- copy script action
- short script version
- reflection mode
- basic subscription gating
- restore purchases flow
- onboarding improvements

### UX Improvements

- faster flow into hard moment mode
- cleaner script rendering
- better child switching
- improved empty states
- better loading and error states
- reduced typing friction
- quick prompt chips such as:
  - bedtime
  - leaving park
  - sibling conflict
  - hitting
  - refusing to leave
  - school refusal

### AI Improvements

- more consistent response formatting
- reflection mode prompts
- stronger neurotype-specific adjustments
- shorter emergency response flow
- better prompt versioning

### Technical Scope

- new Edge Functions:
  - list conversations
  - get conversation
  - save script
  - sync subscription
- RevenueCat integration
- improved client-side state handling
- response schema validation

### Success Criteria

- parents can revisit past conversations
- useful scripts can be saved
- app feels stable and repeatable
- first premium path exists
- parents can use Sturdy more than once a day without friction

---
