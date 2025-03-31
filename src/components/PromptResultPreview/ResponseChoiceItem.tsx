import { motion } from 'framer-motion'
import React from 'react'
import { ResponseChoice } from './types'

type ResponseChoiceItemProps = {
  choice: ResponseChoice
  index: number
}

/**
 * Component for rendering a single response choice
 */
const ResponseChoiceItem = ({ choice, index }: ResponseChoiceItemProps) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className='space-y-2'
  >
    <input
      type='text'
      disabled
      value={choice.message.role}
      className='w-[150px] px-3 py-2 rounded-sm bg-gray-800/50 text-gray-200 outline-hidden'
    />
    <textarea
      value={choice.message.content}
      rows={8}
      disabled
      className='w-full px-3 py-2 rounded-sm bg-gray-800/50 text-gray-200 font-mono text-sm outline-hidden resize-none'
    />
  </motion.div>
)

export default ResponseChoiceItem
