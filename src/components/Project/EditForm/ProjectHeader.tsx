import { cn } from '@/utils'
import Tooltip from '@annatarhe/lake-ui/tooltip'
import { Switch } from '@mantine/core'
import { Info } from 'lucide-react'

interface ProjectHeaderProps {
  projectName?: string | null
  enabled?: boolean
  onEnabledChange: (value: boolean) => void
}

function ProjectHeader({
  projectName,
  enabled,
  onEnabledChange,
}: ProjectHeaderProps) {
  return (
    <div className='flex flex-col md:flex-row md:items-center justify-between w-full mb-8 gap-4'>
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent'>
          Editing {projectName}
        </h1>
        <p className='text-sm text-muted-foreground/80 max-w-md'>
          Configure your project settings and API connections for optimal
          performance
        </p>
      </div>

      <div className='flex items-center gap-3'>
        <Tooltip content='Toggle to enable or disable this project'>
          <Info className='w-4 h-4 text-muted-foreground transition-colors' />
        </Tooltip>
        <div
          className='absolute bottom-full right-0 mb-2 px-4 py-2.5 rounded-xl
            bg-popover/90 text-popover-foreground border-none text-sm min-w-[14rem] hidden
            group-hover:block shadow-xl backdrop-blur-xl z-10 transform transition-all duration-200'
        >
          Toggle to enable or disable this project
        </div>
      </div>
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl px-5 py-2.5',
          'bg-gradient-to-r from-background/40 to-background/60 backdrop-blur-xl',
          'shadow-lg hover:shadow-xl transition-all duration-300',
        )}
      >
        <span
          className={cn(
            'text-sm font-medium',
            enabled ? 'text-emerald-400' : 'text-rose-400',
          )}
        >
          {enabled ? 'Enabled' : 'Disabled'}
        </span>
        <Switch
          checked={enabled}
          onChange={(event) => onEnabledChange(event.currentTarget.checked)}
          size='md'
          color={enabled ? 'teal' : 'red'}
          className='ml-1'
        />
      </div>
    </div>
  )
}

export default ProjectHeader
