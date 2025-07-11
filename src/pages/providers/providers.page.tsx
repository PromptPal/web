import { pl } from '@/pages/providers/provider.query'
import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { motion } from 'framer-motion'

import { EmptyState } from './components/EmptyState'
import { ErrorState } from './components/ErrorState'
// Import the new components
import { LoadingState } from './components/LoadingState'
import { PageHeader } from './components/PageHeader'
import { ProviderList } from './components/ProviderList'

function ProvidersPage() {
  const [pagination] = useState({
    limit: 50,
    offset: 0,
  })

  const {
    data,
    loading: isLoading,
    error,
  } = useQuery(pl, {
    variables: {
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

  const providers = data?.providers?.edges || []
  const hasProviders = providers.length > 0

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 dark:from-gray-950 dark:via-gray-900/95 dark:to-gray-800/90'>
      {/* Background Pattern */}
      <div className='absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10'></div>
      <div className='absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-blue-500/5 dark:from-sky-400/10 dark:via-transparent dark:to-blue-400/10'></div>

      <div className='relative z-10'>
        <div className='container max-w-7xl mx-auto px-4 py-8'>
          <div className='space-y-8'>
            {/* Page header with title and action button */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PageHeader isDisabled={false} />
            </motion.div>

            {/* Show empty state or provider list based on data */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {!hasProviders ? <EmptyState /> : <ProviderList providers={providers} />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProvidersPage
