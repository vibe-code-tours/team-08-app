---
phase: 01-foundation-design-system
reviewed: 2026-07-10T00:00:00Z
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
  warning: 3
  info: 4
  total: 7
status: issues_found
---

# Phase 1: Code Review Report

**Reviewed:** 2026-07-10
**Depth:** standard
**Files Reviewed:** 15
**Status:** issues_found

## Summary

This phase implements a Walking Skeleton: Tailwind v4 `@theme` design tokens, a full `GameState`/`GameAction` type barrel, a `GameContext` provider + reducer with localStorage-backed settings persistence, seven placeholder screens, and PWA wiring. `npm run lint`, `npx tsc -b`, and `npm run test` (10/10) all pass clean, and the code closely follows the phase plan and CLAUDE.md conventions (functional components, `import type`, try/catch-guarded localStorage, no enums).

No Critical/security issues were found — this is a fully client-side app with no untrusted network input, and the localStorage read path is correctly try/catch-guarded against malformed/tampered data (T-01-01 mitigated as documented). The findings below are logic gaps and test-coverage gaps that will bite in Phase 2 if not tracked, plus a couple of minor quality nits.

## Warnings

### WR-01: `CHOOSE_TRUTH_OR_DARE` payload is silently discarded — no state field records the choice

**File:** `src/state/GameContext.tsx:48-49`
**Issue:** The reducer case for `CHOOSE_TRUTH_OR_DARE` ignores `action.payload` (a `CardType`, i.e. `'truth' | 'dare'`) entirely:
```ts
case 'CHOOSE_TRUTH_OR_DARE':
  return { ...state, phase: 'cardReveal' }
```
`GameState` (`src/types/index.ts:38-44`) has no field to hold which of truth/dare was chosen — only `selectedCard` exists, which is set later by a separate `PICK_CARD` action. Once `phase` becomes `'cardReveal'`, the information needed to decide *which* card pool (truth vs dare) to draw from has already been lost by the time `PICK_CARD` fires, unless the dispatching screen threads it through some other channel. The phase plan itself describes this action as "advances toward cardReveal" implying the choice should be captured, and `GameContext.test.tsx` has zero coverage for this action.
**Fix:** Add a `chosenType: CardType | null` (or similar) field to `GameState`, set it in the reducer, and clear it in `NEXT_ROUND`:
```ts
case 'CHOOSE_TRUTH_OR_DARE':
  return { ...state, phase: 'cardReveal', chosenType: action.payload }
...
case 'NEXT_ROUND':
  return { ...state, phase: 'touchSelection', activePlayer: null, selectedCard: null, chosenType: null }
```
This is scoped as Phase 2 gameplay work per SKELETON.md, but the action/type contract is being frozen in *this* phase for all downstream workstreams to build on — landing it now avoids a type rework later, which is the explicit stated goal of 01-01-PLAN.md's objective section.

### WR-02: `VOTE` action is a complete no-op with zero test coverage

