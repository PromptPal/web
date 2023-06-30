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

export type testPromptPayload = {
  projectId: number
  name: string
  prompts: PromptRow[]
  variables: Record<string, string>
}

export function testPrompt(payload: testPromptPayload) {
  return HttpRequest<any, testPromptPayload>(
    `${API_PREFIX}/admin/prompts/test`, {
    method: 'POST',
    body: payload
  })
}