# Feature Landscape

**Domain:** Mobile party game PWA (Truth/Dare Finger Roulette)
**Researched:** 2026-07-09

## Table Stakes

Features users expect. Missing = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Multi-touch finger detection | Core mechanic — players must place fingers to play | High | Must key by touch.identifier; 2-10 players; colored indicators per finger |
| Roulette spin with dramatic slowdown | The core value moment — this IS the game | High | Spring physics, neon glow trail, winner reveal with fanfare |
| Truth or Dare choice | Fundamental game mechanic | Low | Coin-flip animation between two options |
| Card selection grid | Player picks their challenge from face-down cards | Medium | ~10 cards face-down, tap to flip, 3D card flip animation |
| Challenge display | Show the selected challenge text + difficulty badge | Low | Card reveal with difficulty and pack indicators |
| Self-voting (Fail/Pass/Excellent) | Player judges their own performance | Low | Three buttons after challenge, feeds into result screen |
| Game settings (difficulty, pack) | Players want to customize their experience | Low | Simple selectors, persist to localStorage |
| Next round flow | Ability to continue playing | Low | Next Round / Change Settings / Restart options |
| Mobile-first responsive | It is a phone-sharing game — must work on phones | Medium | Portrait orientation, touch targets, safe area insets |

## Differentiators

Features that set product apart. Not expected, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Neon cyber aesthetic with glow effects | Premium feel that makes the game feel "designed" not "built" | Medium | Custom Tailwind theme, CSS glow utilities, consistent neon palette |
| Sound effects (roulette, flip, celebration) | Audio feedback makes the roulette moment visceral | Medium | Howler.js with sound sprites, mobile audio unlock handling |
| Confetti celebration on pass | Dopamine hit — rewards the player visually | Low | canvas-confetti with neon-colored particles |
| Splash screen with neon title | First impression sets the tone | Low | Animated "TRUTH or DARE" title with glow effect |
| Onboarding walkthrough | First-time users understand the flow without explanation | Low | 2-3 slides explaining finger placement and game flow |
| Player count auto-detection | No manual player setup — just place fingers | Medium | Count active touches, assign colors, show indicators |
| Pack color differentiation | Visual variety across card packs | Low | Subtle color accent per pack theme |
| Countdown timer with pressure effects | Increases tension during challenges | Medium | Optional, visual urgency effects (pulsing, color shift) |
| Offline PWA support | Play anywhere, no internet needed after first load | Low | vite-plugin-pwa handles precaching |

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Online multiplayer | Massive complexity (WebRTC/WebSockets, state sync, latency). Project spec explicitly scopes this out. | Focus on the share-the-phone experience — it is the core differentiator. |
| User accounts / authentication | No backend, local party game. Adding auth adds Firebase/supabase + complexity for zero value. | Use localStorage for settings persistence only. |
| Card content editing UI | Cards are static TypeScript data. An editing UI is a full CRUD app. | Add cards by editing `src/data/cards.ts` directly — type-safe, IDE autocomplete. |
| Dark mode toggle | The neon theme IS the mode. Adding a toggle undermines the design identity. | Always dark. The theme is not optional. |
| State management library (Redux, Zustand) | Game state is a single useReducer — phase + settings + players. A state library adds 50-200KB for no benefit. | React Context + useReducer. If it gets complex, extract custom hooks — do not add a library. |
| Analytics / telemetry | MVP is a party game. Tracking user behavior adds privacy concerns and bundle size. | Defer to v2 if ever needed. |
| Social sharing / deep linking | Adds complexity for a game that is played face-to-face on one device. | The share-the-phone model means no need for links. |
| Multiple themes / skins | Adds design debt. One strong theme beats three weak ones. | One neon theme, done excellently. |

## Feature Dependencies

```
GameContext (state management) → All screens
Multi-touch tracking → Roulette spin
Roulette spin → Player selection
Player selection → Truth/Dare choice
Truth/Dare choice → Card selection grid
Card selection grid → Card flip reveal
Card flip reveal → Challenge display
Challenge display → Self-voting
Self-voting → Result screen
Result screen → Next round flow

Settings → GameContext → All screens (affects difficulty, pack, timer)
Sound effects → All interactive moments (overlay concern, not a dependency)
Confetti → Result screen (pass celebration only)
PWA config → App shell (offline caching, installability)
```

## MVP Recommendation

Prioritize:
1. **GameContext + screen flow** — The skeleton everything else plugs into
2. **Multi-touch + roulette** — The core value moment; highest technical risk
3. **Card selection + flip reveal** — Completes the play loop
4. **Neon design system (Tailwind theme)** — Makes it look premium from day one
5. **Self-voting + result screen** — Closes the loop

Defer to Phase 4:
- **Sound effects**: Important for polish but not for playability testing
- **Confetti**: Celebration effect, pure polish
- **Onboarding**: Nice-to-have, users can figure out "put your finger on the screen"
- **Timer with pressure effects**: Optional feature, not core to the game

## Sources

- PROJECT.md — Requirements, active features, out-of-scope decisions (project documentation, HIGH confidence)
- CLAUDE.md — Architecture flow, key technical learnings (project documentation, HIGH confidence)
- SCREENS.png — 24-screen UI kit showing complete visual target (project assets, HIGH confidence)
