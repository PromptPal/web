import { API_PREFIX } from "../constants"
import { HttpRequest } from "./http"
import { ListResponse, PromptRow, PromptVariable } from "./types"

export type PromptObject = {
  id: number;
  hid: string;
  create_time: string;
  update_time: string;
  name?: string;
  description?: string;
  enabled: boolean;
  prompts: PromptRow[];
  tokenCount: number;
  variables?: PromptVariable[];
  publicLevel: string;
  edges: any;
}


export function getPromptList(projectId: number, cursor: number, signal?: AbortSignal) {
  return HttpRequest<ListResponse<PromptObject>>(`${API_PREFIX}/admin/projects/${projectId}/prompts?cursor=${cursor}&limit=20`, {
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
  return HttpRequest<PromptObject, createPromptPayload>(
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