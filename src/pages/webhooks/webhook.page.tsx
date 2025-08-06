import InputField from '@annatarhe/lake-ui/form-input-field'
import { useQuery } from '@apollo/client'
import { Link, useParams } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Edit,
  XCircle,
} from 'lucide-react'
import { useState } from 'react'
import { WebhookCallsTable } from './components/WebhookCallsTable'
import { WEBHOOK_STATUS_COLORS } from './types'
import { getWebhook, webhookCalls } from './webhook.query'

function WebhookDetailPage() {
  const params = useParams({ strict: false })
  const projectId = ~~params.pid!
  const webhookId = ~~params.id!

  const [pagination] = useState({
    limit: 20,
    offset: 0,
  })

  const {
    data: webhookData,
    loading: webhookLoading,
    error: webhookError,
  } = useQuery(getWebhook, {
    variables: { id: webhookId },
  })

  const {
    data: callsData,
    loading: callsLoading,
    error: callsError,
    refetch: refetchCalls,
  } = useQuery(webhookCalls, {
    variables: {
      input: {
        webhookId,
        pagination,
      },
    },
  })

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
            The webhook you&apos;re looking for doesn&apos;t exist or has been deleted.
          </p>
          <Link
            to='/$pid/webhooks'
            params={{ pid: projectId.toString() }}

            className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to webhooks
          </Link>
        </div>
      </div>
    )
  }

  const webhook = webhookData.webhook
  const calls = callsData?.webhookCalls?.edges || []

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 dark:from-gray-950 dark:via-gray-900/95 dark:to-gray-800/90'>
      {/* Background Pattern */}
      <div className='absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10'></div>
      <div className='absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5 dark:from-violet-400/10 dark:via-transparent dark:to-purple-400/10'></div>

      <div className='relative z-10'>
        <div className='container max-w-7xl mx-auto px-4 py-8'>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='mb-8'
          >
            <Link
              to='/$pid/webhooks'
              params={{ pid: projectId.toString() }}
              className='inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4'
            >
              <ArrowLeft className='h-4 w-4' />
              Back to webhooks
            </Link>

            <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
              <div className='space-y-2'>
                <div className='flex items-center gap-3'>
                  <div className={`w-4 h-4 rounded-full ${
                    webhook.enabled
                      ? 'bg-green-500 shadow-lg shadow-green-500/50'
                      : 'bg-gray-400 dark:bg-gray-600'
                  }`}
                  />
                  <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                    {webhook.name}
                  </h1>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    webhook.enabled
                      ? WEBHOOK_STATUS_COLORS.success
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                  >
                    {webhook.enabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <p className='text-gray-500 dark:text-gray-400'>
                  Webhook endpoint configuration and delivery history
                </p>
              </div>

              <div className='flex items-center gap-3'>
                <Link
                  to='/$pid/webhooks/$id/edit'
                  params={{ pid: projectId.toString(), id: webhookId.toString() }}
                  className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                >
                  <Edit className='h-4 w-4' />
                  Edit
                </Link>
              </div>
            </div>
          </motion.div>

          <div className='flex flex-col gap-8'>
            {/* Webhook Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className='flex flex-col lg:flex-row gap-6'
            >
              {/* Basic Info */}
              <div className='flex-1 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/10 dark:border-gray-700/50 shadow-xl p-6'>
                <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                  Webhook Details
                </h2>

                <div className='space-y-4'>
                  <InputField
                    label='Endpoint URL'
                    value={webhook.url}
                    readOnly
                    className='bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    disabled
                    type='url'
                  />

                  <div>
                    <label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Events
                    </label>
                    <div className='mt-2 flex flex-wrap gap-2'>
                      <span
                        className='px-2 py-1 text-xs bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200 rounded-full'
                      >
                        {webhook.event}
                      </span>
                    </div>
                  </div>

                  <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      <div>
                        <label className='font-medium text-gray-500 dark:text-gray-400'>
                          Created
                        </label>
                        <p className='text-gray-900 dark:text-white'>
                          {new Date(webhook.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className='font-medium text-gray-500 dark:text-gray-400'>
                          Updated
                        </label>
                        <p className='text-gray-900 dark:text-white'>
                          {new Date(webhook.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className='flex-shrink-0 lg:w-80 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/10 dark:border-gray-700/50 shadow-xl p-6'>
                <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                  Delivery Stats
                </h2>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg'>
                    <CheckCircle className='h-6 w-6 text-green-500 mx-auto mb-1' />
                    <p className='text-lg font-bold text-green-600 dark:text-green-400'>
                      {calls.filter(call => call.statusCode === 200).length}
                    </p>
                    <p className='text-xs text-green-600 dark:text-green-400'>
                      Successful
                    </p>
                  </div>
                  <div className='text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg'>
                    <XCircle className='h-6 w-6 text-red-500 mx-auto mb-1' />
                    <p className='text-lg font-bold text-red-600 dark:text-red-400'>
                      {calls.filter(call => call.statusCode !== 200).length}
                    </p>
                    <p className='text-xs text-red-600 dark:text-red-400'>
                      Failed
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Webhook Calls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='w-full'
            >
              <div className='bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/10 dark:border-gray-700/50 shadow-xl'>
                <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
                  <div className='flex items-center justify-between'>
                    <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
                      Delivery History
                    </h2>
                    <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                      <Activity className='h-4 w-4' />
                      {callsData?.webhookCalls?.count || 0}
                      {' '}
                      total calls
                    </div>
                  </div>
                </div>

                <WebhookCallsTable
                  calls={calls}
                  loading={callsLoading}
                  error={callsError}
                  onRefetch={refetchCalls}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebhookDetailPage
