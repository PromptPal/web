import { Link } from '@tanstack/react-router'
import { History, Pencil, LibraryBig } from 'lucide-react'
import toast from 'react-hot-toast'

interface PromptHeaderProps {
  name?: string
  description?: string
  promptId?: number
  projectId: number
  onHistoryClick: () => void
}

export function PromptHeader({
  name,
  description,
  promptId,
  projectId,
  onHistoryClick,
}: PromptHeaderProps) {
  return (
    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6'>
      <div className='flex items-start flex-col space-y-2'>
        <h1 className='text-2xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-sky-600'>
          {name}
        </h1>
        <span className='text-gray-400 font-medium'>{description}</span>
      </div>
      <div className='flex flex-wrap gap-3 items-center'>
        <button
          className='px-5 py-2.5 flex items-center gap-2 rounded-lg font-medium text-sm cursor-pointer backdrop-blur-sm bg-gradient-to-r from-sky-500/90 to-blue-600/90 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/20 transition-all duration-200 transform hover:scale-105'
          onClick={onHistoryClick}
        >
          <History className='w-4 h-4' />
          Versions
        </button>
        <Link
          className='px-5 py-2.5 flex items-center gap-2 rounded-lg font-medium text-sm cursor-pointer backdrop-blur-sm bg-gradient-to-r from-blue-500/90 to-cyan-600/90 hover:from-blue-400 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/20 transition-all duration-200 transform hover:scale-105'
          to='/$pid/prompts/$id/edit'
          params={{
            pid: projectId.toString(),
            id: (promptId ?? -1).toString(),
          }}
        >
          <Pencil className='w-4 h-4' />
          Edit
        </Link>
        <a
          href='https://promptpal.github.io/docs/intro'
          target='_blank'
          className='px-5 py-2.5 flex items-center gap-2 rounded-lg font-medium text-sm cursor-pointer backdrop-blur-sm bg-gradient-to-r from-gray-700/90 to-gray-800/90 hover:from-gray-600/90 hover:to-gray-700/90 text-white shadow-lg shadow-gray-500/20 transition-all duration-200 transform hover:scale-105 border border-gray-700/50'
          onClick={() => {
            toast.success('Help coming soon...')
          }}
          rel='noreferrer'
        >
          <LibraryBig className='w-4 h-4' />
          Help
        </a>
      </div>
    </div>
  )
}
