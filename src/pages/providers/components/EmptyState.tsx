import { cn } from '@/utils'
import { Link } from '@tanstack/react-router'
import { PlusCircle, Server } from 'lucide-react'

/**
 * Empty state component for providers page
 * Displayed when no providers are found
 */
export function EmptyState() {
  return (
    <div className={cn(
      'rounded-2xl border border-zinc-200 dark:border-zinc-800',
      'bg-white dark:bg-zinc-900',
      'p-8 sm:p-12 text-center shadow-lg',
      'flex flex-col items-center justify-center space-y-6 min-h-[400px]',
    )}
    >
      <Server className='h-16 w-16 text-indigo-500 dark:text-indigo-400' />
      <div className='space-y-2'>
        <h2 className='text-2xl font-bold text-zinc-900 dark:text-white'>
          No Providers Found
        </h2>
        <p className='text-zinc-600 dark:text-zinc-400 max-w-sm'>
          It looks like you haven&apos;t added any LLM providers yet. Get started by creating your first one.
        </p>
      </div>
      <Link
        to='/providers/new'
        className={cn(
          'inline-flex items-center justify-center rounded-lg text-sm font-medium',
          'h-10 px-6 py-2 mt-4',
          'bg-indigo-600 text-white dark:bg-indigo-700',
          'hover:bg-indigo-700 dark:hover:bg-indigo-600',
          'transition-all duration-200 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900',
          'shadow-md hover:shadow-lg',
        )}
      >
        <PlusCircle className='mr-2 h-4 w-4' />
        Create Your First Provider
      </Link>
    </div>
  )
}
