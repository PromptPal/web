import { motion } from 'framer-motion'
import React from 'react'
import InputField from '@annatarhe/lake-ui/form-input-field'
import TextareaField from '@annatarhe/lake-ui/form-textarea-field'
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
    <InputField
      disabled
      value={choice.message.role}
      className='w-[150px]'
    />
    <TextareaField
      value={choice.message.content}
      rows={8}
      disabled
      className='font-mono text-sm'
    />
  </motion.div>
)

export default ResponseChoiceItem
