import { graphql, HttpResponse } from 'msw'

// Mock data factories
export const createMockProject = (overrides: Record<string, unknown> = {}) => ({
  id: 1,
  name: 'Test Project',
  description: 'Test project description',
  enabled: true,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  ...overrides,
})

export const createMockPrompt = (overrides: Record<string, unknown> = {}) => ({
  id: 1,
  hashId: 'test-hash-id',
  name: 'Test Prompt',
  description: 'Test prompt description',
  enabled: true,
  debug: false,
  tokenCount: 100,
  publicLevel: 'private',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  project: createMockProject(),
  provider: {
    id: 1,
    name: 'OpenAI',
    description: 'OpenAI provider',
    enabled: true,
    source: 'openai',
    endpoint: 'https://api.openai.com/v1',
    organizationId: null,
    defaultModel: 'gpt-3.5-turbo',
    temperature: 0.7,
    topP: 1,
    maxTokens: 2048,
    config: {},
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    headers: {},
  },
  creator: {
    id: 1,
    name: 'Test User',
  },
  prompts: [
    {
      prompt: 'You are a helpful assistant.',
      role: 'system',
    },
  ],
  variables: [],
  ...overrides,
})

export const createMockProvider = (overrides: Record<string, unknown> = {}) => ({
  id: 1,
  name: 'OpenAI',
  description: 'OpenAI provider',
  enabled: true,
  source: 'openai',
  endpoint: 'https://api.openai.com/v1',
  organizationId: null,
  defaultModel: 'gpt-3.5-turbo',
  temperature: 0.7,
  topP: 1,
  maxTokens: 2048,
  config: {},
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  headers: {},
  ...overrides,
})

// GraphQL handlers
export const graphqlHandlers = [
  // Projects
  graphql.query('fetchProjects', () => {
    return HttpResponse.json({
      data: {
        projects: [createMockProject(), createMockProject({ id: 2, name: 'Second Project' })],
      },
    })
  }),

  graphql.query('fetchProjectDetail', ({ variables }) => {
    return HttpResponse.json({
      data: {
        project: createMockProject({ id: variables.id }),
      },
    })
  }),

  // Prompts
  graphql.query('fetchPrompts', () => {
    return HttpResponse.json({
      data: {
        prompts: [createMockPrompt(), createMockPrompt({ id: 2, name: 'Second Prompt' })],
      },
    })
  }),

  graphql.query('fetchPromptDetail', ({ variables }) => {
    return HttpResponse.json({
      data: {
        prompt: createMockPrompt({ id: variables.id }),
      },
    })
  }),

  // Providers
  graphql.query('fetchProviders', () => {
    return HttpResponse.json({
      data: {
        providers: [createMockProvider(), createMockProvider({ id: 2, name: 'Anthropic' })],
      },
    })
  }),

  graphql.query('fetchProviderDetail', ({ variables }) => {
    return HttpResponse.json({
      data: {
        provider: createMockProvider({ id: variables.id }),
      },
    })
  }),

  // Mutations
  graphql.mutation('createProject', ({ variables }) => {
    return HttpResponse.json({
      data: {
        createProject: createMockProject({ name: variables.input?.name }),
      },
    })
  }),

  graphql.mutation('updateProject', ({ variables }) => {
    return HttpResponse.json({
      data: {
        updateProject: createMockProject({ id: variables.id, name: variables.input?.name }),
      },
    })
  }),

  graphql.mutation('deleteProject', () => {
    return HttpResponse.json({
      data: {
        deleteProject: { success: true },
      },
    })
  }),

  graphql.mutation('createPrompt', ({ variables }) => {
    return HttpResponse.json({
      data: {
        createPrompt: createMockPrompt({ name: variables.input?.name }),
      },
    })
  }),

  graphql.mutation('updatePrompt', ({ variables }) => {
    return HttpResponse.json({
      data: {
        updatePrompt: createMockPrompt({ id: variables.id, name: variables.input?.name }),
      },
    })
  }),

  graphql.mutation('deletePrompt', () => {
    return HttpResponse.json({
      data: {
        deletePrompt: { success: true },
      },
    })
  }),
]
