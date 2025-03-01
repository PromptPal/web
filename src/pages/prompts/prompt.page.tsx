import { useQuery as useGraphQLQuery, useMutation } from '@apollo/client'
import { Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useParams } from '@tanstack/react-router'
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import PromptCallMetric from '../../components/Calls/Metrics'
import PromptCalls from '../../components/Calls/PromptCalls'
import { PromptDetailCard } from '../../components/Prompt/PromptDetailCard'
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
  const params: { id: string } = useParams({ strict: false })
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
    (checked: boolean) => {
      if (!promptDetail) {
        return
      }
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
              debug: checked,
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
    <div className='flex justify-center items-center flex-col gap-4'>
      <PromptDetailCard
        promptDetail={promptDetail}
        pjId={pjId}
        isPromptUpdating={isPromptUpdating}
        onDebugChange={onDebugChange}
        historyHandlers={historyHandlers}
      />

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
