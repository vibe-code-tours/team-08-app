---
phase: 01-foundation-design-system
plan: 01
subsystem: ui
tags: [tailwind-v4, react-context, useReducer, localStorage, typescript, vitest, design-tokens]

# Dependency graph
requires: []
provides:
  - "Tailwind v4 @theme neon design-token contract (11 colors + 6 glow shadows) in src/index.css"
  - "Full TypeScript type barrel (src/types/index.ts): GamePhase, Difficulty, CardPack, CardType, PlayerTouch, Card, GameSettings, GameState, GameAction"
  - "GameContext state backbone (src/state/GameContext.tsx): gameReducer, loadSettings, saveSettings, defaultSettings, GameContextProvider, useGameContext"
  - "GameSettings localStorage persistence with try/catch tamper/crash safety"
affects: [01-02-foundation-design-system, 02-core-game-loop, 03-content-settings, 04-polish]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Tailwind v4 CSS-native @theme block (no tailwind.config.js) — --color-* and --shadow-* custom properties auto-generate bg-*/text-*/shadow-glow-* utilities"
    - "Context + useReducer state backbone — single GameContext exposing { state, dispatch }"
    - "localStorage read-on-init / write-on-change scoped to a single state slice (settings only), effect dependency array scoped precisely to state.settings"
    - "try/catch around all localStorage JSON.parse/setItem calls, silent fallback to defaults (V5 input validation)"

key-files:
  created:
    - src/state/GameContext.test.tsx
  modified:
    - src/index.css
    - src/types/index.ts
    - src/state/GameContext.tsx

key-decisions:
  - "Co-located reducer + persistence helpers + hook + provider in one GameContext.tsx file per RESEARCH.md Pattern 2/3 and 01-PATTERNS.md — added a scoped eslint-disable for react-refresh/only-export-components since splitting would break the Task 1/3 test import contract"
  - "Used exact FINAL @theme token values from 01-UI-SPEC.md (pixel-sourced from Screens.png), superseding RESEARCH.md's placeholder OKLCH figures"

patterns-established:
  - "Pattern: @theme neon token block — single source of truth for all colors/glows consumed by Phases 2-4 via Tailwind utility classes, never inline box-shadow/hex values"
  - "Pattern: GameContext.tsx co-locates reducer + persistence + provider + hook; downstream phases should extend the existing file rather than fragmenting state logic"

requirements-completed: [PLAT-04]

coverage:
  - id: D1
    description: "Tailwind v4 @theme neon palette (11 colors + 6 glow shadows) compiles into bg/text/shadow-glow utility classes"
    verification:
      - kind: other
        ref: "npm run build (verified dist CSS contains --color-primary and --shadow-glow-primary custom properties); head -1 src/index.css confirms @import ordering"
        status: pass
    human_judgment: false
  - id: D2
    description: "src/types/index.ts type barrel exports GamePhase (7 phases), Difficulty, CardPack, CardType, PlayerTouch, Card, GameSettings, GameState, and the 7-action GameAction union with no enum usage"
    verification:
      - kind: other
        ref: "npx tsc -b (0 errors in src/types/index.ts); grep -cE '\\benum\\b' src/types/index.ts returns 0"
        status: pass
    human_judgment: false
  - id: D3
    description: "GameContext reducer handles all 7 actions correctly and localStorage persistence never crashes on malformed JSON"
    verification:
      - kind: unit
        ref: "src/state/GameContext.test.tsx (7 tests: START_GAME, SELECT_PLAYER, NEXT_ROUND, UPDATE_SETTINGS reducer transitions; loadSettings empty/malformed fallback; saveSettings/loadSettings round-trip)"
        status: pass
    human_judgment: false

# Metrics
duration: 3min
completed: 2026-07-10
status: complete
---

# Phase 1 Plan 1: Foundation Design Tokens + GameContext Summary

**Tailwind v4 `@theme` neon design-token contract (11 colors + 6 glow shadows, pixel-sourced from Screens.png) plus a fully tested Context+useReducer GameContext backbone with localStorage-backed GameSettings persistence**

## Performance

- **Duration:** 3 min
- **Started:** 2026-07-10T12:26:00Z
- **Completed:** 2026-07-10T12:29:00Z
- **Tasks:** 3
- **Files modified:** 4 (1 created, 3 modified)

## Accomplishments
- Rewrote `src/index.css` as a single Tailwind v4 `@theme` block with the FINAL pixel-sourced neon palette (background, surface, primary, secondary, accent, highlight, truth, dare, success, failure, premium) and 6 glow-shadow tokens, fully replacing the old light/dark `prefers-color-scheme` toggle
- Built `src/types/index.ts` as the single type barrel: `GamePhase` (exactly 7 phases per D-04), `Difficulty`, `CardPack`, `CardType`, `PlayerTouch` (with `touchIdentifier` for multi-touch keying), `Card`, `GameSettings`, `GameState`, and the 7-action `GameAction` union — zero enums, fully `erasableSyntaxOnly`-compliant
- Implemented `GameContext.tsx` (provider + `useReducer` + `useGameContext` hook) with a reducer covering all 7 actions and `GameSettings` localStorage persistence wrapped in try/catch (never crashes on tampered/malformed data)
- TDD RED→GREEN cycle: wrote 7 failing tests first (Task 1), confirmed RED, then implemented GameContext to turn all 7 GREEN (Task 3)

