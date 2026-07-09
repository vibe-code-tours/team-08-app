# Domain Pitfalls

**Domain:** Mobile party game PWA (touch-based, client-side)
**Researched:** 2026-07-09

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Touch Identifier Mismatch
**What goes wrong:** Multi-touch tracking uses array index instead of `touch.identifier`, causing wrong player assignment when a finger lifts and another touches down.
**Why it happens:** Array-based tracking seems simpler. The bug only manifests under specific touch patterns (e.g., player 3 lifts, player 4 touches, but the array shifts).
**Consequences:** Wrong player gets selected by roulette — game feels broken and unpredictable.
**Prevention:** Key all touch tracking by `touch.identifier`. This is already documented in CLAUDE.md and the multitouch spike result.
**Detection:** Test with 3+ fingers, lift one mid-roulette, verify correct player is still highlighted.

### Pitfall 2: Mobile Audio Lock
**What goes wrong:** Sound effects are silent on iOS Safari and Chrome because the browser locks audio until user interaction.
**Why it happens:** Browsers implement autoplay policies to prevent annoying audio. The first sound attempt fails silently or throws.
**Consequences:** No sound effects in the game — kills the premium feel entirely.
**Prevention:** Use Howler.js with the `playerror` + `unlock` event pattern. Play a silent audio buffer on the first touch event to unlock. Test on real iOS devices, not just Chrome DevTools mobile emulation.
**Detection:** Deploy to a real iPhone, tap through the game, verify sounds play.

### Pitfall 3: Animation Jank on Mid-Range Phones
**What goes wrong:** Roulette spin or card flip animations drop below 60fps, making the game feel sluggish.
**Why it happens:** Too many DOM elements animating simultaneously, or using `transform` + `opacity` that triggers layout thrashing.
**Consequences:** The core "electric moment" of the roulette falls flat if it stutters.
**Prevention:** Use `will-change: transform` on animated elements. Motion library uses hardware-accelerated WAAPI by default. Limit simultaneous particle effects. Profile on a real mid-range Android device (e.g., Samsung Galaxy A series), not a flagship.
**Detection:** Use Chrome DevTools Performance tab with CPU throttling at 4x. Target: no frame drops during roulette animation.

## Moderate Pitfalls

### Pitfall 1: PWA Install Prompt Timing
**What goes wrong:** The "Add to Home Screen" prompt fires at a bad time (mid-game) or never fires.
**Why it happens:** `beforeinstallprompt` fires when Chrome determines the app is "installable" — timing varies by device and session.
**Prevention:** Capture the event, defer the prompt, and show a custom install button in the splash or settings screen. Do not rely on the browser's native prompt timing.
**Detection:** Test on Android Chrome, verify install prompt appears and can be triggered at a user-chosen time.

### Pitfall 2: Tailwind v4 Configuration Confusion
**What goes wrong:** Developers try to create a `tailwind.config.js` file (v3 pattern) instead of using `@theme` in CSS (v4 pattern).
**Why it happens:** Most online tutorials and Stack Overflow answers still reference v3 patterns.
**Prevention:** Use `@theme` directive in `src/index.css`. No `tailwind.config.js` file. The `@tailwindcss/vite` plugin handles everything.
**Detection:** If a `tailwind.config.js` file appears in the repo, it is wrong for v4.

### Pitfall 3: vite-plugin-PWA Not Wired
**What goes wrong:** The PWA plugin is in `package.json` but not in `vite.config.ts` — no service worker is generated, no manifest is injected, the app is not installable.
**Why it happens:** The plugin was installed during scaffolding but the config was never updated.
**Prevention:** Wire `VitePWA({...})` into `vite.config.ts` plugins array as part of Phase 1 foundation work.
**Detection:** Run `vite build`, check `dist/` for `sw.js` and `manifest.webmanifest`.

## Minor Pitfalls

### Pitfall 1: Font Loading FOUT
**What goes wrong:** Custom fonts flash from system font to loaded font on every page load.
**Prevention:** Use `font-display: swap` and preload critical font files. Or use system fonts for body text and only custom fonts for headings.

### Pitfall 2: localStorage Quota on Older Devices
**What goes wrong:** Excessive localStorage writes (per-game history, detailed stats) exceed 5MB quota on older iOS devices.
**Prevention:** Keep localStorage usage minimal — only persist settings and preferences, not game history. The game is ephemeral by nature.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Foundation & Design System | Tailwind v3 vs v4 config confusion | Use `@theme` in CSS, not config file |
| Multi-Touch & Roulette | Touch identifier tracking bugs | Key by `touch.identifier`, test with 3+ fingers |
| Multi-Touch & Roulette | Animation jank on mid-range phones | Profile early, use hardware-accelerated transforms only |
| Game Flow | iOS Safari audio lock | Howler.js unlock pattern, test on real device |
| Polish & PWA | PWA not installable | Wire vite-plugin-pwa in Phase 1, test install flow in Phase 4 |

## Sources

- CLAUDE.md multi-touch spike findings (project documentation, HIGH confidence)
- Howler.js README — mobile/Chrome playback section (Context7, HIGH confidence)
- Motion for React docs — hardware acceleration via WAAPI (Context7, HIGH confidence)
- vite-plugin-pwa guide — autoUpdate and dev options (Context7, HIGH confidence)
- Tailwind CSS v4 migration guide — CSS-first configuration (Context7, HIGH confidence)
