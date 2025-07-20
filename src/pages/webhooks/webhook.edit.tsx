import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@apollo/client'
import { useParams, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { webhookFormSchema, type WebhookFormData, WEBHOOK_EVENTS } from './types'
import { updateWebhook } from './webhook.query'
// import { getWebhook } from './webhook.query'

function EditWebhookPage() {
  const params = useParams({ from: '/$pid/webhooks/$id/edit' })
  const navigate = useNavigate()
  const projectId = ~~params.pid
  const webhookId = ~~params.id

  const [showSecret, setShowSecret] = useState(false)

  const {
    data: webhookData,
    loading: webhookLoading,
    error: webhookError,
  } = useQuery(getWebhook, {
    variables: { id: webhookId },
  })

  const [updateWebhookMutation, { loading }] = useMutation(updateWebhook, {
    onCompleted: (data) => {
      if (data?.updateWebhook.id) {
        navigate({ to: `/${projectId}/webhooks/${webhookId}` })
      }
    },
    onError: (error) => {
      console.error('Failed to update webhook:', error)
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<WebhookFormData>({
    resolver: zodResolver(webhookFormSchema),
    defaultValues: {
      name: '',
      url: '',
      events: [],
      enabled: true,
      secret: '',
    },
    mode: 'onChange',
  })

  // Reset form when webhook data loads
  useEffect(() => {
    if (webhookData?.webhook) {
      const webhook = webhookData.webhook
      reset({
        name: webhook.name,
        url: webhook.url,
        events: webhook.events,
        enabled: webhook.enabled,
        secret: webhook.secret || '',
      })
    }
  }, [webhookData, reset])

  const watchedEvents = watch('events')

  const onSubmit = async (data: WebhookFormData) => {
    updateWebhookMutation({
      variables: {
        id: webhookId,
        data: {
          name: data.name,
          url: data.url,
          events: data.events,
          enabled: data.enabled,
          secret: data.secret || undefined,
        },
      },
    })
  }

  const handleEventToggle = (event: string) => {
    const currentEvents = watchedEvents || []
    const newEvents = currentEvents.includes(event)
      ? currentEvents.filter(e => e !== event)
      : [...currentEvents, event]
    setValue('events', newEvents, { shouldValidate: true })
  }

  const generateSecret = () => {
    const secret = crypto.getRandomValues(new Uint8Array(32))
    const secretString = Array.from(secret, byte => byte.toString(16).padStart(2, '0')).join('')
    setValue('secret', secretString, { shouldValidate: true })
  }

  if (webhookLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <div className='w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto' />
          <p className='text-gray-500 dark:text-gray-400'>Loading webhook...</p>
        </div>
      </div>
    )
  }

  if (webhookError || !webhookData?.webhook) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <AlertCircle className='h-12 w-12 text-red-500 mx-auto' />
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
            Webhook not found
          </h3>
          <p className='text-gray-500 dark:text-gray-400'>
            The webhook you&apos;re trying to edit doesn&apos;t exist or has been deleted.
          </p>
          <button
            onClick={() => navigate({ to: `/${projectId}/webhooks` })}
            className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to webhooks
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 dark:from-gray-950 dark:via-gray-900/95 dark:to-gray-800/90'>
      {/* Background Pattern */}
      <div className='absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10'></div>
      <div className='absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5 dark:from-violet-400/10 dark:via-transparent dark:to-purple-400/10'></div>

      <div className='relative z-10'>
        <div className='container max-w-4xl mx-auto px-4 py-8'>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='mb-8'
          >
            <button
              onClick={() => navigate({ to: `/${projectId}/webhooks/${webhookId}` })}
              className='inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4'
            >
              <ArrowLeft className='h-4 w-4' />
              Back to webhook
            </button>

            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              Edit Webhook
            </h1>
            <p className='text-gray-500 dark:text-gray-400 mt-2'>
              Update your webhook endpoint configuration
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/10 dark:border-gray-700/50 shadow-2xl'
          >
            <form onSubmit={handleSubmit(onSubmit)} className='p-8 space-y-8'>
              {/* Basic Information */}
              <div className='space-y-6'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  Basic Information
                </h2>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Name */}
                  <div>
                    <label htmlFor='name' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Webhook Name
                    </label>
                    <input
                      {...register('name')}
                      type='text'
                      id='name'
                      placeholder='My webhook endpoint'
                      className='w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors'
                    />
                    {errors.name && (
                      <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* URL */}
                  <div>
                    <label htmlFor='url' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Endpoint URL
                    </label>
                    <input
                      {...register('url')}
                      type='url'
                      id='url'
                      placeholder='https://api.example.com/webhooks'
                      className='w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors'
                    />
                    {errors.url && (
                      <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                        {errors.url.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Events */}
              <div className='space-y-6'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  Events to Subscribe
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Select which events should trigger this webhook
                </p>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                  {WEBHOOK_EVENTS.map(event => (
                    <label
                      key={event}
                      className='flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors'
                    >
                      <input
                        type='checkbox'
                        checked={watchedEvents?.includes(event) || false}
                        onChange={() => handleEventToggle(event)}
                        className='w-4 h-4 text-violet-600 bg-gray-100 border-gray-300 rounded focus:ring-violet-500 dark:focus:ring-violet-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                      />
                      <div>
                        <span className='text-sm font-medium text-gray-900 dark:text-white'>
                          {event}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                {errors.events && (
                  <p className='text-sm text-red-600 dark:text-red-400'>
                    {errors.events.message}
                  </p>
                )}
              </div>

              {/* Security */}
              <div className='space-y-6'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  Security
                </h2>

                <div>
                  <label htmlFor='secret' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Webhook Secret (Optional)
                  </label>
                  <div className='flex gap-2'>
                    <div className='relative flex-1'>
                      <input
                        {...register('secret')}
                        type={showSecret ? 'text' : 'password'}
                        id='secret'
                        placeholder='Leave empty to remove secret'
                        className='w-full px-4 py-3 pr-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors'
                      />
                      <button
                        type='button'
                        onClick={() => setShowSecret(!showSecret)}
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      >
                        {showSecret ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                      </button>
                    </div>
                    <button
                      type='button'
                      onClick={generateSecret}
                      className='px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                    >
                      Generate
                    </button>
                  </div>
                  <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                    Used to verify webhook authenticity. Will be included in the X-Webhook-Signature header.
                  </p>
                </div>

                {/* Enabled toggle */}
                <div className='flex items-center gap-3'>
                  <input
                    {...register('enabled')}
                    type='checkbox'
                    id='enabled'
                    className='w-4 h-4 text-violet-600 bg-gray-100 border-gray-300 rounded focus:ring-violet-500 dark:focus:ring-violet-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                  />
                  <label htmlFor='enabled' className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Enable webhook
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className='flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700'>
                <button
                  type='button'
                  onClick={() => navigate({ to: `/${projectId}/webhooks/${webhookId}` })}
                  className='px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={!isValid || !isDirty || loading}
                  className='inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
                >
                  {loading
                    ? (
                        <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                      )
                    : (
                        <Save className='h-4 w-4' />
                      )}
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default EditWebhookPage
