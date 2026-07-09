# Project Research Summary

**Project:** Truth/Dare Finger Roulette PWA
**Domain:** Mobile-first party game (client-side only PWA)
**Researched:** 2026-07-09
**Confidence:** HIGH

## Executive Summary

This is a multiplayer party game PWA where 2-10 players share a single phone, place fingers on screen, and a neon roulette spins to select one player who then completes a Truth or Dare challenge. The core value proposition is the roulette selection moment -- it must feel electric and premium. The project already has a solid Vite + React + TypeScript scaffold with CI/CD, ESLint, Vitest, and a 24-screen UI kit as the visual target. All four core game files exist as empty stubs waiting to be implemented.

The recommended approach is a phased build starting with the Tailwind v4 design system and game state skeleton, then the high-risk multi-touch and roulette core mechanic, followed by the card selection and challenge flow, and finishing with sound, confetti, and PWA polish. The stack additions are straightforward: Tailwind CSS v4 (CSS-first config, no tailwind.config.js), Motion (the maintained successor to framer-motion) for spring physics animations, Howler.js for mobile-safe audio, and canvas-confetti for celebrations. All four libraries have high source reputation and are well-suited to this project's constraints.

The three critical risks are: (1) touch tracking bugs from using array index instead of touch.identifier, which causes wrong player selection -- already documented in CLAUDE.md but must be enforced in implementation; (2) silent audio failure on iOS Safari and Chrome due to autoplay lock policies -- requires Howler.js unlock pattern tested on real devices; and (3) animation jank on mid-range phones during the roulette spin -- requires profiling early and using only hardware-accelerated transforms. None of these are novel problems; all have well-understood solutions documented in the research.

## Key Findings

### Recommended Stack

The project scaffold is already solid with React 19, Vite 8, TypeScript 6, Vitest, ESLint, and vite-plugin-pwa (installed but not wired). Four runtime packages need to be added, plus the PWA plugin needs configuration. No backend, no state management library, no UI component library, no router -- this is a single-flow offline game.

**Core additions:**
- **Tailwind CSS v4** (`tailwindcss` + `@tailwindcss/vite`): Utility-first CSS with CSS-first `@theme` configuration for the neon color palette. Do NOT use v3 patterns or create a tailwind.config.js.
- **Motion** (`motion`): Maintained successor to framer-motion (deprecated). Import from `motion/react`. Provides spring physics for roulette spin, card flip, and screen transitions via AnimatePresence.
- **Howler.js** (`howler`): Web Audio API abstraction with automatic mobile unlock, sound sprite support for bundling all game sounds into one file, zero dependencies.
- **canvas-confetti** (`canvas-confetti`): Canvas-based confetti with neon color configuration. Use directly via useRef/useEffect, not a React wrapper.

**Already installed, needs wiring:**
- **vite-plugin-pwa**: Service worker generation, manifest injection, offline caching. Must be added to vite.config.ts plugins array.

**Explicitly not needed:** Redux/Zustand (Context sufficient), React Router (phase-driven routing), UI libraries (custom neon theme), Axios/TanStack Query (no API), i18n (single language MVP).

### Expected Features

**Must have (table stakes):**
- Multi-touch finger detection with auto-detection and colored indicators (2-10 players)
- Roulette spin with spring physics, neon glow trail, and dramatic slowdown
- Truth / Dare / Random choice with coin-flip animation
- Card selection grid (~10 face-down cards, tap to flip with 3D animation)
- Challenge display with difficulty badge and pack badge
- Self-voting (Fail / Pass / Excellent)
- Game settings (difficulty, card pack, timer toggle) persisted to localStorage
- Next round flow (Next Round / Change Settings / Restart)
- Mobile-first responsive design (portrait, touch targets, safe areas)

**Should have (competitive differentiators):**
- Neon cyber aesthetic with glow effects and glassmorphism panels
- Sound effects for roulette, card flip, timer, and celebrations
- Confetti celebration on pass
- Splash screen with animated neon title
- Onboarding walkthrough (2-3 slides)
- Player count auto-detection from touch events
- Countdown timer with pressure effects

**Defer (v2+):**
- Sound effects (polish, not playability -- defer to Phase 4)
- Confetti celebration (pure polish)
- Onboarding walkthrough (users figure it out)
- Countdown timer (optional feature, not core)

### Architecture Approach

