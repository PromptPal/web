import { Link } from '@tanstack/react-router'
import { FolderKanban, PlusCircle } from 'lucide-react'
import { cn } from '@/utils'

/**
 * Empty state component for projects page
 * Displayed when no projects are found
 */
export function ProjectEmptyState() {
  return (
    <div
      className={cn(
        'col-span-full flex flex-col items-center justify-center p-12 rounded-xl',
        'backdrop-blur-xs bg-linear-to-br from-gray-900/80 to-gray-800/80',
        // 'border border-gray-700/50', // Removed border as per UI guidelines
        'shadow-xl min-h-[300px]', // Added shadow and min-height for better presence
      )}
    >
      <FolderKanban className='h-16 w-16 mb-6 text-sky-400' />
      <div className='space-y-2 text-center mb-6'>
        <h2 className='text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-sky-400 to-blue-500'>
          No Projects Yet
        </h2>
        <p className='text-lg text-gray-400'>
          Create your first project to get started!
        </p>
      </div>
      <Link
        to='/projects/new'
        className={cn(
          'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-base',
          'bg-orange-600 hover:bg-orange-700 text-white',
          'transition-colors duration-200',
          'shadow-lg shadow-orange-600/30 hover:shadow-orange-700/40',
        )}
      >
        <PlusCircle className='w-5 h-5' />
        Create New Project
      </Link>
    </div>
  )
}
