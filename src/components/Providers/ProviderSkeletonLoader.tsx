import { Loader2 } from 'lucide-react'
import React from 'react'

export const ProviderSkeletonLoader: React.FC = () => {
  return (
    <div className='mt-6'>
      <div className='bg-white/[0.03] border border-white/10 rounded-xl p-6 relative overflow-hidden'>
        {/* Loading overlay */}
        <div className='absolute inset-0 bg-gray-900/40 backdrop-blur-sm rounded-xl flex items-center justify-center z-10'>
          <div className='bg-gray-800/80 backdrop-blur-md rounded-lg p-4 shadow-lg border border-gray-700/50 flex items-center gap-3'>
            <Loader2 className='w-5 h-5 text-blue-400 animate-spin' />
            <span className='text-sm text-gray-300 font-medium'>Loading provider...</span>
          </div>
        </div>

        {/* Header skeleton */}
        <div className='flex items-start justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-lg bg-white/[0.05] border border-white/10 animate-pulse' />
            <div>
              <div className='h-5 w-32 bg-gray-700/50 rounded animate-pulse mb-2' />
              <div className='h-4 w-24 bg-gray-700/30 rounded animate-pulse' />
            </div>
          </div>
          <div className='h-6 w-16 bg-gray-700/40 rounded-md animate-pulse' />
        </div>

        {/* Description skeleton */}
        <div className='mb-4'>
          <div className='h-4 w-full bg-gray-700/30 rounded animate-pulse mb-2' />
          <div className='h-4 w-3/4 bg-gray-700/30 rounded animate-pulse' />
        </div>

        {/* Content grid skeleton */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='space-y-4'>
              {/* Section header */}
              <div className='flex items-center gap-2 pb-2 border-b border-white/10'>
                <div className='w-4 h-4 bg-gray-700/40 rounded animate-pulse' />
                <div className='h-4 w-20 bg-gray-700/40 rounded animate-pulse' />
              </div>

              {/* Section items */}
              <div className='space-y-3'>
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className='flex items-center gap-3 py-2 px-3 rounded-lg'>
                    <div className='w-4 h-4 bg-gray-700/40 rounded animate-pulse flex-shrink-0' />
                    <div className='flex-1 min-w-0 space-y-1'>
                      <div className='h-3 w-16 bg-gray-700/30 rounded animate-pulse' />
                      <div className='h-4 w-24 bg-gray-700/40 rounded animate-pulse' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
