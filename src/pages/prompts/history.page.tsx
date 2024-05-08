import { Accordion, Divider, Pill } from '@mantine/core'
import dayjs from 'dayjs'
import { graphql } from '../../gql'
import { useQuery } from '@apollo/client'
import UserAvatar from '../../components/User/UserAvatar'
import PromptDiffView from '../../components/Prompt/PromptDiffView'

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
      id: promptId
    }
  })

  if (loading && !data) {
    return (
      <div className='grid gap-4'>
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className='w-full h-10 bg-slate-700 animate-pulse rounded'
          />
        ))}
      </div>
    )
  }

  if (data?.prompt.histories.count === 0) {
    return (
      <div className='flex items-center justify-center py-10'>
        No History
      </div>
    )
  }

  return (
    <div>
      <Accordion>
        {data.prompt.histories.edges.map((x, idx) => {
          return (
            <Accordion.Item
              key={idx}
              value={`History ${idx + 1}`}
            >
              <Accordion.Control>
                {dayjs(x.createdAt).fromNow()}
              </Accordion.Control>
              <Accordion.Panel>
                <div>
                  <div className='flex justify-between'>
                    <UserAvatar
                      addr={x.modifiedBy?.addr}
                      name={x.modifiedBy?.name ?? ''}
                    />
                    <Pill>
                      {x.createdAt}
                    </Pill>
                  </div>
                  <Divider className='my-4' />
                  <div className='grid gap-4'>
                    <PromptDiffView
                      originalPrompt={x.prompts}
                      latestPrompt={data.prompt.prompts}
                    />
                  </div>
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          )
        })
        }
      </Accordion>
    </div>
  )
}

export default PromptHistoriesPage