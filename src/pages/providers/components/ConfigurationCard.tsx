import { DetailCard } from './DetailCard'

type ConfigurationCardProps = {
  config: string | null
}

export function ConfigurationCard({ config }: ConfigurationCardProps) {
  return (
    <DetailCard title='Configuration'>
      <div className='bg-muted/50 rounded-md p-4 overflow-auto max-h-60 backdrop-blur-sm border border-muted/20'>
        <pre className='text-sm'>
          <code>{config || 'No additional configuration'}</code>
        </pre>
      </div>
    </DetailCard>
  )
}
