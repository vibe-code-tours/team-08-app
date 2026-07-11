---
phase: 01-foundation-design-system
plan: 02
subsystem: ui
tags: [react, vite, pwa, vite-plugin-pwa, tailwindcss, localstorage, vitest, testing-library]

# Dependency graph
requires:
  - phase: 01-foundation-design-system (plan 01)
    provides: GameContext.tsx (provider/reducer/persistence), src/types/index.ts (type barrel), src/index.css (@theme neon tokens)
provides:
  - 7 placeholder screen components (one per GamePhase) wired into a phase-based router
  - App.tsx phase router (ActiveScreen, named export for tests) wrapping GameContextProvider
  - PWA installability: @tailwindcss/vite + VitePWA() registered in vite.config.ts, manifest identity/tokens, rasterized icons
  - Automated proof (App.test.tsx) that a GameSettings change survives a simulated reload via loadSettings()/localStorage round-trip
affects: [phase-2-core-game-loop, phase-3-content-settings, phase-4-polish]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Phase-based (non-URL) routing via a switch on state.phase in App.tsx's ActiveScreen, exported as a named export so tests can drive routing without going through the full App tree"
    - "Minimal placeholder screen: function component, default export, renders a lowercase phase-name heading (text-2xl font-semibold) on bg-background/text-primary"
    - "PWA manifest identity/tokens sourced verbatim from the same hex values as index.css's @theme tokens (no drift between theme_color and --color-primary)"
    - "SVG-to-PNG icon rasterization via macOS sips (no new devDependency), padded to square with the app background color before resizing"

key-files:
  created:
    - src/screens/StartScreen.tsx
    - src/screens/SetupScreen.tsx
    - src/screens/TouchSelectionScreen.tsx
    - src/screens/SelectedPlayerScreen.tsx
    - src/screens/TruthDareChoiceScreen.tsx
    - src/screens/CardRevealScreen.tsx
    - src/screens/NextRoundScreen.tsx
    - public/pwa-192x192.png
    - public/pwa-512x512.png
  modified:
    - src/App.tsx
    - src/App.test.tsx
    - vite.config.ts
    - index.html

key-decisions:
  - "ActiveScreen is a named export from App.tsx (not just used internally) so App.test.tsx can render it inside a test-only GameContextProvider + dispatch harness without needing a URL-based or prop-driven routing seam"
  - "App.css deleted (confirmed unused after the full App.tsx rewrite; Tailwind utilities replace it per PATTERNS.md)"
  - "PWA icons rasterized via macOS sips instead of installing @vite-pwa/assets-generator (Pitfall 4) or a new sharp/imagemagick dependency — zero new devDependencies, source SVG padded to square with the app's --color-background hex before resizing to 512 and 192"

requirements-completed: [PLAT-01, PLAT-02]

coverage:
  - id: D1
    description: "App.tsx routes to the correct screen component for all 7 GamePhase values; opening the app renders the neon start screen by default"
    requirement: "PLAT-01"
    verification:
      - kind: unit
        ref: "src/App.test.tsx#App > renders the start screen by default"
        status: pass
      - kind: unit
        ref: "src/App.test.tsx#App > routes to the matching screen when the phase changes"
        status: pass
    human_judgment: false
  - id: D2
    description: "The app is an installable PWA: vite.config.ts registers VitePWA() with the locked manifest identity/icons; npm run build emits a manifest and service worker"
    requirement: "PLAT-01"
    verification:
      - kind: other
        ref: "npm run build -- confirms dist/manifest.webmanifest and dist/sw.js are emitted, manifest theme_color (#8B2FE2) matches src/index.css --color-primary"
        status: pass
    human_judgment: false
  - id: D3
    description: "A GameSettings change made through GameContext persists across a full page reload (localStorage round-trip proven end-to-end)"
    requirement: "PLAT-02"
    verification:
      - kind: unit
        ref: "src/App.test.tsx#App > persists a GameSettings change to localStorage across a simulated reload"
        status: pass
    human_judgment: false

duration: 6min
completed: 2026-07-10
status: complete
---

# Phase 1 Plan 2: Walking Skeleton — Screens, Router, PWA & Persistence Summary

**7 placeholder screens wired into an App.tsx phase router, VitePWA + Tailwind plugins registered for installability, and an automated localStorage round-trip proving GameSettings survives a reload**

## Performance

- **Duration:** 6 min
- **Started:** 2026-07-10T12:35:00Z
- **Completed:** 2026-07-10T12:41:31Z
- **Tasks:** 3
- **Files modified:** 13 (7 created screens, App.tsx, App.test.tsx, vite.config.ts, index.html, 2 rasterized PNG icons; App.css deleted)

