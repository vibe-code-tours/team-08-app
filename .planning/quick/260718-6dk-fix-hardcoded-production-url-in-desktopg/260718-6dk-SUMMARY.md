---
phase: 260718-6dk-fix-hardcoded-production-url-in-desktopg
plan: 01
subsystem: ui
tags: [react, vite, qrcode, desktop-gate]

# Dependency graph
requires:
  - phase: 260718-51q (issue #81 — desktop gate)
    provides: DesktopGateScreen component with QR-to-mobile handoff
provides:
  - DesktopGateScreen QR target URL derived dynamically from window.location.origin + import.meta.env.BASE_URL
affects: [desktop-gate, pwa-deploy]

# Tech tracking
tech-stack:
  added: []
  patterns: [compute environment-derived URLs at effect-run time instead of hardcoding, keep single source of truth with vite.config.ts base path]

key-files:
  created: []
  modified: [src/screens/DesktopGateScreen.tsx]

key-decisions:
  - "Used window.location.origin + import.meta.env.BASE_URL instead of a new env var, so the QR target stays tied to vite.config.ts's base path with no manual duplication"
  - "No dev/prod special-casing — localhost resolution during npm run dev is expected and accepted"

patterns-established:
  - "Pattern: derive deploy-target URLs from window.location + import.meta.env.BASE_URL rather than hardcoding a domain string"

requirements-completed: []

coverage:
  - id: D1
    description: "QR code target URL in DesktopGateScreen is computed dynamically from window.location.origin + import.meta.env.BASE_URL instead of a hardcoded production domain string"
    verification:
      - kind: unit
        ref: "npx tsc --noEmit -p tsconfig.app.json"
        status: pass
      - kind: unit
        ref: "npx eslint src/screens/DesktopGateScreen.tsx"
        status: pass
      - kind: integration
        ref: "npm run build (validates import.meta.env.BASE_URL usage compiles in production build)"
        status: pass
    human_judgment: false

# Metrics
duration: 4min
completed: 2026-07-18
status: complete
---

# Quick Task 260718-6dk: Fix hardcoded production URL in DesktopGateScreen Summary

**Replaced the hardcoded `PRODUCTION_URL` constant in `DesktopGateScreen.tsx` with a dynamically computed QR target URL built from `window.location.origin + import.meta.env.BASE_URL`.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-07-17T20:34:00Z
- **Completed:** 2026-07-17T20:38:05Z
- **Tasks:** 1 completed
- **Files modified:** 1

## Accomplishments
- Removed the module-level `PRODUCTION_URL` constant (`https://vibecode.tours/team-08-app/`)
- QR code target is now computed inside the `useEffect` as `window.location.origin + import.meta.env.BASE_URL`, evaluated at effect-run time so it reflects the live deploy origin
- No behavior change to any other logic in the component (cancelled-flag cleanup, catch handler, JSX all untouched)

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace hardcoded PRODUCTION_URL with dynamic origin + BASE_URL** - `f1c246c` (fix)

**Plan metadata:** pending (docs commit handled separately by orchestrator)

## Files Created/Modified
- `src/screens/DesktopGateScreen.tsx` - Removed hardcoded `PRODUCTION_URL` constant; QR target now derived from `window.location.origin + import.meta.env.BASE_URL` inside the effect

## Decisions Made
- Used `window.location.origin + import.meta.env.BASE_URL` rather than introducing a new environment variable — keeps the QR target tied to `vite.config.ts`'s `base: '/team-08-app/'` with no manual duplication and no compiler-unenforced link
- No dev/prod conditional branching added — resolving to `localhost` during `npm run dev` is expected and accepted per the plan

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `src/screens/DesktopGateScreen.tsx` no longer contains any hardcoded production domain string
- `npm run lint && npm run test && npm run build` all pass
- No blockers or concerns

---
*Phase: 260718-6dk-fix-hardcoded-production-url-in-desktopg*
*Completed: 2026-07-18*

## Self-Check: PASSED

- FOUND: src/screens/DesktopGateScreen.tsx
- FOUND: .planning/quick/260718-6dk-fix-hardcoded-production-url-in-desktopg/260718-6dk-SUMMARY.md
- FOUND: f1c246c (task commit)
