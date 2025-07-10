import PromptCallMetric from '@/components/Calls/Metrics'
import PromptCalls from '@/components/Calls/PromptCalls'
import { PromptDetailCard } from '@/components/Prompt/PromptDetailCard'
import { graphql } from '@/gql'
import { useProjectId } from '@/hooks/route'
import Modal from '@annatarhe/lake-ui/modal'
import { useQuery as useGraphQLQuery, useMutation } from '@apollo/client'
import { useParams } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import PromptHistoriesPage from './history.page'
import { q } from './query'

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

function PromptPage() {
  const params: { id: string } = useParams({ strict: false })
  const pid = ~~(params.id ?? '0')
  const { data, loading } = useGraphQLQuery(q, {
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
              providerId: promptDetail.provider?.id ?? -1,
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

  // const [historyOpened, historyHandlers] = useDisclosure()
  const [historyOpened, setHistoryOpened] = useState(false)

  const historyHandlers = {
    open: () => setHistoryOpened(true),
    close: () => setHistoryOpened(false),
  }

  return (
    <div className='flex justify-center items-center flex-col gap-4'>
      <PromptDetailCard
        promptDetail={promptDetail}
        pjId={pjId}
        isPromptUpdating={isPromptUpdating}
        onDebugChange={onDebugChange}
        historyHandlers={historyHandlers}
        loading={loading}
      />

      <PromptCallMetric promptId={pid} />

      <PromptCalls promptId={pid} />

      <Modal
        isOpen={historyOpened}
        title='Versions'
        onClose={historyHandlers.close}
      >
        <PromptHistoriesPage promptId={pid} />
      </Modal>
    </div>
  )
}

export default PromptPage
