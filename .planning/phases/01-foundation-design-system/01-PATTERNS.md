# Phase 1: Foundation & Design System - Pattern Map

**Mapped:** 2026-07-10
**Files analyzed:** 14
**Analogs found:** 1 / 14 (structural analog only — see note below)

## Note on Analog Scarcity

This is a greenfield scaffold. Every file this phase creates or rewrites is either:
- currently **empty** (`src/types/index.ts`, `src/state/GameContext.tsx`, `src/data/cards.ts`, `src/hooks/useMultiTouch.ts` — 0 bytes each), or
- the **default Vite/React template** (`src/App.tsx`, `src/App.css`, `src/index.css`, `vite.config.ts`, `index.html`) with no project-specific pattern worth preserving, or
- **net-new** (7 screen files, PWA manifest icons).

There is no existing controller/service/component/reducer pattern in this codebase to copy from — Phase 1 *is* the pattern-setting phase. Consequently the "closest analog" for nearly every file is **RESEARCH.md's own Code Examples / Architecture Patterns sections** (already vetted, cited, and version-verified) and **01-UI-SPEC.md's Implementation Reference `@theme` block** (already FINAL, pixel-sourced values — supersedes RESEARCH.md's placeholder OKLCH figures). The one true in-repo analog is `src/App.test.tsx`, which establishes the project's Vitest + Testing Library test-file shape and should be copied for the App-router smoke test.

Treat every "Analog" cell below pointing at RESEARCH.md/UI-SPEC.md as **"copy this exact code block verbatim, replacing only the specific values called out"** — not as "loosely follow this pattern."

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|--------------------|------|-----------|-----------------|----------------|
| `src/types/index.ts` | model (types barrel) | CRUD (state shape) | RESEARCH.md "Type skeleton" code example | exact — verbatim source |
| `src/state/GameContext.tsx` | provider/store | event-driven (dispatch/reducer) | RESEARCH.md Pattern 2 + Pattern 3 code examples | exact — verbatim source |
| `src/App.tsx` | controller (router) | request-response (phase → screen) | RESEARCH.md "App.tsx phase router" code example | exact — verbatim source |
| `src/screens/StartScreen.tsx` | component | request-response (render only) | RESEARCH.md "Minimal placeholder screen" example + UI-SPEC Typography (Heading role) | exact — verbatim shape, apply `text-2xl font-semibold` per UI-SPEC |
| `src/screens/SetupScreen.tsx` | component | request-response | same as StartScreen | exact — same template, different phase string |
| `src/screens/TouchSelectionScreen.tsx` | component | request-response | same as StartScreen | exact — same template |
| `src/screens/SelectedPlayerScreen.tsx` | component | request-response | same as StartScreen | exact — same template |
| `src/screens/TruthDareChoiceScreen.tsx` | component | request-response | same as StartScreen | exact — same template |
| `src/screens/CardRevealScreen.tsx` | component | request-response | same as StartScreen | exact — same template |
| `src/screens/NextRoundScreen.tsx` | component | request-response | same as StartScreen | exact — same template |
| `src/index.css` | config (design tokens) | transform (CSS custom props → utilities) | UI-SPEC "Implementation Reference: `@theme` Block" (FINAL values) | exact — verbatim, supersedes RESEARCH.md Pattern 1 placeholders |
| `vite.config.ts` | config | build-time | RESEARCH.md Pattern 4 code example | exact — verbatim source, fill in hex from UI-SPEC (`#8B2FE2` / `#0A0414`) |
| `index.html` | config | request-response (static) | current `index.html` (in-repo, title placeholder only) | role-match — minimal one-line `<title>` edit per D-11 |
| `src/App.test.tsx` (extend/replace) | test | request-response | `src/App.test.tsx` (in-repo, current default-template test) | exact — same Testing Library + Vitest shape, swap assertion target |

## Pattern Assignments

### `src/types/index.ts` (model, CRUD/state-shape)

**Analog:** RESEARCH.md → Code Examples → "Type skeleton (src/types/index.ts)"

**Full pattern to copy verbatim** (RESEARCH.md lines 411-467):
```typescript
export type GamePhase =
  | 'start'
  | 'setup'
  | 'touchSelection'
  | 'selectedPlayer'
  | 'truthDareChoice'
  | 'cardReveal'
  | 'nextRound'

export type Difficulty = 'easy' | 'medium' | 'hard' | 'all'
export type CardPack = 'friends' | 'couple' | 'family' | 'classic'
export type CardType = 'truth' | 'dare'

export interface PlayerTouch {
  id: string
  touchIdentifier: number // keyed by touch.identifier per multitouch-spike-result.md -- NOT array index
  x: number
  y: number
}

export interface Card {
  id: string
  type: CardType
  difficulty: Difficulty
  pack: CardPack
  text: string
}

export interface GameSettings {
  difficulty: Difficulty
  pack: CardPack
  timerEnabled: boolean
}

export interface GameState {
  phase: GamePhase
  players: PlayerTouch[]
  activePlayer: PlayerTouch | null
  selectedCard: Card | null
  settings: GameSettings
}

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'SELECT_PLAYER'; payload: PlayerTouch }
  | { type: 'CHOOSE_TRUTH_OR_DARE'; payload: CardType }
  | { type: 'PICK_CARD'; payload: Card }
  | { type: 'VOTE'; payload: 'pass' | 'fail' }
  | { type: 'NEXT_ROUND' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GameSettings> }
```

**Conventions this satisfies:** No enums (`erasableSyntaxOnly`) — union types + interfaces only. Barrel file per CONVENTIONS.md. `PlayerTouch.touchIdentifier` field name anticipates the multi-touch `identifier`-keying lesson from CLAUDE.md without importing touch-handling logic this phase.

**Open decision (RESEARCH.md Open Question 2):** `UPDATE_SETTINGS` action — keep the type/reducer case even though no UI dispatches it yet this phase (SetupScreen is a placeholder). This satisfies PLAT-02's persistence requirement being wired end-to-end even without live UI.

---

### `src/state/GameContext.tsx` (provider/store, event-driven)

**Analog:** RESEARCH.md → Architecture Patterns → Pattern 2 (Context + useReducer) and Pattern 3 (localStorage read-on-init/write-on-change)

**Core pattern** (RESEARCH.md lines 236-284):
```tsx
import { createContext, useContext, useReducer } from 'react'
import type { ReactNode, Dispatch } from 'react'
import type { GameState, GameAction } from '../types'

const initialState: GameState = {
  phase: 'start',
  players: [],
  activePlayer: null,
  selectedCard: null,
  settings: loadSettings(), // read-on-init from localStorage, see Pattern 3
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, phase: 'touchSelection' }
    case 'SELECT_PLAYER':
      return { ...state, phase: 'selectedPlayer', activePlayer: action.payload }
    case 'CHOOSE_TRUTH_OR_DARE':
      return { ...state, phase: 'cardReveal' /* ... */ }
    case 'PICK_CARD':
      return { ...state, selectedCard: action.payload }
    case 'VOTE':
      return { ...state /* record self-vote result */ }
    case 'NEXT_ROUND':
      return { ...state, phase: 'touchSelection', activePlayer: null, selectedCard: null }
    default:
      return state
  }
}

type GameContextValue = { state: GameState; dispatch: Dispatch<GameAction> }
const GameContext = createContext<GameContextValue | null>(null)

export function GameContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  return <GameContext value={{ state, dispatch }}>{children}</GameContext>
}

export function useGameContext(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGameContext must be used within GameContextProvider')
  return ctx
}
```

**Persistence pattern to co-locate** (RESEARCH.md lines 290-317):
```ts
import type { GameSettings } from '../types'

const STORAGE_KEY = 'truthOrDare:gameSettings'

const defaultSettings: GameSettings = {
  difficulty: 'all',
  pack: 'classic',
  timerEnabled: true,
}

function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings
  } catch {
    return defaultSettings // private browsing / quota / parse errors fall back silently
  }
}

function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // localStorage unavailable -- fail silently, in-memory state still works
  }
}
```

**Error handling pattern:** try/catch around `JSON.parse` (Pattern 3) is mandatory per Security Domain (V5 Input Validation) — malformed/tampered localStorage must not crash the app; falls back to `defaultSettings` silently, no user-visible error copy (matches UI-SPEC Copywriting Contract "Error state: Not applicable this phase").

**Effect wiring (write-on-change):** `useEffect(() => saveSettings(state.settings), [state.settings])` inside the provider — scope dependency array to `state.settings` only, NOT the whole `state` object (Pitfall 5) to avoid writing on every phase transition.

**Anti-pattern to avoid:** Do not persist `phase`/`activePlayer`/`selectedCard`/`players` — D-09/D-10 scope persistence to `GameSettings` only.

---

### `src/App.tsx` (controller/router, request-response)

**Analog:** RESEARCH.md → Code Examples → "App.tsx phase router" (full rewrite, replaces current default Vite template)

**Full pattern to copy verbatim** (RESEARCH.md lines 486-529):
```tsx
import { GameContextProvider, useGameContext } from './state/GameContext'
import StartScreen from './screens/StartScreen'
import SetupScreen from './screens/SetupScreen'
import TouchSelectionScreen from './screens/TouchSelectionScreen'
import SelectedPlayerScreen from './screens/SelectedPlayerScreen'
import TruthDareChoiceScreen from './screens/TruthDareChoiceScreen'
import CardRevealScreen from './screens/CardRevealScreen'
import NextRoundScreen from './screens/NextRoundScreen'

function ActiveScreen() {
  const { state } = useGameContext()

  switch (state.phase) {
    case 'start':
      return <StartScreen />
    case 'setup':
      return <SetupScreen />
    case 'touchSelection':
      return <TouchSelectionScreen />
    case 'selectedPlayer':
      return <SelectedPlayerScreen />
    case 'truthDareChoice':
      return <TruthDareChoiceScreen />
    case 'cardReveal':
      return <CardRevealScreen />
    case 'nextRound':
      return <NextRoundScreen />
    default:
      return null // exhaustive per noFallthroughCasesInSwitch
  }
}

function App() {
  return (
    <GameContextProvider>
      <ActiveScreen />
    </GameContextProvider>
  )
}

export default App
```

**Delete:** the current `src/App.tsx` content entirely (Vite welcome template — logos, counter button, docs/social links) and its dependency on `src/App.css`, `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`. Confirm whether `App.css` is deleted or repurposed — RESEARCH.md/CONTEXT.md don't call for co-located `App.css` anymore since Tailwind utilities replace it; flag for planner to confirm removal vs. keep-empty.

---

### `src/screens/*.tsx` (7 files — component, request-response)

**Analog:** RESEARCH.md → Code Examples → "Minimal placeholder screen (per D-07)", styled per UI-SPEC Typography section

**Pattern to copy per screen** (RESEARCH.md lines 470-483, heading style upgraded per UI-SPEC line 63):
```tsx
// src/screens/StartScreen.tsx
function StartScreen() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background text-primary">
      <h1 className="text-2xl font-semibold">start</h1>
    </main>
  )
}

export default StartScreen
```

**Per-file substitution table:**

| File | Component name | Heading text (UI-SPEC Copywriting Contract: lowercase `state.phase` string) |
|------|----------------|-------------------------------------------------------------------------------|
| `StartScreen.tsx` | `StartScreen` | `start` |
| `SetupScreen.tsx` | `SetupScreen` | `setup` |
| `TouchSelectionScreen.tsx` | `TouchSelectionScreen` | `touchSelection` |
| `SelectedPlayerScreen.tsx` | `SelectedPlayerScreen` | `selectedPlayer` |
| `TruthDareChoiceScreen.tsx` | `TruthDareChoiceScreen` | `truthDareChoice` |
| `CardRevealScreen.tsx` | `CardRevealScreen` | `cardReveal` |
| `NextRoundScreen.tsx` | `NextRoundScreen` | `nextRound` |

**Conventions this satisfies:** `function` declaration (not arrow), default export, one component per file, `text-2xl font-semibold` = UI-SPEC's "Heading" typography role (24px/600/1.2), `text-primary` / `bg-background` = Tailwind utilities auto-generated from the `@theme` tokens below — do not hand-write CSS for these.

---

### `src/index.css` (config/design tokens, transform)

**Analog:** `01-UI-SPEC.md` → "Implementation Reference: `@theme` Block" — this is the FINAL, pixel-sourced version; supersedes RESEARCH.md Pattern 1's placeholder OKLCH values (RESEARCH.md Assumption A3 flagged those as non-final).

**Full pattern to copy verbatim** (UI-SPEC lines 178-203):
```css
@import "tailwindcss";

@theme {
  /* Color tokens — color-picked from public/images/Screens.png per D-01 */
  --color-background: oklch(0.13 0.04 301);   /* #0A0414 */
  --color-surface: oklch(0.20 0.06 301);      /* #1C0E2E */
  --color-primary: oklch(0.54 0.25 301);      /* #8B2FE2 neon purple */
  --color-secondary: oklch(0.61 0.23 350);    /* #E02B96 neon pink */
  --color-accent: oklch(0.68 0.14 245);       /* #40A1E9 electric blue */
  --color-highlight: oklch(0.86 0.15 91);     /* #F4CC50 gold/orange */
  --color-truth: oklch(0.68 0.14 245);        /* #40A1E9 blue */
  --color-dare: oklch(0.57 0.21 7);           /* #D22461 pink/red */
  --color-success: oklch(0.71 0.20 141);      /* #50BF3A green */
  --color-failure: oklch(0.60 0.23 22);       /* #E9243D red */
  --color-premium: oklch(0.75 0.13 76);       /* #DDA242 gold */

  /* Glow shadow tokens — reusable across Phases 2-4 per D-03 */
  --shadow-glow-primary: 0 0 24px 4px oklch(0.54 0.25 301 / 0.55);
  --shadow-glow-secondary: 0 0 24px 4px oklch(0.61 0.23 350 / 0.55);
  --shadow-glow-accent: 0 0 24px 4px oklch(0.68 0.14 245 / 0.55);
  --shadow-glow-highlight: 0 0 24px 4px oklch(0.86 0.15 91 / 0.55);
  --shadow-glow-success: 0 0 20px 3px oklch(0.71 0.20 141 / 0.5);
  --shadow-glow-failure: 0 0 20px 3px oklch(0.60 0.23 22 / 0.5);
}
```

**Critical ordering rule (Pitfall 1):** `@import "tailwindcss";` MUST be the first line, immediately followed by `@theme { }`. Missing/misordered import causes utility classes to render with zero styles.

**Delete entirely:** the current `:root` light/dark custom-property scheme and its `@media (prefers-color-scheme: dark)` block — conflicts with "always dark, no toggle" (PROJECT.md). Do not extend it; full replacement per code_context note in CONTEXT.md.

**Note:** `--color-surface` is a UI-SPEC addition beyond RESEARCH.md's original token list (glassmorphism panel fill) — include it, it's part of the FINAL contract.

---

### `vite.config.ts` (config, build-time)

**Analog:** RESEARCH.md → Architecture Patterns → Pattern 4 (Vite config combining Tailwind + PWA plugins)

**Full pattern to copy verbatim, with hex values filled in from UI-SPEC** (RESEARCH.md lines 324-357, hex resolved per UI-SPEC line 205):
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Truth or Dare — Finger Roulette',
        short_name: 'Truth or Dare',
        description: 'A premium multiplayer party game — fingers on screen, spinning light, truth or dare.',
        theme_color: '#8B2FE2', // matches --color-primary, D-13
        background_color: '#0A0414', // matches --color-background
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
})
```

**Anti-pattern to avoid (Pitfall 4):** do NOT use `pwaAssets: { image: 'public/favicon.svg' }` — requires the unlisted `@vite-pwa/assets-generator` package. Per D-12, manually rasterize `public/favicon.svg` to `pwa-192x192.png` / `pwa-512x512.png` and reference as static `icons[]` entries as shown above.

**Anti-pattern to avoid (Pitfall 3):** do not add `virtual:pwa-register/react` / `useRegisterSW` reload-prompt UI this phase — out of scope for PLAT-01, and would require installing `workbox-window` as a new devDependency, which isn't currently justified.

---

### `index.html` (config, static)

**Analog:** current in-repo `index.html` — only the `<title>` needs to change; everything else stays.

**Current content (for reference, only line 6 changes):**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>team-08-app</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Change:** `<title>team-08-app</title>` → `<title>Truth or Dare</title>` (matches manifest `short_name` per D-11 — the full descriptive `name` "Truth or Dare — Finger Roulette" is reserved for the manifest, not the raw `<title>` tag, consistent with how most PWAs keep the tab title terse).

---

### `src/App.test.tsx` (test, request-response)

**Analog:** `src/App.test.tsx` (in-repo, current file — full content read below)

**Current pattern (lines 1-8):**
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('Get started')).toBeInTheDocument()
  })
})
```

