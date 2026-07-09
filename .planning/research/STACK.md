# Technology Stack

**Project:** Truth/Dare Finger Roulette PWA
**Researched:** 2026-07-09
**Context:** Greenfield — stack research for a premium animated mobile party game PWA

---

## Current Stack (Already Installed)

These packages are already in `package.json` and working. No changes needed.

| Package | Version | Role | Status |
|---------|---------|------|--------|
| React | `^19.2.7` | UI framework | Installed |
| React DOM | `^19.2.7` | DOM renderer | Installed |
| Vite | `^8.1.1` | Dev server + bundler | Installed |
| @vitejs/plugin-react | `^6.0.3` | React fast-refresh / JSX | Installed |
| TypeScript | `~6.0.2` | Static type checking | Installed |
| Vitest | `^3.2.7` | Test runner | Installed |
| @vitest/ui | `^3.2.7` | Visual test UI | Installed |
| jsdom | `^27.0.1` | Browser env simulation for tests | Installed |
| @testing-library/react | `^16.3.2` | React component testing | Installed |
| @testing-library/jest-dom | `^6.9.1` | DOM matchers | Installed |
| ESLint | `^10.6.0` | Linter | Installed |
| typescript-eslint | `^8.62.0` | TS lint rules | Installed |
| eslint-plugin-react-hooks | `^7.1.1` | Hooks rules | Installed |
| eslint-plugin-react-refresh | `^0.5.3` | Fast Refresh validation | Installed |
| vite-plugin-pwa | `^1.3.0` | PWA service worker + manifest | Installed but **NOT wired** |

---

## Recommended Stack — Packages to Add

### Tailwind CSS v4 (CSS Framework)

| Detail | Value |
|--------|-------|
| Package | `tailwindcss` + `@tailwindcss/vite` |
| Version | `^4.3.2` (both) |
| Purpose | Utility-first CSS for the neon dark theme design system |
| Confidence | **HIGH** |

**Why Tailwind CSS v4:**
- The project spec explicitly calls for Tailwind CSS. v4 is the current stable release (launched January 2025, now at 4.3.2).
- v4 uses CSS-first configuration via `@theme` directive — no more `tailwind.config.js`. Define your neon color palette directly in CSS.
- The Vite plugin (`@tailwindcss/vite`) is faster than the PostCSS approach and integrates natively with Vite 8.
- Custom neon colors defined once in `@theme` become utility classes automatically (`bg-neon-purple`, `text-neon-pink`, etc.).
- The Rust-based Oxide engine makes HMR near-instant.

**Installation:**
```bash
npm install tailwindcss@latest @tailwindcss/vite@latest
```

**vite.config.ts addition:**
```ts
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    // ... VitePWA config (see below)
  ],
});
```

**CSS setup (src/index.css):**
```css
@import "tailwindcss";

@theme {
  --color-neon-purple: #a855f7;
  --color-neon-pink: #ec4899;
  --color-neon-blue: #3b82f6;
  --color-neon-cyan: #06b6d4;
  --color-neon-gold: #f59e0b;
  --color-dark-bg: #0a0014;
  --color-dark-surface: #1a0033;
  --color-dark-card: #2a0052;
}
```

**What NOT to use:**
- Do NOT use Tailwind CSS v3 — it requires PostCSS, a config file, and is significantly slower. v4 is stable and the correct choice for new projects.
- Do NOT use `@tailwindcss/postcss` — use the Vite plugin for better HMR performance.

---

### Motion (Animation Library)

| Detail | Value |
|--------|-------|
| Package | `motion` |
| Version | `^12.42.2` |
| Purpose | Spring physics animations, gesture support, layout animations, AnimatePresence for screen transitions |
| Confidence | **HIGH** |

**Why Motion (not framer-motion):**
- `motion` is the officially maintained successor to `framer-motion`. The original `framer-motion` package is deprecated in favor of `motion`.
- Import path is `import { motion, AnimatePresence } from "motion/react"` — same API surface, new package name.
- React 18.2+ compatible (works with React 19.2.7 in this project).
- Provides everything needed for this game: spring physics for the roulette spin, `AnimatePresence` for screen transitions, `layout` animations for card grid rearrangements, `whileTap` for touch feedback, `variants` for orchestration.

