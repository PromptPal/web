import Button from '@/components/Button/Button'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, X } from 'lucide-react'
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
