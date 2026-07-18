# Truth/Dare Finger Roulette — Project Context

## Stack
Vite + React + TypeScript + vite-plugin-pwa. Vitest for tests, ESLint for lint.

## Architecture
See docs/ARCHITECTURE.md for the diagram. Flow:
Start → Finger Selection → Roulette → Player Selected → Truth/Dare choice → Card Reveal → Next Round

## Key technical learnings (don't relearn these)
- Multi-touch tracking MUST key by `touch.identifier`, never array index — 
  see docs/spikes/multitouch-spike-2026-07.md for spike findings.
- Hardware/OS may cap simultaneous touches before events reach the browser;
  don't chase "missed finger" bugs that aren't reproducible in JS event logs.
- Non-touch device detection (`useTouchCapability`) uses feature detection ONLY
  (`'ontouchstart' in window` OR `navigator.maxTouchPoints > 0`) — never user-agent sniffing.
- The desktop gate (`DesktopGateScreen`) fires only on the finger-selection and roulette
  phases — the only screens that require touch input (they drive `useMultiTouch`).
  Later phases (player-selected, truth-dare-choice, card-reveal, voting, result,
  next-round) are onClick-driven and work fine with a mouse, so the gate does not
  cover them. It never fires on intro/setup, and offers a session-scoped
  "Continue anyway" escape hatch.
- PWA navigation requests must use `NetworkFirst` (never cache-first), and
  `VitePWA` must use `registerType: 'prompt'` — NOT `'autoUpdate'`.
  `'autoUpdate'` bakes an unconditional `window.location.reload()` into
  vite-plugin-pwa's generated register code and never calls `onNeedRefresh`,
  silently reloading any open tab and making a tap-to-reload toast
  unreachable dead code (confirmed via local build+preview testing). Pair
  `registerType: 'prompt'` with `clientsClaim: true` in the workbox config
  (no `skipWaiting: true` — that also forces immediate self-activation,
  skipping the `waiting` state the prompt depends on) and a tap-to-reload
  `UpdateToast` (via `useRegisterSW` from `virtual:pwa-register/react`), so a
  new deploy reaches users promptly on the next fresh navigation without
  silently interrupting an in-progress game round. GitHub Pages gives no
  server-side Cache-Control control, so this fix lives entirely at the
  service-worker layer.

## Folder conventions
- src/screens/       — one file per screen, matches the flow above
- src/state/          — GameContext.tsx holds GameState
- src/data/cards.ts   — static Card[] data, filtered by pack/difficulty/type
- src/hooks/useMultiTouch.ts — multi-touch tracking hook (fully implemented)
- src/types/          — Card, GameState, PlayerTouch, GameSettings, Difficulty, CardPack, CardType, PLAYER_COLORS

## Workflow
- One GitHub issue = one focused Claude Code session = one PR.
- Never push to main directly — branch protection requires PR + review.
- Run `npm run lint && npm run test && npm run build` before opening a PR.