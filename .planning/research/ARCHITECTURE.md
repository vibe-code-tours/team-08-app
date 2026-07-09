# Architecture Patterns — Truth/Dare Finger Roulette

**Domain:** Mobile party game PWA (client-side only)
**Researched:** 2026-07-09

## Recommended Architecture

```
src/
  main.tsx              — React root, StrictMode, global providers
  App.tsx               — Screen router (GameContext-driven)
  index.css             — Tailwind v4 @theme definition (neon color system)
  types/
    index.ts            — Card, GameState, PlayerTouch, GameSettings types
  state/
    GameContext.tsx       — GameContext + useReducer (single source of truth)
  data/
    cards.ts             — Static Card[] array, filtered by pack/difficulty/type
  hooks/
    useMultiTouch.ts     — Touch tracking keyed by touch.identifier
  screens/
    SplashScreen.tsx     — Animated neon title
    OnboardingScreen.tsx — 2-3 slide walkthrough
    SetupScreen.tsx      — Settings (difficulty, pack, timer)
    TouchSelectionScreen.tsx — Fingers on screen, roulette spin
    SelectedPlayerScreen.tsx — Winner reveal + Truth/Dare choice
    CardSelectionScreen.tsx  — Face-down card grid
    CardRevealScreen.tsx     — 3D card flip + challenge display
    ResultScreen.tsx         — Self-voting + pass/fail celebration
    NextRoundScreen.tsx      — Next / Settings / Restart
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `GameContext` | Holds GameState, dispatches actions, exposes game logic | All screens (via useContext) |
| `App.tsx` | Renders the correct screen based on `gameState.phase` | GameContext, all screens |
| `useMultiTouch` | Tracks finger positions, maps touch.identifier to player slots | TouchSelectionScreen |
| Screen components | Render UI for a single game phase, dispatch actions to GameContext | GameContext, child components |
| `cards.ts` | Exports typed card arrays, filterable by pack/difficulty | CardSelectionScreen |
| Tailwind theme (`@theme`) | Defines neon color palette, available as utility classes globally | All components via Tailwind classes |

### Data Flow

```
User touches screen
  -> useMultiTouch tracks touch.identifier -> PlayerTouch[]
  -> Roulette animation (Motion spring physics) selects winner
  -> GameContext dispatches { type: "SELECT_PLAYER", playerId }
  -> Screen transitions (AnimatePresence) to SelectedPlayerScreen
  -> Player taps Truth or Dare
  -> GameContext dispatches { type: "SET_CHOICE", choice }
  -> Screen transitions to CardSelectionScreen
  -> Player taps face-down card
  -> Screen transitions to CardRevealScreen (3D flip animation)
  -> Player performs challenge, taps Pass/Fail/Excellent
  -> GameContext dispatches { type: "SET_RESULT", result }
  -> Screen transitions to ResultScreen (confetti on pass)
  -> Player taps Next Round
  -> GameContext dispatches { type: "NEXT_ROUND" }
  -> Loop back to TouchSelectionScreen
```

## Patterns to Follow

### Pattern 1: Phase-Driven Screen Routing
**What:** Game phase (a string enum) determines which screen renders. No router needed.
**When:** Single-flow games with a defined sequence of screens.
**Example:**
```tsx
function App() {
  const { gameState } = useGameContext();
  return (
    <AnimatePresence mode="wait">
      <Screen key={gameState.phase} />
    </AnimatePresence>
  );
}
```

### Pattern 2: Context + useReducer for Game State
**What:** Single reducer handles all game state transitions. Context provides dispatch + state to all screens.
**When:** State transitions are well-defined (game phases) and shared across many components.
**Example:**
```tsx
type GameAction =
  | { type: "SET_PLAYERS"; players: PlayerTouch[] }
  | { type: "SELECT_PLAYER"; playerId: number }
  | { type: "SET_CHOICE"; choice: "truth" | "dare" | "random" }
  | { type: "SET_RESULT"; result: "pass" | "fail" | "excellent" }
  | { type: "NEXT_ROUND" }
  | { type: "RESTART" };
