import Button from '@/components/Button/Button'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Settings, Sparkles, X } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { BasicInfoSection } from './BasicInfoSection'
import { HttpHeadersSection } from './HttpHeadersSection'
import { ModelParametersSection } from './ModelParametersSection'
import { ProviderConfigSection } from './ProviderConfigSection'
import { ProviderFormValues, providerSchema } from './schema'

export type ProviderFormProps = {
  initialValues?: Partial<ProviderFormValues>
  onSubmit: (data: ProviderFormValues) => Promise<void>
  isSubmitting: boolean
  onCancel: () => void
  submitButtonText: string
}

function ProviderForm({
  initialValues,
  onSubmit,
  isSubmitting,
  onCancel,
  submitButtonText,
}: ProviderFormProps) {
  const form = useForm<ProviderFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(providerSchema) as any,
    defaultValues: () => {
      const val = {
        name: '',
        description: '',
        enabled: true,
        source: 'openai',
        endpoint: 'https://api.openai.com',
        organizationId: '',
        defaultModel: '',
        temperature: 0.7,
        topP: 1,
        maxTokens: 2048,
        config: '',
        ...initialValues,
      }
      return Promise.resolve(val as ProviderFormValues)
    },
  })
  const { handleSubmit, setValue } = form

  // Update form when initialValues change (for edit mode)
  useEffect(() => {
    if (initialValues) {
      Object.entries(initialValues).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof ProviderFormValues, value)
        }
      })
    }
  }, [initialValues, setValue])

  const handleFormSubmit = async (data: ProviderFormValues) => {
    try {
      await onSubmit(data)
    }
    catch (error) {
      console.error('Form submission error:', error)
      toast.error('Failed to submit form')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className='max-w-4xl mx-auto'
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='mb-8'
      >
        <div className='flex items-center gap-4 mb-6'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className='inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-background/60 dark:bg-gray-800/60 hover:bg-background/80 dark:hover:bg-gray-700/80 border border-border/50 dark:border-gray-600/50 backdrop-blur-sm transition-all duration-200 text-foreground dark:text-gray-100 hover:text-foreground dark:hover:text-white'
          >
            <ArrowLeft className='w-4 h-4' />
            <span className='text-sm font-medium'>
              {submitButtonText === 'Create Provider' ? 'Back to Providers' : 'Back to Provider'}
            </span>
          </motion.button>
        </div>

        <div className='flex items-center gap-4'>
          <div className={`p-3 rounded-2xl backdrop-blur-sm border ${
            submitButtonText === 'Create Provider'
              ? 'bg-gradient-to-br from-violet-500/20 to-purple-500/20 dark:from-violet-400/30 dark:to-purple-400/30 border-violet-500/20 dark:border-violet-400/30'
              : 'bg-gradient-to-br from-orange-500/20 to-red-500/20 dark:from-orange-400/30 dark:to-red-400/30 border-orange-500/20 dark:border-orange-400/30'
          }`}
          >
            {submitButtonText === 'Create Provider'
              ? (
                  <Sparkles className='w-8 h-8 text-violet-600 dark:text-violet-400' />
                )
              : (
                  <Settings className='w-8 h-8 text-orange-600 dark:text-orange-400' />
                )}
          </div>
          <div className='space-y-2'>
            <h1 className='text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent'>
              {submitButtonText === 'Create Provider' ? 'Create New Provider' : 'Update Provider'}
            </h1>
            <p className='text-base text-muted-foreground dark:text-gray-400 max-w-2xl'>
              {submitButtonText === 'Create Provider'
                ? 'Configure a new AI provider to expand your prompt management capabilities. Connect to OpenAI, Anthropic, Gemini, or custom endpoints.'
                : 'Modify your AI provider configuration and connection settings. Changes will be applied immediately to all associated prompts.'}
            </p>
          </div>
        </div>
      </motion.div>

      <form
        onSubmit={handleSubmit(handleFormSubmit, (errors) => {
          console.error('Form submission errors:', errors)
          toast.error('Please check the form for errors and try again')
        })}
        className='space-y-6'
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <BasicInfoSection form={form} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <ProviderConfigSection form={form} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <ModelParametersSection form={form} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <HttpHeadersSection form={form} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className='sticky bottom-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-600/50 -mx-6 px-6 py-4 mt-8'
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
              <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
              Form auto-saves as you type
            </div>
            <div className='flex items-center gap-3'>
              <Button
                type='button'
                variant='ghost'
                onClick={onCancel}
                disabled={isSubmitting}
                icon={X}
                className='hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                isLoading={isSubmitting}
                icon={Save}
                className='min-w-[140px] bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25'
              >
                {submitButtonText}
              </Button>
            </div>
          </div>
        </motion.div>
      </form>
    </motion.div>
  )
}

export default ProviderForm
