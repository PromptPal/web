import { DetailCard } from './DetailCard'

type ModelParametersProps = {
  provider: {
    temperature: number
    topP: number
    maxTokens: number
  }
}

export function ModelParameters({ provider }: ModelParametersProps) {
  return (
    <DetailCard title='Model Parameters'>
      <div className='grid grid-cols-2 gap-4'>
        <div className='p-3 rounded-lg bg-gradient-to-br from-primary/5 to-background/0'>
          <div className='text-sm font-medium text-muted-foreground mb-1'>
            Temperature
          </div>
          <div className='font-medium text-lg'>{provider.temperature}</div>
        </div>
        <div className='p-3 rounded-lg bg-gradient-to-br from-primary/5 to-background/0'>
          <div className='text-sm font-medium text-muted-foreground mb-1'>
            Top P
          </div>
          <div className='font-medium text-lg'>{provider.topP}</div>
        </div>
        <div className='p-3 rounded-lg bg-gradient-to-br from-primary/5 to-background/0'>
          <div className='text-sm font-medium text-muted-foreground mb-1'>
            Max Tokens
          </div>
          <div className='font-medium text-lg'>{provider.maxTokens}</div>
        </div>
      </div>
    </DetailCard>
  )
}
