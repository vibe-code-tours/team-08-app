# Truth or Dare — Finger Roulette

## What This Is

A premium multiplayer party game PWA where 2–10 players place their fingers on a phone screen, a roulette spins to select one player, who then picks Truth or Dare, selects a challenge card, and performs it. The game is fully client-side with no backend — a social, share-the-phone experience designed for parties and gatherings.

## Core Value

The roulette selection moment — fingers on screen, spinning light, dramatic slowdown, winner revealed — must feel electric and fun. If that single moment delivers excitement, the game works.

## Design Direction

**Reference:** `public/images/Screens.png` — 24-screen UI kit (source of truth for visual direction)

**Aesthetic:** Neon cyber / party game
- Dark purple/black gradient backgrounds
- Neon glow effects on all interactive elements
- Glassmorphism-style panels with soft shadows
- High-contrast vibrant accents (purple, pink, electric blue, gold)
- Rounded corners, strong visual hierarchy
- Animated particle effects and confetti celebrations

**Color System:**
| Role | Color |
|------|-------|
| Background | Very dark purple / black gradient |
| Primary | Neon Purple |
| Secondary | Neon Pink |
| Accent | Electric Blue |
| Highlight | Gold / Orange |
| Truth | Blue |
| Dare | Pink / Red |
| Success | Green |
| Failure | Red |
| Premium/Selected | Gold |

**Animation Direction:**
- Smooth, responsive, slightly exaggerated for excitement
- Framer Motion for all React animations
- Spring physics for natural feel
- Avoid: generic website transitions, abrupt movements, flat screens

## Requirements

### Validated

- ✓ Project scaffolding (Vite + React + TypeScript) — existing
- ✓ ESLint + Vitest configuration — existing
- ✓ CI/CD pipeline (GitHub Actions) — existing
- ✓ PWA installable with manifest and service worker — Validated in Phase 1: Foundation & Design System
- ✓ Codebase architecture documented — existing
- ✓ Local storage persistence for settings and preferences — Validated in Phase 1: Foundation & Design System
- ✓ Fully client-side, no backend required — Validated in Phase 1: Foundation & Design System

### Active

- [ ] Multi-touch finger selection (2–10 players, auto-detect, colored indicators)
- [ ] Spinning light roulette selection with dramatic slowdown
- [ ] Truth / Dare / Random choice with coin-flip animation
- [ ] Card selection grid (~10 cards face-down, player picks one)
- [ ] Premium 3D card flip reveal animation
- [ ] Challenge display with difficulty badge and pack badge
- [ ] Game settings: difficulty level, card pack, timer toggle
- [ ] Starter card set (50–100+ cards across packs and difficulties)
- [ ] Light pack differentiation (subtle color accent per pack)
- [ ] Simple onboarding walkthrough (2–3 slides for first-time users)
- [ ] Splash screen with neon TRUTH or DARE title
- [ ] Player self-voting (Fail / Pass / Excellent)
- [ ] Result screens (celebration for pass, funny failure for fail)
- [ ] Sound effects (roulette, card flip, timer, celebrations)
- [ ] Optional countdown timer with pressure effects
- [ ] Next round flow (Next Round / Change Settings / Restart)

### Out of Scope

- Backend / server — fully client-side MVP
- User accounts / authentication — local party game, no login
- Online multiplayer — same-device only for v1
- Card content management UI — cards are static TypeScript data
- Redux / Zustand — React Context sufficient for MVP
- Dark mode toggle — always dark (neon theme is the only mode)

## Context

**Existing State:** Phase 1 (Foundation & Design System) complete — Tailwind v4 neon `@theme` design tokens, the full TypeScript type barrel (`src/types/index.ts`), and `GameContext` (reducer + localStorage-backed `GameSettings`) are implemented and tested. `App.tsx` is a phase-based router with AnimatePresence screen transitions over 8 screens (`src/screens/`), and the app is an installable PWA (manifest + service worker). 7 reusable components in `src/components/` (NeonButton, GlassPanel, CardBack, DifficultyBadge, PackBadge, TimerDisplay, PlayerDot). `src/hooks/useMultiTouch.ts` is fully implemented (116 lines). `src/data/cards.ts` has 192 cards across 4 packs × 3 difficulties with filtering helpers. All UI text is in Myanmar (Burmese). 4 screens are fully implemented (StartScreen, FingerSelectionScreen, RouletteScreen, PlayerSelectedScreen); 4 are stubs (SetupScreen, TruthDareChoiceScreen, CardRevealScreen, NextRoundScreen).

**Design Reference:** A 24-screen UI kit (`public/images/Screens.png`) provides the complete visual target — from splash screen through onboarding, gameplay, and settings. The design is in Myanmar/Burmese language but the visual language (neon dark theme, glow effects, card animations, roulette) is clear.

**Technical Learnings:** Multi-touch tracking MUST key by `touch.identifier`, not array index (documented in CLAUDE.md). Hardware/OS may cap simultaneous touches before browser events fire.

**Team:** 4 developers working in parallel on separate feature branches.

## Constraints

- **Tech Stack**: React + Vite + TypeScript + Tailwind CSS + Framer Motion — no UI component libraries, build custom
- **Platform**: PWA, mobile-first, must work on phones (Android + iOS Safari)
- **Multi-touch**: Hardware/OS limits apply; design gracefully for 2–10 fingers
- **Performance**: Smooth 60fps animations on mid-range phones; no jank during roulette or card flip
- **Team**: 4 parallel workstreams — features must be independently branchable
- **No Backend**: Everything runs client-side; data is static TypeScript files + localStorage

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Tailwind CSS over styled-components | Utility-first scales better for custom neon design system | — Pending |
| Framer Motion over CSS-only | Complex sequences (roulette, card flip, particles) need spring physics and orchestration | — Pending |
| Static TypeScript cards over JSON | Type safety, IDE autocomplete, compile-time validation | — Pending |
| React Context over Redux | MVP state is simple (game phase + settings); Context + useReducer sufficient | — Pending |
| Self-vote only | Simplifies UX — selected player judges own challenge | — Pending |
| PWA (no native) | Cross-platform reach, no app store friction, share-the-phone model | — Pending |
| Starter cards in codebase | 50–100+ cards across 4 packs × 3 difficulties built into the project | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-10 after Phase 1: Foundation & Design System*
