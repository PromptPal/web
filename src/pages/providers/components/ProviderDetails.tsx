import { ExternalLink, Layers, Server, Settings } from 'lucide-react'
import { DetailCard } from './DetailCard'

type ProviderDetailsProps = {
  provider: {
    source: string
    endpoint?: string | null
    defaultModel?: string | null
    organizationId?: string | null
  }
}

export function ProviderDetails({ provider }: ProviderDetailsProps) {
  return (
    <DetailCard title='Provider Details'>
      <div>
        <div className='text-sm font-medium text-muted-foreground mb-1'>
          Source
        </div>
        <div className='flex items-center gap-2'>
          <Server className='h-4 w-4 text-primary' />
          <span className='font-medium'>{provider.source}</span>
        </div>
      </div>

      <div>
        <div className='text-sm font-medium text-muted-foreground mb-1'>
          Endpoint
        </div>
        <div className='flex items-center gap-2'>
          <ExternalLink className='h-4 w-4 text-primary' />
          <span className='font-medium break-all'>
            {provider.endpoint || 'Not specified'}
          </span>
        </div>
      </div>

      <div>
        <div className='text-sm font-medium text-muted-foreground mb-1'>
          Default Model
        </div>
        <div className='flex items-center gap-2'>
          <Settings className='h-4 w-4 text-primary' />
          <span className='font-medium'>
            {provider.defaultModel || 'Not specified'}
          </span>
        </div>
      </div>

      <div>
        <div className='text-sm font-medium text-muted-foreground mb-1'>
          Organization ID
        </div>
        <div className='flex items-center gap-2'>
          <Layers className='h-4 w-4 text-primary' />
          <span className='font-medium break-all'>
            {provider.organizationId || 'Not specified'}
          </span>
        </div>
      </div>
    </DetailCard>
  )
}
