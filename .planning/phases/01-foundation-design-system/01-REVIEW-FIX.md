---
phase: 01-foundation-design-system
fixed_at: 2026-07-11T02:30:00Z
review_path: .planning/phases/01-foundation-design-system/01-REVIEW.md
iteration: 2
findings_in_scope: 5
fixed: 5
skipped: 0
status: all_fixed
---

# Phase 1: Code Review Fix Report

**Fixed at:** 2026-07-11T02:30:00Z (WR-05 resolved in a follow-up manual pass)
**Source review:** .planning/phases/01-foundation-design-system/01-REVIEW.md
**Iteration:** 2

**Summary:**
- Findings in scope: 5 (WR-01 through WR-05; fix_scope = critical_warning, 0 Critical findings existed)
- Fixed: 5
- Skipped: 0

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

### WR-05: 512×512 maskable PWA icon violates the maskable safe zone — will be visibly clipped on Android

**Files modified:** `public/pwa-512x512-maskable.png`, `vite.config.ts`
**Reason originally skipped:** Required regenerating a raster PNG asset; no image-editing/rasterization tools were available in the automated-fix environment (`convert`, `magick`, `rsvg-convert`, `inkscape` all absent), so this was left as a design-asset task for manual follow-up.

**Attempt 1 (2026-07-11, manual, rejected on retest):** User added `public/pwa-512x512-maskable.png` and repointed `vite.config.ts`'s `purpose: 'maskable'` entry to it. Retest found the glyph was still a like-for-like copy of the original shape (top-left, top-right, right, and bottom tips all still outside the 80% safe-zone circle) and introduced a new defect: the asset was 240×240px against a declared `sizes: '512x512'`.

**Attempt 2 (2026-07-11, manual, verified fixed):** User redrew the glyph inset to the safe zone and re-exported at the correct resolution.

**Verification performed:**
- `public/pwa-512x512-maskable.png` is now 512×512px (RGBA), matching the `sizes: '512x512'` declared in `vite.config.ts`.
- Measured the glyph's maximum radial distance from image center against the safe-zone radius (40% of canvas width = 204.8px): max glyph extent measured at 199.5px — inside the safe zone with margin. Confirmed visually by rendering the safe-zone circle over the asset — the full glyph sits within the circle.
- `npm run build` succeeds; `dist/manifest.webmanifest` correctly emits the maskable icon entry at `pwa-512x512-maskable.png`, `sizes: 512x512`, `purpose: maskable`, and `dist/pwa-512x512-maskable.png` is written to the build output.
- `npx vitest run`: 10/10 passing (unaffected by this asset-only change).
- `npx eslint src/`: clean.

---

_Fixed: 2026-07-11T02:30:00Z_
_Fixer: Claude (gsd-code-fixer, re-verified after user's manual fix)_
_Iteration: 2_
