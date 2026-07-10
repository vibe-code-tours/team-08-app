# Requirements: Truth or Dare -- Finger Roulette

**Defined:** 2026-07-09
**Core Value:** The roulette selection moment -- fingers on screen, spinning light, dramatic slowdown, winner revealed -- must feel electric and fun.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Multi-Touch & Selection

- [ ] **MTCH-01**: App detects 2-10 fingers placed on screen simultaneously
- [ ] **MTCH-02**: Each finger gets a unique colored indicator/dot
- [ ] **MTCH-03**: Roulette spinning light animation selects one player randomly
- [ ] **MTCH-04**: Roulette gradually slows down before stopping on winner
- [ ] **MTCH-05**: Selected player gets strong highlight effect (crown/glow)

### Game Flow

- [ ] **FLOW-01**: Selected player chooses Truth, Dare, or Random
- [ ] **FLOW-02**: Random mode shows coin-flip animation before revealing Truth or Dare
- [ ] **FLOW-03**: Card selection grid displays ~10 face-down cards
- [ ] **FLOW-04**: Selected card flips with premium 3D animation to reveal challenge
- [ ] **FLOW-05**: Challenge display shows content, difficulty badge, and pack badge

### Settings & Config

- [ ] **CONF-01**: Player can select difficulty level (Easy / Medium / Hard / All)
- [ ] **CONF-02**: Player can select card pack (Friends / Couple / Family / Classic)
- [ ] **CONF-03**: Player can toggle countdown timer on/off

### Content

- [ ] **CONT-01**: Starter card set with 50-100+ cards across packs and difficulties
- [ ] **CONT-02**: Light color accent differentiation per card pack

### UX & Polish

- [ ] **UX-01**: Splash screen with neon "TRUTH or DARE" title
- [ ] **UX-02**: Simple onboarding walkthrough (2-3 slides for first-time users)
- [ ] **UX-03**: Player self-voting screen (Fail / Pass / Excellent)
- [ ] **UX-04**: Celebration result screen for pass
- [ ] **UX-05**: Funny failure result screen for fail
- [ ] **UX-06**: Next round options (Next Round / Change Settings / Restart)
- [ ] **UX-07**: Sound effects for roulette, card flip, timer, celebrations
- [ ] **UX-08**: Countdown timer with visual pressure effects

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
| MTCH-01 | Phase 2 | Pending |
| MTCH-02 | Phase 2 | Pending |
| MTCH-03 | Phase 2 | Pending |
| MTCH-04 | Phase 2 | Pending |
| MTCH-05 | Phase 2 | Pending |
| FLOW-01 | Phase 2 | Pending |
| FLOW-02 | Phase 2 | Pending |
| FLOW-03 | Phase 2 | Pending |
| FLOW-04 | Phase 2 | Pending |
| FLOW-05 | Phase 2 | Pending |
| CONF-01 | Phase 3 | Pending |
| CONF-02 | Phase 3 | Pending |
| CONF-03 | Phase 3 | Pending |
| CONT-01 | Phase 3 | Pending |
| CONT-02 | Phase 4 | Pending |
| UX-01 | Phase 4 | Pending |
| UX-02 | Phase 4 | Pending |
| UX-03 | Phase 2 | Pending |
| UX-04 | Phase 2 | Pending |
| UX-05 | Phase 2 | Pending |
| UX-06 | Phase 2 | Pending |
| UX-07 | Phase 4 | Pending |
| UX-08 | Phase 4 | Pending |
| PLAT-01 | Phase 1 | Complete |
| PLAT-02 | Phase 1 | Complete |
| PLAT-03 | Phase 2 | Pending |
| PLAT-04 | Phase 1 | Complete |

**Coverage:**

- v1 requirements: 27 total
- Mapped to phases: 27
- Unmapped: 0

---
*Requirements defined: 2026-07-09*
*Last updated: 2026-07-09 after roadmap creation*
