import { graphql } from '@/gql'
import { cn } from '@/utils'
import Tooltip from '@annatarhe/lake-ui/tooltip'
import { useQuery } from '@apollo/client'
import { motion } from 'framer-motion'
import { Check, Loader2, Server, Sparkles } from 'lucide-react'

const pl = graphql(`
  query allProviderListLiteForSelect($pagination: PaginationInput!) {
    providers(pagination: $pagination) {
      count
      edges {
        id
        name
        enabled
        source
        endpoint
      }
    }
  }
`)

type Props = {
  name: string
  label: string | React.ReactNode
  value?: number | null
  onChange: (value: number | null) => void
}

function ProviderCard({
  provider,
  isSelected,
  isDisabled,
  onClick,
  name,
  id,
  index,
}: {
  provider: { id: number, name: string, enabled: boolean, source?: string }
  isSelected: boolean
  isDisabled: boolean
  onClick: () => void
  name: string
  id: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className={cn(
        'group relative rounded-2xl transition-all duration-300 cursor-pointer',
        'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
        'border border-gray-200/50 dark:border-gray-600/50',
        'shadow-sm hover:shadow-lg',
        isSelected && 'ring-2 ring-sky-500/50 border-sky-500/50 bg-sky-50/80 dark:bg-sky-950/30',
        isDisabled && 'opacity-60 cursor-not-allowed hover:shadow-sm',
        !isDisabled && 'hover:scale-[1.02]',
      )}
      onClick={isDisabled ? undefined : onClick}
      aria-disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
    >
      {/* Background gradient overlay */}
      <div className={cn(
        'absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300',
        'bg-gradient-to-br from-sky-500/5 via-transparent to-blue-500/5',
        'dark:from-sky-400/10 dark:via-transparent dark:to-blue-400/10',
        isSelected && 'opacity-100',
        !isSelected && 'opacity-0 group-hover:opacity-100',
      )}
      />

      <div className='relative p-5'>
        <input
          type='radio'
          id={id}
          name={name}
          value={provider.id}
          checked={isSelected}
          disabled={isDisabled}
          className='sr-only'
        />

        {/* Header with icon and status */}
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className={cn(
              'p-2.5 rounded-xl backdrop-blur-sm border transition-all duration-200',
              isSelected
                ? 'bg-gradient-to-br from-sky-500/30 to-blue-500/30 dark:from-sky-400/40 dark:to-blue-400/40 border-sky-500/30 dark:border-sky-400/40'
                : 'bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-sky-400/30 dark:to-blue-400/30 border-sky-500/20 dark:border-sky-400/30',
            )}
            >
              <Server className={cn(
                'w-5 h-5 transition-colors duration-200',
                isSelected
                  ? 'text-sky-600 dark:text-sky-400'
                  : 'text-sky-600 dark:text-sky-400',
              )}
              />
            </div>
            {isSelected && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className='flex items-center justify-center w-6 h-6 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full shadow-lg'
              >
                <Check className='w-3.5 h-3.5 text-white' />
              </motion.div>
            )}
          </div>

          {!provider.enabled && (
            <div className='px-2 py-1 rounded-full text-xs font-medium bg-red-50/80 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200/50 dark:border-red-800/50'>
              Disabled
            </div>
          )}
        </div>

        {/* Provider info */}
        <div className='space-y-2'>
          <Tooltip content={provider.name} disabled={provider.name.length <= 20}>
            <h3 className={cn(
              'font-semibold text-base leading-tight transition-colors duration-200 max-w-36 text-ellipsis overflow-hidden whitespace-nowrap',
              isSelected
                ? 'text-sky-700 dark:text-sky-300'
                : 'text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400',
            )}
            >
              {provider.name}
            </h3>
          </Tooltip>

          {provider.source && (
            <Tooltip content={`Provider type: ${provider.source}`} disabled={provider.source.length <= 15}>
              <p className='text-sm text-gray-500 dark:text-gray-400 capitalize'>
                {provider.source}
              </p>
            </Tooltip>
          )}

          <div className={cn(
            'text-xs font-medium transition-colors duration-200',
            isSelected
              ? 'text-sky-600 dark:text-sky-400'
              : 'text-gray-500 dark:text-gray-500 group-hover:text-sky-500',
          )}
          >
            {isSelected ? '✓ Selected' : 'Click to select'}
          </div>
        </div>

        {/* Selection glow effect */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className='absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-500/10 to-blue-500/10 pointer-events-none'
          />
        )}
      </div>
    </motion.div>
  )
}

function ProvidersSelector({ name, label, value, onChange }: Props) {
  const { data, loading } = useQuery(pl, {
    variables: {
      pagination: {
        limit: 50,
        offset: 0,
      },
    },
  })

  const providers = data?.providers?.edges || []

  // Create a synthetic event that mimics a select change event
  const handleProviderSelect = (providerId: number) => {
    onChange(providerId)
  }

  return (
    <div className='space-y-6'>
      {label && (
        <div className='flex items-center gap-3'>
          <div className='p-2 rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-sky-400/30 dark:to-blue-400/30 backdrop-blur-sm border border-sky-500/20 dark:border-sky-400/30'>
            <Sparkles className='w-4 h-4 text-sky-600 dark:text-sky-400' />
          </div>
          <label className='text-lg font-semibold text-gray-900 dark:text-white'>
            {label}
          </label>
        </div>
      )}

      {loading
        ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='flex flex-col items-center justify-center py-12 space-y-4'
            >
              <div className='relative'>
                <div className='w-12 h-12 rounded-full border-4 border-sky-200 dark:border-sky-800'></div>
                <Loader2 className='w-12 h-12 text-sky-500 animate-spin absolute top-0 left-0' />
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400 font-medium'>
                Loading providers...
              </p>
            </motion.div>
          )
        : providers.length === 0
          ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className='relative rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 shadow-sm p-8 text-center'
              >
                {/* Background gradient overlay */}
                <div className='absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 dark:from-orange-400/10 dark:via-transparent dark:to-red-400/10 rounded-2xl pointer-events-none' />

                <div className='relative space-y-4'>
                  <div className='flex justify-center'>
                    <div className='p-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 dark:from-orange-400/30 dark:to-red-400/30 backdrop-blur-sm border border-orange-500/20 dark:border-orange-400/30'>
                      <Server className='w-8 h-8 text-orange-600 dark:text-orange-400' />
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                      No Providers Available
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto'>
                      You need to create at least one provider before you can select it for your project.
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          : (
              <div
                role='radiogroup'
                className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
              >
                {providers.map((provider, index) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    isSelected={value === provider.id}
                    isDisabled={!provider.enabled}
                    onClick={() => handleProviderSelect(provider.id)}
                    name={name}
                    id={`${name}-${provider.id}`}
                    index={index}
                  />
                ))}
              </div>
            )}
    </div>
  )
}

export default ProvidersSelector
