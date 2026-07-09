# Testing Strategy — Truth/Dare Finger Roulette

## Framework and Configuration

### Core Stack

| Tool | Version | Purpose |
|---|---|---|
| **Vitest** | ^3.2.7 | Test runner (Vite-native) |
| **jsdom** | ^27.0.1 | Browser environment simulation |
| **@testing-library/react** | ^16.3.2 | Component rendering and querying |
| **@testing-library/jest-dom** | ^6.9.1 | Custom DOM matchers (toBeInTheDocument, etc.) |
| **@vitest/ui** | ^3.2.7 | Visual test UI (dev dependency) |

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
  App.test.tsx     <-- co-located
  hooks/
    useMultiTouch.ts
    useMultiTouch.test.ts   <-- expected pattern (not yet created)
  state/
    GameContext.tsx
    GameContext.test.tsx     <-- expected pattern (not yet created)
```

There is **no separate `__tests__/` directory** or `tests/` folder. The architecture doc mentions a `tests/` folder, but the actual convention is co-location.

## What Is Currently Tested

### Coverage: Smoke Test Only

The single existing test file (`src/App.test.tsx`):

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('Get started')).toBeInTheDocument()
  })
})
```

**What this covers:**
- The `App` component renders to the DOM without throwing.
- A specific text element ("Get started") is present in the output.

**What this does NOT cover:**
- Interactive behavior (button clicks, state changes)
- CSS/layout
- Accessibility
- Edge cases

## What Is NOT Tested Yet (Gaps)

The project has stub files and planned features with zero test coverage:

| Area | File | Status |
|---|---|---|
| **Screen components** | `src/screens/*.tsx` | Directory does not exist yet |
| **Game state management** | `src/state/GameContext.tsx` | Empty stub file |
| **Card data and filtering** | `src/data/cards.ts` | Empty stub file |
| **Multi-touch hook** | `src/hooks/useMultiTouch.ts` | Empty stub file |
| **Type definitions** | `src/types/index.ts` | Empty stub file |
| **PWA service worker** | (vite-plugin-pwa) | Not tested |
| **Game flow integration** | Start -> Setup -> Touch -> Truth/Dare -> Reveal | No integration tests |

### Priority Gaps (as the app develops)

1. **GameContext** — state transitions, reducer logic, context provider behavior
2. **useMultiTouch hook** — touch event handling, identifier tracking (critical path per CLAUDE.md)
3. **Card data** — filtering by pack/difficulty/type, data integrity
4. **Screen components** — each screen's render and interaction
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

No mocks are in use yet. Expected patterns as the app grows:

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
