import { pl } from '@/pages/providers/provider.query'
import { useQuery } from '@apollo/client'
import { Link } from '@tanstack/react-router'
import { PlusCircle, Server, Settings } from 'lucide-react'
import { useState } from 'react'

function ProvidersPage() {
  const [pagination] = useState({
    limit: 50,
    offset: 0,
  })

  const {
    data,
    loading: isLoading,
    error,
  } = useQuery(pl, {
    variables: {
      pagination,
    },
  })

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center justify-between mb-8'>
          <div className='space-y-1'>
            <h1 className='text-2xl font-bold tracking-tight'>Providers</h1>
            <p className='text-sm text-muted-foreground'>
              Manage your LLM providers
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <button
              className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
              disabled
            >
              <PlusCircle className='mr-2 h-4 w-4' />
              New Provider
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className='rounded-lg p-0.5 bg-gradient-to-br from-primary/20 via-primary/10 to-background/5 overflow-hidden'
            >
              <div className='h-40 rounded-lg bg-card p-6 flex flex-col justify-between backdrop-blur-md animate-pulse'>
                <div className='space-y-3'>
                  <div className='h-4 bg-background/20 rounded w-3/4'></div>
                  <div className='h-3 bg-background/20 rounded w-1/2'></div>
                </div>
                <div className='flex justify-between items-center'>
                  <div className='h-3 bg-background/20 rounded w-1/4'></div>
                  <div className='h-8 w-8 bg-background/20 rounded-full'></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='rounded-lg border bg-card p-8 text-card-foreground shadow-sm'>
          <div className='flex flex-col items-center justify-center space-y-4'>
            <Server className='h-12 w-12 text-destructive' />
            <h2 className='text-xl font-semibold'>Error Loading Providers</h2>
            <p className='text-center text-muted-foreground'>
              {error.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const providers = data?.providers?.edges || []
  const hasProviders = providers.length > 0

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex items-center justify-between mb-8'>
        <div className='space-y-1'>
          <h1 className='text-2xl font-bold tracking-tight'>Providers</h1>
          <p className='text-sm text-muted-foreground'>
            Manage your LLM providers
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Link
            to='/providers/new'
            className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
          >
            <PlusCircle className='mr-2 h-4 w-4' />
            New Provider
          </Link>
        </div>
      </div>

      {!hasProviders ? (
        <div className='rounded-lg border bg-card p-8 text-card-foreground shadow-sm'>
          <div className='flex flex-col items-center justify-center space-y-4'>
            <Server className='h-12 w-12 text-muted-foreground' />
            <h2 className='text-xl font-semibold'>No Providers Found</h2>
            <p className='text-center text-muted-foreground'>
              You haven't created any providers yet.
            </p>
            <Link
              to='/providers/new'
              className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
            >
              Create Your First Provider
            </Link>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  )
}

export default ProvidersPage
