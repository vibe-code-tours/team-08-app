# Roadmap: Truth or Dare -- Finger Roulette

## Overview

The game builds in four phases: first the design system and game state skeleton, then the high-risk multi-touch roulette core and game flow screens in parallel, followed by the content/settings platform layer, and finally the premium polish (sound, animations, onboarding). After Phase 1 lands, up to 4 developers can work simultaneously on Phases 2-4 across separate branches.

## Phases

- [x] **Phase 1: Foundation & Design System** - Tailwind neon theme, GameContext, type definitions, PWA wiring, screen router (completed 2026-07-10)
- [ ] **Phase 2: Core Game Loop** - Multi-touch roulette selection and the complete play flow (Truth/Dare choice, card selection, reveal, voting, results, next round)
- [ ] **Phase 3: Content, Settings & Platform** - Card data (50-100+ cards), game settings screens (difficulty, pack, timer toggle)
- [ ] **Phase 4: Premium Polish** - Splash screen, onboarding, sound effects, countdown timer, pack color accents

## Phase Details

### Phase 1: Foundation & Design System

**Mode:** mvp
**Goal**: Developers have a complete design system, game state backbone, and screen router ready for feature work
**Depends on**: Nothing (first phase)
**Requirements**: PLAT-01, PLAT-02, PLAT-04
**Success Criteria** (what must be TRUE):

  1. Tailwind v4 neon color palette is available as utility classes (neon purple, pink, electric blue, gold backgrounds, glows)
  2. GameContext provides all game actions (start game, select player, choose truth/dare, pick card, vote, next round) and reducer handles every state transition
  3. TypeScript type definitions exist for Card, GameState, PlayerTouch, GameSettings, and all game phases
  4. Game settings and state persist in local storage so they survive page reloads
  5. App.tsx routes to the correct screen component based on the current game phase from GameContext

**Plans**: 2/2 plans complete

Plans:
**Wave 1**

- [x] 01-01-PLAN.md — Tailwind v4 @theme neon token contract, type barrel, and GameContext (reducer + GameSettings localStorage persistence)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02-PLAN.md — 7 screen stubs + phase-based App.tsx router, PWA wiring (manifest/service worker/icons), and end-to-end reload-persistence proof

### Phase 2: Core Game Loop

**Mode:** mvp
**Goal**: The core roulette selection moment works and the full play flow is playable end-to-end
**Depends on**: Phase 1
**Requirements**: MTCH-01, MTCH-02, MTCH-03, MTCH-04, MTCH-05, FLOW-01, FLOW-02, FLOW-03, FLOW-04, FLOW-05, UX-03, UX-04, UX-05, UX-06, PLAT-03
**Success Criteria** (what must be TRUE):

  1. 2-10 fingers on screen each get a unique colored indicator and the roulette spins to select one player with a dramatic slowdown and winner highlight
  2. The selected player can choose Truth, Dare, or Random (with coin-flip animation), then pick from a grid of face-down cards
  3. Tapping a card triggers a 3D flip animation revealing the challenge content with difficulty and pack badges
  4. The player can self-vote (Fail / Pass / Excellent) and sees the appropriate result screen (celebration for pass, failure for fail)
  5. After voting, the player sees Next Round / Change Settings / Restart options and can return to the touch selection screen

**Plans**: TBD

Plans:

- [ ] 02-01: Multi-touch hook, touch selection screen, roulette animation with spring physics and winner reveal
- [ ] 02-02: Truth/Dare choice screen, card selection grid, card flip reveal, challenge display
- [ ] 02-03: Self-voting screen, result screens (pass/fail), next round flow

### Phase 3: Content, Settings & Platform

**Mode:** mvp
**Goal**: The game ships with a full card library and configurable settings
**Depends on**: Phase 1
**Requirements**: CONT-01, CONF-01, CONF-02, CONF-03
**Success Criteria** (what must be TRUE):

  1. A starter set of 50-100+ cards exists across 4 packs (Friends, Couple, Family, Classic) and 3 difficulties (Easy, Medium, Hard)
  2. Players can select difficulty level and card pack from a settings screen, and the card grid shows only cards matching those selections
  3. Players can toggle the countdown timer on or off in settings
  4. Settings persist in local storage and the game respects difficulty/pack filters during card selection

**Plans**: TBD

Plans:

- [ ] 03-01: Card data (50-100+ cards) across packs and difficulties
- [ ] 03-02: Settings screens (difficulty, pack, timer toggle) with local storage persistence

### Phase 4: Premium Polish

**Mode:** mvp
**Goal**: The game delivers the electric, premium party-game feel through sound, animation, and onboarding
**Depends on**: Phase 2, Phase 3
**Requirements**: UX-01, UX-02, UX-07, UX-08, CONT-02
**Success Criteria** (what must be TRUE):

  1. The app opens with an animated neon splash screen showing "TRUTH or DARE" title
  2. First-time users see a 2-3 slide onboarding walkthrough explaining how to play
  3. Sound effects play for roulette spin, card flip, timer countdown, and celebrations/failures
  4. The optional countdown timer shows increasing visual pressure as time runs out
  5. Card packs have subtle color accent differentiation (e.g., Friends = blue tint, Couple = pink tint)

**Plans**: TBD

Plans:

- [ ] 04-01: Splash screen and onboarding walkthrough
- [ ] 04-02: Sound effects (Howler.js) and countdown timer pressure effects

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4. Phases 2, 3, and 4 can execute in parallel after Phase 1 completes.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Design System | 2/2 | Complete    | 2026-07-10 |
| 2. Core Game Loop | 0/3 | Not started | - |
| 3. Content, Settings & Platform | 0/2 | Not started | - |
| 4. Premium Polish | 0/2 | Not started | - |
