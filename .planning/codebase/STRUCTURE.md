# Structure — Truth/Dare Finger Roulette

## Directory tree with purpose annotations

```
team-08-app/
|
|-- .env.example                  # Environment variable template (no secrets)
|-- .gitignore                    # Git ignore rules
|-- CLAUDE.md                     # AI assistant project context and conventions
|-- LICENSE                       # Project license
|-- README.md                     # Project overview and quickstart
|-- SETUP.md                      # Developer setup instructions
|-- working-agreement.md          # Team communication, code review, and role conventions
|
|-- .github/
|   |-- CODEOWNERS                # Code ownership rules for PR reviews
|   |-- dependabot.yml            # Automated dependency update configuration
|   |-- pull_request_template.md  # PR description template
|   |-- ISSUE_TEMPLATE/
|   |   |-- bug.md                # Bug report issue template
|   |   |-- task.md               # Task/work item issue template
|   |-- workflows/
|       |-- ci.yml                # CI pipeline (lint, test, build)
|       |-- security.yml          # Security scanning workflow (Semgrep)
|
|-- docs/
|   |-- ARCHITECTURE.md           # Project architecture overview (template, to be filled)
|   |-- decisions/
|       |-- 0001-record-architecture-decisions.md  # ADR: decision logging convention
|
|-- src/
|   |-- App.tsx                   # Root component (currently Vite scaffold, will host GameContextProvider)
|   |-- App.css                   # App-level styles (currently Vite scaffold)
|   |-- App.test.tsx              # Smoke test for App component
|   |-- main.tsx                  # React entry point, renders <App /> into DOM
|   |-- index.css                 # Global CSS variables and base styles (light/dark theme)
|   |-- test-setup.ts             # Vitest setup file (imports jest-dom matchers)
|   |
|   |-- assets/                   # Static assets
|   |   |-- hero.png              # Hero image (Vite scaffold)
|   |   |-- react.svg             # React logo
|   |   |-- vite.svg              # Vite logo
|   |
|   |-- data/
|   |   |-- cards.ts             # Static Card[] data, filtered by pack/difficulty/type [STUB - empty]
|   |
|   |-- hooks/
|   |   |-- useMultiTouch.ts     # Multi-touch tracking hook (touch.identifier keyed) [STUB - empty]
|   |
|   |-- state/
|   |   |-- GameContext.tsx       # React Context + reducer for GameState [STUB - empty]
|   |
|   |-- types/
|       |-- index.ts              # TypeScript type definitions: Card, GameState, PlayerTouch, GameSettings [STUB - empty]
|
|-- index.html                    # Vite HTML entry point, mounts React to #root
|-- package.json                  # Dependencies, scripts, project metadata
|-- package-lock.json             # Locked dependency versions
|
|-- tsconfig.json                 # Root TypeScript config (references app + node configs)
|-- tsconfig.app.json             # TypeScript config for src/ (browser code)
|-- tsconfig.node.json            # TypeScript config for tooling files (vite.config.ts)
|
|-- vite.config.ts                # Vite build configuration (React plugin)
|-- vitest.config.ts              # Vitest test configuration (jsdom environment)
|-- eslint.config.js              # ESLint flat config (TS + React hooks + React Refresh)
```

## File naming conventions

- **PascalCase** for React component files: `App.tsx`, `GameContext.tsx`,
  `StartScreen.tsx` (planned).
- **camelCase** for hooks: `useMultiTouch.ts`.
- **camelCase** for data modules: `cards.ts`.
- **camelCase** for config files: `vite.config.ts`, `vitest.config.ts`,
  `eslint.config.js`.
- **kebab-case** for documentation and markdown: `working-agreement.md`,
  `0001-record-architecture-decisions.md`.
- **kebab-case** for test setup: `test-setup.ts`.
- One default export per file; TypeScript files use `.ts` or `.tsx` extensions.

## Screen files (planned, per the game flow)

Each screen maps to one game phase and lives in `src/screens/`:

