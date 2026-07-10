# Phase 1: Foundation & Design System - Context

**Gathered:** 2026-07-10
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers pure infrastructure — no user-facing gameplay yet. It gives the 4 parallel dev teams (Phase 2/3/4) a stable foundation to build on:

1. A Tailwind v4 neon design system (color tokens + glow utilities) matching the `Screens.png` reference
2. The GameContext state backbone (types + reducer) covering the 7 named game phases
3. Placeholder screen files + a phase-based router in App.tsx
4. PWA wiring (manifest, service worker) and GameSettings local-storage persistence

Building actual gameplay (roulette, card flip, truth/dare content, settings UI) is explicitly out of scope — that's Phases 2-4.

</domain>

<decisions>
## Implementation Decisions

### Neon Palette Sourcing & Glow System
- **D-01:** Color-pick exact hex/OKLCH values from `public/images/Screens.png` (the 24-screen UI kit) rather than using generic neon approximations — the palette must match the design source of truth pixel-for-pixel.
- **D-02:** Implement the palette as Tailwind v4 `@theme` tokens (CSS-based config — Tailwind v4 does not use `tailwind.config.js`) with named tokens for: background, primary (neon purple), secondary (neon pink), accent (electric blue), highlight (gold/orange), truth (blue), dare (pink/red), success (green), failure (red), premium/selected (gold).
- **D-03:** Glow effects become reusable Tailwind utilities (glow/shadow tokens defined in `@theme`, e.g. a `--shadow-glow-purple`-style token) rather than one-off inline `box-shadow` styles, so Phases 2-4 can apply glow consistently without redefining it.

### GameContext v1 Scope
- **D-04:** Lock `GamePhase` to exactly the 7 phases already named in `CLAUDE.md` / `.planning/codebase/ARCHITECTURE.md`: `start`, `setup`, `touchSelection`, `selectedPlayer`, `truthDareChoice`, `cardReveal`, `nextRound`.
- **D-05:** Reducer actions cover: start game, select player, choose truth/dare, pick card, vote, next round. The Random coin-flip sub-choice (REQUIREMENTS.md FLOW-02) and dedicated pass/fail/celebration result screens (UX-03/04/05) are NOT modeled as separate `GamePhase` values in Phase 1 — Phase 2 extends the union type and reducer when it builds those screens.
- **D-06:** Deliberate narrow-scope choice: the type contract should be extendable later rather than Phase 1 trying to predict every future field Phase 2 will need.

### Screen Stub Strategy
- **D-07:** Create all 7 placeholder screen components now in `src/screens/` (`StartScreen.tsx`, `SetupScreen.tsx`, `TouchSelectionScreen.tsx`, `SelectedPlayerScreen.tsx`, `TruthDareChoiceScreen.tsx`, `CardRevealScreen.tsx`, `NextRoundScreen.tsx`), each a minimal functional component (e.g., renders its own phase name), wired into the router.
- **D-08:** Rationale: the team runs 4 parallel workstreams across Phases 2-4. Pre-creating one file per screen means each developer edits only their own screen file instead of everyone touching the shared `App.tsx` router the first time a screen is needed — avoids merge conflicts.

### Local Storage Persistence Scope
- **D-09:** Persist `GameSettings` only (difficulty, pack, timer toggle) — matches `.planning/REQUIREMENTS.md` PLAT-02 wording exactly ("game settings persist in local storage").
- **D-10:** Full `GameState` (mid-round phase/players/active card) is explicitly NOT persisted in Phase 1 — a page reload mid-game restarts from `start`. No hydration logic is needed for in-progress rounds. Revisit only if reload-during-party turns out to be a real pain point post-v1.

### PWA Manifest Identity
- **D-11:** `name`: "Truth or Dare — Finger Roulette", `short_name`: "Truth or Dare". Update `index.html`'s `<title>` (currently the placeholder "team-08-app") to match.
- **D-12:** Icons: rasterize the existing `public/favicon.svg` up to 192×192 and 512×512 PNGs as manifest icon stand-ins. No custom icon art in this phase.
- **D-13:** `theme_color` must be one of the locked palette tokens from D-01/D-02 (the neon primary/purple token) — not a separate ad-hoc value.

