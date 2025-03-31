import { motion } from 'framer-motion'
import React from 'react'
import { UsageStatItem as UsageStatItemType } from './types'

type UsageStatItemProps = {
  item: UsageStatItemType
  index: number
}

/**
 * Component for displaying a single usage statistic item
 */
const UsageStatItem = ({ item, index }: UsageStatItemProps) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 + index * 0.1 }}
    className='bg-gray-800/30 backdrop-blur-xs rounded-lg p-4'
  >
    <h3 className='text-sm font-semibold uppercase text-gray-400 mb-2'>
      {item.label}
    </h3>
    <p className='text-2xl font-mono text-gray-200'>{item.value}</p>
  </motion.div>
)

export default UsageStatItem
