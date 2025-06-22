import { dp, p } from '@/pages/providers/provider.query'
import { useApolloClient, useMutation, useQuery } from '@apollo/client'
import { useNavigate, useParams } from '@tanstack/react-router'
import { motion } from 'framer-motion'
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
    <div className='min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 dark:from-gray-950 dark:via-gray-900/95 dark:to-gray-800/90'>
      {/* Background Pattern */}
      <div className='absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10'></div>
      <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-400/10 dark:via-transparent dark:to-purple-400/10'></div>
      <div className='relative z-10'>
        <div className='container max-w-7xl mx-auto px-4 py-8'>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BackButton />
          </motion.div>

          {/* Provider Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <ProviderHeader
              className='mt-6'
              provider={provider}
              onDeleteClick={() => setIsDeleteModalOpen(true)}
            />
          </motion.div>

          {/* Provider Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8'
          >
            {/* Left Column */}
            <div className='space-y-8'>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <ProviderDetails provider={provider} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <ModelParameters provider={provider} />
              </motion.div>
            </div>

            {/* Right Column */}
            <div className='space-y-8'>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <ConfigurationCard config={provider.config} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <HeadersCard headers={provider.headers} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <UsageCard projects={provider.projects} prompts={provider.prompts} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <MetadataCard
                  createdAt={provider.createdAt}
                  updatedAt={provider.updatedAt}
                />
              </motion.div>
            </div>
          </motion.div>
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
