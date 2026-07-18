---
phase: quick-260718-vh0
plan: 01
subsystem: infra
tags: [pwa, vite-plugin-pwa, workbox, service-worker, react, vitest]

requires: []
provides:
  - "workbox config with skipWaiting + clientsClaim + NetworkFirst navigation caching + CacheFirst asset caching"
  - "tap-to-reload UpdateToast component wired to virtual:pwa-register/react"
  - "test-time alias resolving virtual:pwa-register/react so vitest doesn't need the VitePWA plugin"
  - "ADR 0002 documenting the PWA update strategy"
affects: [pwa, deployment, service-worker, testing]

tech-stack:
  added: []
  patterns:
    - "workbox runtimeCaching split by request.mode/destination (NetworkFirst for navigation, CacheFirst for hashed static assets)"
    - "virtual:pwa-register/react virtual module aliased to a local stub in vitest.config.ts for tests, since the VitePWA plugin (which owns the module) is build/dev-only and not loaded by vitest"

key-files:
  created:
    - src/vite-env.d.ts
    - src/components/UpdateToast.tsx
    - docs/decisions/0002-pwa-update-strategy.md
    - src/test-mocks/pwa-register-react.ts
  modified:
    - vite.config.ts
    - src/App.tsx
    - CLAUDE.md
    - vitest.config.ts

key-decisions:
  - "skipWaiting + clientsClaim activate a new service worker immediately instead of leaving it in the waiting state until all tabs close"
  - "NetworkFirst (3s timeout) for navigation requests; CacheFirst for content-hashed static assets"
  - "Tap-to-reload UpdateToast, not a silent auto-reload, to avoid interrupting a live game round"
  - "virtual:pwa-register/react is aliased to a local stub in vitest.config.ts rather than adding the VitePWA plugin to the test config, keeping the test environment lightweight"

patterns-established:
  - "Test-time aliasing of Vite virtual modules owned by build-only plugins: point resolve.alias at a small local stub file instead of loading the full plugin in vitest.config.ts"

requirements-completed: [QUICK-260718-vh0]

coverage:
  - id: D1
    description: "workbox block (skipWaiting, clientsClaim, navigateFallback, NetworkFirst navigation + CacheFirst asset runtimeCaching) added to VitePWA config"
    requirement: "QUICK-260718-vh0"
    verification:
      - kind: unit
        ref: "npm run build (dist/sw.js generated with skipWaiting, clientsClaim, cacheName:\"pages\" NetworkFirst, cacheName:\"assets\" CacheFirst)"
        status: pass
    human_judgment: false
  - id: D2
    description: "UpdateToast component shows tap-to-reload prompt via useRegisterSW, mounted once in App.tsx outside the screen router"
    requirement: "QUICK-260718-vh0"
    verification:
      - kind: unit
        ref: "npm run build (type-checks against virtual:pwa-register/react) + npm run test (App.test.tsx renders App including UpdateToast without error)"
        status: pass
    human_judgment: false
  - id: D3
    description: "CLAUDE.md learnings bullet and ADR 0002 documenting the PWA update strategy"
    verification: []
    human_judgment: true
    rationale: "Documentation content quality/accuracy is a judgment call, not something a test asserts."

duration: ~6min
completed: 2026-07-18
status: complete
---

# Quick Task 260718-vh0: Fix PWA update/cache staleness Summary

**Workbox NetworkFirst navigation caching (3s timeout) + skipWaiting/clientsClaim + a tap-to-reload UpdateToast, so new GitHub Pages deploys land on the next fresh navigation instead of only after all tabs close.**

## Performance

- **Duration:** ~6 min
- **Tasks:** 3
- **Files modified:** 8 (4 created, 4 modified)

## Accomplishments
- Added a `workbox` block to the existing `VitePWA({...})` call: `skipWaiting: true`, `clientsClaim: true`, `navigateFallback: '/team-08-app/index.html'`, and a two-entry `runtimeCaching` array (NetworkFirst for navigation requests with a 3s timeout, CacheFirst for script/style/image/font assets).
- Created `src/vite-env.d.ts` with `vite/client` and `vite-plugin-pwa/react` triple-slash type references so `virtual:pwa-register/react` type-checks under `verbatimModuleSyntax`.
- Created `UpdateToast` component (`useRegisterSW` from `virtual:pwa-register/react`) that shows a tap-to-reload prompt — never a silent auto-reload — mounted once in `App.tsx` alongside `SettingsButton`, outside the phase-based screen router.
- Added a CLAUDE.md learnings bullet and `docs/decisions/0002-pwa-update-strategy.md` (Y-statement ADR) documenting the strategy and the GitHub Pages constraint that forced an SW-layer-only fix.
- Fixed a test-time blocker: `virtual:pwa-register/react` is a Vite virtual module owned by the VitePWA plugin, which `vitest.config.ts` doesn't load — aliased the specifier to a small local stub (`src/test-mocks/pwa-register-react.ts`) so `App.test.tsx` (which renders `App` -> `UpdateToast`) resolves cleanly.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add workbox config + PWA register type reference** - `bdd8031` (feat)
2. **Task 2: Create UpdateToast and mount it in App** - `a383f32` (feat)
3. **Task 3: Document learning + ADR, then full verify** - `34b492c` (docs)

