---
phase: 01-foundation-design-system
reviewed: 2026-07-11T00:00:00Z
depth: standard
files_reviewed: 15
files_reviewed_list:
  - public/pwa-192x192.png
  - public/pwa-512x512.png
  - src/App.test.tsx
  - src/App.tsx
  - src/index.css
  - src/screens/CardRevealScreen.tsx
  - src/screens/NextRoundScreen.tsx
  - src/screens/SelectedPlayerScreen.tsx
  - src/screens/SetupScreen.tsx
  - src/screens/StartScreen.tsx
  - src/screens/TouchSelectionScreen.tsx
  - src/screens/TruthDareChoiceScreen.tsx
  - src/state/GameContext.test.tsx
  - src/state/GameContext.tsx
  - src/types/index.ts
findings:
  critical: 0
  warning: 5
  info: 5
  total: 10
status: issues_found
---

# Phase 1: Code Review Report

**Reviewed:** 2026-07-11
**Depth:** standard
**Files Reviewed:** 15
**Status:** issues_found

## Summary

Phase 1 delivers a Walking Skeleton: Tailwind v4 `@theme` neon design tokens, a `GameState`/`GameAction` type barrel, a `GameContext` provider + reducer with localStorage-backed settings persistence, seven placeholder screens, and PWA wiring via `vite-plugin-pwa`. `npm run lint`, `npx tsc -b`, `npx vitest run` (10/10), and `npm run build` all pass clean as of this review.

No Critical/security-severity issues were found in the reviewed source — this is a fully client-side app with no untrusted network input, and the localStorage read/write paths are correctly try/catch-guarded against malformed data or unavailable storage. The findings below are real logic gaps in the reducer (payload data silently discarded for two of seven actions, a third with an undocumented ordering dependency), an unreachable-but-unenforced exhaustiveness gap in the screen router, a maskable-icon spec violation that will visibly clip the app icon on Android home screens, and several test-coverage gaps worth tracking before Phase 2 builds real screens and gameplay logic on top of this state backbone.

Several of the reducer findings (`CHOOSE_TRUTH_OR_DARE`, `VOTE`) were explicitly scoped in 01-CONTEXT.md/01-RESEARCH.md D-05 as "Phase 2 will complete this" — they are not implementation mistakes relative to the plan's stated scope. They are nonetheless live bugs in the reducer as committed today (dispatching either action silently loses caller-supplied data with no observable state change), so per the adversarial review mandate they are reported here as Warnings against the shipped code, not waived on the basis of plan intent.

## Warnings

### WR-01: `CHOOSE_TRUTH_OR_DARE` payload is silently discarded — no state field records the choice

**File:** `src/state/GameContext.tsx:48-49`
**Issue:** The reducer case ignores `action.payload` (a `CardType`, i.e. `'truth' | 'dare'`) entirely:
```ts
case 'CHOOSE_TRUTH_OR_DARE':
  return { ...state, phase: 'cardReveal' }
```
`GameState` (`src/types/index.ts:38-44`) has no field to hold which of truth/dare was chosen — only `selectedCard` exists, set later by a separate `PICK_CARD` action. By the time `phase` becomes `'cardReveal'`, the information needed to decide which card pool (truth vs dare) to draw from has already been lost unless some other channel threads it through. `GameContext.test.tsx` has zero coverage for this action, so nothing currently guards this contract.
**Fix:**
```ts
// types/index.ts — add to GameState
chosenType: CardType | null

// GameContext.tsx
case 'CHOOSE_TRUTH_OR_DARE':
  return { ...state, phase: 'cardReveal', chosenType: action.payload }
...
case 'NEXT_ROUND':
  return { ...state, phase: 'touchSelection', activePlayer: null, selectedCard: null, chosenType: null }
```

### WR-02: `VOTE` action is a complete no-op — payload received and discarded, misleading new-object-identity spread

