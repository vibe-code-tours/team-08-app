# Architecture — Truth/Dare Finger Roulette

## What it does

Truth/Dare Finger Roulette is a multi-player party game designed for touch-screen
devices (phones and tablets). Players place their fingers on the screen
simultaneously; the app randomly selects one player, who then chooses between a
"truth" or a "dare" card. The game runs in rounds, cycling through players and
cards. The entire experience is client-side with no backend — it is a progressive
web app (PWA) powered by Vite and React.

## High-level architecture pattern

**Component-based SPA with Context-driven state and custom hooks for hardware
interaction.**

The application is a single-page React app that uses a top-level Context Provider
to manage global game state and custom hooks to encapsulate device-specific logic
(multi-touch tracking). Screen components are rendered conditionally based on the
current game phase, not via a URL router.

```
+------------------------------------------------------+
|                    <App />                            |
|  +--------------------------------------------------+|
|  |          <GameContextProvider>                    ||
|  |                                                  ||
|  |   <PhaseMusic />          // BGM controller      ||
|  |   <ErrorBoundary>         // crash recovery      ||
|  |     <ActiveScreen />      // by gamePhase        ||
|  |   </ErrorBoundary>                               ||
|  |   <SettingsButton />     // sound/music toggles  ||
|  |                                                  ||
|  |   Screen (by gamePhase):                         ||
|  |     StartScreen                                  ||
|  |     OnboardingScreen                             ||
|  |     SetupScreen                                  ||
|  |     FingerSelectionScreen                        ||
|  |     RouletteScreen                               ||
|  |     PlayerSelectedScreen  (Truth/Dare/Random)    ||
|  |     CardRevealScreen                             ||
|  |     VotingScreen                                 ||
|  |     ResultScreen                                 ||
|  |     NextRoundScreen                              ||
|  |                                                  ||
|  |   useMultiTouch()  <-- touch events              ||
|  |   useSound()       <-- Web Audio API SFX         ||
|  |                                                  ||
|  |   GameContext (state + dispatch)                  ||
|  +--------------------------------------------------+|
+------------------------------------------------------+
```

## Component hierarchy

```
<StrictMode>
  <App>
    <GameContextProvider>          // src/state/GameContext.tsx
      <PhaseMusic />              // src/components/PhaseMusic.tsx
      <ErrorBoundary>             // src/components/ErrorBoundary.tsx
        <ActiveScreen />          // One of src/screens/*.tsx, selected by gamePhase
      </ErrorBoundary>
      <SettingsButton />          // src/components/SettingsButton.tsx
    </GameContextProvider>
  </App>
</StrictMode>
```

- **App** (`src/App.tsx`) — Root component. Wraps everything in GameContextProvider.
- **GameContextProvider** — Wraps the entire app tree, providing game state and
  dispatch to all descendants.
- **PhaseMusic** — Renders nothing; manages background music based on game phase.
- **ErrorBoundary** — Catches render crashes and shows a recovery screen with restart.
- **SettingsButton** — Floating button with sound/music toggle overlay.
- **Screen components** (`src/screens/*.tsx`) — One file per screen. Only the
  screen matching the current `gamePhase` renders at any given time.

## State management approach

### GameContext (`src/state/GameContext.tsx`)

The app uses React Context + useReducer for centralized state management. The
context exposes:

- **GameState** — the full current state object (players, active finger, chosen
  card, settings, phase).
- **dispatch** — a reducer action dispatcher for state transitions.

### GameState shape (`src/types/index.ts`)

Key types:

- **GamePhase** — Union type of screen identifiers: `"start"` | `"onboarding"` |
  `"setup"` | `"finger-selection"` | `"roulette"` | `"player-selected"` |
  `"card-reveal"` | `"voting"` | `"result"` | `"next-round"`.
- **PlayerTouch** — Tracks a player's identity (assigned at touch-down) keyed by
  `touch.identifier`. Includes `color`, `x`, `y`, `label`.
- **Card** — A truth or dare card with `type` ("truth" | "dare"), `difficulty`,
  `pack`, and `text`.
- **GameSettings** — Configurable game parameters: `difficulty`, `pack`,
  `timerEnabled`, `soundEnabled`, `musicEnabled`, `noRepeat`.
- **GameState** — The composite state object holding `phase`, `players`,
  `selectedPlayer`, `selectedCard`, `chosenType`, `voteResult`, `settings`,
  and `lastSelectedPlayerId`.
- **GameAction** — Union of 12 reducer actions for state transitions.

## Data flow patterns

### Touch event flow

