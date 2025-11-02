'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary component to catch and display React errors
 * Prevents the entire app from crashing when a component throws an error
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    })

    // In production, you could send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-sage-light flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white border-2 border-black p-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-8 w-8 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold uppercase tracking-wider mb-4">
                  Something Went Wrong
                </h1>

                <p className="text-gray-700 mb-4">
                  The application encountered an unexpected error. This has been logged
                  and we'll look into it.
                </p>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mb-4">
                    <summary className="cursor-pointer text-sm uppercase tracking-wider font-bold mb-2">
                      Error Details (Development Only)
                    </summary>
                    <div className="bg-red-50 border border-red-200 p-4 rounded font-mono text-xs overflow-auto">
                      <div className="mb-2">
                        <strong>Error:</strong> {this.state.error.toString()}
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="whitespace-pre-wrap mt-2">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={this.handleReset}
                    className="bg-terracotta hover:bg-terracotta-dark text-black border border-black"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/'}
                    className="bg-sage hover:bg-sage-dark text-black border border-black"
                  >
                    Go Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
