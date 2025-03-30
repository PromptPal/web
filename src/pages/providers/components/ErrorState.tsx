import { ApolloError } from '@apollo/client'
import { Server } from 'lucide-react'

/**
 * Error state component for providers page
 * Displays an error message when providers fail to load
 */
interface ErrorStateProps {
  error: ApolloError
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='rounded-lg border bg-card p-8 text-card-foreground shadow-sm'>
        <div className='flex flex-col items-center justify-center space-y-4'>
          <Server className='h-12 w-12 text-destructive' />
          <h2 className='text-xl font-semibold'>Error Loading Providers</h2>
          <p className='text-center text-muted-foreground'>
            {error.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}
