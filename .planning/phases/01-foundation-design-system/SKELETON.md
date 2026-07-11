# Walking Skeleton — Truth or Dare, Finger Roulette

**Phase:** 1
**Generated:** 2026-07-10

## Capability Proven End-to-End

A party-game player can open the installable, neon-themed app on the start screen, have GameContext route them through the phase-based screen flow, and change a game setting that survives a full page reload — proving the full client-side stack (Tailwind v4 tokens → React Context state → phase router → localStorage persistence → PWA packaging) works with no backend.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | React 19 + Vite 8 + TypeScript (already scaffolded) | Locked by CLAUDE.md/PROJECT.md; createRoot + StrictMode already wired in main.tsx |
| Styling / design system | Tailwind v4 CSS-native `@theme` tokens in src/index.css (no tailwind.config.js) | D-01/D-02/D-03; v4 install path already in package.json; auto-generates bg/text/shadow-glow utilities |
| State layer | React Context + useReducer in src/state/GameContext.tsx | No Redux/Zustand (REQUIREMENTS Out of Scope); single GameState + GameAction union |
| Routing | Phase-based conditional render in App.tsx (state.phase → screen), no URL router | ARCHITECTURE.md non-URL navigation model; no router library installed |
| Persistence | localStorage for GameSettings only (difficulty/pack/timerEnabled), try/catch-guarded | D-09/D-10; PLAT-02; full GameState is NOT persisted in v1 |
| PWA | vite-plugin-pwa generateSW strategy, registerType autoUpdate, manual-rasterized icons | PLAT-01; Pitfalls 3/4 — no workbox-window, no pwaAssets generator |
| Deployment target | Netlify (per README), PR previews per pull request; local full-stack run via `npm run dev` | No backend to deploy (PLAT-04); static SPA + service worker |
| Directory layout | src/screens/ (one file per phase), src/state/, src/types/ (barrel), src/data/, src/hooks/ | CLAUDE.md folder conventions; pre-created screen files avoid Phase 2-4 merge conflicts (D-07/D-08) |

## Stack Touched in Phase 1

- [x] Project scaffold (framework, build, lint, test runner) — already present; this phase wires Tailwind + PWA plugins into vite.config.ts
- [x] Routing — App.tsx phase-based router covering all 7 GamePhase values
- [x] Persistence — real localStorage write (settings effect) AND real read (loadSettings on init), proven surviving a reload (there is no DB for this fully client-side app; localStorage is the storage tier)
- [x] UI — 7 neon-themed placeholder screens; start screen renders on open, driven by GameContext state
- [x] Deployment — `npm run dev` runs the full stack locally with SW/manifest enabled (devOptions.enabled true); `npm run build` emits the deployable PWA bundle

## Out of Scope (Deferred to Later Slices)

- Real gameplay logic in any screen (roulette, card flip, truth/dare content, voting UI) — screens are placeholder headings only (D-07/D-08); Phase 2.
- Random coin-flip GamePhase / animation (FLOW-02) and distinct pass/fail/celebration result phases (UX-03/04/05) — Phase 2 extends the union + reducer.
- Full resumable mid-game GameState persistence (phase/players/activePlayer/selectedCard) — deferred per D-10; only GameSettings persists in v1.
- Card data (src/data/cards.ts) and real settings UI (CONF-01/02/03) — Phase 3.
- Custom PWA icon art, splash screen, onboarding, sound, timer polish — Phase 4.
- Icon library wiring (lucide-react) — no icons this phase; re-verify lucide-react@1.24.0 version when the first phase imports it (RESEARCH observation).

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering its architectural decisions:

- Phase 2 — Core Game Loop: multi-touch roulette selection and the full play flow (extends GamePhase/reducer, fills the 7 screen stubs with real UI).
- Phase 3 — Content, Settings & Platform: card library + real settings screens consuming the GameSettings shape and persistence wired here.
- Phase 4 — Premium Polish: splash, onboarding, sound, timer pressure, pack color accents — all consuming the @theme tokens and glow utilities frozen in this phase.
