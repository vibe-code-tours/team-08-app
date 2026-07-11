# 🎮 Truth or Dare — Finger Roulette | Team Proposal

> **Read this before picking your task.**
> This document explains what we're building, how we'll build it, and what each person should work on.

---

## What Are We Building?

A **premium multiplayer party game PWA** where 2–10 players share a phone screen. Players place their fingers on the screen, a roulette spins and selects one player, who then picks Truth or Dare, selects a challenge card, and performs it.

**Tech stack:** React + Vite + TypeScript + Tailwind CSS + Motion (Framer Motion successor)

**Design:** Neon cyber/party aesthetic — dark backgrounds, glowing effects, premium animations.

**Reference:** `public/images/Screens.png` — our complete 24-screen UI kit.

---

## 4 Phases

We build in 4 phases. Phase 1 must finish first, then Phases 2–4 run in parallel.

```
Phase 1: Foundation       ← ALL 4 DEVS WORK HERE FIRST
    │
    ├──→ Phase 2: Core Game Loop      (Dev A)
    ├──→ Phase 3: Content & Settings  (Dev B)
    └──→ Phase 4: Premium Polish      (Dev C + Dev D)
```

| Phase | Name | What We Build | Requirements |
|-------|------|---------------|--------------|
| **1** | **Foundation & Design System** | Tailwind neon theme, shared components, game state, screen router, PWA, card data | PLAT-01, PLAT-02, PLAT-04 |
| **2** | **Core Game Loop** | Multi-touch roulette, Truth/Dare choice, card grid, flip reveal, voting, results, next round | MTCH-01–05, FLOW-01–05, UX-03–06, PLAT-03 |
| **3** | **Content & Settings** | 100+ cards across packs, settings screens (difficulty, pack, timer toggle) | CONT-01, CONF-01–03 |
| **4** | **Premium Polish** | Splash screen, onboarding, sound effects, countdown timer, pack color accents | UX-01, UX-02, UX-07, UX-08, CONT-02 |

---

## Phase 1 — Tasks (Pick One)

Phase 1 has **4 tasks**. Each person picks one. All tasks run in parallel — no blocking.

### Task 1: Design System & Components

**Pick this if:** You like CSS, design systems, and building beautiful reusable things.

**What you do:**

- Install and configure Tailwind v4 with `@theme` neon color palette
- Define glow utilities and dark gradient background
- Color constants defined in `src/index.css` via Tailwind `@theme` tokens and `PLAYER_COLORS` array in `src/types/index.ts`
- Build 7 shared components in `src/components/`:

| Component | Props | Used In |
|-----------|-------|---------|
| `NeonButton` | `variant: 'truth' | 'dare' | 'random' | 'gold'`, `onClick`, `children`, `glow?` | Truth/Dare screen, Setup, Voting |
| `GlassPanel` | `children`, `className?` | Every screen (container) |
| `PlayerDot` | `color`, `size?`, `active?` | Finger selection, Roulette |
| `CardBack` | `onClick`, `selected?` | Card grid |
| `DifficultyBadge` | `difficulty: 'easy' | 'medium' | 'hard'` | Card reveal |
| `PackBadge` | `pack: 'friends' | 'couple' | 'family' | 'classic'` | Card reveal |
| `TimerDisplay` | `seconds`, `maxSeconds`, `active?` | Timer screen |

**Output:** Dark gradient background + neon utility classes + 7 reusable components working.

**Files you touch:** `vite.config.ts`, `src/index.css`, `src/theme/colors.ts`, `src/components/`

---

### Task 2: GameContext & Types

**Pick this if:** You like TypeScript, state management, and building the brain of the app.

> **Reducer invariant:** The reducer is the only place `phase` changes. Screens dispatch intent (e.g. `CHOOSE_TYPE`, `SELECT_CARD`) and the reducer decides the resulting phase. No screen component calls a phase-setting action directly.

**What you do:**

