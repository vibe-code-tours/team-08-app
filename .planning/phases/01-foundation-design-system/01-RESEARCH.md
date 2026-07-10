# Phase 1: Foundation & Design System - Research

**Researched:** 2026-07-10
**Domain:** Tailwind v4 CSS-based design tokens, React 19 Context/useReducer state backbone, vite-plugin-pwa wiring, localStorage persistence
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Neon Palette Sourcing & Glow System**
- **D-01:** Color-pick exact hex/OKLCH values from `public/images/Screens.png` (the 24-screen UI kit) rather than using generic neon approximations — the palette must match the design source of truth pixel-for-pixel.
- **D-02:** Implement the palette as Tailwind v4 `@theme` tokens (CSS-based config — Tailwind v4 does not use `tailwind.config.js`) with named tokens for: background, primary (neon purple), secondary (neon pink), accent (electric blue), highlight (gold/orange), truth (blue), dare (pink/red), success (green), failure (red), premium/selected (gold).
- **D-03:** Glow effects become reusable Tailwind utilities (glow/shadow tokens defined in `@theme`, e.g. a `--shadow-glow-purple`-style token) rather than one-off inline `box-shadow` styles, so Phases 2-4 can apply glow consistently without redefining it.

**GameContext v1 Scope**
- **D-04:** Lock `GamePhase` to exactly the 7 phases already named in `CLAUDE.md` / `.planning/codebase/ARCHITECTURE.md`: `start`, `setup`, `touchSelection`, `selectedPlayer`, `truthDareChoice`, `cardReveal`, `nextRound`.
- **D-05:** Reducer actions cover: start game, select player, choose truth/dare, pick card, vote, next round. The Random coin-flip sub-choice (REQUIREMENTS.md FLOW-02) and dedicated pass/fail/celebration result screens (UX-03/04/05) are NOT modeled as separate `GamePhase` values in Phase 1 — Phase 2 extends the union type and reducer when it builds those screens.
- **D-06:** Deliberate narrow-scope choice: the type contract should be extendable later rather than Phase 1 trying to predict every future field Phase 2 will need.

**Screen Stub Strategy**
- **D-07:** Create all 7 placeholder screen components now in `src/screens/` (`StartScreen.tsx`, `SetupScreen.tsx`, `TouchSelectionScreen.tsx`, `SelectedPlayerScreen.tsx`, `TruthDareChoiceScreen.tsx`, `CardRevealScreen.tsx`, `NextRoundScreen.tsx`), each a minimal functional component (e.g., renders its own phase name), wired into the router.
- **D-08:** Rationale: the team runs 4 parallel workstreams across Phases 2-4. Pre-creating one file per screen means each developer edits only their own screen file instead of everyone touching the shared `App.tsx` router the first time a screen is needed — avoids merge conflicts.

**Local Storage Persistence Scope**
- **D-09:** Persist `GameSettings` only (difficulty, pack, timer toggle) — matches `.planning/REQUIREMENTS.md` PLAT-02 wording exactly ("game settings persist in local storage").
- **D-10:** Full `GameState` (mid-round phase/players/active card) is explicitly NOT persisted in Phase 1 — a page reload mid-game restarts from `start`. No hydration logic is needed for in-progress rounds. Revisit only if reload-during-party turns out to be a real pain point post-v1.

**PWA Manifest Identity**
- **D-11:** `name`: "Truth or Dare — Finger Roulette", `short_name`: "Truth or Dare". Update `index.html`'s `<title>` (currently the placeholder "team-08-app") to match.
- **D-12:** Icons: rasterize the existing `public/favicon.svg` up to 192×192 and 512×512 PNGs as manifest icon stand-ins. No custom icon art in this phase.
- **D-13:** `theme_color` must be one of the locked palette tokens from D-01/D-02 (the neon primary/purple token) — not a separate ad-hoc value.

### Claude's Discretion
- Exact hex/OKLCH values extracted from `Screens.png` — the user decided the *sourcing method* (color-pick from the reference image), not the literal values. Pick the closest accurate match per token role.
- Precise glow utility naming/token structure within Tailwind v4's `@theme` syntax.
- Minimal placeholder screen content (D-07) — e.g., whether it's just a phase-name heading or includes a "back to start" dev affordance.

