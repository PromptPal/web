import { PromptRow, PromptVariable, Provider } from '@/gql/graphql'
import { Link } from '@tanstack/react-router'
import {
  Bug,
  CalendarDays,
  Eye,
  Hash,
  History,
  Key,
  LibraryBig,
  Pencil,
  Power,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { ProviderCard } from '../Providers/ProviderCard'
import PromptReadonly from './PromptReadonly'

interface PromptDetailCardProps {
  promptDetail?: {
    id: number
    name: string
    description: string
    hashId: string
    createdAt: string
    publicLevel: string
    enabled: boolean
    debug: boolean
    provider?: Omit<Provider, 'projects' | 'creator' | 'prompts'> | null
    prompts: PromptRow[]
    variables: PromptVariable[]
  } | null
  pjId: number
  isPromptUpdating: boolean
  onDebugChange: (checked: boolean) => void
  historyHandlers: {
    open: () => void
  }
}

export function PromptDetailCard({
  promptDetail,
  pjId,
  isPromptUpdating,
  onDebugChange,
  historyHandlers,
}: PromptDetailCardProps) {
  return (
    <section className='w-full backdrop-blur-xs bg-linear-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 shadow-xl rounded-xl'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6'>
        <div className='flex items-start flex-col space-y-2'>
          <h1 className='text-2xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-600'>
            {promptDetail?.name}
          </h1>
          <span className='text-gray-400 font-medium'>
            {promptDetail?.description}
          </span>
        </div>
        <div className='flex flex-wrap gap-3 items-center'>
          <button
            className='px-5 py-2.5 flex items-center gap-2 rounded-lg font-medium text-sm cursor-pointer backdrop-blur-sm bg-gradient-to-r from-purple-500/90 to-indigo-600/90 hover:from-purple-400 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20 transition-all duration-200 transform hover:scale-105'
            onClick={() => {
              historyHandlers.open()
            }}
          >
            <History className='w-4 h-4' />
            Versions
          </button>
          <Link
            className='px-5 py-2.5 flex items-center gap-2 rounded-lg font-medium text-sm cursor-pointer backdrop-blur-sm bg-gradient-to-r from-blue-500/90 to-cyan-600/90 hover:from-blue-400 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/20 transition-all duration-200 transform hover:scale-105'
            to='/$pid/prompts/$id/edit'
            params={{
              pid: pjId.toString(),
              id: (promptDetail?.id ?? -1).toString(),
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
      <div className='px-6 pt-4 pb-6 border-t border-gray-700/50 bg-gray-900/30'>
        <div className='flex items-center justify-around p-4 rounded-lg bg-gray-800/50 backdrop-blur-md'>
          <div className='text-center font-medium'>
            <span className='text-gray-400 inline-flex items-center gap-1.5'>
              <Key className='w-4 h-4' />
              {' '}
              ID:
            </span>
            <span className='ml-2 text-blue-400'>{promptDetail?.id}</span>
          </div>
          <div className='text-center font-medium'>
            <span className='text-gray-400 inline-flex items-center gap-1.5'>
              <Hash className='w-4 h-4' />
              {' '}
              Hash ID:
            </span>
            <span className='ml-2 text-blue-400'>{promptDetail?.hashId}</span>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mt-6'>
          <div className='p-4 rounded-lg bg-gray-800/30 backdrop-blur-xs'>
            <div className='text-gray-400 font-medium mb-2 flex items-center gap-2'>
              <CalendarDays className='w-4 h-4' />
              {' '}
              Create Time
            </div>
            <div className='font-bold text-white'>
              {promptDetail
                ? new Intl.DateTimeFormat().format(
                    new Date(promptDetail?.createdAt),
                  )
                : 'N/A'}
            </div>
          </div>

          <div className='p-4 rounded-lg bg-gray-800/30 backdrop-blur-xs'>
            <div className='text-gray-400 font-medium mb-2 flex items-center gap-2'>
              <Eye className='w-4 h-4' />
              {' '}
              Visibility
            </div>
            <span className='px-2 py-1 text-sm rounded-full bg-linear-to-r from-green-500 to-emerald-600 text-white'>
              {promptDetail?.publicLevel}
            </span>
          </div>

          <div className='p-4 rounded-lg bg-gray-800/30 backdrop-blur-xs'>
            <div className='text-gray-400 font-medium mb-2 flex items-center gap-2'>
              <Power className='w-4 h-4' />
              {' '}
              Enabled
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                className='sr-only peer'
                checked={promptDetail?.enabled}
                readOnly
              />
              <div className='w-11 h-6 bg-gray-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:rtl:after:-translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:start-[2px] after:bg-linear-to-r after:from-blue-500 after:to-purple-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-700'></div>
            </label>
          </div>

          <div className='p-4 rounded-lg bg-gray-800/30 backdrop-blur-xs'>
            <div className='text-gray-400 font-medium mb-2 flex items-center gap-2'>
              <Bug className='w-4 h-4' />
              {' '}
              Debug
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                className='sr-only peer'
                checked={promptDetail?.debug}
                onChange={e => onDebugChange(e.target.checked)}
                disabled={isPromptUpdating}
              />
              <div className='w-11 h-6 bg-gray-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:rtl:after:-translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:start-[2px] after:bg-linear-to-r after:from-blue-500 after:to-purple-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-700'></div>
            </label>
          </div>
        </div>

        <ProviderCard provider={promptDetail?.provider} />

        <div className='mt-6 flex flex-col gap-4'>
          {promptDetail?.prompts.map((prompt, idx) => (
            <PromptReadonly
              key={idx}
              index={idx}
              prompt={prompt}
              promptVariables={promptDetail.variables}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
