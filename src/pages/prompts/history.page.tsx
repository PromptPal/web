import { Accordion, Divider, Pill } from '@mantine/core'
import { graphql } from '../../gql'
import { useQuery } from '@apollo/client'
import PromptReadonly from '../../components/Prompt/PromptReadonly'
import UserAvatar from '../../components/User/UserAvatar'
import dayjs from 'dayjs'

type PromptHistoriesPageProps = {
  promptId: number
}

const q = graphql(`
  query fetchPromptHistories($id: Int!) {
    prompt(id: $id) {
      id
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

  const { data } = useQuery(q, {
    variables: {
      id: promptId
    }
  })

  if (!data) {
    return (
      <div>
        Loading...
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
                    {x.prompts.map((p, idx) => (
                      <PromptReadonly
                        key={idx}
                        index={idx}
                        prompt={p}
                        promptVariables={x.variables}
                      />
                    ))}
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