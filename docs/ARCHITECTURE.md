# Architecture — Truth/Dare Finger Roulette

> One page. Keep it true as the project grows. A teammate should be able to read
> this and find their way around in 5 minutes.

## What it does

A multiplayer party game PWA. 2–10 players place their fingers on a shared phone
screen; a roulette spins and selects one player, who picks Truth or Dare, picks a
challenge card, and performs it. Fully client-side, no backend — a
share-the-phone experience for parties.

## Diagram

Component-based SPA: a top-level Context Provider holds game state, a custom hook
handles multi-touch, and one screen renders at a time based on the current game
phase (no URL router).

```
<App>
  <GameContextProvider>          // src/state/GameContext.tsx
    <ActiveScreen />             // src/screens/*.tsx, chosen by gamePhase
  </GameContextProvider>
</App>

Screen (by gamePhase): Start -> Setup -> TouchSelection -> SelectedPlayer
                        -> TruthDareChoice -> CardReveal -> NextRound

TouchSelectionScreen --> useMultiTouch() --> dispatch() --> GameContext reducer
                                                                   |
                                                                   v
                                                     gamePhase changes, screen swaps
```

Touches are tracked by `touch.identifier`, never array index (see
`docs/multitouch-spike-result.md`). Card data (`src/data/cards.ts`) is static,
filtered at read time by pack/difficulty/type from `GameSettings`.

## Where things live

| Path | What |
|---|---|
| `src/screens/` | one file per screen, matches the phase flow above |
| `src/state/GameContext.tsx` | GameState + reducer, wraps the whole app |
| `src/hooks/useMultiTouch.ts` | multi-touch tracking hook |
| `src/data/cards.ts` | static `Card[]` data |
| `src/types/` | `Card`, `GameState`, `PlayerTouch`, `GameSettings` |
| `tests/` (co-located `*.test.tsx`) | Vitest + Testing Library |
| `.github/workflows/` | CI + security |
| `docs/` | this file, decisions, demo/spike notes |
| `.planning/` | GSD planning docs (roadmap, phases, generated codebase inventory) |

## External services

None. No backend, no auth, no analytics — everything runs client-side with
localStorage for settings/state persistence. Deploy target is Netlify (PR
previews on every pull request).

## How to run

See the [README](../README.md) Quickstart.
