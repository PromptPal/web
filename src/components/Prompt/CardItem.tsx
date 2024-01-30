import { Badge } from '@mantine/core'
import { Prompt } from '../../gql/graphql'
import { Link } from 'react-router-dom'

type PromptCardItemProps = {
  prompt: Pick<Prompt, 'id' | 'name' | 'createdAt' | 'enabled' | 'tokenCount' | 'publicLevel'>
}

function PromptCardItem(props: PromptCardItemProps) {
  const { prompt } = props
  return (
    <Link
      to={`/prompts/${prompt.id}`}
      className='w-full py-4 rounded bg-gradient-to-br from-sky-400 to-green-400 via-purple-400 flex justify-center items-center flex-col hover:scale-105 focus:scale-95 cursor-pointer duration-75'
    >
      <h3 className='text-2xl font-bold text-black'>#{prompt.id} {prompt.name}</h3>
      <div className='gap-4 flex my-6'>
        <Badge color={prompt.tokenCount < 300 ? 'green' : 'red'}>Token Count: {prompt.tokenCount}</Badge>
        <Badge color={prompt.enabled ? 'green' : 'red'}>{prompt.enabled ? 'Enabled' : 'Disabled'}</Badge>
        <Badge color='purple'>{prompt.publicLevel}</Badge>
      </div>
      <p className='text-sm text-slate-700'>{prompt.createdAt}</p>
    </Link>
  )
}

export default PromptCardItem