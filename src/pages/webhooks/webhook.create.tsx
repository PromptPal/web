import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, Save } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import InputField from '@annatarhe/lake-ui/form-input-field'
import SwitchField from '@annatarhe/lake-ui/form-switch-field'
import { WEBHOOK_EVENTS, webhookFormSchema, type WebhookFormData } from './types'
import { createWebhook } from './webhook.query'

function CreateWebhookPage() {
  const params = useParams({ from: '/$pid/webhooks/new' })
  const navigate = useNavigate()
  const projectId = ~~params.pid

  const [createWebhookMutation, { loading }] = useMutation(createWebhook, {
    refetchQueries: ['allWebhooksList'],
    onCompleted: (data) => {
      if (data?.createWebhook.id) {
        navigate({ to: `/${projectId}/webhooks` })
      }
    },
    onError: (error) => {
      console.error('Failed to create webhook:', error)
    },
  })

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(webhookFormSchema),
    defaultValues: {
      name: '',
      url: '',
      events: [],
      enabled: true,
    },
    mode: 'onChange',
  })

  const watchedEvents = watch('events')

  const onSubmit = async (data: WebhookFormData) => {
    createWebhookMutation({
      variables: {
        data: {
          projectId,
          name: data.name,
          url: data.url,
          event: data.events[0],
          enabled: data.enabled,
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
              onClick={() => navigate({ to: `/${projectId}/webhooks` })}
              className='inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4'
            >
              <ArrowLeft className='h-4 w-4' />
              Back to webhooks
            </button>

            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              Create New Webhook
            </h1>
            <p className='text-gray-500 dark:text-gray-400 mt-2'>
              Configure a webhook endpoint to receive real-time notifications
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
                  <Controller
                    name='name'
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputField
                        {...field}
                        label='Webhook Name'
                        placeholder='My webhook endpoint'
                        error={fieldState.error?.message}
                      />
                    )}
                  />

                  {/* URL */}
                  <Controller
                    name='url'
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputField
                        {...field}
                        type='url'
                        label='Endpoint URL'
                        placeholder='https://api.example.com/webhooks'
                        error={fieldState.error?.message}
                      />
                    )}
                  />
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

                {/* Enabled toggle */}
                <Controller
                  name='enabled'
                  control={control}
                  render={({ field }) => (
                    <SwitchField
                      {...field}
                      label='Enable webhook immediately'
                    />
                  )}
                />
              </div>

              {/* Submit */}
              <div className='flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700'>
                <button
                  type='button'
                  onClick={() => navigate({ to: `/${projectId}/webhooks` })}
                  className='px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={!isValid || loading}
                  className='inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
                >
                  {loading
                    ? (
                        <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                      )
                    : (
                        <Save className='h-4 w-4' />
                      )}
                  Create Webhook
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CreateWebhookPage
