import { useQuery as useGraphQLQuery, useMutation } from '@apollo/client'
import { Divider, Title as Heading, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Link, useParams } from '@tanstack/react-router'
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import ButtonGlow from '../../components/Button/ButtonGlow'
import LinkGlow from '../../components/Button/LinkGlow'
import PromptCallMetric from '../../components/Calls/Metrics'
import PromptCalls from '../../components/Calls/PromptCalls'
import { PromptDetailCard } from '../../components/Prompt/PromptDetailCard'
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
      <PromptDetailCard
        promptDetail={promptDetail}
        pjId={pjId}
        isPromptUpdating={isPromptUpdating}
        onDebugChange={onDebugChange}
        historyHandlers={historyHandlers}
      />

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
