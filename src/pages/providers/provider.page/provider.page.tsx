import { dp, p } from '@/pages/providers/provider.query'
import { useApolloClient, useMutation, useQuery } from '@apollo/client'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { AlertTriangle, ArrowLeft, Edit, Server, Trash2 } from 'lucide-react'
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
    } catch (error) {
      console.error('Error deleting provider:', error)
    }
  }

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center gap-2 mb-8'>
          <BackButton disabled />
        </div>

        {/* Loading Header */}
        <div className='rounded-xl p-[2px] bg-gradient-to-br from-primary/20 via-primary/10 to-background/5 overflow-hidden mb-6 shadow-lg'>
          <div className='rounded-lg bg-card/80 p-6 backdrop-blur-md'>
            <div className='animate-pulse space-y-4'>
              <div className='flex justify-between'>
                <div className='space-y-2'>
                  <div className='h-6 bg-background/20 rounded-md w-48'></div>
                  <div className='h-4 bg-background/20 rounded-md w-32'></div>
                </div>
                <div className='flex gap-2'>
                  <div className='h-10 bg-background/20 rounded-md w-24'></div>
                  <div className='h-10 bg-background/20 rounded-md w-24'></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-6'>
            {/* Loading Provider Details */}
            <div className='rounded-xl p-[2px] bg-gradient-to-br from-primary/20 via-secondary/10 to-background/5 overflow-hidden shadow-md'>
              <div className='rounded-lg bg-card/80 p-6 backdrop-blur-xl'>
                <div className='h-5 bg-background/20 rounded-md w-36 mb-4'></div>
                <div className='space-y-4 animate-pulse'>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className='space-y-2'>
                      <div className='h-4 bg-background/20 rounded-md w-24'></div>
                      <div className='h-5 bg-background/20 rounded-md w-full'></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            {/* Loading Configuration */}
            <div className='rounded-xl p-[2px] bg-gradient-to-br from-primary/20 via-secondary/10 to-background/5 overflow-hidden shadow-md'>
              <div className='rounded-lg bg-card/80 p-6 backdrop-blur-xl'>
                <div className='h-5 bg-background/20 rounded-md w-36 mb-4'></div>
                <div className='bg-muted/50 rounded-md p-4 h-32 animate-pulse'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center gap-2 mb-8'>
          <BackButton />
        </div>

        <div className='rounded-xl p-[2px] bg-gradient-to-br from-destructive/30 via-destructive/20 to-background/5 overflow-hidden shadow-lg'>
          <div className='rounded-lg bg-card/80 p-8 backdrop-blur-xl'>
            <div className='flex flex-col items-center justify-center space-y-4'>
              <div className='h-16 w-16 rounded-full bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center'>
                <AlertTriangle className='h-8 w-8 text-destructive' />
              </div>
              <h2 className='text-xl font-semibold'>Error Loading Provider</h2>
              <p className='text-center text-muted-foreground max-w-md'>
                {error.message || 'An unexpected error occurred'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 h-10 px-4 py-2'
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const provider = data?.provider
  if (!provider) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center gap-2 mb-8'>
          <BackButton />
        </div>

        <div className='rounded-xl p-[2px] bg-gradient-to-br from-muted/30 via-muted/20 to-background/5 overflow-hidden shadow-lg'>
          <div className='rounded-lg bg-card/80 p-8 backdrop-blur-xl'>
            <div className='flex flex-col items-center justify-center space-y-4'>
              <div className='h-16 w-16 rounded-full bg-gradient-to-br from-muted/20 to-muted/10 flex items-center justify-center'>
                <Server className='h-8 w-8 text-muted-foreground' />
              </div>
              <h2 className='text-xl font-semibold'>Provider Not Found</h2>
              <p className='text-center text-muted-foreground max-w-md'>
                The provider you're looking for doesn't exist or has been
                deleted.
              </p>
              <a
                href='/providers'
                className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 h-10 px-4 py-2'
              >
                View All Providers
              </a>
            </div>
          </div>
        </div>
      </div>
    )
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
