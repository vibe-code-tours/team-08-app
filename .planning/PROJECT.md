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
- ✓ Multi-touch finger selection (2–10 players, auto-detect, colored indicators) — Validated in Phase 2
- ✓ Spinning light roulette selection with dramatic slowdown — Validated in Phase 2
- ✓ Truth / Dare / Random choice with coin-flip animation — Validated in Phase 2
- ✓ Card selection grid with 3D flip animation — Validated in Phase 2
- ✓ Challenge display with difficulty badge and pack badge — Validated in Phase 2
- ✓ Player self-voting (Fail / Pass / Excellent) — Validated in Phase 2
- ✓ Result screens (celebration for pass, funny failure for fail) — Validated in Phase 2
- ✓ Next round flow (Next Round / Change Settings / Restart) — Validated in Phase 2
- ✓ Game settings: difficulty level, card pack, timer toggle — Validated in Phase 3
- ✓ Starter card set: 192 cards across 4 packs × 3 difficulties — Validated in Phase 3
- ✓ Light pack differentiation (color accent per pack) — Validated in Phase 3
- ✓ Onboarding walkthrough (5 slides for first-time users) — Validated in Phase 4
- ✓ Sound effects (12 SFX via Web Audio API) — Validated in Phase 4
- ✓ Background music (3 tracks with crossfade) — Validated in Phase 4
- ✓ Countdown timer with pressure effects — Validated in Phase 4
- ✓ No-repeat player selection — Validated in v1 consolidation
- ✓ Desktop click-to-add players — Validated in v1 consolidation
- ✓ Error boundary with restart — Validated in v1 consolidation
- ✓ Merged PlayerSelected + TruthDareChoice screen — Validated in v1 consolidation

### Active

- [ ] Works on Android and iOS Safari (mobile-first testing)

### Out of Scope

- Backend / server — fully client-side MVP
- User accounts / authentication — local party game, no login
- Online multiplayer — same-device only for v1
- Card content management UI — cards are static TypeScript data
- Redux / Zustand — React Context sufficient for MVP
- Dark mode toggle — always dark (neon theme is the only mode)

## Context

**Existing State:** All 4 phases complete + v1 consolidation merged. 11 screens, 12 components, 3 hooks (useMultiTouch, useSound, useTouchCapability). Web Audio API SFX (12 sounds with inflight dedup) + HTML5 Audio BGM (3 tracks with RAF crossfade). Error boundary with restart. No-repeat player selection. Desktop click-to-add. 192 cards across 4 packs × 3 difficulties. Settings + phase persist in localStorage. 35 tests passing across 4 test files. PWA installable with manifest, service worker, and icons. All UI text in Myanmar (Burmese).

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
| Tailwind CSS over styled-components | Utility-first scales better for custom neon design system | Confirmed in Phase 1 |
| Framer Motion over CSS-only | Complex sequences (roulette, card flip, particles) need spring physics and orchestration | Confirmed in Phase 2 |
| Static TypeScript cards over JSON | Type safety, IDE autocomplete, compile-time validation | Confirmed in Phase 3 |
| React Context over Redux | MVP state is simple (game phase + settings); Context + useReducer sufficient | Confirmed in Phase 1 |
| Self-vote only | Simplifies UX — selected player judges own challenge | Confirmed in Phase 2 |
| PWA (no native) | Cross-platform reach, no app store friction, share-the-phone model | Confirmed in Phase 1 |
| 192 starter cards in codebase | 4 packs × 3 difficulties × 16 cards each | Confirmed in Phase 3 |
| Web Audio API for SFX | Low-latency, preloaded, inflight dedup for rapid sounds like roulette tick | Confirmed in v1 |
| HTML5 Audio for BGM | Avoids Howler.js state machine race conditions; RAF crossfade | Confirmed in v1 |
| Error boundary via class component | React requirement — class component for componentDidCatch, wrapped in functional component | Confirmed in v1 |
| Module-level click ID counter | Desktop click IDs must persist across remounts to avoid no-repeat collisions between rounds | Confirmed in v1 |

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
*Last updated: 2026-07-18 after v1 consolidation (PR #86)*