| Screen file | Game phase | Description |
|---|---|---|
| `StartScreen.tsx` | `start` | Title screen with game branding and start button |
| `SetupScreen.tsx` | `setup` | Player configuration, difficulty, and pack selection |
| `TouchSelectionScreen.tsx` | `touchSelection` | All players touch screen; random selection via multi-touch |
| `SelectedPlayerScreen.tsx` | `selectedPlayer` | Announcement of the randomly chosen player |
| `TruthDareChoiceScreen.tsx` | `truthDareChoice` | Selected player picks "truth" or "dare" |
| `CardRevealScreen.tsx` | `cardReveal` | Displays the drawn card content |
| `NextRoundScreen.tsx` | `nextRound` | Round transition, score update, continue/end prompt |

Note: The `src/screens/` directory does not exist yet. It will be created when
screen components are implemented.

## Shared code locations

### Types (`src/types/`)
- `index.ts` — All TypeScript type and interface definitions.
- Planned exports: `Card`, `GamePhase`, `GameState`, `GameSettings`, `PlayerTouch`,
  `GameAction` (reducer action type).

### State management (`src/state/`)
- `GameContext.tsx` — React Context provider, reducer function, and custom
  context hook (`useGameState` or similar). Central source of truth for all
  game data.

### Custom hooks (`src/hooks/`)
- `useMultiTouch.ts` — Encapsulates touch event handling. Tracks multiple
  simultaneous touches by `touch.identifier`. Returns current touch state and
  provides a selection mechanism.

### Static data (`src/data/`)
- `cards.ts` — Exports the full `Card[]` array. Cards have `type`, `difficulty`,
  `text`, and `pack` fields. Filtered at runtime by `GameSettings`.

## Config files and their roles

| File | Role |
|---|---|
| `package.json` | Project metadata, npm scripts (`dev`, `build`, `test`, `lint`, `preview`), and dependency declarations |
| `vite.config.ts` | Vite build configuration; enables the `@vitejs/plugin-react` plugin |
| `vitest.config.ts` | Vitest test runner configuration; sets `jsdom` environment, CSS processing, and test setup file |
| `tsconfig.json` | Root TypeScript config; references `tsconfig.app.json` and `tsconfig.node.json` |
| `tsconfig.app.json` | TypeScript config for application source code in `src/`; targets ES2023, enables JSX |
| `tsconfig.node.json` | TypeScript config for Node-side tooling files (`vite.config.ts`) |
| `eslint.config.js` | ESLint flat config; applies TypeScript, React hooks, and React Refresh rules to `.ts`/`.tsx` files |
| `index.html` | Vite's HTML entry point; contains the `#root` div and module script tag |
| `.env.example` | Template for environment variables (no real values committed) |
| `.gitignore` | Excludes `node_modules`, `dist`, `.env`, and other generated files from version control |

## CI/CD and GitHub configuration

| File | Role |
|---|---|
| `.github/workflows/ci.yml` | Continuous integration: lint, test, build on PRs and pushes |
| `.github/workflows/security.yml` | Security scanning (Semgrep) |
| `.github/CODEOWNERS` | Defines required reviewers per code area |
| `.github/dependabot.yml` | Automated dependency update PRs |
| `.github/ISSUE_TEMPLATE/bug.md` | Structured bug report template |
| `.github/ISSUE_TEMPLATE/task.md` | Structured task/work item template |
| `.github/pull_request_template.md` | PR description template for consistent reviews |

## Key dependency versions

| Package | Version | Purpose |
|---|---|---|
| react | ^19.2.7 | UI framework |
| react-dom | ^19.2.7 | DOM rendering |
| vite | ^8.1.1 | Build tool and dev server |
| vitest | ^3.2.7 | Test runner |
| typescript | ~6.0.2 | Type checking |
| vite-plugin-pwa | ^1.3.0 | Progressive Web App support |
| @testing-library/react | ^16.3.2 | React component testing utilities |
| @testing-library/jest-dom | ^6.9.1 | Custom DOM matchers for Vitest |