The architecture is a single-flow, phase-driven game with no router. Game phase (a string enum) determines which screen renders, managed by a single GameContext with useReducer. All game state (phase, settings, players, current challenge, results) lives in one reducer. Screen components dispatch actions to transition between phases. The useMultiTouch hook tracks finger positions keyed by touch.identifier. Animation uses Motion for spring physics (roulette, card flip) and AnimatePresence for screen transitions.

**Major components:**
1. **GameContext** -- Single source of truth for all game state; handles phase transitions, player tracking, settings
2. **useMultiTouch** -- Touch tracking hook keyed by touch.identifier; maps to PlayerTouch with colors
3. **Screen components** (one per phase) -- Render UI for current phase, dispatch actions to GameContext
4. **Tailwind @theme** -- Defines the neon color palette as utility classes available globally
5. **useSoundEffects** -- Howler.js wrapper hook handling unlock and providing typed play functions

**Key anti-patterns to avoid:** Multiple context providers (use single GameContext), array index touch tracking (use touch.identifier), CSS-only animations for complex sequences (use Motion), building screens before the design system (set up Tailwind @theme first).

### Critical Pitfalls

1. **Touch identifier mismatch** -- Using array index instead of touch.identifier causes wrong player assignment when fingers lift and touch down in sequence. Prevention: key all touch state by touch.identifier, test with 3+ fingers where one lifts mid-roulette.
2. **Mobile audio lock** -- iOS Safari and Chrome silence all audio until user interaction. Prevention: Howler.js with playerror + unlock event pattern, test on real iOS devices (not Chrome DevTools emulation).
3. **Animation jank on mid-range phones** -- Roulette or card flip dropping below 60fps kills the premium feel. Prevention: use only hardware-accelerated transforms (will-change: transform), limit simultaneous particles, profile on real mid-range Android (Samsung Galaxy A series) with 4x CPU throttling.
4. **PWA not wired** -- vite-plugin-pwa is in package.json but not in vite.config.ts, so no service worker is generated. Prevention: wire VitePWA into plugins array in Phase 1.
5. **Tailwind v3 vs v4 confusion** -- Online tutorials still reference v3 config patterns. Prevention: use `@theme` directive in src/index.css, never create a tailwind.config.js file.

## Implications for Roadmap

### Phase 1: Foundation and Design System
**Rationale:** The Tailwind v4 design system must land before any screen work (anti-pattern: building screens before the design system). GameContext provides the skeleton all screens plug into. vite-plugin-pwa must be wired early so offline caching works from the start.
**Delivers:** Tailwind v4 with full neon color palette, GameContext with all game actions and reducer, type definitions, vite-plugin-pwa configured, initial App.tsx screen router.
**Addresses:** Game settings, local storage persistence, PWA config, neon cyber aesthetic foundation.
**Avoids:** Tailwind v3/v4 confusion (use @theme), building screens without design system.

### Phase 2: Multi-Touch and Roulette Core
**Rationale:** This is the core value proposition and the highest technical risk. Must be validated early. Depends on GameContext from Phase 1 for state management. The useMultiTouch hook and TouchSelectionScreen are the most complex pieces.
**Delivers:** useMultiTouch hook, TouchSelectionScreen with multi-touch tracking, roulette spin animation with spring physics and dramatic slowdown, winner reveal, player color assignment.
**Addresses:** Multi-touch finger detection, roulette spin with dramatic slowdown, player count auto-detection, mobile-first responsive design.
**Avoids:** Touch identifier mismatch (key by touch.identifier), animation jank (profile early, hardware-accelerated transforms only).
**Uses:** Motion library for spring physics roulette animation.

### Phase 3: Game Flow Completion
**Rationale:** Once the core mechanic works, complete the play loop so the game is actually playable end-to-end. Depends on GameContext from Phase 1 and player selection from Phase 2.
**Delivers:** Truth/Dare choice screen, CardSelectionScreen with face-down grid, CardRevealScreen with 3D flip animation, ResultScreen with self-voting, NextRoundScreen, splash screen, onboarding walkthrough, card data (50-100+ cards across packs and difficulties).
**Addresses:** Truth or Dare choice, card selection grid, card flip reveal, challenge display, self-voting, result screens, next round flow, splash screen, onboarding.
**Uses:** Motion for card flip animation and screen transitions (AnimatePresence).

