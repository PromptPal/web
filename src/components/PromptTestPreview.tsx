import { motion } from 'framer-motion'
import { MessageSquare, Zap } from 'lucide-react'
import { testPromptResponse } from '../service/prompt'

type PromptTestPreviewProps = {
  data: testPromptResponse | null
}

function PromptTestPreview(props: PromptTestPreviewProps) {
  const { data } = props
  if (!data) {
    return (
      <div className='p-8 rounded-lg bg-linear-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl'>
        <h2 className='text-xl font-bold text-gray-200'>
          No Preview Available
        </h2>
        <p className='text-gray-400 mt-2'>
          Test your prompt to see the results here
        </p>
      </div>
    )
  }
  return (
    <div className='w-full flex flex-col md:flex-row gap-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex-1'
      >
        <div className='p-6 rounded-lg bg-linear-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl shadow-lg'>
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <MessageSquare size={20} className='text-blue-400' />
              <h2 className='text-xl font-bold text-gray-200'>Response</h2>
            </div>
            <div className='space-y-4'>
              {data.choices.map((choice, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
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
              ))}
            </div>
          </div>
        </div>
      </motion.div>

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
              {[
                { label: 'Prompt Tokens', value: data.usage.prompt_tokens },
                {
                  label: 'Completion Tokens',
                  value: data.usage.completion_tokens,
                },
                { label: 'Total Tokens', value: data.usage.total_tokens },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className='bg-gray-800/30 backdrop-blur-xs rounded-lg p-4'
                >
                  <h3 className='text-sm font-semibold uppercase text-gray-400 mb-2'>
                    {item.label}
                  </h3>
                  <p className='text-2xl font-mono text-gray-200'>
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default PromptTestPreview
