import { Component } from 'react'
import type { ErrorInfo, ReactNode, Dispatch } from 'react'
import type { GameAction } from '../types/index.ts'

type InnerBoundaryProps = {
  children: ReactNode
  onError: (error: Error, info: ErrorInfo) => void
  hasError: boolean
  onReset: () => void
}

type InnerBoundaryState = {
  DerivedHasError: boolean
}

/**
 * Internal class component — React requires class components for error
 * boundaries (componentDidCatch / getDerivedStateFromError).
 * Not exported; only used by the functional ErrorBoundary wrapper.
 */
class InnerBoundary extends Component<InnerBoundaryProps, InnerBoundaryState> {
  state: InnerBoundaryState = { DerivedHasError: false }

  static getDerivedStateFromError(): InnerBoundaryState {
    return { DerivedHasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError(error, info)
  }

  render(): ReactNode {
    if (this.state.DerivedHasError || this.props.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-dvh px-6 text-center">
          <div className="mb-6 text-6xl">💥</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            တစ်ခုခု မှားသွားတယ်
          </h1>
          <p className="text-white/60 mb-8 max-w-sm">
            ဂိမ်းမှာ ပြဿနာတစ်ခု ဖြစ်သွားပါတယ်။ ပြန်စကြည့်ပါ။
          </p>
          <button
            onClick={() => {
              this.setState({ DerivedHasError: false })
              this.props.onReset()
            }}
            className="px-8 py-3 rounded-2xl font-bold text-white cursor-pointer
              bg-gradient-to-br from-[#8B2FE2] to-[#8B2FE2cc]
              shadow-[0_4px_20px_#8B2FE250,0_0_40px_#8B2FE220,inset_0_1px_0_rgba(255,255,255,0.15)]
              active:scale-95 transition-transform"
          >
            ပြန်စရန်
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

type ErrorBoundaryProps = {
  children: ReactNode
  dispatch: Dispatch<GameAction>
}

/**
 * Catches unrecoverable rendering errors and shows a friendly recovery screen.
 * On restart, dispatches RESTART to reset game state back to the start screen.
 */
export default function ErrorBoundary({ children, dispatch }: ErrorBoundaryProps) {
  const handleReset = () => {
    dispatch({ type: 'RESTART' })
  }

  const handleError = (error: Error, info: ErrorInfo) => {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  return (
    <InnerBoundary onError={handleError} hasError={false} onReset={handleReset}>
      {children}
    </InnerBoundary>
  )
}