_Plan metadata commit handled by the orchestrator, not this executor (per constraints)._

## Files Created/Modified
- `vite.config.ts` - Added `workbox` block inside the existing `VitePWA({...})` call
- `src/vite-env.d.ts` - New file; `vite/client` + `vite-plugin-pwa/react` type references
- `src/components/UpdateToast.tsx` - New tap-to-reload toast component using `useRegisterSW`
- `src/App.tsx` - Imports and mounts `<UpdateToast />` once, outside the screen router
- `CLAUDE.md` - New learnings bullet on PWA NetworkFirst navigation caching + tap-to-reload UX
- `docs/decisions/0002-pwa-update-strategy.md` - New ADR documenting the update strategy
- `vitest.config.ts` - Added `resolve.alias` mapping `virtual:pwa-register/react` to a test stub
- `src/test-mocks/pwa-register-react.ts` - New test-time stub for `useRegisterSW`

## Decisions Made
- `skipWaiting`/`clientsClaim` chosen over the default "wait for all tabs to close" behavior so a deploy is picked up on the very next fresh navigation.
- `NetworkFirst` (not `NetworkOnly` or `CacheFirst`) for navigation requests, with a 3s network timeout, balances freshness against offline usability via `navigateFallback`.
- Tap-to-reload UX (not silent auto-reload) was an explicit plan requirement — reloading mid-round would be disruptive to a live game.
- Test alias over adding the VitePWA plugin to `vitest.config.ts`: keeps the test config lightweight and avoids generating a real service worker during test runs.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] vitest couldn't resolve `virtual:pwa-register/react`**
- **Found during:** Task 3 (`npm run test` step of the final verify)
- **Issue:** `virtual:pwa-register/react` is a Vite virtual module only resolved by the VitePWA plugin (loaded in `vite.config.ts`, build/dev only). `vitest.config.ts` uses its own separate Vite config that doesn't load VitePWA, so `App.test.tsx` (which renders `App` -> `UpdateToast`) failed with "Failed to resolve import" and the whole suite file errored.
- **Fix:** Added `resolve.alias` in `vitest.config.ts` mapping the virtual specifier to a new local stub file (`src/test-mocks/pwa-register-react.ts`) implementing `useRegisterSW` with inert defaults (`needRefresh: [false, noop]`, etc.). (A first attempt using `vi.mock('virtual:pwa-register/react', ...)` in `test-setup.ts` did not intercept the import before Vite's resolver failed, so the alias approach was used instead — no `vi.mock` remains in `test-setup.ts`.)
- **Files modified:** `vitest.config.ts`, `src/test-mocks/pwa-register-react.ts` (new)
- **Verification:** `npm run test` — all 4 test files / 21 tests pass (previously 1 file failed to load, 18 tests ran in the other 3 files).
- **Committed in:** `34b492c` (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary for the plan's own final verification step (`npm run lint && npm run test && npm run build`) to pass. No scope creep — the plan's specified files (CLAUDE.md, ADR) were also delivered in the same commit.

## Issues Encountered
- `git status --short` shows several pre-existing untracked paths (`.claude/agents/`, `.claude/skills/`, `docs/presentation/`, `docs/templates/`) unrelated to this task — left untouched per scope boundary.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- PWA update flow is ready to verify against a real GitHub Pages deploy: after merge, a subsequent deploy should surface the `UpdateToast` on the next fresh navigation within ~3s (online) instead of requiring all tabs to close.
- No blockers for follow-on work.

---
*Phase: quick-260718-vh0*
*Completed: 2026-07-18*

## Self-Check: PASSED

All 8 created/modified files found on disk; all 3 task commits (`bdd8031`, `a383f32`, `34b492c`) found in `git log --oneline --all`.
