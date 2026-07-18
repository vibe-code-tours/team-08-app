import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterAll, afterEach } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'

// eslint-disable-next-line react-refresh/only-export-components
function ThrowingComponent(): React.JSX.Element {
  throw new Error('test crash')
}

function GoodComponent() {
  return <div>all good</div>
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
      <ErrorBoundary>
        <GoodComponent />
      </ErrorBoundary>,
    )
    expect(screen.getByText('all good')).toBeInTheDocument()
  })

  it('shows fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    )
    expect(screen.getByText('တစ်ခုခု မှားသွားတယ်')).toBeInTheDocument()
    expect(screen.getByText('ပြန်စရန်')).toBeInTheDocument()
  })

  it('calls onRestart when the restart button is clicked', () => {
    const onRestart = vi.fn()
    render(
      <ErrorBoundary onRestart={onRestart}>
        <ThrowingComponent />
      </ErrorBoundary>,
    )
    screen.getByText('ပြန်စရန်').click()
    expect(onRestart).toHaveBeenCalledOnce()
  })
})
