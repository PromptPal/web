import { Sliders, Thermometer, Zap } from 'lucide-react'
import { DetailCard } from './DetailCard'

type ModelParametersProps = {
  provider: {
    temperature: number
    topP: number
    maxTokens: number
  }
}

export function ModelParameters({ provider }: ModelParametersProps) {
  return (
    <DetailCard title='Model Parameters'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4'>
        <div className='p-4 rounded-xl bg-gradient-to-r from-orange-50/80 to-red-50/80 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-200/50 dark:border-orange-800/50'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='p-2 rounded-lg bg-orange-100/80 dark:bg-orange-900/40'>
              <Thermometer className='h-4 w-4 text-orange-600 dark:text-orange-400' />
            </div>
            <div className='text-sm font-medium text-gray-600 dark:text-gray-400'>
              Temperature
            </div>
          </div>
          <div className='ml-11'>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>{provider.temperature}</div>
            <div className='text-xs text-gray-500 dark:text-gray-500 mt-1'>Randomness control</div>
          </div>
        </div>

        <div className='p-4 rounded-xl bg-gradient-to-r from-cyan-50/80 to-blue-50/80 dark:from-cyan-950/30 dark:to-blue-950/30 border border-cyan-200/50 dark:border-cyan-800/50'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='p-2 rounded-lg bg-cyan-100/80 dark:bg-cyan-900/40'>
              <Sliders className='h-4 w-4 text-cyan-600 dark:text-cyan-400' />
            </div>
            <div className='text-sm font-medium text-gray-600 dark:text-gray-400'>
              Top P
            </div>
          </div>
          <div className='ml-11'>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>{provider.topP}</div>
            <div className='text-xs text-gray-500 dark:text-gray-500 mt-1'>Nucleus sampling</div>
          </div>
        </div>

        <div className='p-4 rounded-xl bg-gradient-to-r from-emerald-50/80 to-green-50/80 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-200/50 dark:border-emerald-800/50 sm:col-span-2 lg:col-span-1 xl:col-span-2'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='p-2 rounded-lg bg-emerald-100/80 dark:bg-emerald-900/40'>
              <Zap className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
            </div>
            <div className='text-sm font-medium text-gray-600 dark:text-gray-400'>
              Max Tokens
            </div>
          </div>
          <div className='ml-11'>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>{provider.maxTokens.toLocaleString()}</div>
            <div className='text-xs text-gray-500 dark:text-gray-500 mt-1'>Maximum response length</div>
          </div>
        </div>
      </div>
    </DetailCard>
  )
}
