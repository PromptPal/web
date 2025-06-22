import { cp } from '@/pages/providers/provider.query'
import { useApolloClient, useMutation } from '@apollo/client'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'react-hot-toast'
import ProviderForm from './components/provider-form/ProviderForm'
import { ProviderFormValues } from './components/provider-form/schema'

function ProvidersCreatePage() {
  const navigate = useNavigate()
  const apolloClient = useApolloClient()

  const [createProvider, { loading: isSubmitting }] = useMutation(cp, {
    refetchQueries: ['allProviderListLite'],
    onCompleted(data) {
      toast.success('Provider created successfully')
      apolloClient.resetStore()
      navigate({ to: `/providers/${data.createProvider.id}` })
    },
    onError(error) {
      console.error('Failed to create provider:', error)
      toast.error('Failed to create provider')
    },
  })

  const handleSubmit = async (data: ProviderFormValues) => {
    if (!data.apiKey) {
      toast.error('API Key is required')
      return
    }

    const headers: Record<string, string> = {}
    if (data.headers) {
      data.headers.forEach((header) => {
        headers[header.key] = header.value
      })
    }
    await createProvider({
      variables: {
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
          headers: JSON.stringify(headers),
        },
      },
    })
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 dark:from-gray-950 dark:via-gray-900/95 dark:to-gray-800/90'>
      {/* Background Pattern */}
      <div className='absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10'></div>
      <div className='absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/5 dark:from-violet-400/10 dark:via-transparent dark:to-indigo-400/10'></div>

      <div className='relative z-10'>
        <div className='container max-w-4xl mx-auto px-4 py-8'>
          <ProviderForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => navigate({ to: '/providers' })}
            submitButtonText='Create Provider'
          />
        </div>
      </div>
    </div>
  )
}

export default ProvidersCreatePage