**Key capabilities for this project:**
- **Roulette spin:** `animate` + spring transitions with `stiffness`/`damping`/`mass` for dramatic slowdown
- **Card flip:** `rotateY` animation with perspective, spring physics for natural feel
- **Screen transitions:** `AnimatePresence mode="wait"` for enter/exit between game phases
- **Touch feedback:** `whileTap={{ scale: 0.95 }}` for responsive press states
- **Particle orchestration:** `variants` + `staggerChildren` for sequenced reveal effects

**Installation:**
```bash
npm install motion
```

**Import pattern:**
```tsx
import { motion, AnimatePresence } from "motion/react";
```

**What NOT to use:**
- Do NOT use `framer-motion` — it is deprecated. The `motion` package is the current maintained version with identical API.
- Do NOT use CSS-only animations for complex sequences — the roulette spin, card flip, and screen transitions all need programmatic spring physics and orchestration that CSS cannot provide.
- Do NOT use GSAP — it is heavier, has a non-React-native API, and is overkill for this project's animation needs. Motion's spring physics and declarative React API are a better fit.

---

### Howler.js (Sound Effects)

| Detail | Value |
|--------|-------|
| Package | `howler` |
| Version | `^2.2.4` |
| Purpose | Sound effects for roulette, card flip, timer, celebrations |
| Confidence | **HIGH** |

**Why Howler.js:**
- The gold standard for web audio in 2026. Handles the Web Audio API + HTML5 Audio fallback transparently.
- Critical feature for this project: **automatic audio unlock on mobile**. Safari and Chrome lock audio until user interaction — Howler handles this with `autoUnlock`, but more importantly provides the `playerror` + `unlock` event pattern for retry.
- **Sound sprite support** — bundle all game sounds (roulette tick, card flip, timer tick, celebration, failure) into a single audio file for efficient loading. Important for PWA offline caching.
- Zero external dependencies.
- Battle-tested on millions of mobile web apps.

**Installation:**
```bash
npm install howler
```

**Usage pattern:**
```tsx
import { Howl } from "howler";

const sfx = new Howl({
  src: ["sounds/game-sprites.webm", "sounds/game-sprites.mp3"],
  sprite: {
    rouletteTick: [0, 50],
    rouletteWin: [100, 1500],
    cardFlip: [2000, 300],
    timerTick: [3000, 200],
    celebration: [4000, 3000],
    failure: [8000, 2000],
  },
  onplayerror: function (_id, error) {
    sfx.once("unlock", function () {
      sfx.play();
    });
  },
});
```

**What NOT to use:**
- Do NOT use the Web Audio API directly — the cross-browser inconsistencies (especially iOS Safari lock behavior) are a minefield. Howler abstracts this away.
- Do NOT use `tone.js` — it is a full music production framework, vastly overkill for playing short game sound effects.

---

### canvas-confetti (Celebration Effects)

| Detail | Value |
|--------|-------|
| Package | `canvas-confetti` |
| Version | `^1.9.4` |
| Purpose | Confetti burst on success, celebration moments |
| Confidence | **HIGH** |

**Why canvas-confetti (not react-canvas-confetti):**
- `canvas-confetti` is the underlying library with 88.66 benchmark score and High source reputation. It is a standalone zero-dependency canvas library.
- Use it directly with a `useEffect` + `useRef` pattern — this avoids adding a React wrapper dependency for what is essentially imperative canvas calls.
- Highly configurable: particle count, spread, colors, origin, gravity, drift — perfect for matching the neon color scheme.
- Performant — renders on HTML5 Canvas, hardware-accelerated, minimal CPU impact.

**Installation:**
```bash
npm install canvas-confetti
```

**Usage pattern:**
```tsx
import confetti from "canvas-confetti";

function fireNeonConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#a855f7", "#ec4899", "#3b82f6", "#f59e0b"],
  });
}
```

**What NOT to use:**
- Do NOT use `react-confetti` — it uses SVG particles which are significantly less performant than canvas, especially on mobile devices where this game runs.
- Do NOT use `react-canvas-confetti` — unnecessary wrapper when the base library is simple enough to use directly.

---

## PWA Configuration (Already Installed, Needs Wiring)

`vite-plugin-pwa@^1.3.0` is already in devDependencies but is NOT loaded in `vite.config.ts`. This needs to be wired up.

