# Requirements: Truth or Dare -- Finger Roulette

**Defined:** 2026-07-09
**Core Value:** The roulette selection moment -- fingers on screen, spinning light, dramatic slowdown, winner revealed -- must feel electric and fun.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Multi-Touch & Selection

- [x] **MTCH-01**: App detects 2-10 fingers placed on screen simultaneously
- [x] **MTCH-02**: Each finger gets a unique colored indicator/dot
- [x] **MTCH-03**: Roulette spinning light animation selects one player randomly
- [x] **MTCH-04**: Roulette gradually slows down before stopping on winner
- [x] **MTCH-05**: Selected player gets strong highlight effect (crown/glow)

### Game Flow

- [x] **FLOW-01**: Selected player chooses Truth, Dare, or Random
- [x] **FLOW-02**: Random mode shows coin-flip animation before revealing Truth or Dare
- [x] **FLOW-03**: Card selection grid displays ~10 face-down cards
- [x] **FLOW-04**: Selected card flips with premium 3D animation to reveal challenge
- [x] **FLOW-05**: Challenge display shows content, difficulty badge, and pack badge

### Settings & Config

- [x] **CONF-01**: Player can select difficulty level (Easy / Medium / Hard / All)
- [x] **CONF-02**: Player can select card pack (Friends / Couple / Family / Classic)
- [x] **CONF-03**: Player can toggle countdown timer on/off

### Content

- [x] **CONT-01**: Starter card set with 192 cards across packs and difficulties
- [x] **CONT-02**: Light color accent differentiation per card pack

### UX & Polish

- [x] **UX-01**: Splash screen with neon "TRUTH or DARE" title
- [x] **UX-02**: Simple onboarding walkthrough (5 slides for first-time users)
- [x] **UX-03**: Player self-voting screen (Fail / Pass / Excellent)
- [x] **UX-04**: Celebration result screen for pass
- [x] **UX-05**: Funny failure result screen for fail
- [x] **UX-06**: Next round options (Next Round / Change Settings / Restart)
- [x] **UX-07**: Sound effects for roulette, card flip, timer, celebrations
- [x] **UX-08**: Countdown timer with visual pressure effects

### Platform

- [x] **PLAT-01**: PWA is installable with manifest and service worker
- [x] **PLAT-02**: Game settings persist in local storage
- [ ] **PLAT-03**: Works on Android and iOS Safari (mobile-first)
- [x] **PLAT-04**: Fully client-side, no backend required

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Social Features

- **SOCL-01**: Online multiplayer via WebSockets
- **SOCL-02**: Player profiles and avatars
- **SOCL-03**: Score tracking and leaderboards
- **SOCL-04**: Custom card creation by players

### Content Expansion

- **CNTE-01**: Additional card packs (Themed, Seasonal, NSFW)
- **CNTE-02**: Card pack marketplace
- **CNTE-03**: User-generated content moderation

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend / server | Fully client-side MVP -- no auth, no database |
| User accounts / authentication | Local party game, no login needed |
| Online multiplayer | Same-device share-the-phone model for v1 |
| Redux / Zustand | React Context + useReducer sufficient for game state |
| UI component libraries | Custom neon design system, build from scratch |
| Dark mode toggle | Always dark -- neon theme is the only mode |
| Custom question creation UI | Cards are static TypeScript data in v1 |
| Native mobile apps | PWA cross-platform reach, no app store friction |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| MTCH-01 | Phase 2 | Complete |
| MTCH-02 | Phase 2 | Complete |
| MTCH-03 | Phase 2 | Complete |
| MTCH-04 | Phase 2 | Complete |
| MTCH-05 | Phase 2 | Complete |
| FLOW-01 | Phase 2 | Complete |
| FLOW-02 | Phase 2 | Complete |
| FLOW-03 | Phase 2 | Complete |
| FLOW-04 | Phase 2 | Complete |
| FLOW-05 | Phase 2 | Complete |
| CONF-01 | Phase 3 | Complete |
| CONF-02 | Phase 3 | Complete |
| CONF-03 | Phase 3 | Complete |
| CONT-01 | Phase 3 | Complete |
| CONT-02 | Phase 4 | Complete |
| UX-01 | Phase 4 | Complete |
| UX-02 | Phase 4 | Complete |
| UX-03 | Phase 2 | Complete |
| UX-04 | Phase 2 | Complete |
| UX-05 | Phase 2 | Complete |
| UX-06 | Phase 2 | Complete |
| UX-07 | Phase 4 | Complete |
| UX-08 | Phase 4 | Complete |
| PLAT-01 | Phase 1 | Complete |
| PLAT-02 | Phase 1 | Complete |
| PLAT-03 | Phase 2 | Pending |
| PLAT-04 | Phase 1 | Complete |

**Coverage:**

- v1 requirements: 27 total
- Mapped to phases: 27
- Complete: 26
- Pending: 1 (PLAT-03: mobile testing)
- Unmapped: 0

---
*Requirements defined: 2026-07-09*
*Last updated: 2026-07-16 — all features shipped except PLAT-03*
