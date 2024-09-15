import { Badge } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { Prompt } from '../../gql/graphql'
import { useProjectId } from '../../hooks/route'

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
      to={`/${pj}/prompts/${prompt.id}`}
      className='w-full py-4 rounded-lg flex justify-center items-center flex-col with-fade-in'
      data-glow
    >
      <h3 className='text-2xl text-center font-bold text-black dark:text-white'>
        #{prompt.id} {prompt.name}
      </h3>
      <div className='gap-4 flex my-6 flex-wrap justify-center'>
        <Badge color={prompt.tokenCount < 300 ? 'green' : 'red'}>
          Token Count: {prompt.tokenCount}
        </Badge>
        <Badge color={prompt.enabled ? 'green' : 'red'}>
          {prompt.enabled ? 'Enabled' : 'Disabled'}
        </Badge>
        <Badge color='purple'>{prompt.publicLevel}</Badge>
      </div>
      <p className='text-sm text-slate-700 dark:text-slate-200'>
        {dayjs(prompt.createdAt).format('YYYY-MM-DD HH:mm')}
      </p>
    </Link>
  )
}

export default PromptCardItem