### Deferred Ideas (OUT OF SCOPE)
- Random coin-flip `GamePhase`/animation (REQUIREMENTS.md FLOW-02) — Phase 2.
- Self-vote result screens (pass/fail/celebration) as distinct phases (UX-03/04/05) — Phase 2.
- Full resumable mid-game `GameState` persistence (beyond `GameSettings`) — not in v1 scope per D-09/D-10; revisit only if reload-during-party proves to be a real problem.
- Custom PWA icon art (beyond the favicon rasterization in D-12) — candidate for Phase 4 Premium Polish, possibly alongside the splash screen (UX-01) work.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-------------------|
| PLAT-01 | PWA is installable with manifest and service worker | Pattern 4 (Vite config combining Tailwind + PWA plugins) provides the exact `VitePWA()` config shape, manifest fields, icon requirements, and `registerType: 'autoUpdate'` strategy; Pitfall 2-4 cover manifest/icon/dependency traps |
| PLAT-02 | Game settings persist in local storage | Pattern 3 (localStorage read-on-init/write-on-change for GameSettings only) provides the exact hook/effect shape scoped per D-09/D-10; Security Domain covers the `JSON.parse` tampering/crash mitigation |
| PLAT-04 | Fully client-side, no backend required | Architectural Responsibility Map confirms all Phase 1 capabilities resolve to Browser/Client or build-time tiers only — no server tier introduced; Environment Availability section confirms no external service dependencies |

</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Stack:** Vite + React + TypeScript + `vite-plugin-pwa`. Vitest for tests, ESLint for lint — no substitutions.
- **Architecture flow:** Start → Setup → Touch Selection → Selected Player → Truth/Dare choice → Card Reveal → Next Round — matches the `GamePhase` union locked in D-04; the router built this phase must follow this exact order/naming.
- **Multi-touch key-by-identifier lesson:** Not this phase's concern (no touch handling in Phase 1), but the type skeleton's `PlayerTouch` shape must anticipate `touch.identifier`-based keying (see `docs/multitouch-spike-result.md`) so Phase 2 doesn't need a type rework.
- **Folder conventions (hard requirement):** `src/screens/` one file per screen; `src/state/GameContext.tsx` holds `GameState`; `src/data/cards.ts` static `Card[]` (out of scope this phase); `src/hooks/useMultiTouch.ts` (out of scope this phase); `src/types/` for `Card`, `GameState`, `PlayerTouch`, `GameSettings`.
- **Functional components only**, `function` declaration syntax (not arrow functions), one component per file, default exports for components.
- **No enums** — `erasableSyntaxOnly: true` requires `const` objects + union types instead (already reflected in the `GamePhase`/`Difficulty`/`CardPack` type design above).
- **`import type` required** for type-only imports — `verbatimModuleSyntax: true`.
- **No CSS modules, no CSS-in-JS** — plain CSS with native nesting and Tailwind utilities; co-located `.css` files (`App.css` next to `App.tsx`, `index.css` global).
- **Dark mode is the only mode** — the existing `@media (prefers-color-scheme: dark)` toggle in `index.css` must be removed, not extended (confirmed in code_context of CONTEXT.md and reflected in Pattern 1 above).
- **No Redux/Zustand** — React Context + `useReducer` is the only state management approach.
- **State is not persisted** in general — only the `GameSettings` slice per PLAT-02/D-09, matching CLAUDE.md's "State is not persisted — purely in-memory for the session" note (settings persistence is the sole, explicit exception).
- **Workflow:** run `npm run lint && npm run test && npm run build` before opening a PR; never push to main directly.

## Summary

Phase 1 is pure infrastructure: a Tailwind v4 neon theme, a `GameContext` state backbone, 7 placeholder screens wired into a phase-based router, PWA manifest/service-worker wiring, and `GameSettings` localStorage persistence. All four target libraries (`tailwindcss@4.3.2`, `@tailwindcss/vite@4.3.2`, `vite-plugin-pwa@1.3.0`, `react@19.2.7`) are already pinned in `package.json` — this phase is about correctly wiring already-installed dependencies, not new package selection.

Tailwind v4 replaces `tailwind.config.js` entirely with a CSS-native `@theme` block: `--color-*` custom properties auto-generate `bg-*`/`text-*`/`border-*` utilities, and `--shadow-*` custom properties auto-generate `shadow-*` utilities. This directly satisfies D-02/D-03 (neon palette + glow tokens as first-class utilities) with zero JS config. `vite-plugin-pwa@1.3.0` needs to move from an unwired devDependency to an active Vite plugin — the minimal manifest shape (`name`, `short_name`, `theme_color`, `icons[]`) and `registerType: 'autoUpdate'` are both directly confirmed against current docs. React 19 introduces no breaking changes to `Context` + `useReducer` — the Phase 1 `GameContextProvider` pattern is the same one used in React 18.

**Primary recommendation:** Rebuild `src/index.css` from scratch with a single `@theme` block defining the full neon palette (colors + glow shadows) sourced by color-picking `Screens.png`; wire `@tailwindcss/vite` and `VitePWA()` side-by-side in `vite.config.ts`; build `GameContext` as a single `createContext` + `useReducer` pair exporting a typed action union; persist only `GameSettings` via a small `useLocalStorage`-style read-on-init/write-on-change pattern, not a general-purpose hook library.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Neon color/glow tokens | Browser / Client (CSS) | — | Tailwind v4 `@theme` compiles to static CSS custom properties + utility classes; no runtime JS involved |
| Game state (phase, players, settings) | Browser / Client (React Context) | — | Fully client-side app, no backend (PLAT-04); Context+useReducer is the in-memory state owner |
| GameSettings persistence | Browser / Client (localStorage) | — | Client-only storage API; no server round-trip, matches PLAT-02 wording exactly |
| Screen routing | Browser / Client (React conditional render) | — | Phase-based (non-URL) navigation per ARCHITECTURE.md; `gamePhase` string drives which screen component renders |
| PWA installability (manifest + SW) | Build tool (Vite plugin) + Browser (SW runtime) | CDN/Static (precached assets) | `vite-plugin-pwa` generates manifest.webmanifest + sw.js at build time; browser registers/executes SW at runtime; precached assets are served static |

