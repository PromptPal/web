import { API_PREFIX } from "../constants"
import { HttpRequest } from "./http"
import { ListResponse, PromptRow, PromptVariable } from "./types"

export function getPromptList(projectId: number, cursor: number, signal?: AbortSignal) {
  return HttpRequest<ListResponse<any>>(`${API_PREFIX}/admin/projects/${projectId}/prompts?cursor=${cursor}`, {
    signal,
  });
}

export type createPromptPayload = {
  projectId: number
  name: string
  description: string
  tokenCount: number
  prompts: PromptRow[]
  variables: PromptVariable[]
  publicLevel: 'public' | 'protected' | 'private'
}

export function createPrompt(payload: createPromptPayload) {
  return HttpRequest<any, createPromptPayload>(
    `${API_PREFIX}/admin/prompts`, {
    method: 'POST',
    body: payload
  })
}