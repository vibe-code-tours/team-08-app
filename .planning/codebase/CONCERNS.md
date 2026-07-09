# CONCERNS.md — Technical Concerns, Risks, and Improvement Areas

> Generated: 2026-07-09
> Project: Truth/Dare Finger Roulette (team-08-app)

---

## 1. Critical: Zero Core Implementation

This is the single most important finding. The project has scaffolding and tooling in place, but **none of the actual game logic has been implemented**.

### Empty files (0 bytes, 0 lines of code)

| File | Purpose (per CLAUDE.md) |
|---|---|
| `src/state/GameContext.tsx` | Game state management, settings, active touches |
| `src/hooks/useMultiTouch.ts` | Multi-touch tracking keyed by `touch.identifier` |
| `src/data/cards.ts` | Static Truth/Dare card data, filtered by pack/difficulty |
| `src/types/index.ts` | `Card`, `GameState`, `GameSettings`, `PlayerTouch` types |

### Missing directories

- `src/screens/` does not exist. CLAUDE.md states it should contain "one file per screen" matching the flow: Start, Setup, Touch Selection, Selected Player, Truth/Dare choice, Card Reveal, Next Round. **None of these 7 screens have been created.**

### App.tsx is still the Vite starter template

`src/App.tsx` is the default Vite boilerplate (counter button, React/Vite logo, documentation links). It has not been replaced with any game UI. The `App.test.tsx` test asserts `'Get started'` text, which matches the starter -- not the game.

---

## 2. Documentation Gaps

### Referenced file does not exist

`CLAUDE.md` line 5 references `docs/multitouch-spike-result.md` for multi-touch spike findings. This file does not exist anywhere in the repository. The technical learning documented in CLAUDE.md ("key by `touch.identifier`, never array index") has no source to point to.

### ARCHITECTURE.md is still a template

`docs/ARCHITECTURE.md` contains unfilled template placeholders:
- `{{PROJECT_NAME}}` in the title
- Generic `[ frontend ] --> [ backend ] --> [ data ]` diagram instead of the actual Vite/React/PWA architecture
- Empty "What it does" section
- Generic "Where things live" table referencing `src/` or `app/` instead of the actual structure

### LICENSE is unfilled

`LICENSE` contains `{{YEAR}}` and `{{TEAM_OR_AUTHOR}}` placeholders.

### working-agreement.md is unfilled

`working-agreement.md` contains `{{PROJECT_NAME}}` and empty role assignments.

### README placeholders

- `README.md` line 7: `<!-- A screenshot or GIF of the app goes here -->`
- Team table: `_fill in_` for both Anchor and Reviewer roles
- Board link: `_link your GitHub Project here_`

---

## 3. PWA Configuration Gaps

`vite-plugin-pwa` is listed as a devDependency in `package.json`, but:

- **`vite.config.ts` does not import or configure the PWA plugin.** It only imports `@vitejs/plugin-react`. The plugin is installed but unused.
- **No `manifest.json` or `manifest.webmanifest` exists** in `public/`.
- **No PWA icons** (192x192, 512x512 PNG) exist in `public/`. The only icon is `favicon.svg` (the Vite lightning bolt).
- **`index.html` title** is still `"team-08-app"` instead of the game name.
- `index.html` references `/favicon.svg` which exists but is the Vite logo, not a game icon.

For a "mobile-first PWA party game" (per README), the PWA configuration is completely non-functional.

---

## 4. Test Coverage

### Only one test exists

`src/App.test.tsx` contains a single smoke test that renders the starter template and asserts `'Get started'` is in the document. This test will break as soon as App.tsx is replaced with actual game code.

### No tests for planned core logic

- No test file for `GameContext` (state management)
- No test file for `useMultiTouch` (the hook CLAUDE.md warns is tricky)
- No test file for card data filtering
- No test file for any screen component

### Vitest config is ready but unused

`vitest.config.ts` is properly configured with jsdom environment and setup file. The test infrastructure is ready; it just has nothing to test.

---

## 5. CI/CD Concerns

### False-positive green builds

In `.github/workflows/ci.yml`:
- `npm run lint --if-present` will succeed even if the lint script is missing or has errors that don't cause non-zero exit.
- `npm test --if-present` will pass silently when there are no meaningful tests.

The pipeline is green but does not reflect actual code quality.

### Security scans are advisory-only

Both jobs in `security.yml` use `continue-on-error: true`. This is documented as intentional ("report-only, enforce later"), but if enforcement is never enabled, security findings will be perpetually ignored.

### No typecheck step in CI

The CI workflow runs `lint`, `test`, and `build` but has no explicit `tsc --noEmit` step. Type errors may surface during `build` (since `npm run build` runs `tsc -b && vite build`), but a separate typecheck step would provide clearer failure messages.

---

## 6. Configuration and Tooling Gaps

### No `engines` field in package.json

There is no `engines` field specifying the required Node.js version. CI uses Node 24, but local developers have no guardrail.

### No `browserslist` in package.json

For a mobile-first PWA that uses multi-touch APIs, there is no explicit browser target definition. The TypeScript target is `es2023` but there is no `browserslist` to guide CSS autoprefixing or Babel transforms.

### No path aliases