## Package Legitimacy Audit

All four packages central to this phase are **already installed** in `package.json` (not new installs). Ran the legitimacy gate anyway per protocol since this phase actively wires two of them (`@tailwindcss/vite`, `vite-plugin-pwa`) into build config for the first time.

| Package | Registry | Age (latest publish) | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|----------------------|-----------|--------------|---------|-------------|
| `tailwindcss` | npm | published 2026-06-29 | 123.9M/wk | github.com/tailwindlabs/tailwindcss | SUS (`too-new`) | Approved — false positive, see note below |
| `@tailwindcss/vite` | npm | published 2026-06-29 | 40.0M/wk | github.com/tailwindlabs/tailwindcss | SUS (`too-new`) | Approved — false positive, see note below |
| `vite-plugin-pwa` | npm | published 2026-05-05 | 3.5M/wk | github.com/vite-pwa/vite-plugin-pwa | OK | Approved |
| `workbox-window` | npm | published 2026-05-04 | 8.0M/wk | github.com/googlechrome/workbox | OK | Approved — needed as new devDependency if wiring the React reload-prompt hook (see Pitfall 3) |

**Note on `too-new` verdicts:** The `package-legitimacy check` seam flags `tailwindcss` and `@tailwindcss/vite` as `SUS` solely because their most recent published version is within the seam's "recency" window. Both packages have 40M–124M weekly downloads and a matching, long-established GitHub org (`tailwindlabs`) — this is a high-cadence official release, not a slopsquat signal. Cross-verified via `npm view <pkg> version` (returns `4.3.2` for both, matching `.planning/codebase/STACK.md`) and via Context7's `/websites/tailwindcss` docs resolving to the same org. Treat as **Approved**, not flagged for `checkpoint:human-verify`.

