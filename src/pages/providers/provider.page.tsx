import { dp, p } from '@/pages/providers/provider.query'
import { useApolloClient, useMutation, useQuery } from '@apollo/client'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  ChevronRight,
  Edit,
  ExternalLink,
  Layers,
  Pencil,
  Server,
  Settings,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

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
          <button
            onClick={() => navigate({ to: '/providers' })}
            className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2'
            disabled
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </button>
        </div>

        <div className='rounded-lg border bg-card p-8 text-card-foreground shadow-sm'>
          <div className='animate-pulse space-y-6'>
            <div className='flex justify-between'>
              <div className='space-y-2'>
                <div className='h-6 bg-background/20 rounded w-48'></div>
                <div className='h-4 bg-background/20 rounded w-32'></div>
              </div>
              <div className='h-10 bg-background/20 rounded w-24'></div>
            </div>
            <div className='h-px bg-border'></div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-3'>
                <div className='h-4 bg-background/20 rounded w-24'></div>
                <div className='h-6 bg-background/20 rounded w-full'></div>
              </div>
              <div className='space-y-3'>
                <div className='h-4 bg-background/20 rounded w-24'></div>
                <div className='h-6 bg-background/20 rounded w-full'></div>
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
          <Link
            to='/providers'
            className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Link>
        </div>

        <div className='rounded-lg border bg-card p-8 text-card-foreground shadow-sm'>
          <div className='flex flex-col items-center justify-center space-y-4'>
            <AlertTriangle className='h-12 w-12 text-destructive' />
            <h2 className='text-xl font-semibold'>Error Loading Provider</h2>
            <p className='text-center text-muted-foreground'>
              {error.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
            >
              Try Again
            </button>
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
          <Link
            to='/providers'
            className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Link>
        </div>

        <div className='rounded-lg border bg-card p-8 text-card-foreground shadow-sm'>
          <div className='flex flex-col items-center justify-center space-y-4'>
            <Server className='h-12 w-12 text-muted-foreground' />
            <h2 className='text-xl font-semibold'>Provider Not Found</h2>
            <p className='text-center text-muted-foreground'>
              The provider you're looking for doesn't exist or has been deleted.
            </p>
            <Link
              to='/providers'
              className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
            >
              View All Providers
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex items-center gap-2 mb-8'>
        <Link
          to='/providers'
          className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back
        </Link>
      </div>

      {/* Provider Header */}
      <div className='rounded-lg p-0.5 bg-gradient-to-br from-primary/20 via-primary/10 to-background/5 overflow-hidden mb-6'>
        <div className='rounded-lg bg-card p-6 backdrop-blur-md'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div className='space-y-1'>
              <h1 className='text-2xl font-bold tracking-tight flex items-center gap-2'>
                {provider.name}
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${provider.enabled ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}
                >
                  {provider.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </h1>
              <p className='text-sm text-muted-foreground'>
                {provider.description || 'No description provided'}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <Link
                to='/providers/$id/edit'
                params={{ id: provider.id.toString() }}
                className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2'
              >
                <Edit className='mr-2 h-4 w-4' />
                Edit
              </Link>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-destructive hover:text-destructive-foreground h-10 px-4 py-2'
              >
                <Trash2 className='mr-2 h-4 w-4' />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Details */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Left Column */}
        <div className='space-y-6'>
          <div className='rounded-lg border bg-card p-6 text-card-foreground shadow-sm'>
            <h2 className='text-xl font-semibold mb-4'>Provider Details</h2>
            <div className='space-y-4'>
              <div>
                <div className='text-sm font-medium text-muted-foreground mb-1'>
                  Source
                </div>
                <div className='flex items-center gap-2'>
                  <Server className='h-4 w-4 text-primary' />
                  <span className='font-medium'>{provider.source}</span>
                </div>
              </div>

              <div>
                <div className='text-sm font-medium text-muted-foreground mb-1'>
                  Endpoint
                </div>
                <div className='flex items-center gap-2'>
                  <ExternalLink className='h-4 w-4 text-primary' />
                  <span className='font-medium break-all'>
                    {provider.endpoint || 'Not specified'}
                  </span>
                </div>
              </div>

              <div>
                <div className='text-sm font-medium text-muted-foreground mb-1'>
                  Default Model
                </div>
                <div className='flex items-center gap-2'>
                  <Settings className='h-4 w-4 text-primary' />
                  <span className='font-medium'>
                    {provider.defaultModel || 'Not specified'}
                  </span>
                </div>
              </div>

              <div>
                <div className='text-sm font-medium text-muted-foreground mb-1'>
                  Organization ID
                </div>
                <div className='flex items-center gap-2'>
                  <Layers className='h-4 w-4 text-primary' />
                  <span className='font-medium break-all'>
                    {provider.organizationId || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className='rounded-lg border bg-card p-6 text-card-foreground shadow-sm'>
            <h2 className='text-xl font-semibold mb-4'>Model Parameters</h2>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <div className='text-sm font-medium text-muted-foreground mb-1'>
                    Temperature
                  </div>
                  <div className='font-medium'>{provider.temperature}</div>
                </div>
                <div>
                  <div className='text-sm font-medium text-muted-foreground mb-1'>
                    Top P
                  </div>
                  <div className='font-medium'>{provider.topP}</div>
                </div>
                <div>
                  <div className='text-sm font-medium text-muted-foreground mb-1'>
                    Max Tokens
                  </div>
                  <div className='font-medium'>{provider.maxTokens}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className='space-y-6'>
          <div className='rounded-lg border bg-card p-6 text-card-foreground shadow-sm'>
            <h2 className='text-xl font-semibold mb-4'>Configuration</h2>
            <div className='bg-muted rounded-md p-4 overflow-auto max-h-60'>
              <pre className='text-sm'>
                <code>{provider.config || 'No additional configuration'}</code>
              </pre>
            </div>
          </div>

          <div className='rounded-lg border bg-card p-6 text-card-foreground shadow-sm'>
            <h2 className='text-xl font-semibold mb-4'>Usage</h2>
            <div className='space-y-4'>
              <div>
                <div className='text-sm font-medium text-muted-foreground mb-1'>
                  Projects
                </div>
                <div className='flex items-center justify-between'>
                  <span className='font-medium'>
                    {provider.projects?.count || 0} projects
                  </span>
                  {provider.projects?.count > 0 && (
                    <button className='text-sm text-primary hover:underline inline-flex items-center'>
                      View All <ChevronRight className='h-4 w-4 ml-1' />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className='text-sm font-medium text-muted-foreground mb-1'>
                  Prompts
                </div>
                <div className='flex items-center justify-between'>
                  <span className='font-medium'>
                    {provider.prompts?.count || 0} prompts
                  </span>
                  {provider.prompts?.count > 0 && (
                    <button className='text-sm text-primary hover:underline inline-flex items-center'>
                      View All <ChevronRight className='h-4 w-4 ml-1' />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className='rounded-lg border bg-card p-6 text-card-foreground shadow-sm'>
            <h2 className='text-xl font-semibold mb-4'>Metadata</h2>
            <div className='space-y-4'>
              <div>
                <div className='text-sm font-medium text-muted-foreground mb-1'>
                  Created At
                </div>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4 text-primary' />
                  <span className='font-medium'>
                    {new Date(provider.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <div className='text-sm font-medium text-muted-foreground mb-1'>
                  Last Updated
                </div>
                <div className='flex items-center gap-2'>
                  <Pencil className='h-4 w-4 text-primary' />
                  <span className='font-medium'>
                    {new Date(provider.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className='fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <div className='bg-card rounded-lg shadow-lg max-w-md w-full p-6 space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center'>
                <AlertTriangle className='h-5 w-5 text-destructive' />
              </div>
              <h3 className='text-lg font-semibold'>Delete Provider</h3>
            </div>
            <p className='text-muted-foreground'>
              Are you sure you want to delete this provider? This action cannot
              be undone and may affect any projects or prompts using this
              provider.
            </p>
            <div className='flex justify-end gap-2 pt-2'>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2'
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2'
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProviderPage
