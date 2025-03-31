import { API_PREFIX } from '../constants'
import { HttpRequest } from './http'
import { PromptRow } from './types'

export type testPromptResponse = {
  id: string
  object: string
  created: number
  model: string
  system_fingerprint?: string
  choices: {
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
    delta?: {
      role: string
      content: string
    }
    content_filter_results: Record<
      string,
      { filtered: boolean; detected?: boolean }
    >
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
    prompt_tokens_details?: {
      audio_tokens: number
      cached_tokens: number
    }
    completion_tokens_details?: {
      audio_tokens: number
      reasoning_tokens: number
    }
  }
}

export type testPromptPayload = {
  projectId: number
  name: string
  prompts: PromptRow[]
  variables: Record<string, string | number | boolean | File>
  providerId: number
}

export function testPrompt(
  payload: testPromptPayload,
): Promise<testPromptResponse> {
  return HttpRequest<testPromptResponse, testPromptPayload>(
    `${API_PREFIX}/admin/prompts/test`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    },
  ).then((res) => res.json())
}
