import { Link } from '@tanstack/react-router'
import { Server } from 'lucide-react'

/**
 * Empty state component for providers page
 * Displayed when no providers are found
 */
export function EmptyState() {
  return (
    <div className='rounded-lg border bg-card p-8 text-card-foreground shadow-sm'>
      <div className='flex flex-col items-center justify-center space-y-4'>
        <Server className='h-12 w-12 text-muted-foreground' />
        <h2 className='text-xl font-semibold'>No Providers Found</h2>
        <p className='text-center text-muted-foreground'>
          You haven't created any providers yet.
        </p>
        <Link
          to='/providers/new'
          className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
        >
          Create Your First Provider
        </Link>
      </div>
    </div>
  )
}
