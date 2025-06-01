import { useQuery } from '@apollo/client'
import dayjs from 'dayjs'
import { ArchiveXIcon, ChevronDownIcon } from 'lucide-react'
import PromptDiffView from '../../components/Prompt/PromptDiffView'
import UserAvatar from '../../components/User/UserAvatar'
import { graphql } from '../../gql'

type PromptHistoriesPageProps = {
  promptId: number
}

const q = graphql(`
  query fetchPromptHistories($id: Int!) {
    prompt(id: $id) {
      id
      prompts {
        prompt
        role
      }
      histories {
        count
        edges {
          id
          prompts {
            role
            prompt
          }
          variables {
            name
            type
          }
          createdAt
          updatedAt
          modifiedBy {
            id
            addr
            name
          }
          latestCalls {
            count
            edges {
              duration
              totalToken
              payload
              message
              createdAt
            }
          }
        }
      }
    } 
  }
`)

function PromptHistoriesPage(props: PromptHistoriesPageProps) {
  const { promptId } = props

  const { data, loading } = useQuery(q, {
    variables: {
      id: promptId,
    },
  })

  if (loading && !data) {
    return (
      <div className='space-y-4 py-4'>
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className='w-full h-20 bg-white/30 dark:bg-black/30 backdrop-blur-md animate-pulse rounded-xl shadow-md'
          />
        ))}
      </div>
    )
  }

  if (data?.prompt.histories.count === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center'>
        <ArchiveXIcon className='w-16 h-16 mb-4 text-purple-400 dark:text-purple-500 opacity-70' />
        <p className='text-xl font-semibold text-gray-700 dark:text-gray-300'>No History Found</p>
        <p className='text-sm text-gray-500 dark:text-gray-400'>There are no recorded changes for this prompt yet.</p>
      </div>
    )
  }

  return (
    <div className='space-y-4 py-4'>
      {data!.prompt.histories.edges.map((x, idx) => {
        return (
          <details
            key={idx}
            className='bg-white/60 dark:bg-black/50 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden group transition-all duration-300 ease-in-out open:shadow-2xl open:ring-1 open:ring-purple-300 dark:open:ring-purple-700'
          >
            <summary className='p-5 cursor-pointer flex justify-between items-center font-semibold text-lg text-purple-700 dark:text-purple-400 hover:bg-purple-100/70 dark:hover:bg-purple-900/40 transition-colors duration-150 list-none'>
              <span>{dayjs(x.createdAt).fromNow()}</span>
              <ChevronDownIcon className='w-6 h-6 text-purple-500 dark:text-purple-300 transition-transform duration-300 group-open:rotate-180' />
            </summary>
            <div className='p-6 border-t border-purple-200/80 dark:border-purple-800/60 bg-white/30 dark:bg-black/20'>
              <div className='flex justify-between items-center mb-4'>
                <UserAvatar
                  addr={x.modifiedBy?.addr}
                  name={x.modifiedBy?.name ?? ''}
                />
                <span className='px-3 py-1.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 shadow-sm'>
                  {dayjs(x.createdAt).format('MMM D, YYYY h:mm A')}
                </span>
              </div>
              <hr className='my-4 border-t-2 border-purple-200/60 dark:border-purple-700/50 rounded-full' />
              <div className='grid gap-4'>
                <PromptDiffView
                  originalPrompt={x.prompts}
                  latestPrompt={data!.prompt.prompts}
                />
              </div>
            </div>
          </details>
        )
      })}
    </div>
  )
}

export default PromptHistoriesPage
