import { Calendar, Pencil } from 'lucide-react'
import { DetailCard } from './DetailCard'

type MetadataCardProps = {
  createdAt: string
  updatedAt: string
}

export function MetadataCard({ createdAt, updatedAt }: MetadataCardProps) {
  return (
    <DetailCard title='Metadata'>
      <div className='space-y-4'>
        <div className='p-3 rounded-lg bg-gradient-to-br from-primary/5 to-background/0'>
          <div className='text-sm font-medium text-muted-foreground mb-1'>
            Created At
          </div>
          <div className='flex items-center gap-2'>
            <Calendar className='h-4 w-4 text-primary' />
            <span className='font-medium'>
              {new Date(createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        <div className='p-3 rounded-lg bg-gradient-to-br from-primary/5 to-background/0'>
          <div className='text-sm font-medium text-muted-foreground mb-1'>
            Last Updated
          </div>
          <div className='flex items-center gap-2'>
            <Pencil className='h-4 w-4 text-primary' />
            <span className='font-medium'>
              {new Date(updatedAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </DetailCard>
  )
}
