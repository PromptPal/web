import { cn } from '@/utils';
import { Link } from '@tanstack/react-router';
import { PlusCircle } from 'lucide-react';

/**
 * Props for the PageHeader component
 */
interface PageHeaderProps {
  /**
   * Whether the action button should be disabled
   */
  isDisabled?: boolean
}

/**
 * Common page header for the providers page
 * Contains the title, description and action button
 */
export function PageHeader({ isDisabled = false }: PageHeaderProps) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-bold tracking-tight text-zinc-900 dark:text-white'>
          Providers
        </h1>
        <p className='text-sm text-zinc-600 dark:text-zinc-400'>
          Manage your LLM providers
        </p>
      </div>
      <div className='flex items-center'>
        {isDisabled
          ? (
              <button
                className={cn(
                  'inline-flex items-center justify-center rounded-lg text-sm font-medium',
                  'h-10 px-4 py-2',
                  'bg-zinc-100 text-zinc-400 dark:bg-zinc-800/80 dark:text-zinc-500',
                  'cursor-not-allowed',
                  'transition-all duration-200 ease-in-out',
                )}
                disabled
              >
                <PlusCircle className='mr-2 h-4 w-4' />
                New Provider
              </button>
            )
          : (
              <Link
                to='/providers/new'
                className={cn(
                  'inline-flex items-center justify-center rounded-lg text-sm font-medium',
                  'h-10 px-4 py-2',
                  'bg-indigo-600 text-white dark:bg-indigo-700',
                  'hover:bg-indigo-700 dark:hover:bg-indigo-600',
                  'transition-all duration-200 ease-in-out',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
                )}
              >
                <PlusCircle className='mr-2 h-4 w-4' />
                New Provider
              </Link>
            )}
      </div>
    </div>
  );
}
