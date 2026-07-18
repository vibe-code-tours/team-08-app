<!-- GSD:project-start source:PROJECT.md -->

## Project

**Truth or Dare — Finger Roulette**

A premium multiplayer party game PWA where 2–10 players place their fingers on a phone screen, a roulette spins to select one player, who then picks Truth or Dare, selects a challenge card, and performs it. The game is fully client-side with no backend — a social, share-the-phone experience designed for parties and gatherings.

**Core Value:** The roulette selection moment — fingers on screen, spinning light, dramatic slowdown, winner revealed — must feel electric and fun. If that single moment delivers excitement, the game works.

### Constraints

- **Tech Stack**: React + Vite + TypeScript + Tailwind CSS + Framer Motion — no UI component libraries, build custom
- **Platform**: PWA, mobile-first, must work on phones (Android + iOS Safari)
- **Multi-touch**: Hardware/OS limits apply; design gracefully for 2–10 fingers
- **Performance**: Smooth 60fps animations on mid-range phones; no jank during roulette or card flip
- **Team**: 4 parallel workstreams — features must be independently branchable
- **No Backend**: Everything runs client-side; data is static TypeScript files + localStorage

<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Runtime

- **Node.js version:** 24 (CI uses `actions/setup-node@v4` with `node-version: "24"`)
- **Module system:** ESM (`"type": "module"` in package.json)
- **Browser target:** ES2023 (TypeScript `target: "es2023"`, `lib: ["ES2023", "DOM"]`)
- **No engine restrictions** declared in package.json

## Framework and Core Libraries

| Library | Version (range) | Role |
|---|---|---|
| React | `^19.2.7` | UI framework |
| React DOM | `^19.2.7` | DOM renderer |

- **Render method:** `createRoot` (React 18+ concurrent API)
- **StrictMode:** enabled in `src/main.tsx`
- **No router library** installed (single-page with screen-based flow managed in `GameContext`)
- **No state management library** beyond React Context (`src/state/GameContext.tsx`)

## Build Toolchain

| Tool | Version (range) | Purpose |
|---|---|---|
| Vite | `^8.1.1` | Dev server and bundler |
| @vitejs/plugin-react | `^6.0.3` | React fast-refresh / JSX transform |
| TypeScript | `~6.0.2` | Static type checking |
| vite-plugin-pwa | `^1.3.0` | PWA service worker + manifest generation |

### Vite Configuration

- Minimal config in `vite.config.ts` -- only the `react()` plugin, no custom aliases, proxy, or build overrides.

### TypeScript Configuration

- `tsconfig.app.json` (for `src/`)
- `tsconfig.node.json` (for `vite.config.ts`)
- `target: "es2023"`, `lib: ["ES2023", "DOM"]`
- `module: "esnext"`, `moduleResolution: "bundler"`
- `jsx: "react-jsx"`
- `verbatimModuleSyntax: true`
- `noEmit: true` (Vite handles bundling)
- `erasableSyntaxOnly: true`
- Strict linting options: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- Includes: `src/`
- `target: "es2023"`, `lib: ["ES2023"]`
- `module: "nodenext"`, `types: ["node"]`
- `noEmit: true`
- Includes: `vite.config.ts`

## Testing Framework and Libraries

| Tool | Version (range) | Role |
|---|---|---|
| Vitest | `^3.2.7` | Test runner |
| @vitest/ui | `^3.2.7` | Visual test UI |
| jsdom | `^27.0.1` | Browser environment simulation |
| @testing-library/react | `^16.3.2` | React component testing utilities |
| @testing-library/jest-dom | `^6.9.1` | Custom DOM matchers |

- `environment: 'jsdom'`
- `setupFiles: ['./src/test-setup.ts']` (imports `@testing-library/jest-dom/vitest`)
- `css: true` (CSS modules processed in tests)
- Uses `@vitejs/plugin-react` for JSX in test files

## Linting and Code Quality

| Tool | Version (range) | Role |
|---|---|---|
| ESLint | `^10.6.0` | Core linter |
| @eslint/js | `^10.0.1` | ESLint recommended rules |
| typescript-eslint | `^8.62.0` | TypeScript-aware linting rules |
| eslint-plugin-react-hooks | `^7.1.1` | React hooks rules of exhuastive deps |
| eslint-plugin-react-refresh | `^0.5.3` | Validates React Fast Refresh compatibility |

- `globalIgnores(['dist'])`
- Files: `**/*.{ts,tsx}`
- Extends: `js.configs.recommended`, `tseslint.configs.recommended`, `reactHooks.configs.flat.recommended`, `reactRefresh.configs.vite`
- `languageOptions.globals: globals.browser`
- No custom rules overrides

## PWA Configuration

- **Plugin:** `vite-plugin-pwa ^1.3.0`
- **Status:** Plugin is listed as a devDependency but is **not currently wired** into `vite.config.ts`. The Vite config only loads `react()`. PWA features (manifest, service worker, icons) are not yet configured.
- **Target behavior** (per README): installable, offline-capable PWA

