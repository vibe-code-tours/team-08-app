# External Service Integrations

> Generated from source files, configs, and dependency analysis.

---

## Current Integrations

**None.** This is a fully client-side, offline-capable PWA with no external API calls, no authentication, no database, and no server-side runtime. All game data (Truth/Dare cards) is bundled as static data in `src/data/cards.ts`. Game state lives entirely in React Context (`src/state/GameContext.tsx`) and is never persisted beyond the session.

### Verified by inspecting:
- All `src/**/*.ts` and `src/**/*.tsx` files -- no `fetch()`, no API client imports, no SDK imports
- `package.json` dependencies -- only `react` and `react-dom` at runtime, zero API/SDK packages
- No `.env` variables consumed in source code (`.env.example` exists but the project is in scaffold stage)
- No network-related Vite plugins or proxy configuration

---

## What the App Does (and Why No Integrations Are Needed Yet)

The app is a "Truth or Dare Finger Roulette" party game:
1. Multiple players place fingers on a touchscreen
2. The app randomly selects one player
3. That player picks Truth or Dare
4. A card is revealed from a local deck

This is a single-device, local-multiplayer experience. No accounts, no network, no persistence required for core gameplay.

---

## CI/CD Integrations (External Services Used in Tooling)

These are not app-level integrations but are relevant external services the project depends on:

| Service | Purpose | Configuration |
|---|---|---|
| GitHub Actions | CI pipeline (lint, test, build) | `.github/workflows/ci.yml` |
| GitHub Actions | Security scanning | `.github/workflows/security.yml` |
| Gitleaks (Docker) | Secret leak detection | Pinned to `ghcr.io/gitleaks/gitleaks:v8.18.4` |
| Semgrep | Static analysis (SAST) | Community rules via `--config=auto` |
| Dependabot | Automated dependency updates | `.github/dependabot.yml` |
| Netlify | Hosting and PR preview deploys | Configured externally (no `netlify.toml` in repo) |

---

## Potential Future Integrations

Based on the app's purpose and architecture, these integrations might be relevant as the project evolves:

| Integration | Why | Priority |
|---|---|---|
| **None required for MVP** | Core gameplay works entirely offline with local state | -- |
| IndexedDB / localStorage | Persist custom card decks or game settings across sessions | Low |
| Analytics (e.g. Plausible, Umami) | Track installs, DAU for a PWA party game | Low |
| Cloud sync (Firebase, Supabase) | Share custom card decks across devices | Only if multi-device features added |

---

## Summary

This project is intentionally integration-free at the application layer. It is a pure client-side PWA that bundles all data and logic locally. The only external services in use are development/CI tooling (GitHub Actions, Gitleaks, Semgrep, Dependabot, Netlify). No API keys, authentication tokens, database connections, or third-party SDKs are consumed by the running application.
