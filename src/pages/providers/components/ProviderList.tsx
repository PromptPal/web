import Tooltip from '@annatarhe/lake-ui/tooltip'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Server, X } from 'lucide-react'

/**
 * Provider interface representing the structure of a provider item
 */
interface Provider {
  id: string | number
  name: string
  description?: string
  enabled?: boolean
  source?: string
}

/**
 * ProviderList component for displaying a grid of provider cards
 */
interface ProviderListProps {
  providers: Provider[]
}

export function ProviderList({ providers }: ProviderListProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
      {providers.map((provider, index) => (
        <motion.div
          key={provider.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Link
            to='/providers/$id'
            params={{ id: provider.id.toString() }}
            className='group block h-full'
          >
            <div className='relative h-full rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50 overflow-hidden'>
              {/* Background gradient overlay */}
              <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-400/10 dark:via-transparent dark:to-purple-400/10 pointer-events-none' />

              <div className='relative p-6 h-full flex flex-col'>
                {/* Header */}
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-400/30 dark:to-purple-400/30 backdrop-blur-sm border border-blue-500/20 dark:border-blue-400/30'>
                      <Server className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <Tooltip content={provider.name}>
                        <h3 className='font-semibold text-lg text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 max-w-48'>
                          {provider.name}
                        </h3>
                      </Tooltip>
                      {provider.source && (
                        <p className='text-sm text-gray-500 dark:text-gray-400 capitalize truncate'>
                          {provider.source}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
                    provider.enabled !== false
                      ? 'bg-green-50/80 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200/50 dark:border-green-800/50'
                      : 'bg-red-50/80 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200/50 dark:border-red-800/50'
                  }`}
                  >
                    {provider.enabled !== false
                      ? (
                          <>
                            <div className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse' />
                            <span>Active</span>
                          </>
                        )
                      : (
                          <>
                            <X className='w-3 h-3' />
                            <span>Inactive</span>
                          </>
                        )}
                  </div>
                </div>

                {/* Description */}
                <div className='flex-1 mb-4'>
                  <Tooltip content={provider.description || 'No description provided for this provider'}>
                    <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed'>
                      {provider.description || 'No description provided for this provider'}
                    </p>
                  </Tooltip>
                </div>

                {/* Footer */}
                <div className='flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-600/50'>
                  <span className='text-xs text-gray-500 dark:text-gray-500'>
                    ID:
                    {' '}
                    {provider.id}
                  </span>
                  <div className='flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200'>
                    <span>View Details</span>
                    <ArrowRight className='w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                  </div>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none' />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