- Define all TypeScript types in `src/types/index.ts`:
  - `GamePhase` — all 15 game phases (splash → onboarding → setup → finger-selection → roulette → player-selected → truth-dare → coin-flip → card-grid → card-reveal → challenge → timer → voting → result-success → result-failed → next-round)
  - Standalone shared types, referenced from `Card` / `GameSettings` instead of inlined:
    - `Difficulty = 'easy' | 'medium' | 'hard'`
    - `Pack = 'friends' | 'couple' | 'family' | 'classic'`
    - `CardType = 'truth' | 'dare'`
    - `Vote = 'fail' | 'pass' | 'excellent'`
  - `Card` — `{ id, type: CardType, difficulty: Difficulty, pack: Pack, text }`
  - `PlayerTouch` — `{ identifier, color, x, y }`. `identifier` is the browser's `pointerId` — stable across a single touch gesture, and NOT an array index. Do not substitute a generated index.
  - `GameSettings` — `{ difficulty: Difficulty, pack: Pack, timerEnabled, timerDuration }`
  - `GameState` — full game state shape, including the round-state fields:
    - `selectedPlayerId: number | null`
    - `chosenType: CardType | null`
    - `selectedCard: Card | null`
    - `lastVote: Vote | null`
    - Nullable fields use `| null`, not `?`.
  - `GameAction` — all possible actions (discriminated union)

- Build `GameContext.tsx` with **split context pattern** (critical for performance):
  - `GameStateContext` — for screens that only READ state
  - `GameDispatchContext` — for screens that only DISPATCH actions
  - This prevents 60fps re-renders during touch events

- Implement `useReducer` with all state transitions:
  - `START_GAME`, `SET_FINGERS`, `SELECT_PLAYER`, `CHOOSE_TRUTH_DARE`
  - `COIN_FLIP_RESULT`, `SELECT_CARD`, `REVEAL_CARD`, `VOTE`
  - `CHANGE_SETTINGS`
  - `NEXT_ROUND` — clears `selectedPlayerId`, `chosenType`, `selectedCard`, `lastVote`. Preserves `touches`, `settings`, `hasSeenOnboarding`.
  - `RESTART` — resets to initial state entirely, EXCEPT `settings` is preserved and `hasSeenOnboarding` is forced to `true`.

- Persist ONLY `settings` and `hasSeenOnboarding` to localStorage. Nothing else — `phase`, `touches`, and round state (`selectedPlayerId`, `chosenType`, `selectedCard`, `lastVote`) must NOT be persisted, since rehydrating mid-round would resume showing a card to whoever refreshes the page.

- Export clean hooks: `useGame()`, `useGameDispatch()`

**Output:** All game state transitions work. Settings survive page reload.

**Files you touch:** `src/types/index.ts`, `src/state/GameContext.tsx`

---

### Task 3: Screen Router & PWA

**Pick this if:** You like wiring things together and making the app come alive.

**What you do:**

- Create `src/screens/` directory with 15 placeholder screen files:
  - `SplashScreen.tsx`, `OnboardingScreen.tsx`, `SetupScreen.tsx`
  - `FingerSelectionScreen.tsx`, `RouletteScreen.tsx`, `PlayerSelectedScreen.tsx`
  - `TruthDareScreen.tsx`, `CoinFlipScreen.tsx`, `CardGridScreen.tsx`
  - `CardRevealScreen.tsx`, `ChallengeScreen.tsx`, `TimerScreen.tsx`
  - `VotingScreen.tsx`, `ResultScreen.tsx`, `NextRoundScreen.tsx`

- Each screen: simple dark-background component showing screen name in neon text

- Wire `App.tsx` with screen router:
  - Read `gamePhase` from `GameContext`
  - Switch/map to correct screen component

- Add Framer Motion:
  - `npm install motion` (already in package.json)
  - Wrap router with `AnimatePresence mode="wait"`
  - Each screen gets enter/exit animation

- Configure `vite-plugin-pwa` in `vite.config.ts`:
  - `registerType: "autoUpdate"`
  - Portrait orientation lock
  - Basic web manifest (name, theme color, icons), including a 512x512 icon with `purpose: 'maskable'` alongside the existing icons

- Add PWA meta tags to `index.html`, including `viewport-fit=cover` alongside the existing viewport settings