1. FingerSelectionScreen attaches touch event listeners to a full-screen container.
2. The **useMultiTouch hook** (`src/hooks/useMultiTouch.ts`) handles
   `touchstart`, `touchmove`, and `touchend` events.
3. Touches are tracked by `touch.identifier` (never by array index) to correctly
   handle finger add/remove/reassign across the screen.
4. When 2+ fingers stabilize, a countdown starts and then dispatches `SET_FINGERS`.
5. On desktop (non-touch), click-to-add players with module-level ID counter.
6. RouletteScreen pre-selects a winner (respecting noRepeat), spins the animation,
   then dispatches `SELECT_PLAYER`.

### State transition flow

```
User action / touch event
  --> Component calls dispatch({ type: 'ACTION', payload: ... })
    --> GameContext reducer updates GameState
      --> gamePhase changes
        --> Active screen component re-renders to show the new screen
```

### Card data flow

- Static card data lives in `src/data/cards.ts` as a `Card[]` array.
- Cards are filtered at read time by pack, difficulty, and type based on the
  current `GameSettings`.
- The active screen selects and presents a random card from the filtered set.

## Screen/flow navigation model

The app uses a **phase-based navigation model** (not URL routing). The current
`gamePhase` string in GameState determines which screen component renders.

| Phase | Screen Component | Purpose |
|---|---|---|
| `start` | `StartScreen` | Landing page with game title and start button |
| `onboarding` | `OnboardingScreen` | 5-slide walkthrough for first-time players |
| `setup` | `SetupScreen` | Configure game settings (difficulty, pack, timer, sound) |
| `finger-selection` | `FingerSelectionScreen` | All players place fingers; auto-starts roulette after countdown |
| `roulette` | `RouletteScreen` | Spinning highlight animation, selects one player |
| `player-selected` | `PlayerSelectedScreen` | Announce winner + Truth/Dare/Random choice (merged screen) |
| `card-reveal` | `CardRevealScreen` | Display the chosen card with 3D flip animation |
| `voting` | `VotingScreen` | Self-voting: Fail / Pass / Excellent |
| `result` | `ResultScreen` | Show vote result with confetti or failure effects |
| `next-round` | `NextRoundScreen` | Continue, change settings, or restart |

Navigation is unidirectional: forward through the phases, with the option to
restart from `start` at the end of a round or game.

## Key design patterns

### Context Provider pattern
GameContext wraps the entire component tree so any descendant screen can access
game state and dispatch without prop drilling.

### Custom Hook pattern
Device-specific and reusable logic is extracted into custom hooks:
- `useMultiTouch` — encapsulates multi-touch tracking and finger selection.
- `useSound` — Web Audio API SFX manager with preloading, dedup, and autoplay unlock.
- `useTouchCapability` — feature-detects touch support (no UA sniffing).

### Single-responsibility screens
Each screen is one file in `src/screens/` and owns its own presentation logic.
Screens do not directly mutate state — they dispatch actions to GameContext.

### Static data + runtime filtering
Card data is static (no API calls). Cards are filtered at runtime by game
settings, keeping the data layer simple and fast.

### PWA via vite-plugin-pwa
The app is configured as a PWA for installability and offline capability, making
it suitable as a party game on mobile devices without requiring an app store.

## Architectural decisions

### ADR-0001: Record architecture decisions
- Each meaningful decision is logged as a numbered markdown file in
  `docs/decisions/`.
- Decisions follow a Y-statement format: situation, concern, option, benefit,
  tradeoff.
- Reversing a decision creates a new ADR rather than editing the old one.

## Current project state

**All 4 phases are complete.** The game is fully playable end-to-end.

Implemented:
- 11 screen components (Start, Onboarding, Setup, FingerSelection, Roulette, PlayerSelected, CardReveal, Voting, Result, NextRound, DesktopGate)
- 12 reusable components (NeonButton, GlassPanel, CardBack, DifficultyBadge, PackBadge, TimerDisplay, PlayerDot, SettingsButton, ErrorBoundary, PhaseMusic, ResultDisplay, VotingPanel)
- 3 custom hooks (useMultiTouch, useSound, useTouchCapability)
- Utility: selectPlayer (no-repeat logic)
- 192 cards across 4 packs × 3 difficulties
- Sound effects (12 SFX via Web Audio API with inflight dedup)
- Background music (3 tracks via HTML Audio with RAF crossfade)
- Error boundary with restart (dispatches RESTART to reset game state)
- No-repeat player selection (excludes last picked player)
- Desktop click-to-add players (module-level ID counter)
- Settings with localStorage persistence (sound, music, difficulty, pack, timer, noRepeat)
- PWA with manifest, service worker, and icons
- 35 passing tests across 4 test files
