import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'

/**
 * Provider interface representing the structure of a provider item
 */
interface Provider {
  id: string | number
  name: string
}

/**
 * ProviderList component for displaying a grid of provider cards
 */
interface ProviderListProps {
  providers: Provider[]
}

export function ProviderList({ providers }: ProviderListProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {providers.map((provider) => (
        <Link
          key={provider.id}
          to={`/providers/$id`}
          params={{ id: provider.id.toString() }}
          className='group rounded-lg p-0.5 bg-gradient-to-br from-primary/20 via-primary/10 to-background/5 overflow-hidden transition-all duration-300 hover:from-primary/40 hover:via-primary/20 hover:to-background/10 hover:shadow-lg hover:shadow-primary/10 cursor-pointer'
        >
          <div className='h-40 rounded-lg bg-card p-6 flex flex-col justify-between backdrop-blur-md transition-all duration-300 group-hover:backdrop-blur-xl'>
            <div className='space-y-2'>
              <h3 className='font-semibold text-lg truncate group-hover:text-primary transition-colors'>
                {provider.name}
              </h3>
              <p className='text-sm text-muted-foreground truncate'>
                Provider ID: {provider.id}
              </p>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-muted-foreground'>
                Click to view details
              </span>
              <div className='h-8 w-8 rounded-full flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors'>
                <Settings className='h-4 w-4 text-primary' />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
