import { p, up } from '@/pages/providers/provider.query'
import { useApolloClient, useMutation, useQuery } from '@apollo/client'
import { useNavigate, useParams } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import ProviderForm from './components/provider-form/ProviderForm'
import { ProviderFormValues } from './components/provider-form/schema'

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
      if (!data.provider) {
        toast.error('Provider not found')
        return
      }
      const headersObj: Record<string, string> = data.provider.headers
        ? JSON.parse(data.provider.headers)
        : {}
      const headers: { key: string, value: string }[] = Object.entries(
        headersObj,
      ).reduce(
        (acc, [key, value]) => {
          acc.push({ key, value })
          return acc
        },
        [] as { key: string, value: string }[],
      )
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
        headers,
      })
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
    const headers: Record<string, string> = {}
    data.headers?.forEach((header) => {
      headers[header.key] = header.value
    })
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
          headers: JSON.stringify(headers),
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
      <div className='min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 dark:from-gray-950 dark:via-gray-900/95 dark:to-gray-800/90'>
        <div className='absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10'></div>
        <div className='absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/5 dark:from-violet-400/10 dark:via-transparent dark:to-indigo-400/10'></div>

        <div className='relative z-10'>
          <div className='container max-w-4xl mx-auto px-4 py-8'>
            <div className='flex items-center justify-center h-64'>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col items-center gap-4 p-8 rounded-2xl bg-card/50 dark:bg-gray-800/50 backdrop-blur-xl border border-border/50 dark:border-gray-600/50'
              >
                <div className='p-3 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 dark:from-violet-400/30 dark:to-purple-400/30'>
                  <Loader2 className='w-8 h-8 text-violet-600 dark:text-violet-400 animate-spin' />
                </div>
                <div className='text-center space-y-2'>
                  <h3 className='text-lg font-semibold text-foreground dark:text-gray-100'>
                    Loading Provider
                  </h3>
                  <p className='text-sm text-muted-foreground dark:text-gray-400'>
                    Fetching provider configuration...
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 dark:from-gray-950 dark:via-gray-900/95 dark:to-gray-800/90'>
      {/* Background Pattern */}
      <div className='absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10'></div>
      <div className='absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/5 dark:from-violet-400/10 dark:via-transparent dark:to-indigo-400/10'></div>

      <div className='relative z-10'>
        <div className='container max-w-4xl mx-auto px-4 py-8'>
          <ProviderForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => navigate({ to: `/providers/${providerId}` })}
            submitButtonText='Update Provider'
          />
        </div>
      </div>
    </div>
  )
}

export default ProvidersUpdatePage