```

### Pattern 3: Touch Tracking by Identifier
**What:** All multi-touch state is a Map<number, PlayerTouch> keyed by touch.identifier.
**When:** Any time you track multiple simultaneous touches.
**Example:**
```tsx
const [activeTouches, setActiveTouches] = useState<Map<number, PlayerTouch>>(new Map());

function handleTouchStart(e: TouchEvent) {
  setActiveTouches(prev => {
    const next = new Map(prev);
    for (const touch of Array.from(e.changedTouches)) {
      next.set(touch.identifier, {
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
        color: PLAYER_COLORS[next.size % PLAYER_COLORS.length],
      });
    }
    return next;
  });
}
```

### Pattern 4: Sound Effect Wrapper Hook
**What:** Encapsulate Howler.js in a custom hook that handles unlock and provides typed play functions.
**When:** Multiple components need to trigger sounds.
**Example:**
```tsx
function useSoundEffects() {
  const sfxRef = useRef<Howl | null>(null);
  // Initialize on mount, handle unlock
  // Return { play: (name: SoundName) => void, setVolume: (v: number) => void }
}
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Multiple Context Providers
**What:** Creating separate contexts for game state, settings, sounds, etc.
**Why bad:** Adds unnecessary re-render complexity. Game state IS the settings — they belong in one reducer.
**Instead:** Single GameContext with a well-typed reducer. Split the reducer logic into helper functions if it gets large.

### Anti-Pattern 2: Array Index for Touch Tracking
**What:** Using touch array position (e.g., `e.touches[0]`) instead of `touch.identifier`.
**Why bad:** Touch array indices shift when fingers lift. Finger 3 becomes finger 2 after finger 1 lifts. Wrong player gets selected.
**Instead:** Always key by `touch.identifier`.

### Anti-Pattern 3: CSS Animations for Complex Sequences
**What:** Trying to choreograph the roulette spin or card flip using CSS @keyframes alone.
**Why bad:** Cannot apply spring physics, cannot orchestrate multi-step sequences, cannot react to state changes mid-animation.
**Instead:** Use Motion library for anything with spring physics or state-dependent animation. CSS is fine for simple hover effects and the neon glow pulse.

### Anti-Pattern 4: Building Screens Before the Design System
**What:** Building UI screens with inline styles or ad-hoc CSS, planning to "add Tailwind later."
**Why bad:** Every screen gets rewritten when the design system lands. Double work.
**Instead:** Set up the Tailwind v4 `@theme` with the full neon color palette in Phase 1 before writing any screen components.

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| Bundle size | Irrelevant — PWA, cached after first load | Precached by service worker — no impact | Same — offline first, no server load |
| Animation performance | Fine on any device | Fine — canvas-based confetti, WAAPI animations | Same — no server involved |
| Audio loading | Fine — single sprite file, ~200KB | Same — precached by service worker | Same |
| Card data | 50-100 cards = ~15KB TypeScript | Same — static data, bundled in JS | Same |
| State management | Context is fine | Context is fine | Context is fine (no server state) |

Note: This project has no server-side scaling concerns. All state is client-side. The "scaling" dimension is purely about PWA caching and bundle size, both of which are handled by Vite + vite-plugin-pwa.

## Sources

- PROJECT.md — Architecture requirements, folder conventions (project documentation, HIGH confidence)
- CLAUDE.md — Screen flow, key learnings (project documentation, HIGH confidence)
- docs/ARCHITECTURE.md — Existing architecture documentation (project documentation, HIGH confidence)
- Motion for React docs — AnimatePresence, spring physics, layout animations (Context7, HIGH confidence)
- vite-plugin-pwa guide — PWA caching strategy (Context7, HIGH confidence)
