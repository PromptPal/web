import { ExternalLink, Layers, Server, Settings } from 'lucide-react'
import { DetailCard } from './DetailCard'

type ProviderDetailsProps = {
  provider: {
    source: string
    endpoint?: string | null
    defaultModel?: string | null
    organizationId?: string | null
  }
}

export function ProviderDetails({ provider }: ProviderDetailsProps) {
  return (
    <DetailCard title='Provider Details'>
      <div className='p-4 rounded-xl bg-gradient-to-r from-sky-50/80 to-blue-50/80 dark:from-sky-950/30 dark:to-blue-950/30 border border-sky-200/50 dark:border-sky-800/50'>
        <div className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-2'>
          Source Provider
        </div>
        <div className='flex items-center gap-3'>
          <div className='p-2 rounded-lg bg-sky-100/80 dark:bg-sky-900/40'>
            <Server className='h-4 w-4 text-sky-600 dark:text-sky-400' />
          </div>
          <span className='font-semibold text-gray-900 dark:text-white capitalize'>{provider.source}</span>
        </div>
      </div>

      <div className='p-4 rounded-xl bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200/50 dark:border-green-800/50'>
        <div className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-2'>
          API Endpoint
        </div>
        <div className='flex items-center gap-3'>
          <div className='p-2 rounded-lg bg-green-100/80 dark:bg-green-900/40'>
            <ExternalLink className='h-4 w-4 text-green-600 dark:text-green-400' />
          </div>
          <span className='font-medium text-gray-900 dark:text-white break-all text-sm'>
            {provider.endpoint || 'Not specified'}
          </span>
        </div>
      </div>

      <div className='p-4 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/50 dark:border-blue-800/50'>
        <div className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-2'>
          Default Model
        </div>
        <div className='flex items-center gap-3'>
          <div className='p-2 rounded-lg bg-blue-100/80 dark:bg-blue-900/40'>
            <Settings className='h-4 w-4 text-blue-600 dark:text-blue-400' />
          </div>
          <span className='font-medium text-gray-900 dark:text-white'>
            {provider.defaultModel || 'Not specified'}
          </span>
        </div>
      </div>

      <div className='p-4 rounded-xl bg-gradient-to-r from-orange-50/80 to-amber-50/80 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200/50 dark:border-orange-800/50'>
        <div className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-2'>
          Organization ID
        </div>
        <div className='flex items-center gap-3'>
          <div className='p-2 rounded-lg bg-orange-100/80 dark:bg-orange-900/40'>
            <Layers className='h-4 w-4 text-orange-600 dark:text-orange-400' />
          </div>
          <span className='font-medium text-gray-900 dark:text-white break-all text-sm'>
            {provider.organizationId || 'Not specified'}
          </span>
        </div>
      </div>
    </DetailCard>
  )
}
