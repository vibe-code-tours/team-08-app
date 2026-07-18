# Testing Strategy — Truth/Dare Finger Roulette

## Framework and Configuration

### Core Stack

| Tool | Version | Purpose |
|---|---|---|
| **Vitest** | ^4.1.10 | Test runner (Vite-native) |
| **jsdom** | ^29.1.1 | Browser environment simulation |
| **@testing-library/react** | ^16.3.2 | Component rendering and querying |
| **@testing-library/jest-dom** | ^6.9.1 | Custom DOM matchers (toBeInTheDocument, etc.) |
| **@vitest/ui** | ^4.1.10 | Visual test UI (dev dependency) |

### Vitest Configuration (`vitest.config.ts`)

```ts
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    css: true,  // CSS is processed in tests (not stripped)
  },
})
```

- **jsdom environment** — simulates a browser DOM for component rendering.
- **CSS processing enabled** — CSS imports are not mocked, so CSS variables and layout are available.
- **Setup file** — `src/test-setup.ts` loads jest-dom matchers globally.

### Test Setup (`src/test-setup.ts`)

```ts
import '@testing-library/jest-dom/vitest'
```

Single import that extends Vitest's `expect` with jest-dom matchers (`toBeInTheDocument`, `toHaveClass`, etc.). This is imported once and available in all test files.

### NPM Script

```json
"test": "vitest run"
```

- `vitest run` executes all tests once (no watch mode by default).
- CI uses this same script via `npm test`.

## Test File Placement and Naming

### Convention: Co-located Tests

Test files sit **next to the source file** they test, using the `.test.tsx` / `.test.ts` suffix.

```
src/
  App.tsx
  App.test.tsx
  components/
    ErrorBoundary.tsx
    ErrorBoundary.test.tsx
  hooks/
    useMultiTouch.ts
  state/
    GameContext.tsx
    GameContext.test.tsx
  utils/
    selectPlayer.ts
    selectPlayer.test.ts
```

There is **no separate `__tests__/` directory** or `tests/` folder. The architecture doc mentions a `tests/` folder, but the actual convention is co-location.

## What Is Currently Tested

### Coverage: 35 Tests Across 4 Files

Test files:

- `src/App.test.tsx` — App component rendering
- `src/state/GameContext.test.tsx` — GameContext reducer (state transitions, settings persistence, noRepeat, RESTART)
- `src/components/ErrorBoundary.test.tsx` — Error boundary crash recovery and restart dispatch
- `src/utils/selectPlayer.test.ts` — No-repeat player selection logic (5 tests)

All 35 tests pass. Lint and build are clean.

**What this covers:**
- App renders to the DOM without throwing.
- GameContext reducer handles all 12 actions correctly.
- Settings persist in localStorage and survive page reload.
- NoRepeat excludes last selected player, falls back when only one remains.
- ErrorBoundary catches crashes and dispatches RESTART on button click.
- selectEligiblePlayers filters correctly with edge cases (empty array, single player).

**What this does NOT cover:**
- Screen component rendering and interaction
- Touch event handling (useMultiTouch hook)
- Sound playback (useSound hook)
- CSS/layout and accessibility
- End-to-end game flow integration

## What Is NOT Tested Yet (Gaps)

| Area | File | Status |
|---|---|---|
| **Screen components** | `src/screens/*.tsx` | 11 screens, no unit tests |
| **Multi-touch hook** | `src/hooks/useMultiTouch.ts` | Implemented, no tests (critical path) |
| **Sound hook** | `src/hooks/useSound.ts` | Implemented, no tests |
| **PhaseMusic** | `src/components/PhaseMusic.tsx` | Implemented, no tests |
| **Card data filtering** | `src/data/cards.ts` | 192 cards, no filter tests |
| **PWA service worker** | (vite-plugin-pwa) | Not tested |
| **Game flow integration** | Start → Setup → Touch → Roulette → Reveal | No integration tests |

### Priority Gaps

