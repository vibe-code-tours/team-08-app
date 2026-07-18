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

Screen (by gamePhase): Start → Onboarding → Setup → FingerSelection → Roulette
  → PlayerSelected → TruthDareChoice → CardReveal → Voting → Result → NextRound

FingerSelectionScreen → useMultiTouch() → dispatch() → GameContext reducer
                                                    ↓
                                          gamePhase changes, screen swaps
```

Touches are tracked by `touch.identifier`, never array index (see
`docs/multitouch-spike-result.md`). Card data (`src/data/cards.ts`) is static,
filtered at read time by pack/difficulty/type from `GameSettings`.

## Where things live

| Path | What |
|---|---|
| `src/screens/` | 12 screen files, one per game phase |
| `src/components/` | 10 reusable components (NeonButton, GlassPanel, etc.) |
| `src/state/GameContext.tsx` | GameState + reducer (13 actions), settings persistence, wraps the whole app |
| `src/hooks/useMultiTouch.ts` | Multi-touch tracking hook (keyed by `touch.identifier`) |
| `src/hooks/useTouchCapability.ts` | Non-touch device detection (feature detection only, no UA sniffing) |
| `src/data/cards.ts` | 192 static `Card[]` data with filtering helpers |
| `src/types/` | `Card`, `GameState`, `PlayerTouch`, `GameSettings`, `Difficulty`, `CardPack`, `CardType`, `PLAYER_COLORS` |
| `src/*.test.tsx`, `src/**/*.test.tsx` | Vitest + Testing Library (co-located with source) |
| `.github/workflows/` | CI + security + deploy (GitHub Pages) |
| `docs/` | this file, decisions, spike notes |
| `.planning/` | GSD planning docs (roadmap, phases, codebase inventory) |

## External services

None. No backend, no auth, no analytics — everything runs client-side with
localStorage for settings persistence only (game state is in-memory). Deploy
target is GitHub Pages, auto-deployed on push to `main` via
`.github/workflows/deploy.yml`.

## How to run

See the [README](../README.md) Quickstart.
