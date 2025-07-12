import { CalendarDays, Eye, Power, Bug } from 'lucide-react'

interface PromptStatsProps {
  createdAt?: string
  publicLevel?: string
  enabled?: boolean
  debug?: boolean
  isPromptUpdating: boolean
  onDebugChange: (checked: boolean) => void
}

export function PromptStats({
  createdAt,
  publicLevel,
  enabled,
  debug,
  isPromptUpdating,
  onDebugChange,
}: PromptStatsProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mt-6'>
      <div className='p-4 rounded-lg bg-gray-800/30 backdrop-blur-xs'>
        <div className='text-gray-400 font-medium mb-2 flex items-center gap-2'>
          <CalendarDays className='w-4 h-4' />
          {' '}
          Create Time
        </div>
        <div className='font-bold text-white'>
          {createdAt
            ? new Intl.DateTimeFormat().format(new Date(createdAt))
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
          {publicLevel}
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
            checked={enabled}
            readOnly
          />
          <div className='w-11 h-6 bg-gray-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:rtl:after:-translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:start-[2px] after:bg-linear-to-r after:from-blue-500 after:to-sky-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-700'></div>
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
            checked={debug}
            onChange={e => onDebugChange(e.target.checked)}
            disabled={isPromptUpdating}
          />
          <div className='w-11 h-6 bg-gray-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:rtl:after:-translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:start-[2px] after:bg-linear-to-r after:from-blue-500 after:to-sky-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-700'></div>
        </label>
      </div>
    </div>
  )
}
