import { Link } from '@tanstack/react-router'
import { Server, Settings } from 'lucide-react'

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
      {providers.map(provider => (
        <Link
          key={provider.id}
          to='/providers/$id'
          params={{ id: provider.id.toString() }}
          className='group rounded-xl p-0.5 bg-gradient-to-br from-purple-500/40 via-purple-600/30 to-purple-700/20 overflow-hidden transition-all duration-300 hover:from-purple-500/60 hover:via-purple-600/40 hover:to-purple-700/30 hover:shadow-2xl hover:shadow-purple-500/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-background'
        >
          <div className='h-48 rounded-xl bg-card/70 p-6 flex flex-col justify-between backdrop-blur-lg transition-all duration-300 group-hover:bg-card/50 group-hover:backdrop-blur-2xl'>
            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <Server className='w-7 h-7 text-purple-400 group-hover:text-purple-300 transition-colors duration-300' />
                <h3 className='font-bold text-xl text-foreground group-hover:text-purple-300 transition-colors duration-300 truncate' title={provider.name}>
                  {provider.name}
                </h3>
              </div>
              <p className='text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 truncate'>
                ID:
                {' '}
                {provider.id}
              </p>
            </div>
            <div className='flex justify-between items-center mt-3 pt-3 border-t border-white/10 group-hover:border-purple-500/30 transition-colors duration-300'>
              <span className='text-xs text-muted-foreground group-hover:text-purple-400 transition-colors duration-300'>
                Manage Settings
              </span>
              <div className='h-9 w-9 rounded-full flex items-center justify-center bg-purple-500/10 group-hover:bg-purple-500/25 transition-all duration-300 group-hover:scale-110 transform-gpu'>
                <Settings className='h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors duration-300 group-hover:rotate-12' />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
