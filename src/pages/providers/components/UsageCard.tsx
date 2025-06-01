import { ChevronRight } from 'lucide-react'
import { DetailCard } from './DetailCard'

type UsageCardProps = {
  projects?: { count: number } | null
  prompts?: { count: number } | null
}

export function UsageCard({ projects, prompts }: UsageCardProps) {
  return (
    <DetailCard title='Usage'>
      <div className='space-y-4'>
        <div className='p-3 rounded-lg bg-gradient-to-br from-primary/5 to-background/0'>
          <div className='text-sm font-medium text-muted-foreground mb-1'>
            Projects
          </div>
          <div className='flex items-center justify-between'>
            <span className='font-medium'>
              {projects?.count || 0}
              {' '}
              projects
            </span>
            {projects?.count && projects.count > 0 && (
              <button className='text-sm text-primary hover:text-primary/80 hover:underline inline-flex items-center transition-colors'>
                View All
                {' '}
                <ChevronRight className='h-4 w-4 ml-1' />
              </button>
            )}
          </div>
        </div>

        <div className='p-3 rounded-lg bg-gradient-to-br from-primary/5 to-background/0'>
          <div className='text-sm font-medium text-muted-foreground mb-1'>
            Prompts
          </div>
          <div className='flex items-center justify-between'>
            <span className='font-medium'>
              {prompts?.count || 0}
              {' '}
              prompts
            </span>
            {prompts?.count && prompts.count > 0 && (
              <button className='text-sm text-primary hover:text-primary/80 hover:underline inline-flex items-center transition-colors'>
                View All
                {' '}
                <ChevronRight className='h-4 w-4 ml-1' />
              </button>
            )}
          </div>
        </div>
      </div>
    </DetailCard>
  )
}
