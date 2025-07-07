import { PromptPayload } from '@/gql/graphql'

export type mutatePromptType = Omit<
  PromptPayload,
  'projectId' | 'description' | 'tokenCount' | 'providerId' | '__typename'
> & {
  projectId?: number
  description?: string
  tokenCount?: number
  providerId?: number | null
}
