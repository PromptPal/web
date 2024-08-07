// set endpoint to '' if in production. the static files will be served from the server directly
export const HTTP_ENDPOINT = import.meta.env.PROD ? '' : 'http://localhost:7788'
export const API_PREFIX = '/api/v1'

export const OpenAIModels = [
  'gpt-3.5-turbo',
  'gpt-4-turbo',
  'gpt-4',
  'gpt-4o',
  'gpt-4o-mini',
  'gemini-pro',
] as const

export const SupportedVariableType = [
  'String',
  'Number',
  'Boolean',
  'Video',
  'Audio',
  'Image',
] as const
