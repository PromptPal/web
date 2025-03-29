import { cn } from '@/utils'
import InputField from '@annatarhe/lake-ui/form-input-field'
import Tooltip from '@annatarhe/lake-ui/tooltip'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Info, Loader2, Save, X } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import * as z from 'zod'

// Define the schema for provider form
const providerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  enabled: z.boolean().default(true),
  source: z
    .string()
    .trim()
    .min(2, 'Source must be at least 2 characters')
    .max(100, 'Source cannot exceed 100 characters'),
  endpoint: z
    .string()
    .trim()
    .url('Please enter a valid URL')
    .max(255, 'Endpoint URL cannot exceed 255 characters'),
  apiKey: z
    .string()
    .trim()
    .min(3, 'API Key must be at least 3 characters')
    .max(255, 'API Key cannot exceed 255 characters'),
  organizationId: z
    .string()
    .trim()
    .max(100, 'Organization ID cannot exceed 100 characters')
    .optional(),
  defaultModel: z
    .string()
    .trim()
    .min(2, 'Default model must be at least 2 characters')
    .max(100, 'Default model cannot exceed 100 characters'),
  temperature: z
    .number()
    .min(0, 'Temperature must be at least 0')
    .max(2, 'Temperature cannot exceed 2')
    .default(0.7),
  topP: z
    .number()
    .min(0, 'Top P must be at least 0')
    .max(1, 'Top P cannot exceed 1')
    .default(1),
  maxTokens: z
    .number()
    .min(1, 'Max tokens must be at least 1')
    .max(100000, 'Max tokens cannot exceed 100000')
    .default(2048),
  config: z
    .string()
    .trim()
    .max(5000, 'Config cannot exceed 5000 characters')
    .optional(),
})

