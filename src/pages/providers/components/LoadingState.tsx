import { PlusCircle } from 'lucide-react'

/**
 * Loading state component for providers page
 * Displays a skeleton UI while providers are being loaded
 */
export function LoadingState() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex items-center justify-between mb-8'>
        <div className='space-y-1'>
          <h1 className='text-2xl font-bold tracking-tight text-foreground dark:text-white'>Providers</h1>
          <p className='text-sm text-muted-foreground dark:text-gray-400'>
            Manage your LLM providers
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <button
            className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
            disabled
          >
            <PlusCircle className='mr-2 h-4 w-4' />
            New Provider
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className='rounded-lg p-0.5 bg-gradient-to-br from-primary/20 via-primary/10 to-background/5 overflow-hidden'
          >
            <div className='h-40 rounded-lg bg-card p-6 flex flex-col justify-between backdrop-blur-md animate-pulse'>
              <div className='space-y-3'>
                <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4'></div>
                <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
              </div>
              <div className='flex justify-between items-center'>
                <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4'></div>
                <div className='h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full'></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
