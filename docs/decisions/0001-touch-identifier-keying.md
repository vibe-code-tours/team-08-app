# ADR 0001: Key active touches by `touch.identifier`, not array index

## Status

Accepted

## Context

Finger Roulette's core mechanic depends on tracking which physical
finger corresponds to which player across the lifetime of a touch
gesture — from `touchstart`, through however many `touchmove` events,
to `touchend`. The naive approach is to store active touches in an
array and reference them by index. That approach breaks under a
realistic case: if a mid-sequence finger lifts before the others (e.g.
player 2 of 5 lifts early), the browser's `TouchList` for subsequent
events shifts, and index-based lookups silently reassign one player's
touch state to another player.

The browser's native `Touch.identifier` property is designed to solve
exactly this problem — it's a stable ID assigned to a touch point for
its entire duration, regardless of position in the `TouchList` or
lifting order of other touches.

This was validated as sound during the July 2026 multi-touch spike (see
[`docs/spikes/multitouch-spike-2026-07.md`](../spikes/multitouch-spike-2026-07.md)),
which confirmed zero `touchcancel` events and zero dropped/unknown
moves across all six recorded runs — 4 on Android (Chrome and Samsung
Internet) and 2 on iOS Safari — using identifier-based tracking in the
test harness.

## Decision

`GameState.activeTouches` is typed as `Record<number, PlayerTouch>`,
keyed by `touch.identifier`. All touch event handlers
(`useMultiTouch.ts`) read and write this map using the identifier from
the native `Touch` object — never array position.

## Consequences

- **Two failure modes to actively guard against**, called out in
  `CLAUDE.md`:
  1. `touchcancel` events firing for a tracked identifier (must clean
     up state for that identifier)
  2. `touchmove` events arriving for an identifier with no prior
     `touchstart` (must be ignored, not treated as a new touch)
- With `noUncheckedIndexedAccess` enabled in `tsconfig`, every read from
  `activeTouches[identifier]` is typed as possibly `undefined`, forcing
  explicit handling of stale or missing identifiers at each access
  site rather than assuming the map is always in sync with reality.
- Implementation must pair this with `touch-action: none`,
  `{ passive: false }` listeners, and `preventDefault()` to prevent
  native gesture hijacking — validated together in the same spike.