export type ProviderFormValues = z.infer<typeof providerSchema>

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
  const [formRef] = useAutoAnimate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      name: '',
      description: '',
      enabled: true,
      source: '',
      endpoint: '',
      organizationId: '',
      defaultModel: '',
      temperature: 0.7,
      topP: 1,
      maxTokens: 2048,
      config: '',
      ...initialValues,
    },
  })

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
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error('Failed to submit form')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit, (errors) => {
        console.error('Form submission errors:', errors)
        toast.error('Failed to submit form')
      })}
      className='space-y-8'
      ref={formRef}
    >
      <div className='rounded-xl bg-linear-to-br from-background/30 via-background/50 to-background/30 py-6 px-6 backdrop-blur-xl space-y-6'>
        {/* Basic Information */}
        <div className='space-y-4'>
          <h3 className='text-lg font-medium'>Basic Information</h3>

          <div className='space-y-2'>
            <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
              Provider Name
            </label>
            <InputField
              {...register('name')}
              aria-invalid={errors.name ? 'true' : 'false'}
              placeholder='My Provider'
            />
            {errors.name && (
              <p className='text-sm text-destructive mt-1'>
                {errors.name.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
              Description
            </label>
            <textarea
              className={cn(
                'flex w-full rounded-lg bg-background/50 px-4 py-2',
                'text-sm ring-offset-background file:border-0 file:bg-transparent',
                'file:text-sm file:font-medium placeholder:text-muted-foreground',
                'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'backdrop-blur-xs transition-all duration-200 ease-in-out min-h-[80px]',
                'hover:bg-background/70',
              )}
              placeholder='Description of the provider'
              {...register('description')}
              aria-invalid={errors.description ? 'true' : 'false'}
            />
            {errors.description && (
              <p className='text-sm text-destructive mt-1'>
                {errors.description.message}
              </p>
            )}
          </div>

          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              id='enabled'
              className='rounded border-gray-300 text-primary focus:ring-primary'
              {...register('enabled')}
            />
            <label
              htmlFor='enabled'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Enabled
            </label>
          </div>
        </div>

        {/* Provider Configuration */}
        <div className='space-y-4 pt-4 border-t border-border/30'>
          <h3 className='text-lg font-medium'>Provider Configuration</h3>

          <div className='space-y-2'>
            <div className='flex items-center gap-1'>
              <label className='text-sm font-medium leading-none'>Source</label>
              <Tooltip content='The source of the provider (e.g., OpenAI, Anthropic, etc.)'>
                <Info className='w-4 h-4 text-muted-foreground' />
              </Tooltip>
            </div>
            <input
              type='text'
              className={cn(
                'flex h-10 w-full rounded-lg bg-background/50 px-4 py-2',
                'text-sm ring-offset-background file:border-0 file:bg-transparent',
                'file:text-sm file:font-medium placeholder:text-muted-foreground',
                'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'backdrop-blur-xs transition-all duration-200 ease-in-out',
                'hover:bg-background/70',
              )}
              placeholder='OpenAI'
              {...register('source')}
              aria-invalid={errors.source ? 'true' : 'false'}
            />
            {errors.source && (
              <p className='text-sm text-destructive mt-1'>
                {errors.source.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <div className='flex items-center gap-1'>
              <label className='text-sm font-medium leading-none'>
                Endpoint URL
              </label>
              <Tooltip content='The API endpoint URL for the provider'>
                <Info className='w-4 h-4 text-muted-foreground' />
              </Tooltip>
            </div>
            <input
              type='text'
              className={cn(
                'flex h-10 w-full rounded-lg bg-background/50 px-4 py-2',
                'text-sm ring-offset-background file:border-0 file:bg-transparent',
                'file:text-sm file:font-medium placeholder:text-muted-foreground',
                'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'backdrop-blur-xs transition-all duration-200 ease-in-out',
                'hover:bg-background/70',
              )}
              placeholder='https://api.openai.com/v1'
              {...register('endpoint')}
              aria-invalid={errors.endpoint ? 'true' : 'false'}
            />
            {errors.endpoint && (
              <p className='text-sm text-destructive mt-1'>
                {errors.endpoint.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <div className='flex items-center gap-1'>
              <label className='text-sm font-medium leading-none'>
                API Key
              </label>
              <Tooltip content='API Key for authentication with the provider'>
                <Info className='w-4 h-4 text-muted-foreground' />
              </Tooltip>
            </div>
            <input
              type='password'
              className={cn(
                'flex h-10 w-full rounded-lg bg-background/50 px-4 py-2',
                'text-sm ring-offset-background file:border-0 file:bg-transparent',
                'file:text-sm file:font-medium placeholder:text-muted-foreground',
                'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'backdrop-blur-xs transition-all duration-200 ease-in-out',
                'hover:bg-background/70',
              )}
              placeholder='sk-...'
              {...register('apiKey')}
              aria-invalid={errors.apiKey ? 'true' : 'false'}
            />
            {errors.apiKey && (
              <p className='text-sm text-destructive mt-1'>
                {errors.apiKey.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <div className='flex items-center gap-1'>
              <label className='text-sm font-medium leading-none'>
                Organization ID
              </label>
              <Tooltip content='Optional organization ID for the provider'>
                <Info className='w-4 h-4 text-muted-foreground' />
              </Tooltip>
            </div>
            <input
              type='text'
              className={cn(
                'flex h-10 w-full rounded-lg bg-background/50 px-4 py-2',
                'text-sm ring-offset-background file:border-0 file:bg-transparent',
                'file:text-sm file:font-medium placeholder:text-muted-foreground',
                'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'backdrop-blur-xs transition-all duration-200 ease-in-out',
                'hover:bg-background/70',
              )}
              placeholder='org-123456'
              {...register('organizationId')}
              aria-invalid={errors.organizationId ? 'true' : 'false'}
            />
            {errors.organizationId && (
              <p className='text-sm text-destructive mt-1'>
                {errors.organizationId.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium leading-none'>
              Default Model
            </label>
            <input
              type='text'
              className={cn(
                'flex h-10 w-full rounded-lg bg-background/50 px-4 py-2',
                'text-sm ring-offset-background file:border-0 file:bg-transparent',
                'file:text-sm file:font-medium placeholder:text-muted-foreground',
                'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'backdrop-blur-xs transition-all duration-200 ease-in-out',
                'hover:bg-background/70',
              )}
              placeholder='gpt-4'
              {...register('defaultModel')}
              aria-invalid={errors.defaultModel ? 'true' : 'false'}
            />
            {errors.defaultModel && (
              <p className='text-sm text-destructive mt-1'>
                {errors.defaultModel.message}
              </p>
            )}
          </div>
        </div>

        {/* Model Parameters */}
        <div className='space-y-4 pt-4 border-t border-border/30'>
          <h3 className='text-lg font-medium'>Model Parameters</h3>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <div className='flex items-center gap-1'>
                <label className='text-sm font-medium leading-none'>
                  Temperature
                </label>
                <Tooltip content='Controls randomness: 0 is deterministic, higher values increase randomness'>
                  <Info className='w-4 h-4 text-muted-foreground' />
                </Tooltip>
              </div>
              <input
                type='number'
                step='0.1'
                className={cn(
                  'flex h-10 w-full rounded-lg bg-background/50 px-4 py-2',
                  'text-sm ring-offset-background file:border-0 file:bg-transparent',
                  'file:text-sm file:font-medium placeholder:text-muted-foreground',
                  'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'backdrop-blur-xs transition-all duration-200 ease-in-out',
                  'hover:bg-background/70',
                )}
                placeholder='0.7'
                {...register('temperature', { valueAsNumber: true })}
                aria-invalid={errors.temperature ? 'true' : 'false'}
              />
              {errors.temperature && (
                <p className='text-sm text-destructive mt-1'>
                  {errors.temperature.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <div className='flex items-center gap-1'>
                <label className='text-sm font-medium leading-none'>
                  Top P
                </label>
                <Tooltip content='Controls diversity: 0.1 means only 10% most likely tokens are considered'>
                  <Info className='w-4 h-4 text-muted-foreground' />
                </Tooltip>
              </div>
              <input
                type='number'
                step='0.1'
                className={cn(
                  'flex h-10 w-full rounded-lg bg-background/50 px-4 py-2',
                  'text-sm ring-offset-background file:border-0 file:bg-transparent',
                  'file:text-sm file:font-medium placeholder:text-muted-foreground',
                  'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'backdrop-blur-xs transition-all duration-200 ease-in-out',
                  'hover:bg-background/70',
                )}
                placeholder='1'
                {...register('topP', { valueAsNumber: true })}
                aria-invalid={errors.topP ? 'true' : 'false'}
              />
              {errors.topP && (
                <p className='text-sm text-destructive mt-1'>
                  {errors.topP.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <div className='flex items-center gap-1'>
                <label className='text-sm font-medium leading-none'>
                  Max Tokens
                </label>
                <Tooltip content='Maximum number of tokens to generate in the response'>
                  <Info className='w-4 h-4 text-muted-foreground' />
                </Tooltip>
              </div>
              <input
                type='number'
                className={cn(
                  'flex h-10 w-full rounded-lg bg-background/50 px-4 py-2',
                  'text-sm ring-offset-background file:border-0 file:bg-transparent',
                  'file:text-sm file:font-medium placeholder:text-muted-foreground',
                  'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'backdrop-blur-xs transition-all duration-200 ease-in-out',
                  'hover:bg-background/70',
                )}
                placeholder='2048'
                {...register('maxTokens', { valueAsNumber: true })}
                aria-invalid={errors.maxTokens ? 'true' : 'false'}
              />
              {errors.maxTokens && (
                <p className='text-sm text-destructive mt-1'>
                  {errors.maxTokens.message}
                </p>
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center gap-1'>
              <label className='text-sm font-medium leading-none'>
                Additional Configuration
              </label>
              <Tooltip content='Additional JSON configuration for the provider (optional)'>
                <Info className='w-4 h-4 text-muted-foreground' />
              </Tooltip>
            </div>
            <textarea
              className={cn(
                'flex w-full rounded-lg bg-background/50 px-4 py-2',
                'text-sm ring-offset-background file:border-0 file:bg-transparent',
                'file:text-sm file:font-medium placeholder:text-muted-foreground',
                'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'backdrop-blur-xs transition-all duration-200 ease-in-out min-h-[120px]',
                'hover:bg-background/70 font-mono',
              )}
              placeholder='{"key": "value"}'
              {...register('config')}
              aria-invalid={errors.config ? 'true' : 'false'}
            />
            {errors.config && (
              <p className='text-sm text-destructive mt-1'>
                {errors.config.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className='flex items-center justify-end gap-4'>
        <button
          type='button'
          onClick={onCancel}
          disabled={isSubmitting}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2',
            'bg-background/50 hover:bg-background/80',
            'text-sm font-medium transition-all duration-200 ease-in-out',
            'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
            'disabled:pointer-events-none disabled:opacity-50',
            'backdrop-blur-xs shadow-lg hover:shadow-xl',
          )}
        >
          <X className='w-4 h-4' />
          Cancel
        </button>
        <button
          type='submit'
          disabled={isSubmitting}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2',
            'bg-linear-to-r from-primary to-primary/80 text-slate-600 hover:brightness-110',
            'text-sm font-medium transition-all duration-200 ease-in-out',
            'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
            'disabled:pointer-events-none disabled:opacity-50',
            'backdrop-blur-xs shadow-lg hover:shadow-xl',
          )}
        >
          {isSubmitting ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            <Save className='w-4 h-4' />
          )}
          {submitButtonText}
        </button>
      </div>
    </form>
  )
}

export default ProviderForm