**File:** `src/state/GameContext.tsx:52-53`
**Issue:**
```ts
case 'VOTE':
  return { ...state }
```
This action is dispatchable (it's in the `GameAction` union with a `'pass' | 'fail'` payload) but does nothing — it doesn't even represent a legitimate placeholder pattern (like `return state` with a comment), it spreads a brand-new object identity for no behavioral reason, which is misleading (looks like a state change but isn't) and will cause an unnecessary re-render pass. There is no test in `GameContext.test.tsx` asserting either its behavior or explicitly documenting it as a deferred no-op.
**Fix:** Either return `state` directly with a `// TODO(phase-2): record pass/fail result` comment to make the no-op intent explicit and avoid the pointless object copy, or add a minimal state field now (e.g. `lastVoteResult`) plus a test, consistent with WR-01.
```ts
case 'VOTE':
  // TODO(phase-2): record pass/fail result — no-op until FLOW-02/UX-03-05 land
  return state
```

### WR-03: `default: return null` in `ActiveScreen` switch is unreachable but untested; comment overstates guarantee

**File:** `src/App.tsx:28-29`
**Issue:** The comment claims this is exhaustive "per noFallthroughCasesInSwitch," but `noFallthroughCasesInSwitch` only prevents case fallthrough — it does not enforce switch exhaustiveness. Exhaustiveness here is actually guaranteed only because every literal of `GamePhase` is enumerated as a `case`, so TS narrows `state.phase` to `never` at the `default` line and the branch is structurally unreachable. If a new `GamePhase` value is ever added to `src/types/index.ts` without a matching `case` here, TypeScript will NOT raise a compile error (the `default: return null` silently swallows the new phase and renders a blank screen), because `null` is a valid return type and there's no `const _exhaustive: never = state.phase` check forcing a compile failure.
**Fix:** Replace the silent `default` with an explicit exhaustiveness assertion so future `GamePhase` additions fail to compile if forgotten here:
```ts
default: {
  const _exhaustive: never = state.phase
  return _exhaustive
}
```

## Info

### IN-01: Screen components are byte-for-byte duplicated boilerplate across 7 files

**File:** `src/screens/StartScreen.tsx`, `SetupScreen.tsx`, `TouchSelectionScreen.tsx`, `SelectedPlayerScreen.tsx`, `TruthDareChoiceScreen.tsx`, `CardRevealScreen.tsx`, `NextRoundScreen.tsx`
**Issue:** All seven screens are identical except for the phase-name string, e.g.:
```tsx
function StartScreen() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background text-primary">
      <h1 className="text-2xl font-semibold">start</h1>
    </main>
  )
}
```
This is expected/acceptable as intentional Walking Skeleton placeholder scaffolding per SKELETON.md ("Out of Scope... screens are placeholder headings only"), not a defect to fix now — flagging only so it isn't mistaken for accidental duplication when Phase 2 fills these in.
**Fix:** No action needed this phase; each screen will diverge substantially in Phase 2, at which point this duplication naturally disappears.

### IN-02: `saveSettings`/`loadSettings` swallow all errors uniformly, including non-storage bugs

**File:** `src/state/GameContext.tsx:17-32`
**Issue:** The bare `catch { }` blocks catch *any* exception, not just `localStorage` unavailability or `JSON.parse` failures — for example, a bug in `JSON.stringify` on a settings object containing a circular reference (unlikely given the current flat shape, but not structurally prevented by the `GameSettings` type at the call site) would be silently swallowed with no way to distinguish "expected private-browsing fallback" from "unexpected serialization bug." This is low-risk given the current settings shape but is a broad catch.
**Fix:** Consider logging a dev-only warning (`console.warn` gated by `import.meta.env.DEV`) inside the catch blocks so future regressions in settings shape are observable in development without changing production behavior.

### IN-03: `GameContext.test.tsx` does not test `CHOOSE_TRUTH_OR_DARE`, `PICK_CARD`, or `VOTE` reducer cases

**File:** `src/state/GameContext.test.tsx`
**Issue:** Of the 7 `GameAction` variants, only `START_GAME`, `SELECT_PLAYER`, `NEXT_ROUND`, and `UPDATE_SETTINGS` have reducer tests. `CHOOSE_TRUTH_OR_DARE`, `PICK_CARD`, and `VOTE` are entirely untested, even though the 01-01-PLAN.md task 1 acceptance criteria only required "exactly the 7 tests named in the behavior block" (so this matches plan scope) — flagging as coverage debt since these three cases include the WR-01/WR-02 gaps above and would have caught them if tested.
**Fix:** Add reducer tests for `PICK_CARD` (asserts `selectedCard` is set) and `CHOOSE_TRUTH_OR_DARE`/`VOTE` once WR-01/WR-02 are addressed.

### IN-04: `useGameContext` throw message and provider are untested for the "used outside provider" contract

**File:** `src/state/GameContext.tsx:81-85`
**Issue:** `useGameContext()` throws when `ctx` is null, and this is called out as an acceptance criterion in 01-01-PLAN.md ("useGameContext throws if used outside the provider"), but no test in `GameContext.test.tsx` or `App.test.tsx` renders a consumer outside `GameContextProvider` to verify the throw actually fires.
**Fix:** Add a small test using `renderHook`/error-boundary pattern to assert `useGameContext` throws outside the provider, e.g.:
```ts
it('throws when used outside GameContextProvider', () => {
  const { result } = renderHook(() => useGameContext())
  expect(result.error).toBeDefined()
})
```

---

_Reviewed: 2026-07-10_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