1. **useMultiTouch hook** — touch event handling, identifier tracking (critical path per CLAUDE.md)
2. **Screen components** — each screen's render and interaction
3. **Card data** — filtering by pack/difficulty/type, data integrity
4. **useSound hook** — SFX preload, play, dedup (requires AudioContext mock)
5. **Game flow** — end-to-end flow through all screens
6. **Accessibility** — ARIA attributes, keyboard navigation, screen reader support

## Test Patterns and Conventions

### Test Structure

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ComponentUnderTest from './ComponentUnderTest'

describe('ComponentUnderTest', () => {
  it('does something specific', () => {
    // Arrange: render the component
    render(<ComponentUnderTest />)

    // Act: (implicit — user interactions via fireEvent or userEvent)

    // Assert: query the DOM and check
    expect(screen.getByText('expected text')).toBeInTheDocument()
  })
})
```

### Key Patterns

- **`describe` blocks** group tests by component name.
- **`it` blocks** use lowercase descriptions of behavior ("renders without crashing", "increments counter on click").
- **Vitest imports** are explicit: `import { describe, it, expect } from 'vitest'` (not global).
- **`screen` queries** — prefer `getByRole`, `getByText`, `getByLabelText` over `getByTestId`.
- **`render` from `@testing-library/react`** — wraps components with any needed providers.

### Query Priority (Testing Library Best Practices)

1. `getByRole` / `getByRole` — most accessible
2. `getByText` — for visible text content
3. `getByLabelText` — for form elements
4. `getByTestId` — last resort only

## Mock Strategies

### Current State

Tests for GameContext and selectPlayer use pure function testing (no mocks needed).
ErrorBoundary tests wrap the component in a mock GameContextProvider.
Screen component tests will need to mock useSound and useMultiTouch.

### Component Mocking

```tsx
// Mock a child component
vi.mock('./ChildComponent', () => ({
  default: () => <div data-testid="mock-child" />,
}))
```

### Hook Mocking

```tsx
// Mock a custom hook
vi.mock('./hooks/useMultiTouch', () => ({
  useMultiTouch: () => ({
    touches: [],
    startTracking: vi.fn(),
    stopTracking: vi.fn(),
  }),
}))
```

### Context Provider Mocking

```tsx
// Wrap component in a mock provider for testing
render(
  <GameContext.Provider value={{ state: mockState, dispatch: vi.fn() }}>
    <ComponentUnderTest />
  </GameContext.Provider>
)
```

### Module Mocking

```tsx
// Mock static data
vi.mock('./data/cards', () => ({
  cards: [{ id: 1, text: 'Test card', type: 'truth', difficulty: 'easy' }],
}))
```

### Vitest Mock Primitives

- `vi.fn()` — create mock functions with assertion capabilities
- `vi.mock()` — module-level mocking (hoisted automatically)
- `vi.spyOn()` — spy on existing object methods

## CI Integration

The CI pipeline (`ci.yml`) runs tests as part of the standard build:

```yaml
- name: Test
  run: npm test --if-present
```

- Tests run on **every push to main** and **every pull request**.
- CI uses **Node 24** on `ubuntu-latest`.
- Tests must pass before a PR can be merged (branch protection + review requirement).
- The `--if-present` flag means CI won't fail if the test script is removed, but it IS defined so tests always run.

## Test Commands

| Command | What it does |
|---|---|
| `npm test` | Run all tests once (`vitest run`) |
| `npx vitest` | Run tests in watch mode (development) |
| `npx vitest --ui` | Open Vitest visual UI (requires @vitest/ui) |
| `npx vitest run --reporter=verbose` | Run with detailed output |

## Recommendations for Future Development

1. **Add tests alongside new features** — each new screen, hook, and context function should ship with tests.
2. **Target useMultiTouch hook tests early** — per CLAUDE.md, touch.identifier tracking is critical and error-prone.
3. **Add GameContext reducer tests** — validate all state transitions in isolation before testing screens.
4. **Consider adding `userEvent`** from `@testing-library/user-event` for realistic interaction testing (click, type, touch).
5. **Add test coverage thresholds** once the test suite matures (e.g., `--coverage` with c8/istanbul).
