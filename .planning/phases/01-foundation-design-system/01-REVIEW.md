---
phase: 01-foundation-design-system
reviewed: 2026-07-12T01:05:00Z
depth: standard
files_reviewed: 22
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
  critical: 2
  warning: 5
  info: 4
  total: 11
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-07-12T01:05:00Z
**Depth:** standard
**Files Reviewed:** 22 (of 26 listed; `.claude/CLAUDE.md`, `.gitignore`, `CLAUDE.md`, `docs/ARCHITECTURE.md`, `docs/PROPOSAL.md`, `eslint.config.js`, `package.json`, `public/images/TheChosenOneLogo.png` reviewed as context/config, not flagged for source-level findings)
**Status:** issues_found

## Summary

This review supersedes the prior `01-REVIEW.md` (dated 2026-07-11), which was written against an earlier commit with a different `GamePhase` union (`cardReveal`, `touchSelection`, `SelectedPlayerScreen`, `TouchSelectionScreen`) that no longer exists on this branch. The reducer bugs flagged there (`CHOOSE_TRUTH_OR_DARE`/`PICK_CARD`/`VOTE` silently discarding payloads) have since been fixed in the current `GameContext.tsx`. This is a fresh review of the current `feat/phase1-components-and-cards` diff against `main`: shared components, multi-touch hook, card data, game state/reducer, and the finger-selection/roulette/player-selected/start screens.

`npm run lint` and `npm run test` (11/11) both pass clean, and the reducer/localStorage unit tests are solid. However, two behavior-affecting bugs were found: (1) `useMultiTouch`'s `touchmove` handler mutates player position in the ref without triggering a re-render, so a dragged finger's dot visually freezes until an unrelated touch event fires elsewhere; (2) the `NEXT_ROUND` reducer action forgets to reset `voteResult`, so a stale vote from the prior round leaks into the next round's state. Several component prop APIs (`NeonButton`, `TimerDisplay`, `CardBack`) also diverge from the documented contract in `docs/PROPOSAL.md` that Phases 2–4 are expected to build against, which risks rework or silent prop mismatches downstream.

## Critical Issues

### CR-01: Dragged touch positions don't update player dots (stale position bug)

**File:** `src/hooks/useMultiTouch.ts:63-75`
**Issue:** `handleTouchMove` mutates the `PlayerTouch` object's `x`/`y` fields directly on the object stored in `touchesRef.current` (a `Map`), but never calls `syncPlayers()` (i.e. never calls `setPlayers(...)`). Since `players` (the state array consumed by `FingerSelectionScreen` and `RouletteScreen`) is only updated in `handleTouchStart`/`handleTouchEnd`, dragging a single finger around the screen will not move its rendered `PlayerDot` — the dot only "catches up" to the latest mutated position when some other touch event (a different finger touching down or lifting) happens to trigger `syncPlayers()`. With only one finger on screen, the dot never moves after the initial touchdown. This breaks the core "place your fingers" interaction: a repositioned finger appears detached from its dot, undermining the roulette selection UX this game is built around.
**Fix:**
```ts
const handleTouchMove = (e: TouchEvent) => {
  e.preventDefault()
  const rect = el.getBoundingClientRect()
  let changed = false

  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches[i]
    const player = touchesRef.current.get(touch.identifier)
    if (player) {
      player.x = touch.clientX - rect.left
      player.y = touch.clientY - rect.top
      changed = true
    }
  }
  if (changed) syncPlayers()
}
```
Note: calling `setPlayers` on every `touchmove` re-introduces the 60fps re-render concern the hook's own docstring warns against ("Positions are stored in a ref ... because touch events fire at 60fps"). If avoiding per-frame re-renders is intentional, that tradeoff should be made explicit and `FingerSelectionScreen`/`RouletteScreen` should read live positions from `touchesRef` (e.g. via `requestAnimationFrame` polling) rather than from the `players` state snapshot, instead of silently going stale.

### CR-02: `NEXT_ROUND` does not reset `voteResult`, leaking stale vote into the next round

**File:** `src/state/GameContext.tsx:58-67`
**Issue:** The `NEXT_ROUND` case resets `players`, `selectedPlayer`, `selectedCard`, and `chosenType`, but omits `voteResult`. If a round ends with `voteResult: 'pass'` or `'fail'` (set via the `VOTE` action), that value persists into the following round's initial state. Any UI that reads `voteResult` to show a pass/fail badge (Phase 2/4 scope) will display the previous round's result before a new vote has been cast in the new round.
**Fix:**
```ts
case 'NEXT_ROUND':
  return {
    ...state,
    phase: 'finger-selection',
    players: [],
    selectedPlayer: null,
    selectedCard: null,
    chosenType: null,
    voteResult: null,
  }
```

