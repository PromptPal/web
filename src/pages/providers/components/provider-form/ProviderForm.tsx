import Button from '@/components/Button/Button'
import { cn } from '@/utils'
import InputField from '@annatarhe/lake-ui/form-input-field'
import SwitchField from '@annatarhe/lake-ui/form-switch-field'
import Tooltip from '@annatarhe/lake-ui/tooltip'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ExternalLink, Info, Plus, Save, Trash2, X } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import * as z from 'zod'
import { BasicInfoSection } from './BasicInfoSection'
import { HttpHeadersSection } from './HttpHeadersSection'
import { ModelParametersSection } from './ModelParametersSection'
import { ProviderConfigSection } from './ProviderConfigSection'

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
  apiKey: z.string().trim().optional(),
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
  headers: z
    .array(
      z.object({
        key: z.string().trim().min(1, 'Key cannot be empty'),
        value: z.string().trim().min(1, 'Value cannot be empty'),
      }),
    )
    .optional()
    .default([]),
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
  const form = useForm<ProviderFormValues>({
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
    >
      {/* Basic Information Section */}
      <BasicInfoSection form={form} />

      {/* Provider Configuration Section */}
      <ProviderConfigSection form={form} />

      {/* Model Parameters Section */}
      <ModelParametersSection form={form} />

      {/* HTTP Headers Section */}
      <HttpHeadersSection form={form} />

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
