import { p, up } from '@/pages/providers/provider.query'
import { useApolloClient, useMutation, useQuery } from '@apollo/client'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import ProviderForm, { ProviderFormValues } from './components/ProviderForm'

function ProvidersUpdatePage() {
  const { id } = useParams({ strict: false })
  const providerId = parseInt(id ?? '0', 10)
  const navigate = useNavigate()
  const apolloClient = useApolloClient()
  const [initialValues, setInitialValues] = useState<
    Partial<ProviderFormValues>
  >({})

  const { loading: isLoading, error } = useQuery(p, {
    variables: {
      id: providerId,
    },
    skip: !providerId,
    onCompleted(data) {
      if (data?.provider) {
        const provider = data.provider
        setInitialValues({
          name: provider.name,
          description: provider.description || undefined,
          enabled: provider.enabled,
          source: provider.source,
          endpoint: provider.endpoint,
          organizationId: provider.organizationId || undefined,
          defaultModel: provider.defaultModel,
          temperature: provider.temperature,
          topP: provider.topP,
          maxTokens: provider.maxTokens,
          config: provider.config || undefined,
          // Note: API key is not returned from the server for security reasons
          // User will need to re-enter it if they want to change it
        })
      }
    },
  })

  const [updateProvider, { loading: isSubmitting }] = useMutation(up, {
    refetchQueries: ['allProviderListLite', 'getProviderForEdit'],
    onCompleted() {
      toast.success('Provider updated successfully')
      apolloClient.resetStore()
      navigate({ to: `/providers/${providerId}` })
    },
    onError(error) {
      console.error('Failed to update provider:', error)
      toast.error('Failed to update provider')
    },
  })

  const handleSubmit = async (data: ProviderFormValues) => {
    await updateProvider({
      variables: {
        id: providerId,
        data: {
          name: data.name,
          description: data.description || '',
          enabled: data.enabled,
          source: data.source,
          endpoint: data.endpoint,
          apiKey: data.apiKey,
          organizationId: data.organizationId || '',
          defaultModel: data.defaultModel,
          temperature: data.temperature,
          topP: data.topP,
          maxTokens: data.maxTokens,
          config: data.config || '',
        },
      },
    })
  }

  // Handle loading and error states
  useEffect(() => {
    if (error) {
      toast.error('Failed to load provider')
      console.error('Provider load error:', error)
    }
  }, [error])

  if (isLoading) {
    return (
      <div className='container max-w-3xl mx-auto px-4 py-8'>
        <div className='flex items-center justify-center h-64'>
          <div className='animate-pulse flex space-x-4'>
            <div className='flex-1 space-y-6 py-1'>
              <div className='h-4 bg-background/20 rounded w-3/4'></div>
              <div className='space-y-3'>
                <div className='h-4 bg-background/20 rounded'></div>
                <div className='h-4 bg-background/20 rounded w-5/6'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='container max-w-3xl mx-auto px-4 py-8'>
      <div className='flex items-center justify-between mb-8'>
        <div className='space-y-1'>
          <h1 className='text-2xl font-bold tracking-tight'>Update Provider</h1>
          <p className='text-sm text-muted-foreground'>
            Edit your LLM provider settings
          </p>
        </div>
      </div>

      <ProviderForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={() => navigate({ to: `/providers/${providerId}` })}
        submitButtonText='Update Provider'
      />
    </div>
  )
}

export default ProvidersUpdatePage
