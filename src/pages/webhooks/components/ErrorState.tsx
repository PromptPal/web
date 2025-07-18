import { AlertTriangle, RefreshCw } from 'lucide-react'
import { ApolloError } from '@apollo/client'

interface ErrorStateProps {
  error: ApolloError
  onRetry?: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 dark:from-gray-950 dark:via-gray-900/95 dark:to-gray-800/90'>
      <div className='absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10'></div>
      <div className='absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5 dark:from-red-400/10 dark:via-transparent dark:to-orange-400/10'></div>

      <div className='relative z-10 flex items-center justify-center min-h-screen'>
        <div className='text-center space-y-6 max-w-md'>
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-red-600 to-orange-600 rounded-full blur-lg opacity-75' />
            <div className='relative bg-gradient-to-br from-red-500 to-orange-600 p-4 rounded-full shadow-lg'>
              <AlertTriangle className='h-8 w-8 text-white' />
            </div>
          </div>

          <div className='space-y-2'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Failed to load webhooks
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {error.message || 'An unexpected error occurred while fetching webhook data.'}
            </p>
          </div>

          {onRetry && (
            <button
              onClick={onRetry}
              className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
            >
              <RefreshCw className='h-4 w-4' />
              Try again
            </button>
          )}

          <div className='mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800'>
            <details className='text-left'>
              <summary className='text-sm font-medium text-red-800 dark:text-red-200 cursor-pointer'>
                Technical details
              </summary>
              <pre className='mt-2 text-xs text-red-600 dark:text-red-300 overflow-x-auto'>
                {error.message}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}
