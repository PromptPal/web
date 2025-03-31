import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import React from 'react'
import { testPromptResponse } from '../../service/prompt'
import UsageStatItem from './UsageStatItem'

type UsageStatisticsProps = {
  usage: testPromptResponse['usage']
}

/**
 * Component for displaying usage statistics
 */
const UsageStatistics = ({ usage }: UsageStatisticsProps) => {
  const usageItems = [
    { label: 'Prompt Tokens', value: usage.prompt_tokens },
    { label: 'Completion Tokens', value: usage.completion_tokens },
    { label: 'Total Tokens', value: usage.total_tokens },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className='flex-1'
    >
      <div className='p-6 rounded-lg bg-linear-to-br from-emerald-500/10 to-cyan-500/10 backdrop-blur-xl shadow-lg'>
        <div className='space-y-6'>
          <div className='flex items-center gap-2'>
            <Zap size={20} className='text-emerald-400' />
            <h2 className='text-xl font-bold text-gray-200'>
              Usage Statistics
            </h2>
          </div>
          <div className='grid gap-4'>
            {usageItems.map((item, i) => (
              <UsageStatItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default UsageStatistics
