import { Link } from '@tanstack/react-router'
import { Calendar, ChevronRight, Activity, Hash } from 'lucide-react'
import { useMemo } from 'react'
import { Project } from '../../gql/graphql'
import { cn } from '../../utils'
type ProjectCardItemProps = {
  project: Pick<Project, 'id' | 'name' | 'createdAt' | 'enabled'>
}

function ProjectCardItem(props: ProjectCardItemProps) {
  const { project } = props

  const createdAt = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(project.createdAt))
  }, [project.createdAt])

  return (
    <Link
      to='/$pid'
      params={{ pid: project.id.toString() }}
      className='group relative block w-full h-full'
    >
      {/* Hover Glow Effect */}
      <div className='absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

      <div className='relative h-full p-6 rounded-2xl backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 shadow-lg hover:shadow-2xl hover:border-purple-500/30 transition-all duration-300'>
        <div className='flex flex-col h-full'>
          {/* Header */}
          <div className='flex items-start justify-between mb-4'>
            <div className='flex-1'>
              <h3 className='text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-indigo-300 transition-all duration-300'>
                {project.name}
              </h3>
            </div>
            <ChevronRight className='w-5 h-5 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300 mt-1' />
          </div>

          {/* Content */}
          <div className='flex-1 space-y-3'>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700/50'>
                <Hash className='w-3 h-3 text-gray-500' />
                <span className='text-gray-400'>{project.id}</span>
              </div>

              <div
                className={cn(
                  'flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border',
                  project.enabled
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-gray-500/10 border-gray-500/30 text-gray-500',
                )}
              >
                <Activity className='w-3 h-3' />
                <span>{project.enabled ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='flex items-center gap-2 text-sm text-gray-500 mt-4 pt-4 border-t border-gray-800/50'>
            <Calendar className='w-4 h-4' />
            <span>
              Created
              {' '}
              {createdAt}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProjectCardItem
