import { cn } from '@/utils'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { PlusCircle, Server, Sparkles } from 'lucide-react'

/**
 * Empty state component for providers page
 * Displayed when no providers are found
 */
export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'relative rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
        'border border-gray-200/50 dark:border-gray-600/50',
        'shadow-sm hover:shadow-md transition-all duration-300',
        'p-8 sm:p-12 text-center',
        'flex flex-col items-center justify-center space-y-8 min-h-[400px]',
      )}
    >
      {/* Background gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-blue-500/5 dark:from-sky-400/10 dark:via-transparent dark:to-blue-400/10 rounded-2xl pointer-events-none' />

      <div className='relative z-10 space-y-8'>
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className='flex justify-center'
        >
          <div className='p-6 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-sky-400/30 dark:to-blue-400/30 backdrop-blur-sm border border-sky-500/20 dark:border-sky-400/30'>
            <Server className='h-12 w-12 text-sky-600 dark:text-sky-400' />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className='space-y-4'
        >
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            No Providers Found
          </h2>
          <p className='text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed'>
            It looks like you haven&apos;t added any AI providers yet. Get started by creating your first one to begin managing your prompts.
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Link
            to='/providers/new'
            className={cn(
              'group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white',
              'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600',
              'transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50',
            )}
          >
            <div className='absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300' />
            <PlusCircle className='w-4 h-4 relative z-10' />
            <span className='relative z-10'>Create Your First Provider</span>
            <Sparkles className='w-4 h-4 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
