import { pl } from '@/pages/providers/provider.query'
import { useQuery } from '@apollo/client'
import { useState } from 'react'

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
    <div className='container mx-auto px-4 py-8'>
      {/* Page header with title and action button */}
      <PageHeader isDisabled={false} />

      {/* Show empty state or provider list based on data */}
      {!hasProviders ? <EmptyState /> : <ProviderList providers={providers} />}
    </div>
  )
}

export default ProvidersPage
