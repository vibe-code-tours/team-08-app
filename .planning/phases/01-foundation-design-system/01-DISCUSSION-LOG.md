# Phase 1: Foundation & Design System - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-10
**Phase:** 1-Foundation & Design System
**Areas discussed:** Neon palette sourcing & glow system, GameContext v1 scope, Screen stub strategy, Local storage persistence scope, PWA identity (name/short_name), PWA icons

---

## Neon Palette Sourcing & Glow System

| Option | Description | Selected |
|--------|-------------|----------|
| Color-pick from Screens.png | Extract exact hex/OKLCH values from the 24-screen UI kit reference so Phase 1's palette matches the design source of truth pixel-for-pixel. | ✓ |
| Reasonable neon approximations | Pick standard vivid neon hex values without color-picking the reference image — faster, close enough. | |

**User's choice:** Color-pick from Screens.png (Recommended)
**Notes:** None provided beyond selecting the recommended option.

---

## GameContext v1 Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Lock only the 7 named phases now | start, setup, touchSelection, selectedPlayer, truthDareChoice, cardReveal, nextRound, plus their core dispatch actions. Random sub-choice, self-vote result phases, and timer state get added by Phase 2/3/4. | ✓ |
| Model the full v1 flow now | Also add GamePhase values/reducer cases for Random coin-flip, self-vote, and result screens up front. | |

**User's choice:** Lock only the 7 named phases now (Recommended)
**Notes:** None provided beyond selecting the recommended option.

---

## Screen Stub Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Create all 7 placeholder screens | One minimal stub file per screen in src/screens/, wired into the router now, so Phase 2/3/4 devs each edit their own screen file independently. | ✓ |
| Router logic only | App.tsx routing switch is built against the GamePhase type; screen files are created later by whichever phase first needs them. | |

**User's choice:** Create all 7 placeholder screens (Recommended)
**Notes:** None provided beyond selecting the recommended option.

---

## Local Storage Persistence Scope

| Option | Description | Selected |
|--------|-------------|----------|
| GameSettings only | Matches REQUIREMENTS.md PLAT-02 wording exactly. Difficulty/pack/timer survive reload; mid-round refresh restarts from Start. | ✓ |
| Full GameState (resumable mid-round) | Persist phase/players/active card too, so a reload resumes exactly where it left off. Adds hydration complexity. | |

**User's choice:** GameSettings only (Recommended)
**Notes:** None provided beyond selecting the recommended option.

---

## PWA Identity — App Name

| Option | Description | Selected |
|--------|-------------|----------|
| "Truth or Dare" / "T or D" | name: "Truth or Dare — Finger Roulette", short_name: "Truth or Dare". | ✓ |
| Custom name | User-provided exact name/short_name. | |

**User's choice:** "Truth or Dare" / "T or D" (Recommended)
**Notes:** None provided beyond selecting the recommended option.

---

## PWA Identity — Icons

| Option | Description | Selected |
|--------|-------------|----------|
| Generate simple neon placeholder icon | Create a basic icon (neon-purple background with a die/finger glyph or "T/D" monogram) sized to 192x192 and 512x512 now. | |
| Reuse/derive from favicon.svg | Rasterize the existing favicon.svg up to 192x192 and 512x512 PNGs as a stand-in, deferring custom icon design. | ✓ |

**User's choice:** Reuse/derive from favicon.svg
**Notes:** User picked the non-default (non-"Recommended") option here — deferring custom icon design entirely rather than creating new placeholder art.

---

## Claude's Discretion

- Exact hex/OKLCH values extracted from `Screens.png` (sourcing method was decided; literal values were not).
- Precise glow utility naming/token structure within Tailwind v4's `@theme` syntax.
- Minimal placeholder screen content (heading-only vs. including dev affordances).

## Deferred Ideas

- Random coin-flip GamePhase/animation (FLOW-02) — Phase 2.
- Self-vote result screens as distinct phases (UX-03/04/05) — Phase 2.
- Full resumable mid-game GameState persistence — not in v1 scope; revisit only if it proves to be a real problem.
- Custom PWA icon art beyond favicon rasterization — candidate for Phase 4 Premium Polish.
