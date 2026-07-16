# Coding Conventions — Truth/Dare Finger Roulette

## Component Patterns

- **Functional components only** — all components use the `function` declaration syntax (not arrow functions).
- **No class components** — React 19.x with hooks throughout.
- **One component per file** — each screen and component lives in its own file.
- **Default exports** for components (`export default App`); named exports for utilities and configs.
- **Props** will be defined via `type` or `interface` in the `src/types/` directory (not inline prop destructuring). The project follows a pattern of co-locating type definitions.

```tsx
// Preferred component shape
function ComponentName() {
  // hooks at the top
  // handlers
  // render
}
export default ComponentName
```

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

**Note:** `strict: true` is NOT explicitly enabled. The project relies on individual strict flags.

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

The observed pattern (no ESLint import sort rule enforced):

1. React / third-party library imports
2. Local asset imports (images, SVGs)
3. CSS imports (co-located `.css` files)
4. Relative path imports (components, hooks, types)

Explicit `.tsx` extension is used when importing TypeScript files directly (e.g., `import App from './App.tsx'` in `main.tsx`).

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

```
1. Imports (external, then local, then CSS)
2. Type/interface definitions (if small and file-specific)
3. Component function body
   - Hooks at the top
   - Derived state / computed values
   - Event handlers
   - Render (JSX return)
4. Default export at the bottom
```

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
