# Technology Stack Inventory

> Generated from source files, configs, and lockfile analysis.

---

## Runtime

- **Node.js version:** 24 (CI uses `actions/setup-node@v4` with `node-version: "24"`)
- **Module system:** ESM (`"type": "module"` in package.json)
- **Browser target:** ES2023 (TypeScript `target: "es2023"`, `lib: ["ES2023", "DOM"]`)
- **No engine restrictions** declared in package.json

---

## Framework and Core Libraries

| Library | Version (range) | Role |
|---|---|---|
| React | `^19.2.7` | UI framework |
| React DOM | `^19.2.7` | DOM renderer |

- **Render method:** `createRoot` (React 18+ concurrent API)
- **StrictMode:** enabled in `src/main.tsx`
- **No router library** installed (single-page with screen-based flow managed in `GameContext`)
- **No state management library** beyond React Context (`src/state/GameContext.tsx`)

---

## Build Toolchain

| Tool | Version (range) | Purpose |
|---|---|---|
| Vite | `^8.1.1` | Dev server and bundler |
| @vitejs/plugin-react | `^6.0.3` | React fast-refresh / JSX transform |
| TypeScript | `~6.0.2` | Static type checking |
| vite-plugin-pwa | `^1.3.0` | PWA service worker + manifest generation |

**Build command:** `tsc -b && vite build` (type-check then bundle)
**Dev command:** `vite` (native ESM dev server with HMR)

### Vite Configuration

- Minimal config in `vite.config.ts` -- only the `react()` plugin, no custom aliases, proxy, or build overrides.

### TypeScript Configuration

The project uses a **project references** setup with two configs:

**tsconfig.json** (root) -- references only, no compiler options:
- `tsconfig.app.json` (for `src/`)
- `tsconfig.node.json` (for `vite.config.ts`)

**tsconfig.app.json** (application code):
- `target: "es2023"`, `lib: ["ES2023", "DOM"]`
- `module: "esnext"`, `moduleResolution: "bundler"`
- `jsx: "react-jsx"`
- `verbatimModuleSyntax: true`
- `noEmit: true` (Vite handles bundling)
- `erasableSyntaxOnly: true`
- Strict linting options: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- Includes: `src/`

**tsconfig.node.json** (tooling config):
- `target: "es2023"`, `lib: ["ES2023"]`
- `module: "nodenext"`, `types: ["node"]`
- `noEmit: true`
- Includes: `vite.config.ts`

---

## Testing Framework and Libraries

| Tool | Version (range) | Role |
|---|---|---|
| Vitest | `^3.2.7` | Test runner |
| @vitest/ui | `^3.2.7` | Visual test UI |
| jsdom | `^27.0.1` | Browser environment simulation |
| @testing-library/react | `^16.3.2` | React component testing utilities |
| @testing-library/jest-dom | `^6.9.1` | Custom DOM matchers |

**Vitest config** (`vitest.config.ts`):
- `environment: 'jsdom'`
- `setupFiles: ['./src/test-setup.ts']` (imports `@testing-library/jest-dom/vitest`)
- `css: true` (CSS modules processed in tests)
- Uses `@vitejs/plugin-react` for JSX in test files

**Test command:** `vitest run` (single run, no watch mode)

---

## Linting and Code Quality

| Tool | Version (range) | Role |
|---|---|---|
| ESLint | `^10.6.0` | Core linter |
| @eslint/js | `^10.0.1` | ESLint recommended rules |
| typescript-eslint | `^8.62.0` | TypeScript-aware linting rules |
| eslint-plugin-react-hooks | `^7.1.1` | React hooks rules of exhuastive deps |
| eslint-plugin-react-refresh | `^0.5.3` | Validates React Fast Refresh compatibility |

**ESLint config** (`eslint.config.js` -- flat config format):
- `globalIgnores(['dist'])`
- Files: `**/*.{ts,tsx}`
- Extends: `js.configs.recommended`, `tseslint.configs.recommended`, `reactHooks.configs.flat.recommended`, `reactRefresh.configs.vite`
- `languageOptions.globals: globals.browser`
- No custom rules overrides

**Lint command:** `eslint .`

---

## PWA Configuration

- **Plugin:** `vite-plugin-pwa ^1.3.0`
- **Status:** Plugin is listed as a devDependency but is **not currently wired** into `vite.config.ts`. The Vite config only loads `react()`. PWA features (manifest, service worker, icons) are not yet configured.
- **Target behavior** (per README): installable, offline-capable PWA

---

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

---

## Deployment

- **Target:** Netlify (per README)
- **PR previews:** enabled on every pull request
- **No Netlify config file** (`netlify.toml`) present in repo -- likely configured via Netlify dashboard or planned

---

## Package Manager

- **npm** (lockfileVersion 3 in `package-lock.json`)
- No `yarn.lock`, `pnpm-lock.yaml`, or `bun.lockb` present