## Task Commits

Each task was committed atomically:

1. **Task 1: Write failing reducer + persistence tests for GameContext** - `aabf159` (test)
2. **Task 2: Rewrite index.css @theme tokens and define the type barrel** - `3bf0911` (feat)
3. **Task 3: Implement GameContext provider, reducer, and settings persistence** - `f84d90a` (feat)

_TDD plan: RED (Task 1) → GREEN (Task 3), with the design-token/type barrel (Task 2) landing in between as an independent, non-TDD infrastructure task._

## Files Created/Modified
- `src/state/GameContext.test.tsx` - 7 Vitest tests covering gameReducer transitions (START_GAME, SELECT_PLAYER, NEXT_ROUND, UPDATE_SETTINGS) and settings persistence (loadSettings empty/malformed fallback, saveSettings/loadSettings round-trip)
- `src/index.css` - Full rewrite: single `@theme` block, 11 color tokens + 6 glow-shadow tokens, no light/dark toggle
- `src/types/index.ts` - Type barrel: `GamePhase`, `Difficulty`, `CardPack`, `CardType`, `PlayerTouch`, `Card`, `GameSettings`, `GameState`, `GameAction`
- `src/state/GameContext.tsx` - `gameReducer`, `loadSettings`, `saveSettings`, `defaultSettings`, `GameContextProvider`, `useGameContext`

## Decisions Made
- Kept `gameReducer`, `loadSettings`, `saveSettings`, `defaultSettings`, `GameContextProvider`, and `useGameContext` co-located in a single `GameContext.tsx` file exactly as RESEARCH.md Pattern 2/3 and 01-PATTERNS.md specify (and as the Task 1/3 test import contract requires) — added a scoped `eslint-disable react-refresh/only-export-components` comment rather than splitting the file, since fragmenting state logic across files would violate the plan's explicit export/file contract.
- Used the FINAL pixel-sourced `@theme` token values from `01-UI-SPEC.md` (not RESEARCH.md's placeholder OKLCH figures), per the UI-SPEC's explicit "supersedes RESEARCH.md" note.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Scoped ESLint disable for react-refresh/only-export-components on GameContext.tsx**
- **Found during:** Task 3 (GameContext implementation)
- **Issue:** `npm run lint` flagged 5 errors — `react-refresh/only-export-components` fires because `GameContext.tsx` exports both a component (`GameContextProvider`) and non-component values (reducer, hook, constants) from the same file. This is the exact file shape mandated by the plan's own Task 3 acceptance criteria and RESEARCH.md/01-PATTERNS.md's canonical pattern.
- **Fix:** Added a single scoped `/* eslint-disable react-refresh/only-export-components -- ... */` comment at the top of the file with an inline rationale, rather than restructuring exports across multiple files (which would break the Task 1 test import contract: `gameReducer, loadSettings, saveSettings, defaultSettings` from `./GameContext`).
- **Files modified:** `src/state/GameContext.tsx`
- **Verification:** `npm run lint` passes with 0 errors after the fix; `npx tsc -b` and all 7 GameContext tests still pass unaffected.
- **Committed in:** `f84d90a` (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 Rule 1 lint fix)
**Impact on plan:** No scope creep — the fix is a scoped lint suppression required to keep the plan's mandated file/export shape while satisfying `npm run lint` cleanly. No behavior change.

## Issues Encountered
- The plan's own `<verification>` block command `grep -c enum src/types/index.ts` returns `1`, not the expected `0` — but this is a substring match against the word "enums" inside the file's leading comment (`// No enums (erasableSyntaxOnly)...`), not an actual `enum` keyword. Re-verified with a word-boundary check (`grep -cE '\benum\b' src/types/index.ts` → `0`), matching Task 2's own acceptance criteria wording exactly. No `enum` keyword is used anywhere in the file; this is a verification-script false positive, not a plan deviation.
- `npm run build` emits benign `[lightningcss minify] Unknown at rule: @theme` / `@tailwind` warnings during CSS minification — these originate from Tailwind v4's own internal library CSS (not our `index.css`) and do not affect output correctness; confirmed the compiled `dist/assets/index-*.css` correctly contains `--color-primary` and `--shadow-glow-primary` custom properties.
- Vitest prints a `Could not parse CSS stylesheet` warning when running `App.test.tsx` (jsdom's CSS parser doesn't fully understand modern `@theme`/`@import` syntax) — this is a jsdom limitation unrelated to this plan's changes; all tests still pass.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- The design-token contract (`@theme` neon palette + glow utilities) and the `GameContext` reducer/persistence backbone are fully in place and tested — Plan 01-02 (PWA wiring, `App.tsx` router, 7 placeholder screens) can now build directly on top of these without any type rework.
- `UPDATE_SETTINGS` reducer case and localStorage wiring are ready end-to-end even though no UI dispatches into it yet (per RESEARCH.md Open Question 2) — Phase 3's real `SetupScreen` can wire directly to `dispatch({ type: 'UPDATE_SETTINGS', payload: {...} })`.
- No blockers for Plan 01-02 or Phase 2-4 parallel workstreams.

---
*Phase: 01-foundation-design-system*
*Completed: 2026-07-10*
