import { graphql } from '@/gql'
import { cn } from '@/utils'
import { useQuery } from '@apollo/client'
import { Check } from 'lucide-react'

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
}: {
  provider: { id: number; name: string; enabled: boolean }
  isSelected: boolean
  isDisabled: boolean
  onClick: () => void
  name: string
  id: string
}) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300',
        'cursor-pointer border border-transparent bg-gradient-to-br backdrop-blur-xl shadow-lg',
        'hover:shadow-xl hover:scale-[1.02] hover:border-primary/30',
        'from-background/40 to-background/20',
        isSelected
          ? 'from-primary/20 to-primary/5 border-primary/50 ring-2 ring-primary/30'
          : '',
        isDisabled
          ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-lg'
          : '',
      )}
      onClick={isDisabled ? undefined : onClick}
      aria-disabled={isDisabled}
    >
      <input
        type='radio'
        id={id}
        name={name}
        value={provider.id}
        checked={isSelected}
        disabled={isDisabled}
        className='sr-only'
      />

      {isSelected && (
        <div className='absolute top-2 right-2 flex items-center justify-center w-5 h-5 bg-primary rounded-full'>
          <Check className='w-3 h-3 text-white' />
        </div>
      )}

      <div className='text-center'>
        <h3
          className={cn(
            'text-base font-semibold mb-1',
            isSelected
              ? 'bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent'
              : '',
          )}
        >
          {provider.name}
        </h3>
      </div>
    </div>
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
    <div className='space-y-3'>
      {label && (
        <label className='text-sm font-medium leading-none block'>
          {label}
        </label>
      )}

      {loading ? (
        <div className='flex justify-center py-6'>
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary'></div>
        </div>
      ) : providers.length === 0 ? (
        <div className='text-center py-4 text-muted-foreground'>
          No providers available
        </div>
      ) : (
        <div
          role='radiogroup'
          className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'
        >
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              isSelected={value === provider.id}
              isDisabled={!provider.enabled}
              onClick={() => handleProviderSelect(provider.id)}
              name={name}
              id={`${name}-${provider.id}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProvidersSelector
