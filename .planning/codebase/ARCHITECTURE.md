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
|  |   +------------------------------------------+  ||
|  |   |        Screen (by gamePhase)             |  ||
|  |   |                                          |  ||
|  |   |  StartScreen                             |  ||
|  |   |  SetupScreen                             |  ||
|  |   |  TouchSelectionScreen                    |  ||
|  |   |  SelectedPlayerScreen                    |  ||
|  |   |  TruthDareChoiceScreen                   |  ||
|  |   |  CardRevealScreen                        |  ||
|  |   |  NextRoundScreen                         |  ||
|  |   +------------------------------------------+  ||
|  |                    |                            ||
|  |                    v                            ||
|  |   useMultiTouch()  <-- touch events             ||
|  |                    |                            ||
|  |                    v                            ||
|  |   GameContext (state + dispatch)                ||
|  +--------------------------------------------------+|
+------------------------------------------------------+
```

## Component hierarchy

```
<StrictMode>
  <App>
    <GameContextProvider>          // src/state/GameContext.tsx
      <ActiveScreen />            // One of src/screens/*.tsx, selected by gamePhase
    </GameContextProvider>
  </App>
</StrictMode>
```

- **App** (`src/App.tsx`) — Root component. Currently scaffolded as the default
  Vite template; will be replaced by the GameContextProvider wrapper and screen
  router.
- **GameContextProvider** — Wraps the entire app tree, providing game state and
  dispatch to all descendants.
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

Key types (planned, not yet implemented):

- **GamePhase** — Union type of screen identifiers: `"start"` | `"setup"` |
  `"touchSelection"` | `"selectedPlayer"` | `"truthDareChoice"` | `"cardReveal"` |
  `"nextRound"`.
- **PlayerTouch** — Tracks a player's identity (assigned at touch-down) keyed by
  `touch.identifier`.
- **Card** — A truth or dare card with `type` ("truth" | "dare"), `difficulty`,
  `text`, and optional `pack`.
- **GameSettings** — Configurable game parameters (difficulty, pack selection,
  number of rounds).
- **GameState** — The composite state object holding `phase`, `players`,
  `activePlayer`, `selectedCard`, `settings`, and round tracking fields.

## Data flow patterns

### Touch event flow

1. A screen component (primarily TouchSelectionScreen) attaches touch event
   listeners to a full-screen container.
2. The **useMultiTouch hook** (`src/hooks/useMultiTouch.ts`) handles
   `touchstart`, `touchmove`, and `touchend` events.
3. Touches are tracked by `touch.identifier` (never by array index) to correctly
   handle finger add/remove/reassign across the screen.
4. When a selection moment occurs (e.g., all fingers lift), the hook determines
   the "winner" (randomly or by position) and dispatches to GameContext.

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
| `setup` | `SetupScreen` | Configure game settings (difficulty, pack, players) |
| `touchSelection` | `TouchSelectionScreen` | All players touch the screen; random selection occurs |
| `selectedPlayer` | `SelectedPlayerScreen` | Announce the selected player |
| `truthDareChoice` | `TruthDareChoiceScreen` | Selected player chooses truth or dare |
| `cardReveal` | `CardRevealScreen` | Display the chosen card |
| `nextRound` | `NextRoundScreen` | Transition between rounds, update scores, continue or end |

Navigation is unidirectional: forward through the phases, with the option to
restart from `start` at the end of a round or game.

## Key design patterns

### Context Provider pattern
GameContext wraps the entire component tree so any descendant screen can access
game state and dispatch without prop drilling.

### Custom Hook pattern
Device-specific and reusable logic is extracted into custom hooks:
- `useMultiTouch` — encapsulates multi-touch tracking and finger selection.

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

The project is in **scaffold phase**. The Vite + React + TypeScript starter is
in place, but the game-specific code is not yet implemented:

- `App.tsx` still contains the default Vite welcome page.
- `src/screens/` directory does not exist yet.
- `src/types/index.ts`, `src/state/GameContext.tsx`, `src/data/cards.ts`, and
  `src/hooks/useMultiTouch.ts` exist as empty stub files.
- The GameContextProvider is not yet wired into App.tsx.

The planned architecture above represents the intended design as documented in
CLAUDE.md and the folder conventions established by the team.
