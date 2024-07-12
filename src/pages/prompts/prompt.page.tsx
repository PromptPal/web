import { useQuery as useGraphQLQuery, useMutation } from '@apollo/client'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Title as Heading,
  Modal,
  Switch,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { Link, useParams } from 'react-router-dom'
import PromptCallMetric from '../../components/Calls/Metrics'
import PromptCalls from '../../components/Calls/PromptCalls'
import PromptReadonly from '../../components/Prompt/PromptReadonly'
import { graphql } from '../../gql'
import { useProjectId } from '../../hooks/route'
import PromptHistoriesPage from './history.page'

const pm = graphql(`
  mutation togglePrompt($id: Int!, $payload: PromptPayload!) {
    updatePrompt(id: $id, data: $payload) {
      id
      name
      description
      enabled
      debug
    }
  }
`)

const q = graphql(`
  query fetchPromptDetail($id: Int!) {
    prompt(id: $id) {
      id
      hashId
      name
      description
      enabled
      debug
      tokenCount
      publicLevel
      createdAt
      updatedAt
      project {
        id
        name
      }
      creator {
        id
        name
      }
      prompts {
        prompt
        role
      }
      variables {
        name
        type
      }
    }
  }
`)

function PromptPage() {
  const params = useParams<{ id: string }>()
  const pid = ~~(params.id ?? '0')
  const { data } = useGraphQLQuery(q, {
    variables: {
      id: pid,
    },
    pollInterval: 20_000,
  })

  const promptDetail = data?.prompt

  const [doPromptUpdate, { loading: isPromptUpdating }] = useMutation(pm)

  const onDebugChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!promptDetail) {
        return
      }
      const n = event.target.checked
      toast.promise(
        doPromptUpdate({
          variables: {
            id: promptDetail?.id ?? 0,
            payload: {
              name: promptDetail.name,
              description: promptDetail.description,
              tokenCount: promptDetail.tokenCount,
              publicLevel: promptDetail.publicLevel,
              enabled: promptDetail.enabled,
              projectId: promptDetail.project.id,
              prompts: promptDetail.prompts,
              variables: promptDetail.variables,
              debug: n,
            },
          },
        }),
        {
          loading: 'Updating prompt',
          success: 'Updated prompt',
          error: 'Failed to update prompt',
        },
      )
    },
    [doPromptUpdate, promptDetail],
  )

  const pjId = useProjectId()

  const [historyOpened, historyHandlers] = useDisclosure()

  return (
    <div>
      <Card>
        <div className='flex justify-between items-center'>
          <div className='flex items-start flex-col '>
            <Heading>{promptDetail?.name}</Heading>
            <span className='text-gray-400'>{promptDetail?.description}</span>
          </div>
          <div className='flex gap-4 items-center'>
            <Button
              variant='filled'
              color='teal'
              onClick={() => {
                historyHandlers.open()
              }}
            >
              Versions
            </Button>
            <Button
              variant='filled'
              color='teal'
              component={Link}
              to={`/${pjId}/prompts/${promptDetail?.id}/edit`}
            >
              Edit
            </Button>
            <Button
              component='a'
              target='_blank'
              href='https://promptpal.github.io/docs/intro'
              leftSection={<InformationCircleIcon />}
              onClick={() => {
                toast.success('Help coming soon...')
              }}
            >
              Help
            </Button>
          </div>
        </div>
        <Card.Section className='px-4 mt-4'>
          <div className='flex items-center justify-around'>
            <Box className='text-center'>id: {promptDetail?.id}</Box>
            <Box className='text-center'>Hash ID: {promptDetail?.hashId}</Box>
          </div>
          <Divider my={4} />
          <div className='flex'>
            <div className='flex-1 text-center'>
              Create Time:
              <div>
                {promptDetail
                  ? new Intl.DateTimeFormat().format(
                      new Date(promptDetail?.createdAt),
                    )
                  : 'N/A'}
              </div>
            </div>
            <div className='flex-1 text-center'>
              Visibility:
              <div>
                <Badge>{promptDetail?.publicLevel}</Badge>
              </div>
            </div>
            <div className='flex-1 text-center'>
              Enabled:
              <Switch
                readOnly
                checked={promptDetail?.enabled}
                className='text-center justify-center flex'
                classNames={{
                  body: 'w-fit',
                }}
              />
            </div>
            <div className='flex-1 text-center justify-center'>
              <span>Debug:</span>
              <Switch
                className='text-center justify-center flex'
                classNames={{
                  body: 'w-fit',
                }}
                readOnly={isPromptUpdating}
                checked={promptDetail?.debug}
                onChange={onDebugChange}
              />
            </div>
          </div>

          <div className='my-4 flex flex-col gap-4'>
            {promptDetail?.prompts.map((prompt, idx) => (
              <PromptReadonly
                key={idx}
                index={idx}
                prompt={prompt}
                promptVariables={promptDetail.variables}
              />
            ))}
          </div>
        </Card.Section>
      </Card>

      <Divider my={8} />

      <PromptCallMetric promptId={pid} />

      <PromptCalls promptId={pid} />

      <Modal
        opened={historyOpened}
        centered
        size='xl'
        title='Versions'
        withCloseButton
        onClose={historyHandlers.close}
      >
        <PromptHistoriesPage promptId={pid} />
      </Modal>
    </div>
  )
}

export default PromptPage
