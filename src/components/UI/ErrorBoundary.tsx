import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  resetKey?: string | number
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  prevResetKey?: string | number
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  static getDerivedStateFromProps(
    props: ErrorBoundaryProps,
    state: ErrorBoundaryState,
  ): ErrorBoundaryState {
    if (state.hasError && state.prevResetKey !== props.resetKey) {
      return { hasError: false, error: null, prevResetKey: props.resetKey }
    }
    return { ...state, prevResetKey: props.resetKey }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children
    }

    if (this.props.fallback) {
      return this.props.fallback
    }

    return (
      <div className="w-full h-full min-h-[40vh] flex flex-col items-center justify-center gap-4 p-8 text-center">
        <h2 className="text-xl font-bold text-neutral-700">该内容暂时无法显示</h2>
        <p className="text-sm text-neutral-500 max-w-md">
          渲染时发生了错误，可尝试重试。若问题持续，请返回上一页或刷新。
        </p>
        <button
          onClick={this.handleReset}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:scale-[0.97]"
        >
          重试
        </button>
      </div>
    )
  }
}
