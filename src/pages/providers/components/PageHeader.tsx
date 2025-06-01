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
    <div className='flex items-center justify-between mb-8 bg-primary p-4 rounded-md'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-bold tracking-tight text-primary-foreground'>
          Providers
        </h1>
        <p className='text-sm text-primary-foreground'>
          Manage your LLM providers
        </p>
      </div>
      <div className='flex items-center gap-2'>
        {isDisabled
          ? (
              <button
                className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
                disabled
              >
                <PlusCircle className='mr-2 h-4 w-4' />
                New Provider
              </button>
            )
          : (
              <Link
                to='/providers/new'
                className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
              >
                <PlusCircle className='mr-2 h-4 w-4' />
                New Provider
              </Link>
            )}
      </div>
    </div>
  );
}