## Warnings

### WR-01: `NeonButton` prop API diverges from the documented contract other phases will build against

**File:** `src/components/NeonButton.tsx:3-10`
**Issue:** `docs/PROPOSAL.md` (line 58, documented as the shared contract for Phase 2/3/4 consumers) specifies `NeonButton` props as `variant: 'truth' | 'dare' | 'random' | 'gold'`, `onClick`, `children`, `glow?`. The implementation instead exposes a free-form `color?: string` prop and no `variant` or `glow` prop at all. Any downstream screen written against the proposal's documented API (e.g. `<NeonButton variant="dare">`) will fail to type-check, and there's no `variant`-driven preset styling (each Phase 2-4 dev would have to know and hardcode the correct hex color string instead of using a semantic variant name).
**Fix:** Either update `docs/PROPOSAL.md`/`ARCHITECTURE.md` to reflect the actual `color`-based API (if this was an intentional simplification), or add a `variant` prop that maps to preset colors internally:
```ts
type NeonButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'truth' | 'dare' | 'random' | 'gold'
  glow?: boolean
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}
```

### WR-02: `TimerDisplay` and `CardBack` prop names/shape diverge from the documented contract

**File:** `src/components/TimerDisplay.tsx:3-7`, `src/components/CardBack.tsx:3-7`
**Issue:** Per `docs/PROPOSAL.md`, `TimerDisplay` should accept `seconds`, `maxSeconds`, `active?`; the implementation uses `seconds`, `total` (no `active`). `CardBack` is documented with `onClick`, `selected?`; the implementation has `onClick`, `size?`, `className?` but no `selected?` (needed for card-grid selection highlighting in Phase 2). These are the same class of drift as WR-01 — not bugs in isolation, but a documented cross-team API contract that Phase 2-4 developers will reference and be surprised by.
**Fix:** Reconcile prop names with `docs/PROPOSAL.md`, or update the proposal doc to match the shipped API so downstream phases aren't blindsided. At minimum, add `selected?: boolean` to `CardBack` since card-grid selection is an explicit near-term consumer.

### WR-03: `RouletteScreen`'s inner elimination/result timeouts are not tracked or cleared on cleanup

**File:** `src/screens/RouletteScreen.tsx:40-87`
**Issue:** The spin effect depends on `[players, dispatch]`. `players` comes from `useGame()` (global state), set once via `SET_FINGERS` when entering `roulette` phase and not expected to change again during the spin — so this isn't currently reachable as a live bug. However, if the effect were ever re-entered mid-spin (e.g. a future reducer change spreads state and produces a new `players` array by identity for an unrelated reason) or the component unmounts mid-spin, the two inner `setTimeout` calls at lines 66 and 67-70 (elimination reveal, and the `dispatch({ type: 'SELECT_PLAYER', ... })` result timer) are not tracked or cleared by the effect's cleanup function — only `spinTimer` and the outer `tick` `timerId` are cleared. A stale winner could still be dispatched after the component no longer expects it.
**Fix:** Track and clear the two inner `setTimeout`s in the effect cleanup:
```ts
let elimTimer = 0
let resultTimer = 0
...
if (step >= totalSteps) {
  ...
  elimTimer = window.setTimeout(() => setEliminated(true), 300)
  resultTimer = window.setTimeout(() => {
    setShowResult(true)
    dispatch({ type: 'SELECT_PLAYER', player: selectedWinner })
  }, 2000)
  return
}
...
return () => {
  clearTimeout(spinTimer)
  if (timerId) clearTimeout(timerId)
  clearTimeout(elimTimer)
  clearTimeout(resultTimer)
}
```

### WR-04: `filterCards`/`randomCard`/`randomCards` silently treat `difficulty: 'all'` as a literal filter value instead of "no filter"

**File:** `src/data/cards.ts:268-279`, `src/types/index.ts:14`
**Issue:** `Difficulty` is `'easy' | 'medium' | 'hard' | 'all'`, and `defaultSettings.difficulty` in `GameContext.tsx` is `'all'`. But `filterCards` does `c.difficulty === options.difficulty`, and no card in `cards.ts` has `difficulty: 'all'` (all 192 cards use `'easy' | 'medium' | 'hard'`). If a screen passes `{ difficulty: state.settings.difficulty }` (i.e. `'all'`) straight through to `filterCards`/`randomCard`, it will match zero cards and `randomCard` will return `null` — the opposite of the intended "show cards from all difficulties" behavior implied by the `'all'` sentinel value.
**Fix:** Either strip `'all'` before calling into `cards.ts` helpers at the call site (e.g. `filterCards({ difficulty: settings.difficulty === 'all' ? undefined : settings.difficulty })`), or teach `filterCards` to treat `'all'` as "no difficulty filter":
```ts
(!options.difficulty || options.difficulty === 'all' || c.difficulty === options.difficulty)
```
This is not yet triggered by any code in the reviewed file set (no screen calls these helpers yet), but it's a landmine for the Phase 2/3 dev who wires up the card grid using `state.settings.difficulty` directly.