### Phase 4: Sound, Confetti, and PWA Polish
**Rationale:** Sound effects and confetti are important for the premium feel but not for playability testing. This phase also handles PWA install flow and final polish. Depends on all screens being in place from Phases 2-3.
**Delivers:** Howler.js sound effects (roulette tick, card flip, timer, celebration, failure), canvas-confetti neon celebrations, PWA install prompt handling, countdown timer with pressure effects, pack color differentiation, performance profiling and optimization.
**Addresses:** Sound effects, confetti celebration, offline PWA support, countdown timer, pack color differentiation.
**Avoids:** iOS Safari audio lock (Howler.js unlock pattern tested on real devices).
**Uses:** Howler.js for audio, canvas-confetti for celebrations.

### Phase Ordering Rationale

- **Phase 1 first** because the design system (Tailwind @theme) is a prerequisite for all visual work, and GameContext is the data backbone for every screen. Wiring PWA early ensures offline caching works from the start.
- **Phase 2 before Phase 3** because the roulette is the highest technical risk -- if multi-touch tracking or the animation has fundamental issues, it is better to discover this before building the rest of the game flow.
- **Phase 3 completes the play loop** so the game can be played end-to-end for user testing before polish.
- **Phase 4 last** because sound, confetti, and PWA polish are layered on top of a working game. They improve the experience but do not affect playability.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2:** Multi-touch tracking has known pitfalls (touch.identifier, hardware limits). The spike results in CLAUDE.md provide guidance, but implementation may reveal device-specific issues needing research. Animation spring physics tuning for the roulette may require experimentation.
- **Phase 3:** 3D card flip animation with perspective -- Motion library docs cover this but the exact spring values for a premium feel may need iteration. Timer pressure effects need visual design decisions.

Phases with standard patterns (skip research-phase):
- **Phase 1:** Tailwind v4 setup, React Context, vite-plugin-pwa -- all well-documented with clear patterns in STACK.md.
- **Phase 4:** Howler.js integration, canvas-confetti, PWA install prompt -- established patterns with good documentation.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All four recommended libraries have high source reputation, verified via Context7, and clear rationale for selection over alternatives. Versions confirmed via npm. |
| Features | HIGH | Derived from PROJECT.md requirements and 24-screen UI kit. Clear separation of table stakes vs. differentiators vs. anti-features. Team consensus on scope. |
| Architecture | HIGH | Architecture follows established React patterns (Context + useReducer, phase-driven routing). Component boundaries are clear. Data flow is linear and well-defined. |
| Pitfalls | HIGH | Touch identifier issue is already proven by team's own spike. Audio lock and animation jank are well-documented mobile web issues with established solutions. |

**Overall confidence:** HIGH

### Gaps to Address

- **Card data content:** The project needs 50-100+ cards across 4 packs and 3 difficulties. The actual card content (truths, dares, Myanmar/Burmese text) needs to be authored. This is a content creation task, not a technical one, but should be scheduled before Phase 3 needs it.
- **PWA icon assets:** The vite-plugin-pwa config references 192x192 and 512x512 icons that need to be generated in the neon theme. Should be done during or after Phase 1.
- **Audio sprite file:** Howler.js needs a compiled audio sprite file (webm + mp3) containing all game sounds. Sound design and audio asset creation is needed before Phase 4.
- **Real device testing:** Animation performance and audio unlock must be validated on real iOS and mid-range Android devices. Chrome DevTools emulation is not sufficient. Plan for physical device testing in Phases 2 and 4.
- **Myanmar/Burmese localization:** The UI kit is in Myanmar language. All card content and UI text need to be in Myanmar. Ensure fonts and text rendering work correctly for Myanmar script.

## Sources

### Primary (HIGH confidence)
- PROJECT.md -- Project requirements, scope, constraints, active features
- CLAUDE.md -- Architecture flow, key technical learnings, folder conventions
- docs/ARCHITECTURE.md -- Existing architecture documentation
- Context7: Tailwind CSS v4 -- @theme directive, v4 configuration, Vite plugin
- Context7: Motion for React -- AnimatePresence, spring physics, WAAPI animations
- Context7: Howler.js -- Mobile audio unlock, sound sprites, cross-browser compatibility
- Context7: canvas-confetti -- API, performance, configuration options
- Context7: vite-plugin-pwa -- workbox configuration, manifest setup, dev options

### Secondary (MEDIUM confidence)
- npm version verification -- All package versions confirmed via npm view commands

---

*Research completed: 2026-07-09*
*Ready for roadmap: yes*
