import { Code2, FileText } from 'lucide-react'
import { DetailCard } from './DetailCard'

type ConfigurationCardProps = {
  config: string | null
}

export function ConfigurationCard({ config }: ConfigurationCardProps) {
  const hasConfig = config && config.trim() !== ''

  return (
    <DetailCard title='Configuration'>
      {hasConfig
        ? (
            <div className='relative'>
              <div className='absolute top-3 right-3 z-10'>
                <div className='flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100/80 dark:bg-gray-800/80 text-xs font-medium text-gray-600 dark:text-gray-400'>
                  <Code2 className='w-3 h-3' />
                  JSON
                </div>
              </div>
              <div className='bg-gradient-to-r from-gray-50/80 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/30 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm'>
                <pre className='text-sm text-gray-800 dark:text-gray-200 font-mono overflow-auto max-h-60 leading-relaxed'>
                  <code>{config}</code>
                </pre>
              </div>
            </div>
          )
        : (
            <div className='flex flex-col items-center justify-center p-8 rounded-xl bg-gradient-to-r from-gray-50/80 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/30 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm'>
              <div className='p-3 rounded-full bg-gray-200/80 dark:bg-gray-700/80 mb-3'>
                <FileText className='w-6 h-6 text-gray-500 dark:text-gray-400' />
              </div>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>No Configuration</p>
              <p className='text-xs text-gray-500 dark:text-gray-500 text-center'>This provider uses default settings with no additional JSON configuration</p>
            </div>
          )}
    </DetailCard>
  )
}