**vite.config.ts target configuration:**
```ts
import { VitePWA } from "vite-plugin-pwa";

// Add to plugins array:
VitePWA({
  registerType: "autoUpdate",
  workbox: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg,webm,mp3}"],
    clientsClaim: true,
    skipWaiting: true,
  },
  manifest: {
    name: "Truth or Dare - Finger Roulette",
    short_name: "Truth or Dare",
    description: "A premium multiplayer party game PWA",
    theme_color: "#0a0014",
    background_color: "#0a0014",
    display: "standalone",
    orientation: "portrait",
    icons: [
      {
        src: "pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  },
  devOptions: {
    enabled: true,
  },
})
```

**Key configuration notes:**
- `registerType: "autoUpdate"` forces `clientsClaim` and `skipWaiting` — users get updates instantly without a prompt.
- `globPatterns` must include `webm` and `mp3` for audio sprite precaching.
- `devOptions.enabled: true` lets you test PWA features during development.
- Need to generate PWA icon assets (192x192 and 512x512) in the neon theme.

---

## Full Installation Command

```bash
# Core additions
npm install tailwindcss @tailwindcss/vite motion howler canvas-confetti
```

All five packages are production dependencies (no devDependencies for these — they are runtime).

---

## What This Project Does NOT Need

| Category | Not Needed | Why |
|----------|-----------|-----|
| State management | Redux, Zustand, Jotai | React Context + useReducer is sufficient for game state (phase + settings + players). PROJECT.md explicitly scopes this out. |
| Router | React Router, TanStack Router | Single-page flow managed in GameContext. No URL-based routing needed. |
| UI component library | Shadcn/UI, Material UI, Radix | Custom neon design system — pre-built components would fight the aesthetic. |
| Icon library | Lucide, React Icons | Project already uses `public/icons.svg` sprite. |
| HTTP client | Axios, TanStack Query | Fully client-side, no API calls. |
| Form library | React Hook Form, Formik | Settings are simple toggles/selects — no complex forms. |
| Date library | date-fns, Day.js | No date handling in a party game. |
| CSS-in-JS | styled-components, Emotion | Tailwind v4 handles all styling with better performance. |
| i18n | react-i18next | Single language (Burmese/Myanmar) for MVP. |
| Firebase/Supabase | Any BaaS | Fully offline, no backend. |

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Animation | Motion (`motion`) | Framer Motion (`framer-motion`) | Deprecated; `motion` is the maintained successor |
| Animation | Motion (`motion`) | GSAP | Heavier, non-React-native API, overkill for declarative React animations |
| Animation | Motion (`motion`) | CSS animations + @keyframes | Cannot do spring physics, orchestration, or exit animations |
| CSS | Tailwind CSS v4 (`@tailwindcss/vite`) | Tailwind CSS v3 (PostCSS) | v3 is slower, requires config file, PostCSS overhead |
| CSS | Tailwind CSS v4 | styled-components | Runtime overhead, worse tree-shaking, no utility-first benefits |
| Audio | Howler.js | Web Audio API direct | Cross-browser inconsistencies, especially iOS Safari audio lock |
| Audio | Howler.js | Tone.js | Full music production framework — wildly overkill for SFX |
| Confetti | canvas-confetti | react-confetti (SVG) | SVG particles are 3-5x slower on mobile than canvas |
| Confetti | canvas-confetti | react-canvas-confetti | Unnecessary wrapper for imperative canvas calls |
| PWA | vite-plugin-pwa (already installed) | Manual workbox config | Plugin handles SW generation, manifest injection, asset generation |

---

## Sources

- Tailwind CSS v4 official docs: https://tailwindcss.com (via Context7, High reputation, 3532 snippets)
- Motion for React official docs: https://motion.dev (via Context7, High reputation, 1579 snippets)
- Howler.js official docs: https://github.com/goldfire/howler.js (via Context7, High reputation, 121 snippets)
- canvas-confetti: https://github.com/catdad/canvas-confetti (via Context7, High reputation, 59 snippets)
- vite-plugin-pwa docs: https://vite-pwa-org.netlify.app (via Context7, High reputation, 545 snippets)
- npm version verification: `npm view` commands executed 2026-07-09
