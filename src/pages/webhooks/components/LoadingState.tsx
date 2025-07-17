import { Webhook } from 'lucide-react'

export function LoadingState() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 dark:from-gray-950 dark:via-gray-900/95 dark:to-gray-800/90'>
      <div className='absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10'></div>
      <div className='absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5 dark:from-violet-400/10 dark:via-transparent dark:to-purple-400/10'></div>

      <div className='relative z-10 flex items-center justify-center min-h-screen'>
        <div className='text-center space-y-4'>
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full blur-lg opacity-75 animate-pulse' />
            <div className='relative bg-gradient-to-br from-violet-500 to-purple-600 p-4 rounded-full shadow-lg'>
              <Webhook className='h-8 w-8 text-white animate-pulse' />
            </div>
          </div>
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Loading webhooks...
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Please wait while we fetch your webhook configurations
            </p>
          </div>

          {/* Loading skeleton */}
          <div className='mt-8 space-y-3 w-96'>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className='bg-white/20 dark:bg-gray-800/20 rounded-lg p-4 animate-pulse'>
                <div className='h-4 bg-gray-300/20 dark:bg-gray-600/20 rounded w-3/4 mb-2'></div>
                <div className='h-3 bg-gray-300/20 dark:bg-gray-600/20 rounded w-1/2'></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
