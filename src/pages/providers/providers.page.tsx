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
    <div className='w-full space-y-8'>
      {/* Page header with title and action button */}
      <PageHeader isDisabled={false} />

      {/* Show empty state or provider list based on data */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {!hasProviders ? <EmptyState /> : <ProviderList providers={providers} />}
      </motion.div>
    </div>
  )
}

export default ProvidersPage
