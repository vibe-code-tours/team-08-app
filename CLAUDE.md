# Truth/Dare Finger Roulette — Project Context

## Stack
Vite + React + TypeScript + vite-plugin-pwa. Vitest for tests, ESLint for lint.

## Architecture
See docs/ARCHITECTURE.md for the diagram. Flow:
Start → Setup → Touch Selection → Selected Player → Truth/Dare choice → Card Reveal → Next Round

## Key technical learnings (don't relearn these)
- Multi-touch tracking MUST key by `touch.identifier`, never array index — 
  see docs/multitouch-spike-result.md for spike findings.
- Hardware/OS may cap simultaneous touches before events reach the browser;
  don't chase "missed finger" bugs that aren't reproducible in JS event logs.

## Folder conventions
- src/screens/       — one file per screen, matches the flow above
- src/state/          — GameContext.tsx holds GameState
- src/data/cards.ts   — static Card[] data, filtered by pack/difficulty/type
- src/hooks/useMultiTouch.ts — spike touch logic, hook-ified
- src/types/          — Card, GameState, PlayerTouch, GameSettings

## Workflow
- One GitHub issue = one focused Claude Code session = one PR.
- Never push to main directly — branch protection requires PR + review.
- Run `npm run lint && npm run test && npm run build` before opening a PR.