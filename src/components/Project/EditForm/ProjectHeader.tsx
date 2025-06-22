import { cn } from '@/utils'
import Switch from '@annatarhe/lake-ui/form-switch-field'
import Tooltip from '@annatarhe/lake-ui/tooltip'
import { Info, Sparkles, Zap } from 'lucide-react'

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
    <div className='flex flex-col lg:flex-row lg:items-center justify-between w-full gap-6'>
      {/* Project Info Section */}
      <div className='flex-2 space-y-3'>
        <div className='flex items-center gap-3'>
          <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center border border-blue-500/30'>
            <Sparkles className='w-6 h-6 text-blue-400' />
          </div>
          <div>
            <h2 className='text-2xl font-bold text-white leading-tight'>
              {projectName || 'Untitled Project'}
            </h2>
            <p className='text-sm text-gray-400'>Project Configuration</p>
          </div>
        </div>
        <p className='text-sm text-gray-300 leading-relaxed max-w-lg'>
          Configure your project settings, AI provider connections, and model parameters for optimal performance.
        </p>
      </div>

      {/* Status Toggle Section */}
      <div className='flex-1 flex-shrink-0'>
        <div className='bg-white/[0.05] border border-white/10 rounded-xl p-4 hover:bg-white/[0.08] hover:border-white/15 transition-all duration-300'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex flex-1 items-center gap-3'>
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300',
                enabled
                  ? 'bg-green-500/20 border border-green-500/30'
                  : 'bg-gray-500/20 border border-gray-500/30',
              )}
              >
                <Zap className={cn(
                  'w-4 h-4 transition-colors',
                  enabled ? 'text-green-400' : 'text-gray-400',
                )}
                />
              </div>
              <div>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium text-white'>
                    Project Status
                  </span>
                  <Tooltip content='Toggle to enable or disable this project for API requests'>
                    <Info className='w-3 h-3 text-gray-400 hover:text-gray-300 transition-colors cursor-help' />
                  </Tooltip>
                </div>
                <span className={cn(
                  'text-xs font-medium',
                  enabled ? 'text-green-400' : 'text-gray-400',
                )}
                >
                  {enabled ? 'Active & Ready' : 'Inactive'}
                </span>
              </div>
            </div>

            <Switch
              value={enabled || false}
              onChange={onEnabledChange}
              label=''
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectHeader
