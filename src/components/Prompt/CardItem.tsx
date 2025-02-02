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
      className='group w-full p-6 rounded-xl flex flex-col gap-4 bg-gradient-to-br from-background/50 to-background border border-border backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20'
    >
      <div className='flex items-center gap-3'>
        <div className='p-2 rounded-lg bg-primary/10 text-primary'>
          <Sparkles className='w-5 h-5' />
        </div>
        <h3 className='text-xl font-bold tracking-tight group-hover:text-primary transition-colors'>
          {prompt.name}
        </h3>
      </div>

      <div className='flex flex-wrap gap-3 text-sm'>
        <div
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium',
            prompt.tokenCount < 300
              ? 'bg-green-500/10 text-green-500'
              : 'bg-red-500/10 text-red-500',
          )}
        >
          <Hash className='w-3.5 h-3.5' />
          {prompt.tokenCount} tokens
        </div>

        <div
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium',
            prompt.enabled
              ? 'bg-green-500/10 text-green-500'
              : 'bg-red-500/10 text-red-500',
          )}
        >
          <ToggleLeft className='w-3.5 h-3.5' />
          {prompt.enabled ? 'Enabled' : 'Disabled'}
        </div>

        <div className='flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-primary/10 text-primary'>
          <Globe2 className='w-3.5 h-3.5' />
          {prompt.publicLevel}
        </div>
      </div>

      <div className='flex items-center gap-2 text-sm text-muted-foreground mt-auto'>
        <Clock className='w-4 h-4' />
        <time dateTime={prompt.createdAt}>
          {dayjs(prompt.createdAt).format('YYYY-MM-DD HH:mm')}
        </time>
      </div>
    </Link>
  )
}

export default PromptCardItem
