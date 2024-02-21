// set endpoint to '' if in production. the static files will be served from the server directly
export const HTTP_ENDPOINT = import.meta.env.PROD ? '' : 'http://localhost:7788'
export const API_PREFIX = '/api/v1'

export const OpenAIModels = [
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k',
  'gpt-4',
  'gpt-4-32k',
  'gemini-pro'
] as const