import { Globe, Lock, Server } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface HeadersCardProps {
  headers?: string
}

export function HeadersCard(props: HeadersCardProps) {
  const headers = useMemo<Record<string, string>>(() => {
    if (!props.headers) {
      return {}
    }
    try {
      return JSON.parse(props.headers)
    }
    catch {
      return {}
    }
  }, [props.headers])

  const hasHeaders = headers && Object.keys(headers).length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='group relative rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50'
    >
      {/* Subtle gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-gray-50/30 via-transparent to-gray-100/20 dark:from-gray-700/20 dark:via-transparent dark:to-gray-600/10 rounded-2xl pointer-events-none' />

      <div className='relative p-6 h-full'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm border border-blue-500/20'>
            <Globe className='w-5 h-5 text-blue-400' />
          </div>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
            HTTP Headers
          </h2>
        </div>

        {hasHeaders
          ? (
              <div className='space-y-3'>
                {Object.entries(headers).map(([key, value], index) => {
                  const isSensitive = key.toLowerCase().includes('authorization')
                    || key.toLowerCase().includes('key')
                    || key.toLowerCase().includes('secret')

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                      className='group/item p-4 rounded-xl bg-gradient-to-r from-slate-50/80 to-slate-100/60 dark:from-slate-900/50 dark:to-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-200'
                    >
                      <div className='flex items-center justify-between gap-4'>
                        <div className='flex items-center gap-3 min-w-0'>
                          <div className='flex-shrink-0'>
                            {isSensitive
                              ? (
                                  <div className='p-1.5 rounded-lg bg-orange-100/80 dark:bg-orange-900/40'>
                                    <Lock className='w-3.5 h-3.5 text-orange-600 dark:text-orange-400' />
                                  </div>
                                )
                              : (
                                  <div className='p-1.5 rounded-lg bg-blue-100/80 dark:bg-blue-900/40'>
                                    <Server className='w-3.5 h-3.5 text-blue-600 dark:text-blue-400' />
                                  </div>
                                )}
                          </div>
                          <div className='min-w-0'>
                            <div className='text-sm font-medium text-gray-700 dark:text-gray-300 truncate'>
                              {key}
                            </div>
                            <div className='text-xs text-gray-500 dark:text-gray-500 mt-0.5'>
                              {isSensitive ? 'Sensitive header' : 'Custom header'}
                            </div>
                          </div>
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='text-right'>
                            <code className='text-sm font-mono text-gray-800 dark:text-gray-200 bg-gray-100/80 dark:bg-gray-800/80 px-3 py-1.5 rounded-lg break-all'>
                              {isSensitive ? '••••••••••••••••••••••••••' : value}
                            </code>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )
          : (
              <div className='flex flex-col items-center justify-center p-8 rounded-xl bg-gradient-to-r from-gray-50/80 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/30 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm'>
                <div className='p-3 rounded-full bg-gray-200/80 dark:bg-gray-700/80 mb-3'>
                  <Globe className='w-6 h-6 text-gray-500 dark:text-gray-400' />
                </div>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>No Headers Configured</p>
                <p className='text-xs text-gray-500 dark:text-gray-500 text-center'>This provider uses default HTTP headers with no custom headers configured</p>
              </div>
            )}
      </div>
    </motion.div>
  )
}
