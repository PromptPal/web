export type PromptRow = {
  prompt: string
  role: 'user' | 'system' | 'assistant'
}

export type PromptVariable = {
  name: string
  type: string
}

export type ListResponse<T> = {
  count: number;
  data: T[];
}

