import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterAll, afterEach } from 'vitest'
import ErrorBoundary from './ErrorBoundary'
import type { Dispatch } from 'react'
import type { GameAction } from '../types/index.ts'

function ThrowingComponent(): React.JSX.Element {
  throw new Error('test crash')
}

function GoodComponent() {
  return <div>all good</div>
}

function makeDispatch(): Dispatch<GameAction> {
  return vi.fn() as unknown as Dispatch<GameAction>
}

describe('ErrorBoundary', () => {
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

  afterEach(() => {
    cleanup()
  })

  afterAll(() => {
    spy.mockRestore()
  })

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary dispatch={makeDispatch()}>
        <GoodComponent />
      </ErrorBoundary>,
    )
    expect(screen.getByText('all good')).toBeInTheDocument()
  })

  it('shows fallback UI when a child throws', () => {
    render(
      <ErrorBoundary dispatch={makeDispatch()}>
        <ThrowingComponent />
      </ErrorBoundary>,
    )
    expect(screen.getByText('တစ်ခုခု မှားသွားတယ်')).toBeInTheDocument()
    expect(screen.getByText('ပြန်စရန်')).toBeInTheDocument()
  })

  it('dispatches RESTART when the restart button is clicked', () => {
    const dispatch = makeDispatch()
    render(
      <ErrorBoundary dispatch={dispatch}>
        <ThrowingComponent />
      </ErrorBoundary>,
    )
    screen.getByText('ပြန်စရန်').click()
    expect(dispatch).toHaveBeenCalledWith({ type: 'RESTART' })
  })
})
