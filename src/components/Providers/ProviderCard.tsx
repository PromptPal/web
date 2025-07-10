import { Provider } from '@/gql/graphql'
import { cn } from '@/utils'
import {
  Activity,
  Calendar,
  Clock,
  Cpu,
  Database,
  Globe,
  Loader2,
  Network,
  Server,
  Settings2,
  Shield,
  Sparkles,
  Thermometer,
  Zap,
} from 'lucide-react'
import React from 'react'

import { DetailItem } from './DetailItem'
import { ProviderSkeletonLoader } from './ProviderSkeletonLoader'
import { Section } from './Section'

interface ProviderCardProps {
  provider?: Omit<Provider, 'projects' | 'prompts' | 'headers'> | null
  className?: string
  loading?: boolean
}

/**
 * Compact and elegant provider card with subtle styling
 */
export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  className,
  loading,
}) => {
  // Show loading skeleton when loading and no provider data
  if (loading && !provider) {
    return <ProviderSkeletonLoader />
  }

  if (!provider) {
    return (
      <div className='bg-white/[0.02] border border-white/10 rounded-xl p-6 text-center'>
        <Server className='w-8 h-8 text-gray-500 mx-auto mb-3' />
        <h3 className='text-sm font-medium text-gray-400 mb-1'>No Provider Configured</h3>
        <p className='text-xs text-gray-500'>Configure an AI provider to get started</p>
      </div>
    )
  }

  // Format dates for better display
  const createdAt = provider.createdAt
    ? new Date(provider.createdAt).toLocaleDateString()
    : null
  const updatedAt = provider.updatedAt
    ? new Date(provider.updatedAt).toLocaleDateString()
    : null

  return (
    <div className={cn('mt-6', className)}>
      {/* Compact header */}
      <div className='bg-white/[0.03] border border-white/10 rounded-xl p-6 hover:bg-white/[0.04] hover:border-white/15 transition-all duration-300 relative overflow-hidden'>
        {/* Loading overlay for existing content */}
        {loading && (
          <div className='absolute inset-0 bg-gray-900/40 backdrop-blur-sm rounded-xl flex items-center justify-center z-10'>
            <div className='bg-gray-800/80 backdrop-blur-md rounded-lg p-4 shadow-lg border border-gray-700/50 flex items-center gap-3'>
              <Loader2 className='w-5 h-5 text-blue-400 animate-spin' />
              <span className='text-sm text-gray-300 font-medium'>Updating provider...</span>
            </div>
          </div>
        )}

        <div className='flex items-start justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center'>
              <Shield className='w-5 h-5 text-gray-300' />
            </div>
            <div>
              <h2 className='text-lg font-semibold text-white'>
                {provider.name}
              </h2>
              <p className='text-sm text-gray-400'>{provider.source}</p>
            </div>
          </div>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium',
              provider.enabled
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
            )}
          >
            <div className={cn('w-1.5 h-1.5 rounded-full', provider.enabled ? 'bg-green-400' : 'bg-gray-400')} />
            {provider.enabled ? 'Active' : 'Inactive'}
          </span>
        </div>

        {provider.description && (
          <p className='text-sm text-gray-300 mb-4 leading-relaxed'>
            {provider.description}
          </p>
        )}

        {/* Compact content grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Connection */}
          <Section title='Connection' icon={Network}>
            <DetailItem
              icon={Database}
              label='ID'
              value={provider.id}
              valueClassName='font-mono text-xs'
            />
            <DetailItem
              icon={Globe}
              label='Endpoint'
              value={provider.endpoint}
              valueClassName='text-xs break-all'
              tooltip='The API endpoint URL for this provider'
            />
            <DetailItem
              icon={Settings2}
              label='Organization'
              value={provider.organizationId}
              valueClassName='font-mono text-xs'
            />
          </Section>

          {/* Model Settings */}
          <Section title='Model' icon={Cpu}>
            <DetailItem
              icon={Sparkles}
              label='Default Model'
              value={provider.defaultModel}
              tooltip='The default AI model used by this provider'
            />
            <DetailItem
              icon={Thermometer}
              label='Temperature'
              value={provider.temperature}
              tooltip='Controls randomness in responses'
            />
            <DetailItem
              icon={Zap}
              label='Top P'
              value={provider.topP}
              tooltip='Controls diversity via nucleus sampling'
            />
            <DetailItem
              icon={Activity}
              label='Max Tokens'
              value={provider.maxTokens}
              tooltip='Maximum tokens in completion'
            />
          </Section>

          {/* System Info */}
          <Section title='System' icon={Clock}>
            <DetailItem
              icon={Calendar}
              label='Created'
              value={createdAt}
            />
            <DetailItem
              icon={Calendar}
              label='Updated'
              value={updatedAt}
            />
            {provider.config && Object.keys(provider.config).length > 0 && (
              <details className='mt-3'>
                <summary className='cursor-pointer text-xs text-gray-400 hover:text-gray-300 transition-colors flex items-center gap-1'>
                  <Settings2 className='w-3 h-3' />
                  Config
                </summary>
                <pre className='mt-2 p-3 bg-black/10 rounded-lg text-xs text-gray-400 overflow-x-auto border border-white/5'>
                  {JSON.stringify(provider.config, null, 2)}
                </pre>
              </details>
            )}
          </Section>
        </div>
      </div>
    </div>
  )
}
