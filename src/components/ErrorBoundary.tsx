import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
  onRestart?: () => void
}

type ErrorBoundaryState = {
  hasError: boolean
}

/**
 * Catches unrecoverable rendering errors and shows a friendly recovery screen
 * instead of a blank white page.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  handleRestart = (): void => {
    this.setState({ hasError: false })
    this.props.onRestart?.()
  }

  render(): ReactNode {
    if (this.state.hasError) {
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
            onClick={this.handleRestart}
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
