import Button from '@/components/Button/Button'
import { cn } from '@/utils'
import InputField from '@annatarhe/lake-ui/form-input-field'
import SelectField from '@annatarhe/lake-ui/form-select-field'
import SwitchField from '@annatarhe/lake-ui/form-switch-field'
import Tooltip from '@annatarhe/lake-ui/tooltip'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ExternalLink, Info, Loader2, Save, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
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
  const [configSectionRef] = useAutoAnimate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
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
    },
  })

  // Watch source value for conditional rendering
  const source = watch('source')

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
      {/* Basic Information Section */}
      <div className='space-y-6 rounded-xl bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-purple-500/20 p-6 backdrop-blur-xl shadow-lg'>
        <h3 className='text-base font-semibold text-foreground bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'>
          Basic Information
        </h3>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <InputField
              label='Provider Name'
              {...register('name')}
              aria-invalid={errors.name ? 'true' : 'false'}
              placeholder='My Provider'
              error={errors.name?.message}
              className={cn(
                'flex h-12 w-full rounded-xl bg-background/30 px-4 py-2',
                'text-sm ring-offset-background focus-visible:outline-hidden',
                'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'backdrop-blur-lg transition-all duration-300 ease-in-out',
                'hover:bg-background/50 border-none shadow-md',
                'bg-gradient-to-r from-background/40 to-background/20',
              )}
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
              Description
            </label>
            <textarea
              className={cn(
                'flex w-full rounded-xl bg-background/30 px-4 py-2',
                'text-sm ring-offset-background file:border-0 file:bg-transparent',
                'file:text-sm file:font-medium placeholder:text-muted-foreground',
                'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'backdrop-blur-lg transition-all duration-300 ease-in-out min-h-[80px]',
                'hover:bg-background/50 border-none shadow-md',
                'bg-gradient-to-r from-background/40 to-background/20',
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
            <Controller
              name='enabled'
              control={control}
              render={({ field }) => (
                <SwitchField label='Enabled' {...field}></SwitchField>
              )}
            />
          </div>
        </div>
      </div>

      {/* Provider Configuration Section */}
      <div
        ref={configSectionRef}
        className='space-y-6 rounded-xl bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-orange-500/20 p-6 backdrop-blur-xl shadow-lg'
      >
        <h3 className='text-base font-semibold text-foreground bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
          Provider Configuration
        </h3>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-1'>
                <label className='text-sm font-medium leading-none'>
                  Source
                </label>
                <Tooltip content='The source of the provider (e.g., OpenAI, Anthropic, etc.)'>
                  <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
                </Tooltip>
              </div>
              <a
                href='https://platform.openai.com/docs/models/overview'
                className='inline-flex items-center gap-1.5 text-primary hover:text-primary/80 text-xs group transition-all duration-200'
                target='_blank'
                rel='noreferrer'
              >
                View providers
                <ExternalLink className='w-3 h-3 group-hover:translate-x-0.5 transition-transform' />
              </a>
            </div>
            <select
              className={cn(
                'flex h-12 w-full rounded-xl bg-background/30 px-4 py-2',
                'text-sm ring-offset-background focus-visible:outline-hidden',
                'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'backdrop-blur-lg transition-all duration-300 ease-in-out',
                'hover:bg-background/50 border-none shadow-lg',
                'bg-gradient-to-r from-background/40 to-background/20',
              )}
              {...register('source')}
              aria-invalid={errors.source ? 'true' : 'false'}
            >
              <option value='openai'>OpenAI</option>
              <option value='anthropic'>Anthropic</option>
              <option value='custom'>Custom</option>
            </select>
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
              <Tooltip content='Endpoint URL for the provider'>
                <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
              </Tooltip>
            </div>
            <input
              type='url'
              className={cn(
                'flex h-12 w-full rounded-xl bg-background/30 px-4 py-2',
                'text-sm ring-offset-background focus-visible:outline-hidden',
                'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'backdrop-blur-lg transition-all duration-300 ease-in-out',
                'hover:bg-background/50 border-none shadow-md',
                'bg-gradient-to-r from-background/40 to-background/20',
              )}
              {...register('endpoint')}
              aria-invalid={errors.endpoint ? 'true' : 'false'}
              placeholder='https://api.openai.com'
            />
            {errors.endpoint && (
              <p className='text-sm text-destructive mt-1'>
                {errors.endpoint.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-1'>
                <label className='text-sm font-medium leading-none'>
                  API Key
                </label>
                <Tooltip content='API Key for authentication with the provider'>
                  <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
                </Tooltip>
              </div>
              {source === 'openai' && (
                <a
                  href='https://platform.openai.com/account/api-keys'
                  className='inline-flex items-center gap-1 text-primary hover:underline text-xs'
                  target='_blank'
                  rel='noreferrer'
                >
                  Create API key
                  <ExternalLink className='w-3 h-3' />
                </a>
              )}
            </div>
            <input
              type='password'
              className={cn(
                'flex h-12 w-full rounded-xl bg-background/30 px-4 py-2',
                'text-sm ring-offset-background focus-visible:outline-hidden',
                'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'backdrop-blur-lg transition-all duration-300 ease-in-out',
                'hover:bg-background/50 border-none shadow-md',
                'bg-gradient-to-r from-background/40 to-background/20',
              )}
              {...register('apiKey')}
              aria-invalid={errors.apiKey ? 'true' : 'false'}
              placeholder='sk-...'
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
                <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
              </Tooltip>
            </div>
            <input
              type='text'
              className={cn(
                'flex h-12 w-full rounded-xl bg-background/30 px-4 py-2',
                'text-sm ring-offset-background focus-visible:outline-hidden',
                'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'backdrop-blur-lg transition-all duration-300 ease-in-out',
                'hover:bg-background/50 border-none shadow-md',
                'bg-gradient-to-r from-background/40 to-background/20',
              )}
              {...register('organizationId')}
              aria-invalid={errors.organizationId ? 'true' : 'false'}
              placeholder='org-...'
            />
            {errors.organizationId && (
              <p className='text-sm text-destructive mt-1'>
                {errors.organizationId.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <div className='flex items-center gap-1'>
              <label className='text-sm font-medium leading-none'>
                Default Model
              </label>
              <Tooltip content='Default model for the provider'>
                <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
              </Tooltip>
            </div>
            <input
              type='text'
              className={cn(
                'flex h-12 w-full rounded-xl bg-background/30 px-4 py-2',
                'text-sm ring-offset-background focus-visible:outline-hidden',
                'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'backdrop-blur-lg transition-all duration-300 ease-in-out',
                'hover:bg-background/50 border-none shadow-md',
                'bg-gradient-to-r from-background/40 to-background/20',
              )}
              {...register('defaultModel')}
              aria-invalid={errors.defaultModel ? 'true' : 'false'}
              placeholder='gpt-4'
            />
            {errors.defaultModel && (
              <p className='text-sm text-destructive mt-1'>
                {errors.defaultModel.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Model Parameters Section */}
      <div className='space-y-6 rounded-xl bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-500/20 p-6 backdrop-blur-xl shadow-lg'>
        <h3 className='text-base font-semibold text-foreground bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent'>
          Model Parameters
        </h3>

        <div className='space-y-6'>
          {/* Temperature Slider */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-1'>
                <label className='text-sm font-medium leading-none'>
                  Temperature
                </label>
                <Tooltip content='Controls randomness: lower values make the output more deterministic, higher values make it more creative.'>
                  <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
                </Tooltip>
              </div>
              <span className='text-sm font-medium'>
                {watch('temperature').toFixed(1)}
              </span>
            </div>

            <div className='relative pt-1'>
              <input
                type='range'
                min='0'
                max='2'
                step='0.1'
                value={watch('temperature')}
                onChange={(e) =>
                  setValue('temperature', parseFloat(e.target.value))
                }
                className={cn(
                  'w-full h-3 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-lg appearance-none cursor-pointer',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                  'transition-all duration-300 ease-in-out',
                )}
              />
              <div className='flex justify-between text-xs text-muted-foreground mt-2'>
                <span>0</span>
                <span>1</span>
                <span>2</span>
              </div>
            </div>

            {errors.temperature && (
              <p className='text-sm text-destructive mt-1'>
                {errors.temperature.message}
              </p>
            )}
          </div>

          {/* Top P Slider */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-1'>
                <label className='text-sm font-medium leading-none'>
                  Top P
                </label>
                <Tooltip content='Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered.'>
                  <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
                </Tooltip>
              </div>
              <span className='text-sm font-medium'>
                {watch('topP').toFixed(1)}
              </span>
            </div>

            <div className='relative pt-1'>
              <input
                type='range'
                min='0'
                max='1'
                step='0.1'
                value={watch('topP')}
                onChange={(e) => setValue('topP', parseFloat(e.target.value))}
                className={cn(
                  'w-full h-3 bg-gradient-to-r from-pink-400/30 to-orange-400/30 rounded-lg appearance-none cursor-pointer',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                  'transition-all duration-300 ease-in-out',
                )}
              />
              <div className='flex justify-between text-xs text-muted-foreground mt-2'>
                <span>0</span>
                <span>0.5</span>
                <span>1</span>
              </div>
            </div>

            {errors.topP && (
              <p className='text-sm text-destructive mt-1'>
                {errors.topP.message}
              </p>
            )}
          </div>

          {/* Max Tokens */}
          <div className='space-y-2'>
            <div className='flex items-center gap-1'>
              <label className='text-sm font-medium leading-none'>
                Max Tokens
              </label>
              <Tooltip content='The maximum number of tokens to generate in the response.'>
                <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
              </Tooltip>
            </div>

            <input
              type='number'
              className={cn(
                'flex h-12 w-full rounded-xl bg-background/30 px-4 py-2',
                'text-sm ring-offset-background focus-visible:outline-hidden',
                'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'backdrop-blur-lg transition-all duration-300 ease-in-out',
                'hover:bg-background/50 border-none shadow-md',
                'bg-gradient-to-r from-background/40 to-background/20',
              )}
              value={watch('maxTokens')}
              onChange={(e) =>
                setValue(
                  'maxTokens',
                  e.target.value ? parseInt(e.target.value) : 0,
                )
              }
              placeholder='2048'
              min='0'
            />

            {errors.maxTokens && (
              <p className='text-sm text-destructive mt-1'>
                {errors.maxTokens.message}
              </p>
            )}
          </div>

          {/* Additional Configuration */}
          <div className='space-y-2'>
            <div className='flex items-center gap-1'>
              <label className='text-sm font-medium leading-none'>
                Additional Configuration
              </label>
              <Tooltip content='Additional JSON configuration for the provider (optional)'>
                <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
              </Tooltip>
            </div>
            <textarea
              className={cn(
                'flex w-full rounded-xl bg-background/30 px-4 py-2',
                'text-sm ring-offset-background file:border-0 file:bg-transparent',
                'file:text-sm file:font-medium placeholder:text-muted-foreground',
                'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'backdrop-blur-lg transition-all duration-300 ease-in-out min-h-[120px]',
                'hover:bg-background/50 border-none shadow-md font-mono',
                'bg-gradient-to-r from-background/40 to-background/20',
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

      <div className='flex items-center justify-end gap-4 mt-8'>
        <Button
          type='button'
          onClick={onCancel}
          isLoading={isSubmitting}
          icon={X}
        >
          Cancel
        </Button>
        <Button type='submit' isLoading={isSubmitting} icon={Save}>
          {submitButtonText}
        </Button>
      </div>
    </form>
  )
}

export default ProviderForm
