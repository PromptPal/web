import { Badge } from '@mantine/core'
import { Prompt } from '../../gql/graphql'
import { Link } from 'react-router-dom'
import { useProjectId } from '../../hooks/route'

type PromptCardItemProps = {
  prompt: Pick<Prompt, 'id' | 'name' | 'createdAt' | 'enabled' | 'tokenCount' | 'publicLevel'>
}

function PromptCardItem(props: PromptCardItemProps) {
  const { prompt } = props
  const pj = useProjectId()
  return (
    <Link
      to={`/prompts/${prompt.id}?pjId=${pj}`}
      className='w-full py-4 rounded-lg flex justify-center items-center flex-col'
      data-glow
    >
      <h3 className='text-2xl font-bold text-black dark:text-white'>#{prompt.id} {prompt.name}</h3>
      <div className='gap-4 flex my-6 flex-wrap justify-center'>
        <Badge color={prompt.tokenCount < 300 ? 'green' : 'red'}>Token Count: {prompt.tokenCount}</Badge>
        <Badge color={prompt.enabled ? 'green' : 'red'}>{prompt.enabled ? 'Enabled' : 'Disabled'}</Badge>
        <Badge color='purple'>{prompt.publicLevel}</Badge>
      </div>
      <p className='text-sm text-slate-700 dark:text-slate-200'>{prompt.createdAt}</p>
    </Link>
  )
}

export default PromptCardItem