**Packages removed due to [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** `tailwindcss`, `@tailwindcss/vite` — flagged by automated heuristic only (too-new), verdict overridden above with cross-verification; no `checkpoint:human-verify` needed.

**Observation (not a blocker for this phase):** `lucide-react@1.24.0` is also pinned in `package.json`. Historically `lucide-react` versions track ~0.x; a `1.24.0` major version is unusual and was also flagged `too-new` by the legitimacy seam (published same day as this research, 84M/wk downloads, matches `github.com/lucide-icons/lucide`). It is not installed or used by any Phase 1 plan (icons are out of scope this phase — screens are placeholders), so no action is required now. Flag for the planner of whichever phase first imports icons from `lucide-react` to re-verify the version at that time.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `tailwindcss` | 4.3.2 `[VERIFIED: npm registry]` | Utility-first CSS engine | Already pinned; project mandates Tailwind per CLAUDE.md, no UI component library |
| `@tailwindcss/vite` | 4.3.2 `[VERIFIED: npm registry]` | Vite-native Tailwind v4 plugin (replaces PostCSS pipeline) | Official v4 recommended integration path for Vite projects `[CITED: tailwindcss.com/docs/upgrade-guide]` |
| `vite-plugin-pwa` | 1.3.0 `[VERIFIED: npm registry]` | Manifest + service worker generation | Already pinned per STACK.md; zero-config Workbox wrapper, official Vite PWA solution `[CITED: vite-pwa/vite-plugin-pwa docs]` |
| `react` / `react-dom` | 19.2.7 `[VERIFIED: npm registry]` | UI framework | Already pinned; `createRoot` + `StrictMode` already wired in `main.tsx` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `workbox-window` | ^7.4.1 `[VERIFIED: npm registry]` | Required devDependency for `virtual:pwa-register/react` hook | Only if Phase 1 wires a live "new content available" reload prompt UI; optional for a minimal PLAT-01 install/offline pass (see Pitfall 3) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Tailwind v4 `@theme` CSS tokens | `tailwind.config.js` (v3-style JS config) | Not available in v4 install path already in package.json; JS config is legacy-compat only and adds an unnecessary indirection layer |
| Hand-written `useLocalStorage` hook | `usehooks-ts` / third-party hook library | Single settings object, one hook, ~15 lines — pulling a dependency for this is unjustified per "Don't Hand-Roll" analysis below (this one *should* be hand-rolled, it's trivial) |
| `vite-plugin-pwa` `generateSW` strategy (default) | `injectManifest` strategy (custom SW) | Phase 1 has no custom caching/offline requirements beyond installability; `generateSW` (zero-config Workbox) is correct for PLAT-01 as scoped |

**Installation:**
No new packages required — all core dependencies already present in `package.json`. Only conditionally needed:
```bash
npm install -D workbox-window
```
(Only if implementing the optional React reload-prompt UI; see Pitfall 3. Not required to satisfy PLAT-01 success criteria as scoped in D-11/D-12/D-13.)

**Version verification:** Confirmed via `npm view <package> version` against the live npm registry on 2026-07-10 — `tailwindcss@4.3.2`, `@tailwindcss/vite@4.3.2`, `vite-plugin-pwa@1.3.0`, `react@19.2.7`, `workbox-window@7.4.1` all match or satisfy the ranges already declared in `package.json`/`STACK.md`. No stale training-data versions substituted.

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  Browser                                                      │
│                                                                 │
│  index.html ──loads──> main.tsx                               │
│                            │                                   │
│                            v                                   │
│                    <StrictMode>                                │
│                      <App>                                     │
│                        <GameContextProvider>  <── useReducer   │
│                          │         (GameState, dispatch)       │
│                          v                                     │
│                    reads state.phase                           │
│                          │                                     │
│              ┌───────────┼────────────────────────┐            │
│              v           v            v            v           │
│         StartScreen  SetupScreen  TouchSelection... (7 total)  │
│         (renders ONE screen matching current gamePhase)        │
│                                                                 │
│  GameSettings  <--read on mount-- localStorage                 │
│      │                                                          │
│      └--write on change--> localStorage["gameSettings"]        │
│                                                                 │
│  Tailwind @theme tokens (index.css) --compiled at build time--> │
│      utility classes (bg-primary, shadow-glow-purple, ...)     │
│      consumed by all screen components                         │
└─────────────────────────────────────────────────────────────┘

Build time (Vite):
  vite.config.ts
    ├─ @tailwindcss/vite  → scans classes, emits CSS from @theme tokens
    └─ VitePWA()          → emits manifest.webmanifest + sw.js (precaches build output)
```

Primary use case trace: `index.html` loads `main.tsx` → mounts `<App>` inside `<GameContextProvider>` → provider's `useReducer` initializes `GameState` (phase: `"start"`, settings hydrated from `localStorage` if present) → `App` reads `state.phase` and renders the matching screen component → user interaction dispatches an action → reducer transitions `phase` → a different screen renders. Settings changes flow through the same dispatch path and a `useEffect` mirrors `state.settings` to `localStorage` on every change.

### Recommended Project Structure
```
src/
├── screens/                    # one file per GamePhase, 7 total (D-07)
│   ├── StartScreen.tsx
│   ├── SetupScreen.tsx
│   ├── TouchSelectionScreen.tsx
│   ├── SelectedPlayerScreen.tsx
│   ├── TruthDareChoiceScreen.tsx
│   ├── CardRevealScreen.tsx
│   └── NextRoundScreen.tsx
├── state/
│   └── GameContext.tsx         # createContext + useReducer + reducer fn + action types + useGameContext hook
├── types/
│   └── index.ts                # barrel: GamePhase, PlayerTouch, Card, GameSettings, GameState, action union
├── App.tsx                     # GameContextProvider wrapper + phase-based screen switch
├── index.css                   # @theme neon tokens (full rewrite, replaces light/dark toggle CSS)
└── main.tsx                    # unchanged — createRoot + StrictMode already correct
vite.config.ts                  # add @tailwindcss/vite + VitePWA() alongside react()
index.html                      # update <title> to PWA short_name
```

### Pattern 1: Tailwind v4 `@theme` neon token block
**What:** A single `@theme { ... }` block in `index.css` defining every color role from PROJECT.md's color table as a `--color-*` custom property, plus glow shadows as `--shadow-*` custom properties.
**When to use:** Once, at the top of `index.css`, replacing the current light/dark `:root` custom-property scheme entirely (per D-01/D-02/D-03 and the code_context note that the existing `@media (prefers-color-scheme: dark)` toggle conflicts with "always dark, no toggle").
**Example:**
```css
/* Source: https://tailwindcss.com/docs/theme, https://tailwindcss.com/docs/functions-and-directives */
@import "tailwindcss";

@theme {
  /* Color tokens -- exact values color-picked from public/images/Screens.png per D-01 */
  --color-background: oklch(0.12 0.03 290);   /* very dark purple/black */
  --color-primary: oklch(0.55 0.25 300);      /* neon purple */
  --color-secondary: oklch(0.65 0.25 340);    /* neon pink */
  --color-accent: oklch(0.65 0.2 240);        /* electric blue */
  --color-highlight: oklch(0.75 0.18 70);     /* gold/orange */
  --color-truth: oklch(0.65 0.2 240);         /* blue */
  --color-dare: oklch(0.6 0.25 350);          /* pink/red */
  --color-success: oklch(0.7 0.2 145);        /* green */
  --color-failure: oklch(0.6 0.24 25);        /* red */
  --color-premium: oklch(0.8 0.15 85);        /* gold/selected */

  /* Glow shadow tokens -- reusable across Phases 2-4 per D-03 */
  --shadow-glow-purple: 0 0 24px 4px oklch(0.55 0.25 300 / 0.6);
  --shadow-glow-pink: 0 0 24px 4px oklch(0.65 0.25 340 / 0.6);
  --shadow-glow-blue: 0 0 24px 4px oklch(0.65 0.2 240 / 0.6);
  --shadow-glow-gold: 0 0 24px 4px oklch(0.75 0.18 70 / 0.6);
}
```
This produces `bg-primary`, `text-primary`, `border-primary`, `shadow-glow-purple`, etc. automatically — no separate utility class definitions needed `[CITED: tailwindcss.com/docs/colors, tailwindcss.com/docs/box-shadow]`. Exact OKLCH values above are placeholders — Claude's discretion (per CONTEXT.md) is to color-pick actual values from `Screens.png`.

### Pattern 2: Context + useReducer state backbone
**What:** Single `GameContext` exposing `{ state: GameState, dispatch: Dispatch<GameAction> }`, created once, provider wraps `<App>`'s children.
**When to use:** Standard for this project — CLAUDE.md and ARCHITECTURE.md both mandate Context+useReducer over Redux/Zustand.
**Example:**
```tsx
// src/state/GameContext.tsx
// Pattern confirmed unchanged for React 19 [CITED: react.dev docs via Context7]
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
Note: React 19 allows `<Context value={...}>` as shorthand for `<Context.Provider value={...}>`; both remain valid — either is acceptable under this project's conventions (functional components, `function` declarations for components).

### Pattern 3: localStorage read-on-init / write-on-change for GameSettings only
**What:** Load `GameSettings` synchronously during `useReducer` initialization (lazy initializer or plain function call), and mirror `state.settings` back to `localStorage` via `useEffect` on every settings change. Per D-09/D-10, only `GameSettings` persists — NOT the full `GameState`.
**When to use:** Exactly once, scoped to the settings slice.
**Example:**
```ts
// src/state/GameContext.tsx (helper functions, colocated or in a small settings-storage.ts)
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
    // localStorage unavailable (private browsing, quota exceeded) -- fail silently, in-memory state still works
  }
}
```
Wire `saveSettings(state.settings)` inside a `useEffect` in the provider keyed on `state.settings`, not on every `state` change (avoids a write on every phase transition). `[CITED: standard React community pattern — Josh Comeau "Persisting React State in localStorage", usehooks-ts source]` `[ASSUMED: exact key name/namespacing — no project precedent found]`.

### Pattern 4: Vite config combining Tailwind + PWA plugins
**What:** Both plugins register alongside `react()` in `vite.config.ts`.
**Example:**
```ts
// vite.config.ts
// Source: https://tailwindcss.com/docs/upgrade-guide (Vite plugin), https://github.com/vite-pwa/vite-plugin-pwa docs
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
        theme_color: '#__NEON_PRIMARY_HEX__', // must match --color-primary token value, D-13
        background_color: '#__BACKGROUND_HEX__',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      devOptions: {
        enabled: true, // allows verifying SW/manifest during `npm run dev`, not just build
      },
    }),
  ],
})
```
`theme_color`/`background_color` hex values must be pulled from the exact `@theme` token values chosen in Pattern 1 (D-13 requires the manifest color to match a locked palette token, not a separate ad-hoc value).

### Anti-Patterns to Avoid
- **Reintroducing `tailwind.config.js`:** Tailwind v4 with `@tailwindcss/vite` reads only CSS `@theme` blocks; a stray `tailwind.config.js` will be silently ignored (or actively conflict if `@config` isn't explicitly referenced). Don't create one.
- **Persisting full `GameState` to localStorage "just in case":** D-10 explicitly scopes persistence to `GameSettings` only. Persisting `phase`/`activePlayer`/`selectedCard` adds hydration complexity (What if `phase: 'cardReveal'` loads with no `selectedCard`? What if `players` array is stale?) that Phase 1 explicitly defers.
- **One-off inline `box-shadow` for glow effects:** D-03 requires glow as reusable `@theme` `--shadow-*` tokens consumed via `shadow-glow-*` utility classes, not ad-hoc inline styles per component — Phases 2-4 depend on this consistency.
- **Building all 7 screens with real gameplay logic:** D-07/D-08 scope screens to minimal placeholders (phase-name heading) — implementing roulette/card-flip/etc. here would violate the phase boundary and create merge conflicts with Phase 2-4 workstreams who own those files next.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Service worker generation / precaching | A hand-written `sw.js` with manual cache logic | `vite-plugin-pwa`'s default `generateSW` strategy (Workbox-based) | Already installed, zero-config, handles cache invalidation/versioning correctly; hand-rolled SW cache-busting is a well-known correctness trap |
| Manifest JSON validity | Hand-written `manifest.webmanifest` static file | `VitePWA({ manifest: {...} })` config object | Plugin validates shape and injects `<link rel="manifest">` + correct MIME type automatically |
| CSS custom-property → utility-class wiring | Manual `.bg-primary { background: var(--color-primary) }` style rules | Tailwind v4 `@theme` `--color-*` tokens | Tailwind auto-generates the full utility set (bg/text/border/ring/etc.) per token; hand-writing loses that coverage and drifts from the rest of the utility system |

**Key insight:** This phase is narrow enough (design tokens + state skeleton + PWA wiring) that the main "don't hand-roll" risk is duplicating what `@tailwindcss/vite` and `vite-plugin-pwa` already do for free. The one thing that legitimately *should* be hand-rolled here is the `GameSettings` localStorage sync — it's a ~15-line effect, and pulling in a hook library (`usehooks-ts`, etc.) for a single settings object is unjustified complexity per the project's "no unnecessary dependencies" posture (CLAUDE.md: no UI component libraries, build custom).

## Common Pitfalls

### Pitfall 1: `@theme` values ignored because `@import "tailwindcss"` is missing or ordered wrong
**What goes wrong:** Utility classes like `bg-primary` don't generate, or generate with no styles.
**Why it happens:** Tailwind v4 requires `@import "tailwindcss";` before the `@theme { }` block (or via `@tailwindcss/vite` — the plugin still expects the import so it knows where to inject generated CSS).
**How to avoid:** `index.css` must start with `@import "tailwindcss";` at the very top, immediately followed by `@theme { ... }`. `[CITED: tailwindcss.com/docs/installation]`
**Warning signs:** Utility classes present in JSX render with zero visual effect; browser devtools show the class applied but no matching CSS rule.

### Pitfall 2: `theme_color` / manifest icons drift from actual `@theme` token values
**What goes wrong:** The PWA install prompt / OS chrome shows a color that doesn't match the app's actual neon primary, or a stale favicon-derived icon that looks wrong at 512×512 (SVG rasterized crudely).
**Why it happens:** `theme_color` in `VitePWA({ manifest: {...} })` is a separate hardcoded hex string, disconnected from the CSS `@theme` token — easy to let them drift after a color tweak.
**How to avoid:** Treat the `@theme` token value as the single source of truth; when picking the final hex/OKLCH values from `Screens.png` (D-01), write the resolved hex down once and use it in both `index.css` and `vite.config.ts`'s manifest block (D-13 requirement). Consider a short code comment cross-referencing the two locations.
**Warning signs:** Manifest `theme_color` hex literal doesn't textually match any `--color-*` value in `index.css`.

### Pitfall 3: `virtual:pwa-register/react` hook usage without `workbox-window` installed
**What goes wrong:** TypeScript/build error or runtime failure if the optional React reload-prompt component (`useRegisterSW` from `virtual:pwa-register/react`) is added without its peer dependency.
**Why it happens:** `vite-plugin-pwa` docs note `workbox-window` must be added as a devDependency specifically to use the React virtual module — it is not bundled by `vite-plugin-pwa` itself. `[CITED: github.com/vite-pwa/vite-plugin-pwa/blob/main/docs/frameworks/react.md]`
**How to avoid:** This is genuinely optional for Phase 1's success criteria — PLAT-01 only requires "installable with manifest and service worker," not a live update-toast UI. Skip the reload-prompt component in Phase 1 unless CONTEXT.md is revisited; if a future phase adds it, install `workbox-window` first.
**Warning signs:** Import error for `virtual:pwa-register/react` at build time.

### Pitfall 4: `pwaAssets` auto-icon-generation implies a dependency not in package.json
**What goes wrong:** Following a "generate icons automatically from one source SVG" tutorial pattern (`pwaAssets: { image: 'public/favicon.svg' }`) fails because it requires the separate `@vite-pwa/assets-generator` package, which is not installed.
**Why it happens:** `vite-plugin-pwa`'s `pwaAssets` config option is a convenience wrapper around a separate generator package; docs examples show it inline but it's an additional install.
**How to avoid:** D-12 already scopes this to manual rasterization ("rasterize the existing `public/favicon.svg` up to 192×192 and 512×512 PNGs as manifest icon stand-ins") — don't reach for `pwaAssets` automation. Produce the two PNGs via any raster tool/script and reference them as static `icons[]` entries (Pattern 4 example above), avoiding the extra dependency entirely.
**Warning signs:** Build fails resolving `@vite-pwa/assets-generator` or similar when `pwaAssets` config key is used.

### Pitfall 5: Persisting settings on every keystroke without considering write frequency
**What goes wrong:** Not a correctness bug at this small scale, but a code-smell if the `useEffect` dependency array is too broad (e.g., depends on the whole `state` object instead of `state.settings`), causing unnecessary localStorage writes on every phase transition.
**Why it happens:** Easy to write `useEffect(() => saveSettings(state.settings), [state])` instead of `[state.settings]`.
**How to avoid:** Scope the effect's dependency array precisely to `state.settings` (or better, keep settings in a narrower piece of state / separate `useReducer` slice if state shape allows). `[ASSUMED: general React best practice, not project-specific]`
**Warning signs:** localStorage write triggered by unrelated actions like `SELECT_PLAYER` or `NEXT_ROUND`.

## Code Examples

### Type skeleton (src/types/index.ts)
```typescript
// All shared types in a single barrel file per CONVENTIONS.md
// No enums (erasableSyntaxOnly) -- const objects + union types instead

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

// Action union for the reducer -- covers exactly the 6 actions in D-05
export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'SELECT_PLAYER'; payload: PlayerTouch }
  | { type: 'CHOOSE_TRUTH_OR_DARE'; payload: CardType }
  | { type: 'PICK_CARD'; payload: Card }
  | { type: 'VOTE'; payload: 'pass' | 'fail' }
  | { type: 'NEXT_ROUND' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GameSettings> }
```
`[ASSUMED: exact field names/shapes — CONTEXT.md and ARCHITECTURE.md establish the type inventory but not literal field names; this is Claude's discretion territory per D-06's "extendable later" framing]`

### Minimal placeholder screen (per D-07)
```tsx
// src/screens/StartScreen.tsx
function StartScreen() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background text-primary">
      <h1 className="text-4xl font-bold">start</h1>
    </main>
  )
}

export default StartScreen
```
Repeat per screen with its own phase-name string; `[ASSUMED: content is Claude's discretion per D-07 note — "just a phase-name heading or includes a back-to-start dev affordance"]`.

### App.tsx phase router
```tsx
// src/App.tsx -- full rewrite, replaces default Vite template
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
      return null // exhaustive per noFallthroughCasesInSwitch -- TS narrows state.phase to never here
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

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| `tailwind.config.js` (JS-based theme config) | CSS-native `@theme` directive | Tailwind v4 (2025) | No JS config file at all for this project; theme lives entirely in `index.css` |
| `@tailwind base/components/utilities` directives | `@import "tailwindcss";` | Tailwind v4 | Single import line replaces three directives |
| PostCSS-based Tailwind + Vite integration | `@tailwindcss/vite` dedicated plugin | Tailwind v4 | Faster builds, official recommended path for Vite projects `[CITED: tailwindcss.com/docs/upgrade-guide]` |

**Deprecated/outdated:** None specific to this phase beyond the above — all pinned versions in `package.json` are current as of 2026-07-10 (verified against npm registry).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Exact placeholder-screen content (heading-only vs. dev affordance) is Claude's discretion | Code Examples | Low — D-07 explicitly defers this choice; any reasonable minimal implementation satisfies the phase goal |
| A2 | `GameSettings` field names (`difficulty`, `pack`, `timerEnabled`) and localStorage key naming (`truthOrDare:gameSettings`) | Code Examples, Pattern 3 | Low-medium — no literal names are locked in CONTEXT.md/ARCHITECTURE.md; if the planner or a downstream phase expects different field names, a rename is a mechanical fix, not a redesign |
| A3 | Exact OKLCH/hex neon token values in the `@theme` example block are placeholders, not color-picked from `Screens.png` | Pattern 1 | Medium — D-01 requires actual color-picking from the reference image; the planner/implementer MUST replace these placeholder values with real picks, not ship them as-is |
| A4 | `GameAction` union covers exactly 6 action types plus an implicit `UPDATE_SETTINGS` | Code Examples | Low — D-05 names 6 reducer actions explicitly (start, select, choose, pick, vote, next); `UPDATE_SETTINGS` was inferred as necessary to satisfy PLAT-02 but isn't explicitly named in D-05 — confirm during planning it isn't meant to be a `SetupScreen`-local `useState` instead of a dispatched action |

**If this table is empty:** N/A — see entries above; all four are LOW-MEDIUM risk and clearly scoped to Claude's-discretion territory already flagged in CONTEXT.md.

## Open Questions

1. **Exact neon palette hex/OKLCH values**
   - What we know: Color roles are named (PROJECT.md table) and a visual reference exists (`Screens.png`, viewed during this research — dark purple/black backgrounds, magenta/purple primary buttons, pink/magenta secondary, blue for "Truth", pink/red for "Dare", gold coin/crown accents, green checkmark for success, red X/crying-face for failure).
   - What's unclear: Precise hex values require pixel-level color-picking tooling (not available in this research pass — only visual inspection of the rendered image).
   - Recommendation: The planner should include an explicit task step instructing the implementer to open `Screens.png` in an image editor / color picker and extract literal hex values per token role, rather than eyeballing "looks about right" values. The placeholder OKLCH values in Pattern 1 are directionally correct (based on visual inspection) but not pixel-verified.

2. **Whether `UPDATE_SETTINGS` is a reducer action or local `SetupScreen` state**
   - What we know: D-05 names exactly 6 actions (start, select player, choose truth/dare, pick card, vote, next round) and doesn't mention a settings-update action.
   - What's unclear: `SetupScreen` (a placeholder in Phase 1, D-07) will eventually need to write to `GameSettings`. Whether that write happens via `GameContext` dispatch (making it 7 actions total) or is deferred entirely to whichever phase builds the real `SetupScreen` UI.
   - Recommendation: Since Phase 1 only stubs `SetupScreen` with a phase-name heading (no real settings UI yet per D-07), the planner can defer wiring an actual `UPDATE_SETTINGS` dispatch path to the phase that builds real settings UI (Phase 3 per REQUIREMENTS.md CONF-01/02/03) — but the reducer's `GameSettings` shape and localStorage read/write mechanism should still exist now per PLAT-02, even if nothing dispatches into it yet from real UI.

## Environment Availability

Skipped — this phase has no external service/tool dependencies beyond already-installed npm packages (verified above via `npm view`). No database, no CLI tools, no running services required for Phase 1 scope.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-------------------|
| V2 Authentication | No | No auth in this app (PLAT-04, fully client-side, no accounts) |
| V3 Session Management | No | No sessions; in-memory `GameState` only |
| V4 Access Control | No | Single-user-per-device local app, no access boundaries |
| V5 Input Validation | Marginal | `JSON.parse` on localStorage read (Pattern 3) must be wrapped in try/catch — malformed or tampered localStorage content should not crash the app on load |
| V6 Cryptography | No | No secrets, no crypto operations in this phase |
| V9 Communications | No | Fully offline-capable client app; no network calls in Phase 1 scope |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|----------------------|
| Malformed/tampered localStorage JSON (a user or browser extension edits `localStorage` directly) causing `JSON.parse` to throw uncaught | Tampering / DoS (client-side crash) | Wrap `JSON.parse` in try/catch with fallback to `defaultSettings` (Pattern 3 code example already does this) |
| Stale service worker serving outdated app shell after a deploy | — (availability/correctness, not a STRIDE security threat per se) | `registerType: 'autoUpdate'` (Pattern 4) auto-prompts/reloads on new SW activation rather than trapping users on an old cached version |

No injection, auth, or session-related threats apply — this is a static, client-only PWA with no user-generated content persistence beyond a settings object the user's own browser wrote.

## Sources

### Primary (HIGH confidence)
- `npm view tailwindcss version` / `npm view @tailwindcss/vite version` / `npm view vite-plugin-pwa version` / `npm view react version` / `npm view workbox-window version` — direct registry verification, 2026-07-10
- `gsd-tools query package-legitimacy check` — automated legitimacy scan cross-referenced against registry signals

### Secondary (MEDIUM confidence)
- Context7 `/websites/tailwindcss` — `@theme` directive syntax, `--color-*`/`--shadow-*` token patterns, Vite plugin installation (https://tailwindcss.com/docs/theme, /docs/functions-and-directives, /docs/colors, /docs/box-shadow, /docs/upgrade-guide)
- Context7 `/vite-pwa/vite-plugin-pwa` — manifest shape, `registerType`, `devOptions.enabled`, React `useRegisterSW` hook + `workbox-window` peer dependency, icon requirements (https://github.com/vite-pwa/vite-plugin-pwa/blob/main/docs/guide/pwa-minimal-requirements.md, /docs/guide/auto-update.md, /docs/guide/development.md, /docs/frameworks/react.md)
- Direct visual inspection of `public/images/Screens.png` (24-screen UI kit) — confirms color-role placement (dark background, purple/pink primary/secondary buttons, blue Truth / pink Dare, gold accents on selection/crown/coin, green success / red failure) though exact hex values not extracted at pixel level in this pass

### Tertiary (LOW confidence)
- WebSearch: React `useLocalStorage` custom hook pattern (lazy `useState` init + `useEffect` write) — general community consensus pattern, not project-specific, cross-checked against multiple independent sources (Josh Comeau, usehooks-ts, dev.to) converging on the same shape `[CITED via WebSearch aggregation]`

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified live against npm registry, matches STACK.md exactly
- Architecture: HIGH — Context+useReducer pattern confirmed unchanged for React 19 via Context7; phase-router pattern already fully specified in ARCHITECTURE.md
- Pitfalls: MEDIUM — Tailwind/PWA pitfalls sourced from official docs; localStorage write-scoping pitfall is general best practice, not doc-verified
- Palette exact values: LOW — visual inspection only, no pixel-level color extraction performed (flagged as Open Question 1 and Assumption A3)

**Research date:** 2026-07-10
**Valid until:** 2026-08-09 (30 days — Tailwind v4 and vite-plugin-pwa are active-development packages; re-verify versions if planning is delayed)
