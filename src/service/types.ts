import { PromptRole } from '../gql/graphql'

export type PromptRow = {
  prompt: string
  role: PromptRole
}

export type PromptVariable = {
  name: string
  type: string
}

export type ListResponse<T> = {
  count: number;
  data: T[];
}