### Claude's Discretion
- Exact hex/OKLCH values extracted from `Screens.png` — the user decided the *sourcing method* (color-pick from the reference image), not the literal values. Pick the closest accurate match per token role.
- Precise glow utility naming/token structure within Tailwind v4's `@theme` syntax.
- Minimal placeholder screen content (D-07) — e.g., whether it's just a phase-name heading or includes a "back to start" dev affordance.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design Reference
- `public/images/Screens.png` — 24-screen UI kit; source of truth for neon palette color-picking (D-01). Text is in Myanmar/Burmese, but the visual language (neon dark theme, glow, glassmorphism, card treatments) is the target.
- `CLAUDE.md` — GamePhase flow list, folder conventions (`src/screens/`, `src/state/`, `src/data/cards.ts`, `src/hooks/useMultiTouch.ts`, `src/types/`), multi-touch identifier-keying lesson (not this phase's concern, but establishes the screen/type inventory).
- `.claude/CLAUDE.md` — Full tech stack, component/hook/naming conventions, TypeScript strictness settings (`verbatimModuleSyntax`, `erasableSyntaxOnly`, no enums), CSS approach.

### Requirements & Roadmap
- `.planning/PROJECT.md` — Core value statement, color-role table (Background/Primary/Secondary/Accent/Highlight/Truth/Dare/Success/Failure/Premium), constraints, key decisions log.
- `.planning/REQUIREMENTS.md` — This phase's requirement IDs: PLAT-01 (installable PWA), PLAT-02 (settings persist in local storage), PLAT-04 (fully client-side). Also FLOW-01/02 and UX-03/04/05/06 — relevant context for why GameContext v1 stays narrow (D-05), even though those requirements map to Phase 2.
- `.planning/ROADMAP.md` §Phase 1 — goal, success criteria, plan stubs (01-01: Tailwind + GameContext + types; 01-02: PWA + router + persistence).

### Codebase Maps
- `.planning/codebase/STACK.md` — confirms `tailwindcss@^4.3.2`, `@tailwindcss/vite@^4.3.2`, `motion@^12.42.2` (Framer Motion's current package name), and `vite-plugin-pwa@^1.3.0` are already in `package.json` but **not yet wired into `vite.config.ts`** (which currently only loads `react()`).
- `.planning/codebase/ARCHITECTURE.md` — planned component hierarchy, GameContext/types shape, phase-based (non-URL) navigation model this phase must implement.
- `.planning/codebase/CONVENTIONS.md` — naming conventions, TS strictness, current CSS approach (plain CSS + `@media (prefers-color-scheme: dark)` — see code_context note below on why this must change).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `public/favicon.svg` — existing generic Vite favicon; reused as the PWA icon source per D-12.
- Nothing else is directly reusable: `src/App.tsx` is still the default Vite starter template, `src/types/index.ts` and `src/state/GameContext.tsx` are empty stub files (0 bytes / placeholder), `src/data/cards.ts` and `src/hooks/useMultiTouch.ts` are stubs out of this phase's scope.

### Established Patterns
- Functional components with `function` declaration syntax + default export (`CONVENTIONS.md`).
- `import type { Foo } from '...'` required for type-only imports (`verbatimModuleSyntax: true`).
- One component/screen per file; screens live in `src/screens/` (directory does not exist yet — this phase creates it).
- No enums — use `const` objects + union types (`erasableSyntaxOnly: true`).
- All shared types live in a `src/types/index.ts` barrel file.

### Integration Points
- `vite.config.ts` — needs the `@tailwindcss/vite` plugin and `VitePWA()` plugin added alongside the existing `react()` plugin.
- `src/App.tsx` — full rewrite: hosts `GameContextProvider` + the phase-based screen router (replaces the default Vite welcome template entirely).
- `src/index.css` — full rewrite: Tailwind v4 `@theme` neon tokens replace the current generic light/dark CSS custom properties. **Note:** the current file uses `@media (prefers-color-scheme: dark)` to switch between light and dark palettes — this conflicts with PROJECT.md's explicit "always dark, no toggle" requirement and must be removed, not extended.
- `index.html` — `<title>` is currently the placeholder "team-08-app"; update to match the PWA short_name (D-11).

</code_context>

<specifics>
## Specific Ideas

- PWA identity locked via discussion: `name` = "Truth or Dare — Finger Roulette", `short_name` = "Truth or Dare"; icons rasterized from `public/favicon.svg` rather than newly designed art.
- The neon palette must be extracted from `Screens.png`, not approximated from memory — visual consistency with the design reference matters more than speed here.

</specifics>

<deferred>
## Deferred Ideas

- Random coin-flip `GamePhase`/animation (REQUIREMENTS.md FLOW-02) — Phase 2.
- Self-vote result screens (pass/fail/celebration) as distinct phases (UX-03/04/05) — Phase 2.
- Full resumable mid-game `GameState` persistence (beyond `GameSettings`) — not in v1 scope per D-09/D-10; revisit only if reload-during-party proves to be a real problem.
- Custom PWA icon art (beyond the favicon rasterization in D-12) — candidate for Phase 4 Premium Polish, possibly alongside the splash screen (UX-01) work.

### Reviewed Todos (not folded)
None — no pending todos matched Phase 1 scope (`todo.match-phase` returned 0 matches).

</deferred>

---

*Phase: 1-Foundation & Design System*
*Context gathered: 2026-07-10*