- Lock down touch handling at the root, not per-screen:
  - `html, body, #root { touch-action: none; overscroll-behavior: none; }`

- Note for all screen components: use `h-dvh`, not `h-screen` — mobile browser chrome makes `100vh` unreliable.

**Output:** App shows placeholder screens and navigates between them by game phase.

**Files you touch:** `src/screens/`, `src/App.tsx`, `vite.config.ts`, `index.html`

---

### Task 4: Card Content

**Pick this if:** You like writing content and being creative.

**What you do:**

- Write 8–12 placeholder cards (2–3 per pack) in `src/data/cards.ts` — enough to build and test the card grid against. The full card library (50–100+, all packs/difficulties) is Phase 3's `CONT-01`, not Phase 1. Pack-tone writing guidance (what "friends" vs "couple" vs "family" vs "classic" should sound like) lives in Phase 3's task description, not here.
- Each card matches this type:

```typescript
interface Card {
  id: string;           // e.g., "friends-easy-01"
  type: 'truth' | 'dare';
  difficulty: 'easy' | 'medium' | 'hard';
  pack: 'friends' | 'couple' | 'family' | 'classic';
  text: string;         // The actual question or challenge
}
```

- Export filter helpers:
  - `filterCards({ pack?, difficulty?, type? })` — returns all matching cards
  - `randomCard(options)` — returns one random matching card
  - `randomCards(n, options)` — returns N random unique matching cards
  - `countCards(options)` — returns count of matching cards

**Output:** 8–12 placeholder cards in `src/data/cards.ts`, fully filterable.

**Files you touch:** `src/data/cards.ts`

---

## Dependency Map

```
Task 1 (Theme + Components) ──→ Phase 2/3/4 screens use these
Task 2 (State) ──────────────→ Phase 2/3/4 screens read/dispatch this
Task 3 (Router) ─────────────→ Phase 2/3/4 screens plug into this
Task 4 (Cards) ──────────────→ Phase 2/3 screens display these
```

**No task blocks another task.** All 4 start at the same time.

---

## How to Work

```bash
# 1. Create your branch from main
git checkout main
git pull
git checkout -b feature/your-name-task-N

# 2. Dependencies are already installed — just run:
npm install

# 3. Work on your task

# 4. Before PR, always run:
npm run lint && npm run test && npm run build

# 5. Push and create PR to main
git push origin feature/your-name-task-N
```

### Rules
- One task per person
- Don't touch files outside your scope
- Keep PRs under 300 lines if possible
- Commit often with clear messages

---

## After Phase 1

Once all 4 tasks merge to main, we branch out:

| Dev | Phase 2 | Phase 3 | Phase 4 |
|-----|---------|---------|---------|
| **Dev A** | Core Game Loop (roulette + all screens) | — | — |
| **Dev B** | — | Content & Settings (cards + settings UI) | — |
| **Dev C** | — | — | Premium Polish (splash + onboarding) |
| **Dev D** | — | — | Premium Polish (sound + timer) |

---

## Quick Reference

| Task | Files | Key Packages |
|------|-------|--------------|
| 1. Design System | `vite.config.ts`, `src/index.css`, `src/theme/`, `src/components/` | tailwindcss, @tailwindcss/vite |
| 2. GameContext | `src/types/index.ts`, `src/state/GameContext.tsx` | react (built-in) |
| 3. Screen Router | `src/screens/`, `src/App.tsx`, `vite.config.ts`, `index.html` | motion, vite-plugin-pwa |
| 4. Card Content | `src/data/cards.ts` | — |

---

## Key Technical Decisions

| Decision | Why |
|----------|-----|
| Split Context (GameState + GameDispatch) | Prevents 60fps re-renders during touch events |
| `useRef` for touch positions, not `useState` | Touch events fire at 60fps — setState would kill performance |
| Motion (not Framer Motion) | Same API, successor package, actively maintained |
| Tailwind v4 `@theme` | CSS-first config, no tailwind.config.js needed |
| Cards as TypeScript (not JSON) | Type safety, IDE autocomplete, compile-time validation |

---

*Proposal created: 2026-07-09*
*Branch: docs/phase1-team-proposal*