## CI/CD Tooling

### ci.yml

- **Runner:** `ubuntu-latest`
- **Node:** 24 (with npm cache)
- **Steps:** `npm ci` -> `lint` -> `test` -> `build`
- **Triggers:** push to `main`, all PRs, manual dispatch
- **Concurrency:** cancels in-progress runs on same ref

### security.yml

- **Secrets scan:** Gitleaks `v8.18.4` (Docker image, advisory/continue-on-error)
- **SAST:** Semgrep with `--config=auto` community rules, Python 3.12 runtime (advisory/continue-on-error)
- **Dependency scanning:** Handled by Dependabot (`.github/dependabot.yml`)
- Both security jobs are currently advisory (`continue-on-error: true`)

## Deployment

- **Target:** GitHub Pages, via `.github/workflows/deploy.yml`
- **Trigger:** auto-deploys on every push to `main`
- **Vite base path:** set for the GitHub Pages subpath deploy (see `vite.config.ts`)

## Package Manager

- **npm** (lockfileVersion 3 in `package-lock.json`)
- No `yarn.lock`, `pnpm-lock.yaml`, or `bun.lockb` present

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Component Patterns

- **Functional components only** — all components use the `function` declaration syntax (not arrow functions).
- **No class components** — React 19.x with hooks throughout.
- **One component per file** — each screen and component lives in its own file.
- **Default exports** for components (`export default App`); named exports for utilities and configs.
- **Props** will be defined via `type` or `interface` in the `src/types/` directory (not inline prop destructuring). The project follows a pattern of co-locating type definitions.

## Hooks Usage

- React hooks (`useState`, `useContext`, `useReducer`) are used directly — no wrapper libraries.
- Custom hooks follow the `use` prefix convention and live in `src/hooks/`.
- Example: `useMultiTouch.ts` encapsulates multi-touch tracking logic.
- Hooks key touch interactions by `touch.identifier` (not array index) — this is a hard-won lesson documented in `docs/multitouch-spike-result.md`.

## State Management

- **React Context** via `src/state/GameContext.tsx` holds global game state.
- The project uses `useReducer` for complex state transitions (game flow: Start, Setup, Touch Selection, Selected Player, Truth/Dare choice, Card Reveal, Next Round).
- State is not persisted — purely in-memory for the session.
- No external state management library (no Redux, Zustand, Jotai).

## TypeScript Usage

### Strictness Settings (from tsconfig.app.json)

| Setting | Value | Effect |
|---|---|---|
| `verbatimModuleSyntax` | `true` | Must use `import type` for type-only imports |
| `noUnusedLocals` | `true` | Error on unused local variables |
| `noUnusedParameters` | `true` | Error on unused function parameters |
| `noFallthroughCasesInSwitch` | `true` | Every case must break or return |
| `erasableSyntaxOnly` | `true` | No enums — use `const` objects + union types instead |
| `target` | `es2023` | Modern JS output |
| `moduleResolution` | `bundler` | Vite-style resolution |
| `allowImportingTsExtensions` | `true` | Can import `.tsx` extensions explicitly |

### Type vs Interface

- Use `type` for simple shape definitions (preferences based on project scaffolding).
- Interfaces may be used for component props if the team prefers — both are valid under `erasableSyntaxOnly`.
- All shared types live in `src/types/index.ts` (barrel file using index re-exports).

### Type Import Convention

- Use `import type { Foo } from '...'` when importing only types (required by `verbatimModuleSyntax`).

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Component files | PascalCase `.tsx` | `App.tsx`, `CardReveal.tsx` |
| Screen files | PascalCase `.tsx` in `src/screens/` | `StartScreen.tsx` |
| Hook files | camelCase with `use` prefix `.ts` | `useMultiTouch.ts` |
| Data files | camelCase `.ts` | `cards.ts` |
| Type files | `index.ts` barrel in `src/types/` | `types/index.ts` |
| State files | PascalCase `.tsx` (context providers) | `GameContext.tsx` |
| Component names | PascalCase | `App`, `GameContext` |
| Hook names | `use` prefix, camelCase | `useMultiTouch` |
| Functions | camelCase | `setCount` |
| CSS class names | kebab-case | `hero`, `button-icon` |

## Import Ordering

## CSS / Styling Approach

- **Tailwind CSS v4** — utility-first styling via `@tailwindcss/vite` plugin.
- **Design tokens** — neon color palette and glow shadows defined in `@theme` block in `src/index.css` (oklch color space).
- **Component styling** — Tailwind utility classes on all components and screens.
- **Dark theme** — always dark (neon cyber aesthetic); no light mode toggle.

## Error Handling

