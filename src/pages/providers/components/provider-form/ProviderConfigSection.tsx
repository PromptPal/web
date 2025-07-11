import InputField from '@annatarhe/lake-ui/form-input-field'
import SelectField from '@annatarhe/lake-ui/form-select-field'
import Tooltip from '@annatarhe/lake-ui/tooltip'
import { motion } from 'framer-motion'
import { ExternalLink, Info, Settings } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { ProviderFormValues } from './schema'

type ProviderConfigSectionProps = {
  form: UseFormReturn<ProviderFormValues>
}

export const ProviderConfigSection = ({ form }: ProviderConfigSectionProps) => {
  const {
    register,
    formState: { errors },
    watch,
  } = form

  // Watch source value for conditional rendering
  const source = watch('source')

  return (
    <div className='group relative'>
      <div className='relative rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-300'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='p-2 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 backdrop-blur-sm border border-sky-500/20'>
            <Settings className='w-5 h-5 text-sky-400' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Provider Configuration
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Configure connection settings and authentication
            </p>
          </div>
        </div>

        <div className='space-y-6'>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='space-y-3'
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <label className='text-sm font-medium leading-none text-gray-700 dark:text-gray-300'>Provider Source</label>
                <Tooltip content='The AI provider service you want to connect to'>
                  <Info className='w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-sky-400 dark:hover:text-sky-300 transition-colors' />
                </Tooltip>
              </div>
              <a
                href='https://platform.openai.com/docs/models/overview'
                className='inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 text-xs group transition-all duration-200 hover:bg-sky-500/10 px-2 py-1 rounded-lg'
                target='_blank'
                rel='noreferrer'
              >
                View providers
                <ExternalLink className='w-3 h-3 group-hover:translate-x-0.5 transition-transform' />
              </a>
            </div>
            <div className='relative'>
              <SelectField
                label={null}
                {...register('source')}
                options={[
                  { value: 'openai', label: '🤖 OpenAI' },
                  { value: 'anthropic', label: '🧠 Anthropic' },
                  { value: 'gemini', label: '💎 Gemini' },
                  { value: 'deepseek', label: '🔍 DeepSeek' },
                  { value: 'custom', label: '⚙️ Custom' },
                ]}
                className='bg-background/40 dark:bg-background/20 border-border/30 hover:bg-background/60 dark:hover:bg-background/30'
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='space-y-3'
          >
            <div className='flex items-center gap-2'>
              <label className='text-sm font-medium leading-none text-gray-700 dark:text-gray-300'>
                Endpoint URL
              </label>
              <Tooltip content='The API endpoint URL for your provider service'>
                <Info className='w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-sky-400 dark:hover:text-sky-300 transition-colors' />
              </Tooltip>
            </div>
            <InputField
              type='url'
              label={null}
              {...register('endpoint')}
              placeholder='https://api.openai.com/v1'
              error={errors.endpoint?.message}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='space-y-3'
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <label className='text-sm font-medium leading-none text-gray-700 dark:text-gray-300'>
                  API Key
                </label>
                <Tooltip content='Your API key for authentication with the provider'>
                  <Info className='w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-sky-400 dark:hover:text-sky-300 transition-colors' />
                </Tooltip>
              </div>
              {source === 'openai' && (
                <a
                  href='https://platform.openai.com/account/api-keys'
                  className='inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 text-xs hover:bg-sky-500/10 px-2 py-1 rounded-lg transition-all duration-200'
                  target='_blank'
                  rel='noreferrer'
                >
                  Create API key
                  <ExternalLink className='w-3 h-3' />
                </a>
              )}
            </div>
            <InputField
              type='password'
              label={null}
              {...register('apiKey')}
              placeholder='sk-proj-...'
              error={errors.apiKey?.message}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='space-y-3'
          >
            <div className='flex items-center gap-2'>
              <label className='text-sm font-medium leading-none text-gray-700 dark:text-gray-300'>
                Organization ID
              </label>
              <Tooltip content='Optional organization ID for team or enterprise accounts'>
                <Info className='w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-sky-400 dark:hover:text-sky-300 transition-colors' />
              </Tooltip>
            </div>
            <InputField
              type='text'
              label={null}
              {...register('organizationId')}
              placeholder='org-example123'
              error={errors.organizationId?.message}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className='space-y-3'
          >
            <div className='flex items-center gap-2'>
              <label className='text-sm font-medium leading-none text-gray-700 dark:text-gray-300'>Default Model</label>
              <Tooltip content='The default AI model to use for this provider'>
                <Info className='w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-sky-400 dark:hover:text-sky-300 transition-colors' />
              </Tooltip>
            </div>
            <InputField
              type='text'
              label={null}
              {...register('defaultModel')}
              placeholder='gpt-4o, claude-3-sonnet, gemini-pro'
              error={errors.defaultModel?.message}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
