import { motion } from 'framer-motion'
import { ReactNode } from 'react'

type DetailCardProps = {
  title: string
  children: ReactNode
  className?: string
}

export function DetailCard({
  title,
  children,
  className = '',
}: DetailCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group relative rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50 ${className}`}
    >
      {/* Subtle gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-gray-50/30 via-transparent to-gray-100/20 dark:from-gray-700/20 dark:via-transparent dark:to-gray-600/10 rounded-2xl pointer-events-none' />

      <div className='relative p-6 h-full'>
        <h2 className='text-xl font-semibold mb-6 text-gray-900 dark:text-white'>
          {title}
        </h2>
        <div className='space-y-4'>{children}</div>
      </div>
    </motion.div>
  )
}