## Accomplishments
- Full end-to-end vertical slice: opening the app renders the neon-styled `start` screen, driven by real `GameContext` state (from 01-01), with real PWA packaging and real localStorage persistence
- `App.tsx` is a phase-based router (`ActiveScreen`, exported for test-harness use) with an exhaustive switch over all 7 `GamePhase` values and a `noFallthroughCasesInSwitch`-safe default
- PWA installability wired: `@tailwindcss/vite` and `VitePWA()` registered alongside `react()`; `npm run build` emits `dist/manifest.webmanifest` and `dist/sw.js`
- `GameSettings` persistence proven end-to-end by an automated test: dispatching `UPDATE_SETTINGS` then calling a fresh `loadSettings()` (the reload stand-in) returns the updated value from `localStorage`

## Task Commits

Each task was committed atomically:

1. **Task 1: Write failing router + reload-persistence tests for App** - `6026b98` (test)
2. **Task 2: Create 7 placeholder screens and the App.tsx phase router** - `75ccba2` (feat)
3. **Task 3: Wire PWA (Vite plugins, manifest, icons, title) and prove reload persistence** - `f25b0df` (feat)

_Note: Task 1 was authored as a TDD RED task; Task 2 turned the default-render and routing assertions GREEN; the reload-persistence assertion was GREEN from Task 1 onward since `GameContext.tsx`'s persistence layer already existed from plan 01-01._

## Files Created/Modified
- `src/screens/StartScreen.tsx` - Placeholder screen for the `start` phase (heading only)
- `src/screens/SetupScreen.tsx` - Placeholder screen for the `setup` phase
- `src/screens/TouchSelectionScreen.tsx` - Placeholder screen for the `touchSelection` phase
- `src/screens/SelectedPlayerScreen.tsx` - Placeholder screen for the `selectedPlayer` phase
- `src/screens/TruthDareChoiceScreen.tsx` - Placeholder screen for the `truthDareChoice` phase
- `src/screens/CardRevealScreen.tsx` - Placeholder screen for the `cardReveal` phase
- `src/screens/NextRoundScreen.tsx` - Placeholder screen for the `nextRound` phase
- `src/App.tsx` - Fully rewritten: phase-based router (`ActiveScreen`) wrapping `GameContextProvider`, replaces the Vite starter template
- `src/App.css` - Deleted (Tailwind utilities replace it; unused after the App.tsx rewrite)
- `src/App.test.tsx` - Replaced the "Get started" smoke test with 3 tests: default-render, phase-routing, reload-persistence
- `vite.config.ts` - Registers `@tailwindcss/vite` and `VitePWA()` alongside `react()`, with the locked manifest identity/tokens
- `index.html` - `<title>` changed from "team-08-app" to "Truth or Dare"
- `public/pwa-192x192.png` - Rasterized from `favicon.svg`, padded square with `--color-background`
- `public/pwa-512x512.png` - Rasterized from `favicon.svg`, padded square with `--color-background`

## Decisions Made
- Exported `ActiveScreen` as a named export from `App.tsx` so the routing test can drive it inside a test-only `GameContextProvider` + dispatch harness, without introducing a separate routing abstraction
- Confirmed `App.css` deletion (no component imports it post-rewrite)
- Used macOS `sips` (already present, no new devDependency) to rasterize the PWA icons instead of the `pwaAssets` auto-generation option (which requires the uninstalled `@vite-pwa/assets-generator` package, per RESEARCH.md Pitfall 4) — padded the non-square 48x46 source SVG render to a square canvas using the app's `--color-background` hex before downsampling, so both icons are proper squares rather than distorted/stretched renders

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- The Walking Skeleton is complete: real branded UI, real state, real persistence, real PWA packaging all proven end-to-end
- Phase 2 (Core Game Loop) can now build real gameplay logic into `TouchSelectionScreen`, `SelectedPlayerScreen`, `TruthDareChoiceScreen`, and `CardRevealScreen` without touching the shared router (D-07/D-08 — each screen is independently ownable)
- `SetupScreen` remains a placeholder; Phase 3 (per REQUIREMENTS.md CONF-01/02/03) will wire `UPDATE_SETTINGS` dispatches to real settings UI — the reducer case and localStorage persistence already exist and are proven end-to-end by this plan's tests
- No blockers or concerns carried forward

---
*Phase: 01-foundation-design-system*
*Completed: 2026-07-10*

## Self-Check: PASSED

All created/modified files verified present on disk (7 screens, App.tsx, App.test.tsx, vite.config.ts, index.html, 2 PWA icons, App.css deletion confirmed). All 4 commit hashes (6026b98, 75ccba2, f25b0df, f15ed1c) verified present in git log.