- Currently minimal — the codebase is in early scaffolding.
- No error boundary components are defined yet.
- The `!` non-null assertion is used in `main.tsx` (`document.getElementById('root')!`) — acceptable for the root DOM element.
- Future pattern: expect error boundaries wrapping screen components as the app grows.

## Code Organization Within Files

## Branch and Commit Conventions

- **Branch naming:** `feat/...` or `fix/...` off `main`.
- **No direct pushes to `main`** — branch protection requires PR + review.
- **PR size:** Keep under ~300 lines.
- **CI must be green** before merging (lint, test, build).
- **Commit messages:** Conventional style observed in git history (`ci:`, `fix:`).

## Dependencies

- **React 19.x** (latest) — no legacy patterns.
- **Vite 8.x** with `@vitejs/plugin-react` and `vite-plugin-pwa`.
- **ES Module** throughout (`"type": "module"` in package.json).
- **Node 24** in CI.

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## What it does

## High-level architecture pattern

```
|                    <App />                            |
|  +--------------------------------------------------+|
|  |          <GameContextProvider>                    ||
|  |                                                  ||
|  |   +------------------------------------------+  ||
|  |   |        Screen (by gamePhase)             |  ||
|  |   |                                          |  ||
|  |   |  StartScreen                             |  ||
|  |   |  SetupScreen                             |  ||
|  |   |  FingerSelectionScreen                   |  ||
|  |   |  RouletteScreen                          |  ||
|  |   |  PlayerSelectedScreen                    |  ||
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
```

## Component hierarchy

```

```

- **App** (`src/App.tsx`) — Root component. Currently scaffolded as the default
- **GameContextProvider** — Wraps the entire app tree, providing game state and
- **Screen components** (`src/screens/*.tsx`) — One file per screen. Only the

## State management approach

### GameContext (`src/state/GameContext.tsx`)

- **GameState** — the full current state object (players, active finger, chosen
- **dispatch** — a reducer action dispatcher for state transitions.

### GameState shape (`src/types/index.ts`)

- **GamePhase** — Union type of screen identifiers: `"start"` | `"setup"` |
- **PlayerTouch** — Tracks a player's identity (assigned at touch-down) keyed by
- **Card** — A truth or dare card with `type` ("truth" | "dare"), `difficulty`,
- **GameSettings** — Configurable game parameters (difficulty, pack selection,
- **GameState** — The composite state object holding `phase`, `players`,

## Data flow patterns

### Touch event flow

### State transition flow

```

```

### Card data flow

- Static card data lives in `src/data/cards.ts` as a `Card[]` array.
- Cards are filtered at read time by pack, difficulty, and type based on the
- The active screen selects and presents a random card from the filtered set.

## Screen/flow navigation model

| Phase | Screen Component | Purpose |
|---|---|---|
| `start` | `StartScreen` | Landing page with game title and start button |
| `setup` | `SetupScreen` | Configure game settings (difficulty, pack, players) |
| `finger-selection` | `FingerSelectionScreen` | All players place fingers; auto-starts roulette after countdown |
| `roulette` | `RouletteScreen` | Spinning highlight animation, selects one player |
| `player-selected` | `PlayerSelectedScreen` | Announce the selected player + Truth/Dare/Random choice |
| `card-reveal` | `CardRevealScreen` | Display the chosen card |
| `nextRound` | `NextRoundScreen` | Transition between rounds, update scores, continue or end |

## Key design patterns

### Context Provider pattern

### Custom Hook pattern

- `useMultiTouch` — encapsulates multi-touch tracking and finger selection.

### Single-responsibility screens

### Static data + runtime filtering

### PWA via vite-plugin-pwa

## Architectural decisions

### ADR-0001: Record architecture decisions

- Each meaningful decision is logged as a numbered markdown file in
- Decisions follow a Y-statement format: situation, concern, option, benefit,
- Reversing a decision creates a new ADR rather than editing the old one.

## Current project state

- All 4 phases are complete (Foundation → Core Game Loop → Content & Settings → Premium Polish).
- `App.tsx` is a phase-based router with AnimatePresence screen transitions, ErrorBoundary, PhaseMusic, and UpdateToast.
- `src/screens/` has 11 screens: StartScreen, OnboardingScreen, SetupScreen, FingerSelectionScreen, RouletteScreen, PlayerSelectedScreen, CardRevealScreen, VotingScreen, ResultScreen, NextRoundScreen, DesktopGateScreen.
- `src/components/` has 13 reusable components: NeonButton, GlassPanel, CardBack, DifficultyBadge, PackBadge, TimerDisplay, PlayerDot, ErrorBoundary, PhaseMusic, UpdateToast, VotingPanel, ResultDisplay, SettingsButton.
- `src/hooks/` has 4 hooks: useMultiTouch, useSound, useTouchCapability, usePwaInstall.
- `src/data/cards.ts` has 192 cards with filtering helpers.
- All UI text is in Myanmar (Burmese).

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
