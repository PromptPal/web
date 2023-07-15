import { API_PREFIX } from '../constants'
import { HttpRequest } from './http'
import { ListResponse, PromptRow, PromptVariable } from './types'

export type PromptObject = {
  id: number;
  hid: string;
  create_time: string;
  update_time: string;
  name?: string;
  description?: string;
  enabled: boolean;
  debug: boolean;
  prompts: PromptRow[];
  tokenCount: number;
  variables?: PromptVariable[];
  publicLevel: string;
  edges: any;
}


export function getPromptList(projectId: number, cursor: number, signal?: AbortSignal) {
  return HttpRequest<ListResponse<PromptObject>>(`${API_PREFIX}/admin/projects/${projectId}/prompts?cursor=${cursor}&limit=20`, {
    signal,
  })
}

export function getPromptDetail(promptId: number, signal?: AbortSignal) {
  return HttpRequest<PromptObject>(`${API_PREFIX}/admin/prompts/${promptId}`, {
    signal,
  })
}

export type PromptCall = {
  id: number;
  create_time: string;
  update_time: string;
  responseToken: number;
  totalToken: number;
  duration: number;
  message: string;
  edges: any;
}

export function getPromptCalls(promptId: number, cursor: number, signal?: AbortSignal) {
  return HttpRequest<ListResponse<PromptCall>>(`${API_PREFIX}/admin/prompts/${promptId}/calls?cursor=${cursor}&limit=20`, {
    signal,
  })
}

export type createPromptPayload = {
  projectId: number
  name: string
  description: string
  enabled: boolean
  debug: boolean
  tokenCount: number
  prompts: PromptRow[]
  variables: PromptVariable[]
  publicLevel: 'public' | 'protected' | 'private'
}

export function createPrompt(payload: createPromptPayload) {
  return HttpRequest<PromptObject, createPromptPayload>(
    `${API_PREFIX}/admin/prompts`, {
      method: 'POST',
      body: payload
    })
}

export type updatePromptPayload = Omit<createPromptPayload, 'projectId' | 'name'>

export function updatePrompt(payload: updatePromptPayload) {
  return HttpRequest<PromptObject, updatePromptPayload>(
    `${API_PREFIX}/admin/prompts`, {
      method: 'POST',
      body: payload
    })
}

export type testPromptResponse = {
  id: string
  object: string
  created: number
  choices: {
    index: number
    message: {
      role: string;
      content: string;
    }
    finish_reason: string
    delta: {
      role: string;
      content: string;
    }
  }[]
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  }
}

export type testPromptPayload = {
  projectId: number
  name: string
  prompts: PromptRow[]
  variables: Record<string, string>
}

export function testPrompt(payload: testPromptPayload) {
  return HttpRequest<testPromptResponse, testPromptPayload>(
    `${API_PREFIX}/admin/prompts/test`, {
      method: 'POST',
      body: payload
    })
}