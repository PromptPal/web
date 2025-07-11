import { cn } from '@/utils'
import { Link } from '@tanstack/react-router'
import { PlusCircle, Server, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Props for the PageHeader component
 */
interface PageHeaderProps {
  /**
   * Whether the action button should be disabled
   */
  isDisabled?: boolean
}

/**
 * Common page header for the providers page
 * Contains the title, description and action button
 */
export function PageHeader({ isDisabled = false }: PageHeaderProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='relative overflow-hidden mb-8'
    >
      <div className='absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-blue-500/10 dark:from-sky-400/15 dark:via-transparent dark:to-blue-400/15 blur-3xl' />
      <div className='relative backdrop-blur-md bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl rounded-2xl'>
        <div className='p-8'>
          <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-gradient-to-br from-sky-500 to-blue-500'>
                  <Server className='w-6 h-6 text-white' />
                </div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent'>
                  Providers
                </h1>
              </div>
              <p className='text-gray-600 dark:text-gray-300 max-w-xl'>
                Configure and manage your AI providers with secure credential storage and real-time monitoring
              </p>
            </div>
            <div className='flex items-center'>
              {isDisabled
                ? (
                    <button
                      className={cn(
                        'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm',
                        'bg-gray-200/50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 cursor-not-allowed',
                        'transition-all duration-200 ease-in-out',
                      )}
                      disabled
                    >
                      <PlusCircle className='w-4 h-4' />
                      New Provider
                    </button>
                  )
                : (
                    <Link
                      to='/providers/new'
                      className='group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-xl shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/40'
                    >
                      <div className='absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300' />
                      <PlusCircle className='w-4 h-4 relative z-10' />
                      <span className='relative z-10'>Add Provider</span>
                      <Sparkles className='w-4 h-4 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                    </Link>
                  )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