### WR-05: `randomCards` uses `Array.sort(() => Math.random() - 0.5)` for shuffling

**File:** `src/data/cards.ts:298-300`
**Issue:** `sort` with a random comparator is a well-known biased/incorrect shuffle (result distribution depends on the sort algorithm's comparison pattern, and comparator inconsistency — the same pair can compare differently across calls — is undefined behavior per spec). For a party game, mild selection bias is a minor product concern, but it's simple to correct with a proper Fisher-Yates shuffle if `randomCards(n, ...)` is used anywhere fairness/uniform randomness matters (e.g. avoiding certain cards showing up disproportionately more often).
**Fix:**
```ts
export function randomCards(n: number, options: { pack?: CardPack; difficulty?: Difficulty; type?: CardType } = {}): Card[] {
  const filtered = filterCards(options)
  const shuffled = [...filtered]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, Math.min(n, shuffled.length))
}
```

## Info

### IN-01: `useMultiTouch` player color reuse on mid-game touch churn

**File:** `src/hooks/useMultiTouch.ts:29-31, 48`
**Issue:** `getNextColor(count)` derives color from `touchesRef.current.size` (current live touch count) rather than a stable per-player index. If player A (color index 0) lifts their finger and player C then touches down, C gets `PLAYER_COLORS[touchesRef.current.size % length]` based on the *current* size, which can reassign a color already visually associated with a still-active player in the UI, depending on touch order. This is a minor cosmetic edge case (not a crash or data-loss bug) but could confuse players mid-round if fingers are lifted and re-placed during the countdown window.
**Fix:** Track a monotonically increasing `nextColorIndexRef` (similar to `playerNumRef`) instead of deriving from current `size`, so color assignment doesn't depend on concurrent touch state.

### IN-02: `PackBadge` embeds a ZWJ (zero-width-joiner) emoji sequence

**File:** `src/components/PackBadge.tsx:11`
**Issue:** The `family` pack icon `'👨‍👩‍👧'` is a ZWJ emoji sequence (multiple codepoints joined by zero-width-joiner characters). This is legitimate content, not malicious, and renders correctly in modern browsers/fonts, but ZWJ sequences can render inconsistently (as separate glyphs, or with a "not joined" fallback showing extra family-member icons) on older Android WebViews / fonts without full ZWJ emoji support — worth a quick manual check on the actual target devices (this project explicitly targets Android + iOS Safari per `.claude/CLAUDE.md`).
**Fix:** Verify rendering on a representative low-end Android device; if it renders as disjoint glyphs, consider a simpler single-codepoint emoji (e.g. `🏠` or `👪`) for broader compatibility.

### IN-03: `GameContext.tsx` top-of-file eslint-disable is broad but justified — verify it stays scoped

**File:** `src/state/GameContext.tsx:1-4`
**Issue:** The file disables `react-refresh/only-export-components` for the entire module because it co-locates the reducer, persistence helpers, and hooks with the provider component. This is a reasonable, documented tradeoff (not a defect), but as the file grows (Phase 2+ likely adds more actions/hooks here) the blast radius of the disabled rule grows with it. Flagging as informational so a future phase doesn't accumulate unrelated exports under the same blanket disable without re-evaluating whether a split is warranted.
**Fix:** No action needed now; revisit if the file's non-component export surface grows significantly.

### IN-04: `RouletteScreen` recomputes circle positions using `window.innerWidth`/`innerHeight` without a resize listener

**File:** `src/screens/RouletteScreen.tsx:23-37`
**Issue:** `getCirclePositions` reads `window.innerWidth`/`window.innerHeight` at render time but there's no `resize`/`orientationchange` listener, so positions won't recompute if the viewport changes mid-screen (e.g. mobile browser chrome collapsing/expanding, or an orientation change while the roulette is active). Given the project's own convention note ("mobile browser chrome makes `100vh` unreliable" in `docs/PROPOSAL.md`), this is a plausible real-world scenario on iOS Safari where the address bar collapses during scroll/interaction.
**Fix:** Not urgent for Phase 1 (screens are still being wired up), but Phase 2/4 polish should consider recalculating positions on a `resize` listener or using relative (percentage/viewport-unit) positioning instead of raw pixel math tied to a single `window.innerWidth` read.

---

_Reviewed: 2026-07-12T01:05:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
