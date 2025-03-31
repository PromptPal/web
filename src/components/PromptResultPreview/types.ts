import { testPromptResponse } from '../../service/prompt'

export type PromptTestPreviewProps = {
  data: testPromptResponse | null
}

export type ResponseChoice = testPromptResponse['choices'][number]

export type UsageStatItem = {
  label: string
  value: number
}

// Mock data for development
export const dummyData: testPromptResponse = {
  id: 'chatcmpl-BHBpvw9j2Uy0FJKSwG6188KRLKHi2',
  object: 'chat.completion',
  created: 1743436775,
  model: 'gpt-4o-mini-2024-07-18',
  choices: [
    {
      index: 0,
      message: {
        role: 'assistant',
        content:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n  <path d="M20,30 C15,20 25,10 30,20 C35,10 45,20 40,30 C45,35 55,30 50,40 C55,50 60,70 50,70 C40,70 40,50 30,50 C20,50 15,60 20,70 C15,80 5,80 0,70 C10,70 10,60 20,60 C30,60 30,70 40,70 C50,70 50,60 60,60 C70,60 70,40 60,40 C70,30 80,20 70,10 C60,0 50,0 40,10 C30,0 20,0 20,30 Z" fill="brown"/>\n</svg>',
      },
      finish_reason: 'stop',
      content_filter_results: {
        hate: {
          filtered: false,
        },
        self_harm: {
          filtered: false,
        },
        sexual: {
          filtered: false,
        },
        violence: {
          filtered: false,
        },
        jailbreak: {
          filtered: false,
          detected: false,
        },
        profanity: {
          filtered: false,
          detected: false,
        },
      },
    },
  ],
  usage: {
    prompt_tokens: 27,
    completion_tokens: 213,
    total_tokens: 240,
    prompt_tokens_details: {
      audio_tokens: 0,
      cached_tokens: 0,
    },
    completion_tokens_details: {
      audio_tokens: 0,
      reasoning_tokens: 0,
    },
  },
  system_fingerprint: 'fp_b376dfbbd5',
}
