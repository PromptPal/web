import { API_PREFIX } from '../constants'
import { HttpRequest } from './http'
import { PromptRow } from './types'

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

export function testPrompt(payload: testPromptPayload): Promise<testPromptResponse> {
  return HttpRequest<testPromptResponse, testPromptPayload>(
    `${API_PREFIX}/admin/prompts/test`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload
    }).then(res => res.json())
}