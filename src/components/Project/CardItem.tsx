import { Link } from '@tanstack/react-router'
import { Calendar, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'
import { Project } from '../../gql/graphql'
import { cn } from '../../utils'
type ProjectCardItemProps = {
  project: Pick<Project, 'id' | 'name' | 'createdAt' | 'enabled'>
}

function ProjectCardItem(props: ProjectCardItemProps) {
  const { project } = props

  const createdAt = useMemo(() => {
    return new Intl.DateTimeFormat().format(new Date(project.createdAt))
  }, [project.createdAt])

  return (
    <Link
      to='/$pid'
      params={{ pid: project.id.toString() }}
      className='group w-full p-6 rounded-xl backdrop-blur-xs bg-linear-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 shadow-xl hover:shadow-2xl hover:from-gray-800/80 hover:to-gray-700/80 transition-all duration-300'
    >
      <div className='flex items-start justify-between'>
        <div className='space-y-2'>
          <div className='flex items-center gap-3'>
            <h3 className='text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500'>
              {project.name}
            </h3>
            <span className='text-xs text-gray-500 px-2 py-1 rounded-full bg-gray-800/50 border border-gray-700/50'>
              #
              {project.id}
            </span>
          </div>
          <div className='flex items-center gap-2 text-sm text-gray-400'>
            <Calendar className='w-4 h-4' />
            <span>{createdAt}</span>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              project.enabled
                ? 'bg-green-500 shadow-lg shadow-green-500/30'
                : 'bg-gray-500 shadow-lg shadow-gray-500/30',
            )}
            title={project.enabled ? 'Active' : 'Inactive'}
          />
          <ChevronRight className='w-5 h-5 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300' />
        </div>
      </div>
    </Link>
  )
}

export default ProjectCardItem
