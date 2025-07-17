import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { useParams } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { webhooksList } from './webhook.query'
import { WebhookList } from './components/WebhookList'
import { EmptyState } from './components/EmptyState'
import { ErrorState } from './components/ErrorState'
import { LoadingState } from './components/LoadingState'
import { PageHeader } from './components/PageHeader'

function WebhooksPage() {
  const params = useParams({ from: '/$pid/webhooks' })
  const projectId = ~~params.pid
  const [pagination] = useState({
    limit: 20,
    offset: 0,
  })

  const {
    data,
    loading: isLoading,
    error,
    refetch,
  } = useQuery(webhooksList, {
    variables: {
      projectId,
      pagination,
    },
  })

  // Show loading state while data is being fetched
  if (isLoading) {
    return <LoadingState />
  }

  // Show error state if there was an error
  if (error) {
    return <ErrorState error={error} />
  }

  const webhooks = data?.webhooks?.edges || []
  const hasWebhooks = webhooks.length > 0

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 dark:from-gray-950 dark:via-gray-900/95 dark:to-gray-800/90'>
      {/* Background Pattern */}
      <div className='absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10'></div>
      <div className='absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5 dark:from-violet-400/10 dark:via-transparent dark:to-purple-400/10'></div>

      <div className='relative z-10'>
        <div className='container max-w-7xl mx-auto px-4 py-8'>
          <div className='space-y-8'>
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PageHeader />
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className='bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/10 dark:border-gray-700/50 shadow-2xl'
            >
              {hasWebhooks
                ? <WebhookList webhooks={webhooks} onRefetch={refetch} />
                : <EmptyState />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebhooksPage
