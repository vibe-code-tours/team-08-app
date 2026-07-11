---
phase: 01-foundation-design-system
reviewed: 2026-07-12T00:00:00Z
depth: standard
files_reviewed: 26
files_reviewed_list:
  - .claude/CLAUDE.md
  - .gitignore
  - CLAUDE.md
  - docs/ARCHITECTURE.md
  - docs/PROPOSAL.md
  - eslint.config.js
  - package.json
  - public/images/TheChosenOneLogo.png
  - src/App.test.tsx
  - src/App.tsx
  - src/components/CardBack.tsx
  - src/components/DifficultyBadge.tsx
  - src/components/GlassPanel.tsx
  - src/components/NeonButton.tsx
  - src/components/PackBadge.tsx
  - src/components/PlayerDot.tsx
  - src/components/TimerDisplay.tsx
  - src/data/cards.ts
  - src/hooks/useMultiTouch.ts
  - src/index.css
  - src/screens/FingerSelectionScreen.tsx
  - src/screens/PlayerSelectedScreen.tsx
  - src/screens/RouletteScreen.tsx
  - src/screens/StartScreen.tsx
  - src/state/GameContext.test.tsx
  - src/state/GameContext.tsx
  - src/types/index.ts
findings:
  critical: 0
  warning: 4
  info: 4
  total: 8
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-07-12T00:00:00Z
**Depth:** standard
**Files Reviewed:** 26
**Status:** issues_found

## Summary

This is a fresh review of the current state of `feat/phase1-components-and-cards`, superseding the prior `01-REVIEW.md` (2 critical / 5 warning / 4 info). All findings from that pass were re-verified against the current files rather than assumed to still apply.

**Both previously-flagged critical issues are now fixed:**
- `useMultiTouch`'s `handleTouchMove` now unconditionally calls `syncPlayers()` (`src/hooks/useMultiTouch.ts:75`), so dragged fingers correctly update their dot position — the prior "frozen dot" bug is gone.
- `NEXT_ROUND` now resets `voteResult: null` (`src/state/GameContext.tsx:66`) alongside the other round-state fields, so no stale vote leaks into the next round.

**Three of the five previously-flagged warnings are also fixed:** the untracked elimination/result timers in `RouletteScreen` are now split into a second `useEffect` with proper cleanup (`src/screens/RouletteScreen.tsx:84-97`); `filterCards` now short-circuits on `difficulty === 'all'` (`src/data/cards.ts:276`); and `randomCards` now uses a proper Fisher–Yates shuffle instead of a biased `sort(() => Math.random() - 0.5)` (`src/data/cards.ts:299-304`).

`npm run lint`, `tsc -b --noEmit`, and `npm run test` (11/11) all pass clean on the current tree.

This pass surfaces no new critical issues, but does surface one previously-unreported logic defect: the `NEXT_ROUND` action (the only dispatcher targeting a "next round" transition) sets `phase: 'finger-selection'`, never `phase: 'next-round'` — meaning the `'next-round'` `GamePhase` value and its `NextRoundScreen` component are structurally unreachable. The remaining warnings/info are largely the still-unaddressed items from the prior pass (component prop-API drift from `docs/PROPOSAL.md`, player color reuse on touch churn, a `CardBack` keyboard-accessibility gap, and a `Difficulty`/`Card.difficulty` type-modeling looseness) plus one new info-level item on `randomCards`'s handling of negative `n`.

## Warnings

### WR-01: `next-round` `GamePhase` and `NextRoundScreen` are unreachable — `NEXT_ROUND` action routes to `finger-selection` instead

**File:** `src/state/GameContext.tsx:58-67`, `src/App.tsx:28-29`
**Issue:** `GamePhase` includes `'next-round'` and `App.tsx`'s `ScreenContent` switch has a case rendering `NextRoundScreen` for it, but the only action that dispatches a "next round" transition is `NEXT_ROUND`, whose reducer case sets `phase: 'finger-selection'` directly (`GameContext.tsx:58-67`). No code path ever produces `state.phase === 'next-round'`, so `NextRoundScreen` can never be rendered. Either the reducer is missing an intermediate `next-round` phase (e.g. to show a round-summary/scoreboard screen before returning to finger-selection), or the `'next-round'` phase value and its screen are dead scaffolding that should be removed to avoid misleading future contributors into thinking that screen is wired up.
**Fix:** Decide the intended flow and pick one:
```ts
// Option A: NEXT_ROUND should land on the next-round screen first
case 'NEXT_ROUND':
  return {
    ...state,
    phase: 'next-round',
    players: [],
    selectedPlayer: null,
    selectedCard: null,
    chosenType: null,
    voteResult: null,
  }
// then NextRoundScreen dispatches a separate action (e.g. CONTINUE)
// to move to 'finger-selection' once the player taps "Continue".
```
```ts
// Option B: if next-round is intentionally being removed for now,
// delete the 'next-round' GamePhase member, the NextRoundScreen import/case
// in App.tsx, and the placeholder screen file.
```

### WR-02: `CardBack` is a clickable element with no keyboard or screen-reader affordance

**File:** `src/components/CardBack.tsx:19-32`
**Issue:** `CardBack` renders a `motion.div` with an `onClick` handler (used as the card-grid selector per `docs/PROPOSAL.md`), but has no `role="button"`, `tabIndex`, `onKeyDown`/`onKeyUp` handler, or `aria-label`. A `div` with only a mouse/touch `onClick` is not reachable or activatable via keyboard, and screen readers will not announce it as interactive. This is a real accessibility gap for a primary game interaction (selecting a truth/dare card), not a style nit.
**Fix:**
```tsx
<motion.div
  role={onClick ? 'button' : undefined}
  tabIndex={onClick ? 0 : undefined}
  onKeyDown={
    onClick
      ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick()
          }
        }
      : undefined
  }
  onClick={onClick}
  ...
>
```

### WR-03: `NeonButton`/`TimerDisplay`/`CardBack` prop APIs diverge from the shared contract documented in `docs/PROPOSAL.md`

**File:** `src/components/NeonButton.tsx:3-10`, `src/components/TimerDisplay.tsx:3-7`, `src/components/CardBack.tsx:3-7`
**Issue:** `docs/PROPOSAL.md` (the doc explicitly written to hand off a shared component contract to the Phase 2/3/4 workstreams) specifies `NeonButton` as `variant: 'truth' | 'dare' | 'random' | 'gold'`, `glow?`; the shipped component instead exposes a free-form `color?: string` with no `variant` or `glow`. Likewise `TimerDisplay` is documented as `seconds`, `maxSeconds`, `active?` but ships as `seconds`, `total` (no `active`); `CardBack` is documented as `onClick`, `selected?` but ships without `selected?`. Any Phase 2+ screen written against the proposal's documented API (e.g. `<NeonButton variant="dare">` or `<CardBack selected>`) will fail to type-check against the actual exports.
**Fix:** Reconcile one direction: either add the missing props (`variant` mapped to preset colors, `active`, `selected`) to match the doc, or update `docs/PROPOSAL.md` to reflect the shipped API so downstream phases aren't blindsided by a stale contract.

### WR-04: `useMultiTouch` can reassign a color already in use by another active player

**File:** `src/hooks/useMultiTouch.ts:29-31, 48`
**Issue:** `getNextColor(count)` derives the new player's color from `touchesRef.current.size` — the *current* number of active touches — rather than a stable per-player slot. Trace: with 3 active players (colors index 0, 1, 2), if the player holding color index 1 lifts their finger, `touchesRef.current.size` drops to 2; a new finger touching down then gets `getNextColor(2)` → `PLAYER_COLORS[2 % 10]`, which is the color already assigned to the still-active third player. Two simultaneously-active players can end up sharing a color, which is confusing in the finger-selection and roulette UI where color is the only way players distinguish their dot.
**Fix:** Track a monotonically increasing counter instead of deriving color from current size:
```ts
const nextColorIndexRef = useRef(0)
// in handleTouchStart:
const color = PLAYER_COLORS[nextColorIndexRef.current % PLAYER_COLORS.length]
nextColorIndexRef.current++
```

## Info

### IN-01: `Card.difficulty` reuses the `Difficulty` union that also contains the filter-only sentinel `'all'`

**File:** `src/types/index.ts:14, 40-46`
**Issue:** `Difficulty = 'easy' | 'medium' | 'hard' | 'all'` is used both for `GameSettings.difficulty` (where `'all'` is a meaningful "no filter" setting) and for `Card.difficulty` (where `'all'` is never a valid value for an actual card). TypeScript will not flag a card literal accidentally written with `difficulty: 'all'` since it's a valid member of the shared union. All 192 current cards in `src/data/cards.ts` correctly avoid this, but the type doesn't enforce it.
**Fix:** Split into two types: `type CardDifficulty = 'easy' | 'medium' | 'hard'` for `Card.difficulty`, and keep `Difficulty = CardDifficulty | 'all'` for `GameSettings.difficulty` and filter options.

### IN-02: `randomCards` silently mis-handles a negative `n`

**File:** `src/data/cards.ts:293-306`
**Issue:** `shuffled.slice(0, Math.min(n, shuffled.length))` — if `n` is negative, `Math.min(n, shuffled.length)` returns the negative `n` unchanged, and `Array.prototype.slice(0, negative)` computes the end index as `length + n`, silently returning `length + n` cards from the front rather than an empty array or a thrown error. No current caller passes a negative `n`, so this isn't reachable today, but the function gives no defensive guard against misuse.
**Fix:** `const count = Math.max(0, Math.min(n, shuffled.length)); return shuffled.slice(0, count)`.

### IN-03: `PackBadge` embeds a ZWJ (zero-width-joiner) emoji sequence for the family pack icon

**File:** `src/components/PackBadge.tsx:11`
**Issue:** The `family` pack icon `'👨‍👩‍👧'` is a multi-codepoint ZWJ sequence. It renders correctly on modern browsers/fonts, but ZWJ sequences can fall back to disjoint individual glyphs on older Android WebViews or fonts lacking full ZWJ emoji support — worth a manual check on representative low-end Android devices, since this project explicitly targets Android + iOS Safari (`.claude/CLAUDE.md`).
**Fix:** Verify on a representative low-end Android device; fall back to a single-codepoint icon (e.g. `🏠`) if rendering is inconsistent.

### IN-04: None of the 7 Phase 1 design-system components are used anywhere yet

**File:** `src/components/NeonButton.tsx`, `GlassPanel.tsx`, `CardBack.tsx`, `DifficultyBadge.tsx`, `PackBadge.tsx`, `PlayerDot.tsx` (used only within `FingerSelectionScreen`/`RouletteScreen`), `TimerDisplay.tsx`
**Issue:** `NeonButton`, `GlassPanel`, `CardBack`, `DifficultyBadge`, `PackBadge`, and `TimerDisplay` are exported but not imported/rendered anywhere in the current screen set. `tsconfig.app.json`'s `noUnusedLocals`/`noUnusedParameters` do not catch unused *exports*, so this won't surface as a build/lint error. Expected for a foundation phase (screens are still placeholders per `.claude/CLAUDE.md`'s "current project state"), but worth tracking so Phase 2/3/4 wiring doesn't quietly skip one of these components.
**Fix:** No action required now; confirm each component gets a real consumer as Phase 2/3/4 screens are built out.

---

_Reviewed: 2026-07-12T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