`tsconfig.app.json` does not configure path aliases. Imports between `src/state/`, `src/hooks/`, `src/screens/`, etc. will use relative paths like `../../state/GameContext`, which becomes unwieldy as the project grows.

### No formatter configured

No Prettier or equivalent is set up. The ESLint config does not include formatting rules. Teams working on this will need to agree on formatting manually.

### No pre-commit hooks

No Husky, lint-staged, or equivalent. Developers can commit unlinted, untested code without guardrails beyond CI.

### No `format` or `typecheck` npm scripts

`package.json` only has `dev`, `build`, `lint`, `preview`, and `test`. Missing:
- `format` / `format:check` (for Prettier or equivalent)
- `typecheck` (for `tsc --noEmit`, separate from build)

---

## 7. Gitignore Gaps

`.gitignore` covers the basics but is missing:

- `.env.local` / `.env.*.local` patterns (the `.env.*` pattern is present but overly broad -- `.env.development.local` is a common Vite convention)
- `*.tsbuildinfo` (TypeScript build cache files, generated in `node_modules/.tmp/`)
- `.eslintcache`

These are minor but can cause confusion for contributors.

---

## 8. Risk: Cutting-Edge Dependency Versions

The project uses bleeding-edge versions of nearly every dependency:

| Dependency | Version | Risk |
|---|---|---|
| TypeScript | ~6.0.2 | TS 6.x is very recent; ecosystem tooling may lag |
| Vite | ^8.1.1 | Vite 8 is recent; plugin compatibility may be limited |
| React | ^19.2.7 | React 19 is recent; some libraries may not yet support it |
| ESLint | ^10.6.0 | ESLint 10 is recent |
| jsdom | ^27.0.1 | Major version jump |

There are no `engines` constraints or lockfile audit, so Dependabot may propose further bumps without guardrails.

---

## 9. Security Concerns

### .env.example is not readable in current environment

The `.env.example` file exists but its contents could not be verified. If it contains actual placeholder keys or reveals expected API patterns, it should be reviewed.

### No Content Security Policy

`index.html` has no CSP meta tag. For a PWA that will be installed on devices, a CSP would help prevent XSS.

### No SRI (Subresource Integrity)

No external resources are loaded in `index.html`, so this is not currently an issue, but it should be considered if CDN resources are added later.

---

## 10. Browser Compatibility and Touch Handling Risks

### Multi-touch is hardware/OS-dependent

CLAUDE.md explicitly warns: "Hardware/OS may cap simultaneous touches before events reach the browser." This is documented as a known limitation but has no mitigation plan:
- No feature detection for max simultaneous touches
- No user-facing feedback when hardware limits are hit
- No fallback for devices that support fewer than expected touches

### No browser compatibility matrix

There is no documentation of which browsers/devices are supported. For a touch-based party game, this matters:
- iOS Safari has specific touch event quirks
- Android Chrome handles multi-touch differently
- Some older devices limit to 2-5 simultaneous touch points

### `touch-action` CSS not configured

For multi-touch games, `touch-action: none` on the touch area is critical to prevent browser gestures (pinch-zoom, swipe-to-navigate) from intercepting touch events. This has not been addressed.

---

## 11. Accessibility Concerns

A touch-only party game presents significant accessibility challenges:

- **No keyboard alternative**: The core mechanic (multiple fingers on screen) has no keyboard equivalent.
- **No screen reader support**: No ARIA labels, live regions, or semantic structure for game state changes.
- **No reduced-motion support**: No `prefers-reduced-motion` media query.
- **No high-contrast mode**: Only `prefers-color-scheme: dark` is handled.
- **No alternative input**: No way to play with a stylus, switch device, or voice input.

These may be acceptable for a party game MVP, but should be tracked as known debt.

---

## 12. Performance Considerations

### Touch event handling

- No mention of passive event listeners (`{ passive: true }`) for touch events, which allows the browser to scroll/zoom without waiting for JS.
- No `requestAnimationFrame` batching planned for touch move events.
- No debounce/throttle strategy documented for rapid touch sequences.

### No code splitting planned

`App.tsx` imports everything in one file. As screens are added, lazy loading (`React.lazy`) should be considered to avoid loading all 7 screens at startup.

---

## 13. Recommended Priority Order

1. **Define types** (`src/types/index.ts`) -- everything else depends on this
2. **Create `GameContext`** -- state management is the backbone
3. **Create `useMultiTouch` hook** -- the core differentiator
4. **Populate card data** (`src/data/cards.ts`)
5. **Create screens** (`src/screens/`) -- one per flow step
6. **Wire up PWA config** in `vite.config.ts`
7. **Add error boundaries** around game screens
8. **Replace starter App.tsx** with game shell/router
9. **Fill documentation** (ARCHITECTURE.md, LICENSE, working-agreement.md)
10. **Add tests** for GameContext, useMultiTouch, card filtering
11. **Add `touch-action: none`** and passive event listeners
12. **Set up formatting** and pre-commit hooks

---

## Summary

The project is a well-tooled skeleton with CI, security scanning, Dependabot, and a test runner -- but zero game implementation. Every source file that matters (types, state, hook, data, screens) is either empty or non-existent. The `App.tsx` is still the Vite starter. The PWA plugin is installed but unconfigured. Documentation has unfilled template placeholders. The team has a strong foundation to build on, but the work ahead is creating the actual application from scratch.