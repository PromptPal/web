import { PromptRow, PromptVariable, Provider } from '@/gql/graphql'
import { ProviderCard } from '../Providers/ProviderCard'
import PromptReadonly from './PromptReadonly'
import { PromptHeader } from './PromptHeader'
import { PromptInfo } from './PromptInfo'
import { PromptStats } from './PromptStats'

interface PromptDetailCardProps {
  promptDetail?: {
    id: number
    name: string
    description: string
    hashId: string
    createdAt: string
    publicLevel: string
    enabled: boolean
    debug: boolean
    provider?: Omit<Provider, 'projects' | 'creator' | 'prompts'> | null
    prompts: PromptRow[]
    variables: PromptVariable[]
  } | null
  pjId: number
  isPromptUpdating: boolean
  onDebugChange: (checked: boolean) => void
  historyHandlers: {
    open: () => void
  }
  loading?: boolean
}

export function PromptDetailCard({
  promptDetail,
  pjId,
  isPromptUpdating,
  onDebugChange,
  historyHandlers,
  loading,
}: PromptDetailCardProps) {
  return (
    <section className='w-full backdrop-blur-xs bg-linear-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 shadow-xl rounded-xl'>
      <PromptHeader
        name={promptDetail?.name}
        description={promptDetail?.description}
        promptId={promptDetail?.id}
        projectId={pjId}
        onHistoryClick={historyHandlers.open}
      />
      <div className='px-6 pt-4 pb-6 border-t border-gray-700/50 bg-gray-900/30'>
        <PromptInfo id={promptDetail?.id} hashId={promptDetail?.hashId} />

        <PromptStats
          createdAt={promptDetail?.createdAt}
          publicLevel={promptDetail?.publicLevel}
          enabled={promptDetail?.enabled}
          debug={promptDetail?.debug}
          isPromptUpdating={isPromptUpdating}
          onDebugChange={onDebugChange}
        />

        <ProviderCard provider={promptDetail?.provider} loading={loading} />

        <div className='mt-6 flex flex-col gap-4'>
          {promptDetail?.prompts.map((prompt, idx) => (
            <PromptReadonly
              key={idx}
              index={idx}
              prompt={prompt}
              promptVariables={promptDetail.variables}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
