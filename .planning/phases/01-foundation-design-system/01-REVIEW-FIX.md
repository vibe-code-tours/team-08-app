---
phase: 01-foundation-design-system
fixed_at: 2026-07-11T01:30:00Z
review_path: .planning/phases/01-foundation-design-system/01-REVIEW.md
iteration: 1
findings_in_scope: 5
fixed: 4
skipped: 1
status: partial
---

# Phase 1: Code Review Fix Report

**Fixed at:** 2026-07-11T01:30:00Z
**Source review:** .planning/phases/01-foundation-design-system/01-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 5 (WR-01 through WR-05; fix_scope = critical_warning, 0 Critical findings existed)
- Fixed: 4
- Skipped: 1

## Fixed Issues

### WR-01: `CHOOSE_TRUTH_OR_DARE` payload is silently discarded — no state field records the choice

**Files modified:** `src/types/index.ts`, `src/state/GameContext.tsx`, `src/state/GameContext.test.tsx`
**Commit:** 3f7cb11
**Applied fix:** Added `chosenType: CardType | null` to `GameState`. `CHOOSE_TRUTH_OR_DARE` now stores `action.payload` into `chosenType` when transitioning to `cardReveal`. `NEXT_ROUND` resets `chosenType` back to `null` alongside the other per-round fields. Updated the `baseState` test fixture in `GameContext.test.tsx` to include the new required field (needed to keep `tsc -b` green; no behavioral test changes).

### WR-02: `VOTE` action is a complete no-op — payload received and discarded

**Files modified:** `src/types/index.ts`, `src/state/GameContext.tsx`, `src/state/GameContext.test.tsx`
**Commit:** 3f7cb11
**Applied fix:** Added `voteResult: 'pass' | 'fail' | null` to `GameState`. `VOTE` now stores `action.payload` into `voteResult` (closing the gap properly, per the review's second fix option, rather than the explicit-no-op alternative — this keeps the reducer contract consistent with `CHOOSE_TRUTH_OR_DARE`/`PICK_CARD` which now also thread their payload through). `NEXT_ROUND` resets `voteResult` back to `null`.
**Note:** Bundled into the same commit as WR-01/WR-03 because all three fixes touch the same `GameState` shape and reducer in a tightly coupled way — splitting them into 3 commits would have left intermediate commits with a `GameState` that doesn't match its own reducer's usage.

### WR-03: `PICK_CARD` never transitions `phase` — silently relies on an undocumented dispatch-order dependency

**Files modified:** `src/types/index.ts`, `src/state/GameContext.tsx`, `src/state/GameContext.test.tsx`
**Commit:** 3f7cb11
**Applied fix:** `PICK_CARD` now sets `phase: 'cardReveal'` explicitly alongside `selectedCard: action.payload`, matching the pattern of every other flow-advancing action. Removes the undocumented ordering dependency on `CHOOSE_TRUTH_OR_DARE` firing first.

### WR-04: `default: return null` in `ActiveScreen` switch is not compiler-enforced exhaustive

**Files modified:** `src/App.tsx`
**Commit:** c43d3ee
**Applied fix:** Replaced `default: return null` with a `const _exhaustiveCheck: never = state.phase; return _exhaustiveCheck` pattern, exactly as suggested in the review. Adding a new `GamePhase` variant without a matching `case` will now fail `tsc -b` instead of silently rendering a blank screen at runtime.

## Skipped Issues

### WR-05: 512×512 maskable PWA icon violates the maskable safe zone — will be visibly clipped on Android

**File:** `public/pwa-512x512.png`, `vite.config.ts`
**Reason:** This fix requires regenerating a raster PNG asset (inset the lightning-bolt glyph to fit within the maskable-icon safe-zone circle) or producing a new dedicated `pwa-512x512-maskable.png`. No image-editing/rasterization tools (`convert`, `magick`, `rsvg-convert`, `inkscape`) are available in this environment, and the repo does not contain a vector source for the app's lightning-bolt glyph itself (`public/icons.svg` only contains unrelated social-media icons) from which a corrected asset could be regenerated programmatically. This is a design-asset task, not a code change, and needs to be done with an actual image editor or the maskable.app tool as the review suggests, then committed separately.
**Original issue:** The maskable icon spec requires meaningful glyph content to fit inside the inner ~80% safe-zone circle. Visual inspection shows the lightning-bolt glyph's points extend close to/past the image edges in `pwa-512x512.png`, and `vite.config.ts` declares this same asset with `purpose: 'maskable'`, so Android will crop it and produce a visibly broken home-screen icon.

---

_Fixed: 2026-07-11T01:30:00Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
