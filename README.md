# Finger Roulette — Truth or Dare

> A mobile-first PWA party game: everyone places a finger on the screen, the app randomly picks a player, and they choose Truth or Dare.

**Live:** [https://thechosenonegame.netlify.app/](https://thechosenonegame.netlify.app/)

![ci](../../actions/workflows/ci.yml/badge.svg) ![security](../../actions/workflows/security.yml/badge.svg)

---

## Quickstart

```bash
git clone https://github.com/vibe-code-tours/team-08-app.git && cd team-08-app
npm install && npm run dev
```

## Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + TypeScript |
| **Build** | Vite 8 |
| **Styling** | Tailwind CSS v4 (neon cyber theme) |
| **Animation** | Motion (Framer Motion) |
| **Sound** | Web Audio API (SFX) + HTML5 Audio (BGM) |
| **PWA** | vite-plugin-pwa (installable, offline-capable) |
| **Testing** | Vitest + Testing Library |
| **Lint** | ESLint (TS + React hooks + refresh) |
| **Deploy** | Netlify (PR previews on every pull request) |

## Features

- **Multi-touch roulette** — 2–10 players place fingers on screen, a spinning light selects one winner
- **Truth or Dare** — selected player chooses Truth, Dare, or Random (with coin-flip animation)
- **Card selection** — grid of face-down cards with 3D flip animation revealing challenges
- **192 cards** across 4 packs (Friends, Couple, Family, Classic) × 3 difficulties (Easy, Medium, Hard)
- **Voting** — Fail / Pass / Excellent with confetti celebration effects
- **Sound effects** — 12 SFX for all interactions (tap, countdown, roulette tick, winner, card flip, timer, voting, celebration)
- **Background music** — 3 tracks (menu, tension, gameplay) that crossfade between game phases
- **Settings** — difficulty, card pack, timer toggle, sound/music toggle
- **Onboarding** — 5-slide swipeable walkthrough for first-time players
- **Myanmar (Burmese)** — all UI text localized
- **PWA** — installable on Android and iOS, works offline

## Game Flow

```
Start → Onboarding → Setup → Finger Selection → Roulette → Player Selected
    → Truth/Dare Choice → Card Reveal → Voting → Result → Next Round ↩
```

## Project Structure

| Path | What |
|------|------|
| `src/screens/` | 11 screen components, one per game phase |
| `src/components/` | 11 reusable components (NeonButton, GlassPanel, PhaseMusic, etc.) |
| `src/state/GameContext.tsx` | Game state, reducer, settings persistence |
| `src/hooks/useMultiTouch.ts` | Multi-touch tracking (keyed by `touch.identifier`) |
| `src/hooks/useSound.ts` | Web Audio API sound effects manager |
| `src/components/PhaseMusic.tsx` | Phase-aware background music with crossfade |
| `src/data/cards.ts` | 192 static Truth/Dare cards with filtering helpers |
| `src/types/` | TypeScript types (Card, GameState, PlayerTouch, etc.) |
| `public/sounds/` | 16 audio files (12 SFX + 3 BGM tracks) |
| `public/images/` | Logo and onboarding slide images |
| `docs/` | Architecture, ADRs, spike results |
| `.planning/` | Roadmap, requirements, GSD planning docs |

## How to Run

```bash
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Production build to dist/
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
npm run test       # Run Vitest
```

## Git Rules

- Branch → PR → 1 teammate review → merge
- No push to `main` directly — branch protection requires PR + review
- Run `npm run lint && npm run test && npm run build` before opening a PR
- CI must be green before merging

---

*Built with [Vibe Code Tours](https://vibe-code-tours.com/) — AI-assisted collaborative development.*
