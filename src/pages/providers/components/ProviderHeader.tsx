import { cn } from '@/utils'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Edit, Sparkles, Trash2, X } from 'lucide-react'

type ProviderHeaderProps = {
  provider: {
    id: number
    name: string
    description?: string | null
    enabled: boolean
  }
  className?: string
  onDeleteClick: () => void
}

export function ProviderHeader({
  provider,
  className,
  onDeleteClick,
}: ProviderHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'relative rounded-2xl overflow-hidden',
        'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
        'shadow-sm hover:shadow-lg transition-all duration-300',
        'border border-gray-200/50 dark:border-gray-600/50',
        className,
      )}
    >
      {/* Background gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-400/10 dark:via-transparent dark:to-purple-400/10 pointer-events-none' />

      <div className='relative p-6'>
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
          <div className='space-y-4'>
            <div className='flex items-center gap-4'>
              <div className='p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-400/30 dark:to-purple-400/30 backdrop-blur-sm border border-blue-500/20 dark:border-blue-400/30'>
                <Sparkles className='w-8 h-8 text-blue-600 dark:text-blue-400' />
              </div>
              <div className='space-y-2'>
                <h1 className='text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent'>
                  {provider.name}
                </h1>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium',
                    'backdrop-blur-sm border shadow-sm',
                    provider.enabled
                      ? 'bg-green-50/80 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200/50 dark:border-green-800/50'
                      : 'bg-red-50/80 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200/50 dark:border-red-800/50',
                  )}
                >
                  {provider.enabled
                    ? (
                        <>
                          <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
                          <span>Active</span>
                        </>
                      )
                    : (
                        <>
                          <X className='h-3 w-3' />
                          <span>Inactive</span>
                        </>
                      )}
                </motion.div>
              </div>
            </div>
            <p className='text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl'>
              {provider.description || 'No description provided for this provider'}
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to='/providers/$id/edit'
                params={{ id: provider.id.toString() }}
                className={cn(
                  'group inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium',
                  'bg-blue-50/80 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300',
                  'hover:bg-blue-100/80 dark:hover:bg-blue-900/40',
                  'border border-blue-200/50 dark:border-blue-800/50',
                  'shadow-sm hover:shadow-md transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
                )}
              >
                <Edit className='w-4 h-4 transition-transform duration-200 group-hover:scale-110' />
                <span>Edit Provider</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                onClick={onDeleteClick}
                className={cn(
                  'group inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium',
                  'bg-red-50/80 dark:bg-red-950/30 text-red-700 dark:text-red-300',
                  'hover:bg-red-100/80 dark:hover:bg-red-900/40',
                  'border border-red-200/50 dark:border-red-800/50',
                  'shadow-sm hover:shadow-md transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50',
                )}
              >
                <Trash2 className='w-4 h-4 transition-transform duration-200 group-hover:scale-110' />
                <span>Delete</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
