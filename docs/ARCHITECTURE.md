# Architecture — Truth/Dare Finger Roulette

> One page. Keep it true as the project grows. A teammate should be able to read
> this and find their way around in 5 minutes.

## What it does

A multiplayer party game PWA. 2–10 players place their fingers on a shared phone
screen; a roulette spins and selects one player, who picks Truth or Dare, picks a
challenge card, and performs it. Fully client-side, no backend — a
share-the-phone experience for parties.

**Live:** https://thechosenonegame.netlify.app/

## Diagram

Component-based SPA: a top-level Context Provider holds game state, custom hooks
handle multi-touch and sound, a headless music component manages BGM, and one
screen renders at a time based on the current game phase (no URL router).

```
<App>
  <GameContextProvider>          // src/state/GameContext.tsx
    <PhaseMusic />               // src/components/PhaseMusic.tsx (headless, manages BGM)
    <ActiveScreen />             // src/screens/*.tsx, chosen by gamePhase
    <SettingsButton />           // src/components/SettingsButton.tsx (floating gear)
  </GameContextProvider>
</App>

Screen (by gamePhase): Start → Onboarding → Setup → FingerSelection → Roulette
  → PlayerSelected → TruthDareChoice → CardReveal → Voting → Result → NextRound

FingerSelectionScreen → useMultiTouch() → dispatch() → GameContext reducer
                                                    ↓
                                          gamePhase changes, screen swaps

PhaseMusic → PHASE_TO_TRACK[phase] → HTML Audio crossfade
useSound() → Web Audio API → SFX buffers (preloaded)
```

## Where things live

| Path | What |
|---|---|
| `src/screens/` | 11 screen files, one per game phase |
| `src/components/` | 11 reusable components (NeonButton, GlassPanel, PhaseMusic, etc.) |
| `src/state/GameContext.tsx` | GameState + reducer (14 actions), settings persistence, wraps the whole app |
| `src/hooks/useMultiTouch.ts` | Multi-touch tracking hook (keyed by `touch.identifier`) |
| `src/hooks/useSound.ts` | Web Audio API SFX manager (12 sounds, preloaded) |
| `src/components/PhaseMusic.tsx` | BGM controller (3 tracks, phase-based crossfade) |
| `src/data/cards.ts` | 192 static `Card[]` data with filtering helpers |
| `src/types/` | `Card`, `GameState`, `PlayerTouch`, `GameSettings`, `GamePhase`, `PLAYER_COLORS` |
| `public/sounds/` | 16 audio files (12 SFX + 3 BGM tracks) |
| `public/images/` | Logo, onboarding slide images |
| `src/*.test.tsx`, `src/**/*.test.tsx` | Vitest + Testing Library (co-located with source) |
| `.github/workflows/` | CI + security |
| `docs/` | this file, decisions, spike notes |
| `.planning/` | GSD planning docs (roadmap, phases, codebase inventory) |

## Sound System

Two independent audio systems share a single AudioContext:

| System | Tech | Purpose |
|--------|------|---------|
| **SFX** | Web Audio API (`AudioContext` + `AudioBufferSourceNode`) | 12 sound effects for interactions |
| **BGM** | Raw HTML5 `Audio` elements + `requestAnimationFrame` crossfade | 3 music tracks mapped to game phases |

- Audio files are preloaded at module import for instant playback
- First user gesture unlocks AudioContext (Chrome/iOS autoplay policy)
- BGM tracks persist across component remounts via module-level cache
- Phase-to-track mapping: `menu` (start/onboarding/setup/next-round), `tension` (finger-selection/roulette/player-selected), `gameplay` (truth-dare-choice/card-reveal/voting/result)

## External services

None. No backend, no auth, no analytics — everything runs client-side with
localStorage for settings persistence only (game state is in-memory). Deploy
target is Netlify (PR previews on every pull request).

## How to run

See the [README](../README.md) Quickstart.
