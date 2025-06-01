import { Provider } from '@/gql/graphql'
import { cn } from '@/utils'
import Tooltip from '@annatarhe/lake-ui/tooltip'
import {
  Calendar,
  Cpu,
  Globe,
  Info,
  Power,
  Server,
  Settings2,
  Thermometer,
  Zap,
} from 'lucide-react'
import React from 'react'

interface ProviderCardProps {
  provider?: Omit<Provider, 'projects' | 'prompts'> | null
  className?: string
}

// Helper component for displaying details with icons
const DetailItem: React.FC<{
  icon: React.ElementType
  label: string
  value?: string | number | null | boolean
  valueClassName?: string
  tooltip?: string
}> = ({ icon: Icon, label, value, valueClassName, tooltip }) => {
  if (value === null || value === undefined || value === '') {
    return null // Don't render if value is not meaningful
  }

  let displayValue: React.ReactNode = value
  if (typeof value === 'boolean') {
    displayValue = value ? 'Yes' : 'No'
  }

  return (
    <div className='flex items-center gap-2 text-sm'>
      <Icon className='h-4 w-4 flex-shrink-0 text-muted-foreground' />
      <span className='font-medium text-muted-foreground'>
        {label}
        :
      </span>
      <span
        className={cn('text-foreground break-words min-w-0', valueClassName)}
      >
        {displayValue}
      </span>
      {tooltip && (
        <Tooltip content={tooltip}>
          <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
        </Tooltip>
      )}
    </div>
  )
}

// Section component for grouping related details
const Section: React.FC<{
  title: string
  icon: React.ElementType
  children: React.ReactNode
  className?: string
  gradientFrom?: string
  gradientTo?: string
}> = ({
  title,
  icon: Icon,
  children,
  className,
  gradientFrom = 'from-blue-500/20',
  gradientTo = 'to-purple-500/20',
}) => {
  return (
    <div
      className={cn(
        'space-y-4 rounded-xl bg-gradient-to-br p-5 backdrop-blur-xl shadow-lg border border-gray-700/30',
        gradientFrom,
        gradientTo,
        className,
      )}
    >
      <div className='flex items-center gap-2'>
        <Icon className='h-5 w-5 text-primary' />
        <h3 className='text-base font-semibold text-foreground bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
          {title}
        </h3>
      </div>
      <div className='space-y-3'>{children}</div>
    </div>
  )
}

/**
 * Displays the details of a specific provider in a visually appealing card using HTML tags and Tailwind CSS.
 * Features gradients, blur effects, and modern styling matching the project page design.
 */
export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  className,
}) => {
  if (!provider) {
    return null
  }

  // Format dates for better display
  const createdAt = provider.createdAt
    ? new Date(provider.createdAt).toLocaleDateString()
    : null
  const updatedAt = provider.updatedAt
    ? new Date(provider.updatedAt).toLocaleDateString()
    : null

  return (
    <div className={cn('mt-6 space-y-4', className)}>
      {/* Header with name and status */}
      <div className='flex items-start justify-between'>
        <div>
          <h2 className='text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500'>
            Provider Details
          </h2>
          {provider.description && (
            <p className='text-sm text-muted-foreground mt-1'>
              {provider.description}
            </p>
          )}
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold',
            provider.enabled
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : 'bg-red-500/20 text-red-300 border border-red-500/30',
          )}
        >
          <Power className='h-3 w-3' />
          <span>{provider.enabled ? 'Enabled' : 'Disabled'}</span>
        </span>
      </div>

      {/* Main content grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Basic Information Section */}
        <Section
          title='Basic Information'
          icon={Server}
          gradientFrom='from-blue-500/20'
          gradientTo='to-indigo-500/20'
        >
          <DetailItem
            icon={Settings2}
            label='ID'
            value={provider.id}
            valueClassName='font-mono text-xs'
          />
          <DetailItem
            icon={Settings2}
            label='Source'
            value={provider.source}
            tooltip='The provider service type (e.g., OpenAI, Azure, etc.)'
          />
          <DetailItem
            icon={Cpu}
            label='Default Model'
            value={provider.defaultModel}
            tooltip='The default AI model used by this provider'
          />
          <DetailItem
            icon={Globe}
            label='Endpoint'
            value={provider.endpoint}
            valueClassName='text-xs break-all'
            tooltip='The API endpoint URL for this provider'
          />
          <DetailItem
            icon={Globe}
            label='Organization ID'
            value={provider.organizationId}
            valueClassName='font-mono text-xs'
          />
        </Section>

        {/* Model Parameters Section */}
        <Section
          title='Model Parameters'
          icon={Settings2}
          gradientFrom='from-purple-500/20'
          gradientTo='to-pink-500/20'
        >
          <DetailItem
            icon={Thermometer}
            label='Temperature'
            value={provider.temperature}
            tooltip='Controls randomness: Higher values make output more random, lower values make it more focused and deterministic'
          />
          <DetailItem
            icon={Zap}
            label='Top P'
            value={provider.topP}
            tooltip='Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered'
          />
          <DetailItem
            icon={Settings2}
            label='Max Tokens'
            value={provider.maxTokens}
            tooltip='The maximum number of tokens that can be generated in the completion'
          />
        </Section>

        {/* Metadata Section */}
        <Section
          title='Metadata'
          icon={Calendar}
          gradientFrom='from-emerald-500/20'
          gradientTo='to-teal-500/20'
          className='md:col-span-2'
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <DetailItem icon={Calendar} label='Created At' value={createdAt} />
            <DetailItem icon={Calendar} label='Updated At' value={updatedAt} />
            {provider.config && Object.keys(provider.config).length > 0 && (
              <div className='col-span-full'>
                <div className='flex items-center gap-2 text-sm'>
                  <Settings2 className='h-4 w-4 flex-shrink-0 text-muted-foreground' />
                  <span className='font-medium text-muted-foreground'>
                    Additional Config:
                  </span>
                  <details className='text-xs'>
                    <summary className='cursor-pointer text-primary hover:text-primary/80 transition-colors'>
                      View Details
                    </summary>
                    <pre className='mt-2 p-3 bg-gray-800/50 rounded-lg overflow-x-auto text-xs'>
                      {JSON.stringify(provider.config, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            )}
          </div>
        </Section>
      </div>
    </div>
  )
}
