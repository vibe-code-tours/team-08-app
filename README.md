# Finger Roulette — Truth or Dare

> A mobile-first PWA party game: everyone places a finger on the screen, the app randomly picks a player, and they choose Truth or Dare.

![ci](../../actions/workflows/ci.yml/badge.svg) ![security](../../actions/workflows/security.yml/badge.svg)

<!-- A screenshot or GIF of the app goes here — it's the best README section. -->

---

## Quickstart

```bash
git clone https://github.com/vibe-code-tours/team-08-app.git && cd team-08-app
cp .env.example .env        # fill in real values LOCALLY — never commit .env
npm install && npm run dev
```

## Stack

- **Frontend:** Vite + React + TypeScript
- **PWA:** `vite-plugin-pwa` (installable, offline-capable)
- **Testing:** Vitest
- **Lint:** ESLint
- **Deploy:** GitHub Pages (auto-deploy on push to `main` via `.github/workflows/deploy.yml`)

## Project structure

| Path                         | What                                                                                                             |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `src/screens/`               | one file per game screen — Start → Setup → Touch Selection → Selected Player → Truth/Dare → Card Reveal → Result |
| `src/state/`                 | `GameContext.tsx` — game state, settings, active touches                                                         |
| `src/data/cards.ts`          | static Truth/Dare card data, filtered by pack/difficulty                                                         |
| `src/hooks/useMultiTouch.ts` | multi-touch tracking (keyed by `touch.identifier`)                                                               |
| `src/types/`                 | `Card`, `GameState`, `GameSettings`, `PlayerTouch`                                                               |
| `docs/`                      | `multitouch-spike-result.md`, `ARCHITECTURE.md`, decision records                                                |
| `.github/`                   | CI, security, PR/issue templates                                                                                 |

## Team

| Name      | Role this week |
| --------- | -------------- |
| _fill in_ | Anchor         |
| _fill in_ | Reviewer       |

Board: _link your GitHub Project here_

---

## What's already set up for you

This repo was created from the **Vibe Code Tours project starter**. It ships with:

| File                                                                  | Gives you                                                                           |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `.github/workflows/ci.yml`                                            | lint · typecheck · test · build on every PR (stays green until you add each script) |
| `.github/workflows/security.yml`                                      | gitleaks (leaked keys) + semgrep (SAST) — advisory, report-only                     |
| `.github/dependabot.yml`                                              | weekly PRs for vulnerable / outdated dependencies                                   |
| `.env.example`                                                        | secret hygiene — copy to `.env`, never commit real keys                             |
| `.github/pull_request_template.md` · `ISSUE_TEMPLATE/` · `CODEOWNERS` | small reviewed PRs, one-owner issues                                                |
| `docs/ARCHITECTURE.md` · `docs/decisions/`                            | a 1-page overview + lightweight ADRs                                                |
| `working-agreement.md`                                                | how your team works (GitHub Flow + rotating roles)                                  |

**First thing to do:** follow [`SETUP.md`](./SETUP.md) — a ~1-hour checklist to turn it all on.

**Git rule:** branch → PR → 1 teammate review → merge. No push to `main`, no self-merge.

> A green pipeline ≠ secure. Scanners catch leaked keys, known-CVE deps, and injection
> patterns. They do **not** catch prompt-injection, over-scoped tokens, or hallucinated
> packages — a human still reviews for those.
