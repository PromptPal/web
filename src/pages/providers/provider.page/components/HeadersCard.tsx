import { Server } from 'lucide-react'
import { useMemo } from 'react'

interface HeadersCardProps {
  headers?: string
}

export function HeadersCard(props: HeadersCardProps) {
  const headers = useMemo<Record<string, string>>(() => {
    if (!props.headers) {
      return {}
    }
    return JSON.parse(props.headers)
  }, [props.headers])

  if (!headers || Object.keys(headers).length === 0) {
    return (
      <div className='rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-6 backdrop-blur-lg dark:from-gray-800/50 dark:to-gray-900/50'>
        <div className='flex items-center gap-2'>
          <Server className='h-5 w-5 text-gray-500 dark:text-gray-400' />
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
            HTTP Headers
          </h3>
        </div>
        <p className='mt-2 text-gray-500 dark:text-gray-400'>
          No headers configured for this provider.
        </p>
      </div>
    )
  }

  return (
    <div className='rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-6 backdrop-blur-lg dark:from-gray-800/50 dark:to-gray-900/50'>
      <div className='flex items-center gap-2'>
        <Server className='h-5 w-5 text-gray-500 dark:text-gray-400' />
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
          HTTP Headers
        </h3>
      </div>
      <div className='mt-4 space-y-3'>
        {Object.entries(headers).map(([key, value]) => (
          <div key={key} className='group relative'>
            <div className='flex items-center justify-between gap-4 rounded-md bg-gray-50 p-2 dark:bg-gray-800/40'>
              <div className='flex-shrink-0 min-w-[120px]'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  {key}
                </span>
              </div>
              <div className='flex-grow overflow-hidden rounded-md bg-gray-100 px-3 py-2 dark:bg-gray-800/70'>
                <p className='text-sm font-mono text-gray-800 dark:text-gray-200 break-all'>
                  {/* Show masked value for authorization or sensitive headers */}
                  {key.toLowerCase().includes('authorization') ||
                  key.toLowerCase().includes('key') ||
                  key.toLowerCase().includes('secret')
                    ? '••••••••••••••••••••••••••'
                    : value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
