import { Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { Clock, Globe2, Hash, Sparkles, ToggleLeft } from 'lucide-react'
import { Prompt } from '../../gql/graphql'
import { useProjectId } from '../../hooks/route'
import { cn } from '../../utils'

type PromptCardItemProps = {
  prompt: Pick<
    Prompt,
    'id' | 'name' | 'createdAt' | 'enabled' | 'tokenCount' | 'publicLevel'
  >
}

function PromptCardItem(props: PromptCardItemProps) {
  const { prompt } = props
  const pj = useProjectId()
  return (
    <Link
      to='/$pid/prompts/$id'
      params={{ pid: pj.toString(), id: prompt.id.toString() }}
      className='group w-full p-6 rounded-xl flex flex-col gap-4 bg-linear-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:from-gray-900/70 hover:via-gray-800/50 hover:to-gray-900/70'
    >
      <div className='flex items-center gap-3'>
        <div className='p-2.5 rounded-lg bg-linear-to-br from-blue-500/20 via-purple-500/10 to-blue-500/5 backdrop-blur-xl text-blue-400'>
          <Sparkles className='w-5 h-5' />
        </div>
        <h3 className='text-xl font-bold tracking-tight bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-400 transition-all duration-300'>
          {prompt.name}
        </h3>
      </div>

      <div className='flex flex-wrap gap-3 text-sm'>
        <div
          className={cn(
            'flex items-center gap-1.5 px-3 py-1 rounded-full font-medium backdrop-blur-xl',
            prompt.tokenCount < 300
              ? 'bg-linear-to-r from-green-500/20 to-green-500/10 text-green-400'
              : 'bg-linear-to-r from-red-500/20 to-red-500/10 text-red-400',
          )}
        >
          <Hash className='w-3.5 h-3.5' />
          {prompt.tokenCount} tokens
        </div>

        <div
          className={cn(
            'flex items-center gap-1.5 px-3 py-1 rounded-full font-medium backdrop-blur-xl',
            prompt.enabled
              ? 'bg-linear-to-r from-green-500/20 to-green-500/10 text-green-400'
              : 'bg-linear-to-r from-red-500/20 to-red-500/10 text-red-400',
          )}
        >
          <ToggleLeft className='w-3.5 h-3.5' />
          {prompt.enabled ? 'Enabled' : 'Disabled'}
        </div>

        <div className='flex items-center gap-1.5 px-3 py-1 rounded-full font-medium bg-linear-to-r from-blue-500/20 to-purple-500/10 text-blue-400 backdrop-blur-xl'>
          <Globe2 className='w-3.5 h-3.5' />
          {prompt.publicLevel}
        </div>
      </div>

      <div className='flex items-center gap-2 text-sm text-gray-500 mt-auto'>
        <Clock className='w-4 h-4' />
        <time dateTime={prompt.createdAt}>
          {dayjs(prompt.createdAt).format('YYYY-MM-DD HH:mm')}
        </time>
      </div>
    </Link>
  )
}

export default PromptCardItem