**File:** `src/state/GameContext.tsx:52-53`
**Issue:**
```ts
case 'VOTE':
  return { ...state }
```
The `'pass' | 'fail'` payload is never stored anywhere in `GameState`. The `{ ...state }` spread produces a new object reference every dispatch with no actual data change — this is misleading (looks like a state update, triggers re-renders in consumers, but changes nothing observable) and there is no test asserting either real behavior or an explicit deferred-no-op intent.
**Fix:** Either store the result now for a stable contract, or make the no-op explicit and cheap:
```ts
case 'VOTE':
  // TODO(phase-2): record pass/fail result — no-op until FLOW-02/UX-03-05 land
  return state
```
or, to close the gap properly:
```ts
case 'VOTE':
  return { ...state, voteResult: action.payload } // requires voteResult: 'pass' | 'fail' | null on GameState
```

### WR-03: `PICK_CARD` never transitions `phase` — silently relies on an undocumented dispatch-order dependency

**File:** `src/state/GameContext.tsx:50-51`
**Issue:**
```ts
case 'PICK_CARD':
  return { ...state, selectedCard: action.payload }
```
Every other flow-advancing action (`START_GAME`, `SELECT_PLAYER`, `CHOOSE_TRUTH_OR_DARE`, `NEXT_ROUND`) also transitions `phase`; `PICK_CARD` breaks that pattern. It "works" today only because `CHOOSE_TRUTH_OR_DARE` already moved `phase` to `'cardReveal'` before `PICK_CARD` fires — an ordering dependency that is nowhere enforced, documented, or tested. If a future caller dispatches `PICK_CARD` on its own (e.g. a "redraw card" action), no phase transition occurs.
**Fix:** Either add an explicit code comment documenting the required dispatch order, or make the action self-sufficient:
```ts
case 'PICK_CARD':
  return { ...state, phase: 'cardReveal', selectedCard: action.payload }
```

### WR-04: `default: return null` in `ActiveScreen` switch is not compiler-enforced exhaustive; comment overstates the guarantee

**File:** `src/App.tsx:28-29`
**Issue:** The comment claims exhaustiveness "per noFallthroughCasesInSwitch," but that TS option only prevents case fallthrough — it does not enforce switch exhaustiveness. Exhaustiveness currently holds only because every literal of `GamePhase` has a matching `case`, narrowing `state.phase` to `never` at `default`. If a new `GamePhase` value is added to `src/types/index.ts` without a matching `case` here, TypeScript will **not** raise a compile error — `default: return null` will silently swallow the new phase and render a blank screen with no console warning, no build failure, no runtime error.
**Fix:** Force a compile-time failure on missing cases:
```ts
default: {
  const _exhaustive: never = state.phase
  return _exhaustive
}
```

### WR-05: 512×512 maskable PWA icon violates the maskable safe zone — will be visibly clipped on Android

**File:** `public/pwa-512x512.png`, `vite.config.ts` (manifest `icons` array, `purpose: 'maskable'` entry)
**Issue:** The maskable icon spec requires all meaningful glyph content to fit inside the inner ~80% "safe zone" circle (roughly a 409px-diameter circle centered in the 512×512 canvas) because Android applies arbitrary mask shapes (circle, squircle, rounded square) and crops everything outside that safe zone. Visual inspection of `public/pwa-512x512.png` shows the lightning-bolt glyph's top-left and top-right points extend almost to the image edges — well outside the safe zone — and the bottom point sits close to the bottom edge as well. Because the manifest declares this exact asset with `purpose: 'maskable'`, Android is told it is safe to crop it to a mask shape, which will clip the bolt's tips and produce a visibly broken home-screen icon.
**Fix:** Regenerate `pwa-512x512.png` (and verify `pwa-192x192.png`, which is not currently used as a maskable source but should be checked too) with the glyph inset to fit within the inner 80% safe-zone circle, e.g. via a maskable-icon validator (maskable.app). Prefer separating concerns rather than reusing the same asset for both purposes:
```ts
icons: [
  { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
  { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
  { src: 'pwa-512x512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
]
```
**Status: resolved 2026-07-11.** First manual attempt added a dedicated `pwa-512x512-maskable.png` but it still violated the safe zone and was the wrong pixel size (240×240 vs. the declared 512×512). A second manual attempt redrew the glyph inset to the safe zone at the correct 512×512 resolution — verified fixed (measured within the safe-zone radius, build emits the correct manifest entry). See `01-REVIEW-FIX.md` WR-05 for full retest details.

## Info

### IN-01: All 7 placeholder screens duplicate identical wrapper markup

