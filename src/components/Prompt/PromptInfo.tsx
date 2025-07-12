import { Key, Hash } from 'lucide-react'
import { CopyButton } from './CopyButton'

interface PromptInfoProps {
  id?: number
  hashId?: string
}

export function PromptInfo({ id, hashId }: PromptInfoProps) {
  return (
    <div className='flex items-center justify-around p-4 rounded-lg bg-gray-800/50 backdrop-blur-md'>
      <div className='text-center font-medium'>
        <span className='text-gray-400 inline-flex items-center gap-1.5'>
          <Key className='w-4 h-4' />
          {' '}
          ID:
        </span>
        <span className='ml-2 text-blue-400'>{id}</span>
      </div>
      <div className='text-center font-medium'>
        <span className='text-gray-400 inline-flex items-center gap-1.5'>
          <Hash className='w-4 h-4' />
          {' '}
          Hash ID:
        </span>
        <span className='ml-2 text-blue-400'>{hashId}</span>
        {hashId && <CopyButton text={hashId} label='Hash ID copied!' className='ml-2' />}
      </div>
    </div>
  )
}
