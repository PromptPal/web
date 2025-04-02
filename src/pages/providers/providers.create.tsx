import { cp } from '@/pages/providers/provider.query'
import { useApolloClient, useMutation } from '@apollo/client'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'react-hot-toast'
import ProviderForm, {
  ProviderFormValues,
} from './components/provider-form/ProviderForm'

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
          headers: data.headers ? JSON.stringify(data.headers) : '[]',
        },
      },
    })
  }

  return (
    <div className='container max-w-3xl mx-auto px-4 py-8'>
      <div className='flex items-center justify-between mb-8'>
        <div className='space-y-1'>
          <h1 className='text-2xl font-bold tracking-tight'>
            Create New Provider
          </h1>
          <p className='text-sm text-muted-foreground'>
            Add a new LLM provider to use with your prompts
          </p>
        </div>
      </div>

      <ProviderForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={() => navigate({ to: '/providers' })}
        submitButtonText='Create Provider'
      />
    </div>
  )
}

export default ProvidersCreatePage
