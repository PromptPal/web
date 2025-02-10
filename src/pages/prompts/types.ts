import { PromptPayload } from '@/gql/graphql'

export type mutatePromptType = Omit<
  PromptPayload,
  'projectId' | 'description' | 'tokenCount'
> & {
  projectId?: number
  description?: string
  tokenCount?: number
}