**Adapt for new App.tsx:** keep the `render(<App />)` + Testing Library shape, but assert against the new default-phase placeholder heading instead of the removed "Get started" copy:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the start screen by default', () => {
    render(<App />)
    expect(screen.getByText('start')).toBeInTheDocument()
  })
})
```

**Note:** `src/test-setup.ts` (`import '@testing-library/jest-dom/vitest'`) requires no changes — already correctly wired as the global Vitest setup file.

---

## Shared Patterns

### Functional Component Convention
**Source:** `.claude/CLAUDE.md` Component Patterns section (project-wide rule, not a single file)
**Apply to:** All 7 screen files + `App.tsx`
```tsx
function ComponentName() {
  return ( /* ... */ )
}
export default ComponentName
```
Never arrow-function components; never class components.

### Type-Only Import Convention
**Source:** `tsconfig.app.json` `verbatimModuleSyntax: true` (project-wide, enforced by TypeScript compiler)
**Apply to:** `GameContext.tsx`, any file importing from `src/types/index.ts`
```ts
import type { GameState, GameAction } from '../types'
```

### No-Enum Convention
**Source:** `tsconfig.app.json` `erasableSyntaxOnly: true`
**Apply to:** `src/types/index.ts` — `GamePhase`, `Difficulty`, `CardPack`, `CardType` are all string union types, never `enum`.

### localStorage Try/Catch Safety
**Source:** RESEARCH.md Pattern 3 + Security Domain (V5)
**Apply to:** `GameContext.tsx` only (the sole file touching `localStorage` this phase)
```ts
try {
  /* JSON.parse / localStorage access */
} catch {
  return defaultSettings // fail silently, no user-visible error
}
```

### Tailwind Utility-Only Styling (No Inline `box-shadow`)
**Source:** UI-SPEC D-03 Glow Utility Tokens section + RESEARCH.md Anti-Patterns
**Apply to:** `src/index.css` (token definitions) and all 7 screen files (token consumption)
Screens/components consume `bg-background`, `text-primary`, `shadow-glow-primary`, etc. — never hand-write `style={{ boxShadow: '...' }}` or a `.css` rule referencing raw hex/oklch values outside the single `@theme` block.

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `public/pwa-192x192.png`, `public/pwa-512x512.png` | asset (raster icon) | file-I/O (build-time static asset) | Not a code file — rasterized manually or via script from `public/favicon.svg` per D-12; no code pattern applies, only the Pitfall 4 anti-pattern warning (don't use `pwaAssets` auto-generation) |

## Metadata

**Analog search scope:** Entire `src/` tree (14 files), `vite.config.ts`, `index.html`, `package.json` — full repo scan since project is small and greenfield.
**Files scanned:** `src/App.tsx`, `src/App.css`, `src/App.test.tsx`, `src/main.tsx`, `src/index.css`, `src/types/index.ts` (empty), `src/state/GameContext.tsx` (empty), `src/data/cards.ts` (empty, out of scope), `src/hooks/useMultiTouch.ts` (empty, out of scope), `src/test-setup.ts`, `vite.config.ts`, `index.html`, `eslint.config.js`, `package.json`.
**Pattern extraction date:** 2026-07-10