**File:** `src/screens/StartScreen.tsx:3`, `SetupScreen.tsx:3`, `TouchSelectionScreen.tsx:3`, `SelectedPlayerScreen.tsx:3`, `TruthDareChoiceScreen.tsx:3`, `CardRevealScreen.tsx:3`, `NextRoundScreen.tsx:3`
**Issue:** Every screen repeats the identical `<main className="flex min-h-svh flex-col items-center justify-center bg-background text-primary">` wrapper, differing only by the phase-name heading text. Expected/acceptable as intentional Walking Skeleton scaffolding (SKELETON.md scopes these as placeholder headings only) — flagging only so it isn't mistaken for accidental duplication, and so it gets extracted before Phase 2 content causes this markup to drift out of sync across 7 files.
**Fix:** No action needed this phase. When Phase 2 fills these in, extract a shared `ScreenLayout` wrapper component to avoid seven independent places to update if the base layout changes.

### IN-02: `GameContext.test.tsx` has zero coverage for `CHOOSE_TRUTH_OR_DARE`, `PICK_CARD`, and `VOTE`

**File:** `src/state/GameContext.test.tsx`
**Issue:** Of the 7 `GameAction` variants, only `START_GAME`, `SELECT_PLAYER`, `NEXT_ROUND`, and `UPDATE_SETTINGS` have reducer tests. The three untested cases are exactly the three with the WR-01/WR-02/WR-03 gaps above — tests would have caught all three at review time. This matches the plan's stated task-level scope (01-01-PLAN.md required "exactly the 7 tests named in the behavior block"), so it is coverage debt rather than a plan deviation.
**Fix:** Add reducer tests for `PICK_CARD` (asserts `selectedCard` and `phase` are both set), `CHOOSE_TRUTH_OR_DARE` (asserts the choice is retrievable from state), and `VOTE` (asserts the pass/fail result is stored, once WR-01/WR-02/WR-03 are addressed).

### IN-03: `useGameContext`'s "throws outside provider" contract is untested

**File:** `src/state/GameContext.tsx:81-85`
**Issue:** `useGameContext()` throws when `ctx` is null, and this is called out as an acceptance criterion in 01-01-PLAN.md ("useGameContext throws if used outside the provider"), but no test in `GameContext.test.tsx` or `App.test.tsx` actually renders a consumer outside `GameContextProvider` to verify the throw fires.
**Fix:** Add a small test, e.g.:
```ts
it('throws when used outside GameContextProvider', () => {
  function Consumer() {
    useGameContext()
    return null
  }
  expect(() => render(<Consumer />)).toThrow('useGameContext must be used within GameContextProvider')
})
```

### IN-04: `saveSettings`/`loadSettings` swallow all errors uniformly, including non-storage bugs

**File:** `src/state/GameContext.tsx:17-32`
**Issue:** The bare `catch { }` blocks catch any exception, not just `localStorage` unavailability or `JSON.parse` failures. A bug elsewhere that causes `JSON.stringify` to throw (e.g. a future settings field holding a non-serializable value) would be silently swallowed with no way to distinguish "expected private-browsing fallback" from "unexpected serialization regression." Low risk today given the current flat `GameSettings` shape, but worth guarding against as the shape grows.
**Fix:** Consider a dev-only diagnostic inside the catch blocks so regressions are observable without changing production behavior:
```ts
} catch (err) {
  if (import.meta.env.DEV) console.warn('[GameContext] settings persistence failed:', err)
  return defaultSettings
}
```

### IN-05: `STORAGE_KEY` is a bare, unversioned localStorage key

**File:** `src/state/GameContext.tsx:9`
**Issue:** `const STORAGE_KEY = 'truthOrDare:gameSettings'` has no schema version suffix. If `GameSettings`'s shape changes in a later phase (e.g. adds a new required field), `loadSettings()`'s `{ ...defaultSettings, ...JSON.parse(raw) }` merge will silently produce a `GameSettings` object built from a stale persisted shape, with no migration path — currently harmless because every field has a default and the merge is additive, but worth deciding now while the cost is low.
**Fix:** Consider `truthOrDare:gameSettings:v1` now, so a future breaking change can bump to `:v2` and treat the old key as absent rather than attempting a lossy merge.

---

_Reviewed: 2026-07-11_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
