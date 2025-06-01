import { dp, p } from '@/pages/providers/provider.query'
import { useApolloClient, useMutation, useQuery } from '@apollo/client'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

// Import components
import { BackButton } from '../components/BackButton'
import { ConfigurationCard } from '../components/ConfigurationCard'
import { DeleteModal } from '../components/DeleteModal'
import { MetadataCard } from '../components/MetadataCard'
import { ModelParameters } from '../components/ModelParameters'
import { ProviderDetails } from '../components/ProviderDetails'
import { ProviderHeader } from '../components/ProviderHeader'
import { UsageCard } from '../components/UsageCard'
import { HeadersCard } from './components/HeadersCard'
import Empty from './empty'
import ErrorPage from './error'
import Loading from './loading'

function ProviderPage() {
  const { id } = useParams({ strict: false })
  const providerId = parseInt(id ?? '0', 10)
  const navigate = useNavigate()
  const apolloClient = useApolloClient()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const {
    data,
    loading: isLoading,
    error,
  } = useQuery(p, {
    variables: {
      id: providerId,
    },
    skip: !providerId,
  })

  const [deleteProvider, { loading: isDeleting }] = useMutation(dp, {
    onCompleted() {
      toast.success('Provider deleted successfully')
      apolloClient.resetStore()
      navigate({ to: '/providers' })
    },
    onError(error) {
      console.error('Failed to delete provider:', error)
      toast.error('Failed to delete provider')
    },
  })

  const handleDelete = async () => {
    try {
      await deleteProvider({
        variables: {
          id: providerId,
        },
      })
    }
    catch (error) {
      console.error('Error deleting provider:', error)
    }
  }

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <ErrorPage error={error} />
  }

  const provider = data?.provider
  if (!provider) {
    return <Empty />
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <BackButton />

      {/* Provider Header */}
      <ProviderHeader
        className='mt-6'
        provider={provider}
        onDeleteClick={() => setIsDeleteModalOpen(true)}
      />

      {/* Provider Details */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Left Column */}
        <div className='space-y-6'>
          <ProviderDetails provider={provider} />

          <ModelParameters provider={provider} />
        </div>

        {/* Right Column */}
        <div className='space-y-6'>
          <ConfigurationCard config={provider.config} />

          <HeadersCard headers={provider.headers} />

          <UsageCard projects={provider.projects} prompts={provider.prompts} />

          <MetadataCard
            createdAt={provider.createdAt}
            updatedAt={provider.updatedAt}
          />
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default ProviderPage
