import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import WebhooksPage from './webhooks.page'
import { webhooksList } from './webhook.query'

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useParams: () => ({ pid: '1' }),
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock components
vi.mock('./components/WebhookList', () => ({
  WebhookList: ({ webhooks }: any) => (
    <div data-testid='webhook-list'>
      {webhooks.map((webhook: any) => (
        <div key={webhook.id} data-testid={`webhook-item-${webhook.id}`}>
          <h3>{webhook.name}</h3>
          <span>
            Status:
            {webhook.enabled ? 'enabled' : 'disabled'}
          </span>
        </div>
      ))}
    </div>
  ),
}))

vi.mock('./components/EmptyState', () => ({
  EmptyState: () => <div data-testid='empty-state'>No webhooks found</div>,
}))

vi.mock('./components/ErrorState', () => ({
  ErrorState: ({ error }: any) => (
    <div data-testid='error-state'>
      Error:
      {error.message}
    </div>
  ),
}))

vi.mock('./components/LoadingState', () => ({
  LoadingState: () => <div data-testid='loading-state'>Loading...</div>,
}))

vi.mock('./components/PageHeader', () => ({
  PageHeader: () => <div data-testid='page-header'>Webhooks Header</div>,
}))

const mockWebhooks = [
  {
    id: 1,
    name: 'Test Webhook 1',
    url: 'https://api.example.com/webhook1',
    events: ['prompt.created', 'prompt.updated'],
    enabled: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Test Webhook 2',
    url: 'https://api.example.com/webhook2',
    events: ['prompt.deleted'],
    enabled: false,
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
]

const mocks = [
  {
    request: {
      query: webhooksList,
      variables: {
        projectId: 1,
        pagination: { limit: 20, offset: 0 },
      },
    },
    result: {
      data: {
        webhooks: {
          count: 2,
          edges: mockWebhooks,
        },
      },
    },
  },
]

const emptyMocks = [
  {
    request: {
      query: webhooksList,
      variables: {
        projectId: 1,
        pagination: { limit: 20, offset: 0 },
      },
    },
    result: {
      data: {
        webhooks: {
          count: 0,
          edges: [],
        },
      },
    },
  },
]

const errorMocks = [
  {
    request: {
      query: webhooksList,
      variables: {
        projectId: 1,
        pagination: { limit: 20, offset: 0 },
      },
    },
    error: new Error('Failed to fetch webhooks'),
  },
]

describe('WebhooksPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <WebhooksPage />
      </MockedProvider>,
    )

    expect(screen.getByTestId('loading-state')).toBeInTheDocument()
  })

  it('renders webhooks list when data is loaded', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <WebhooksPage />
      </MockedProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('page-header')).toBeInTheDocument()
      expect(screen.getByTestId('webhook-list')).toBeInTheDocument()
      expect(screen.getByTestId('webhook-item-1')).toBeInTheDocument()
      expect(screen.getByTestId('webhook-item-2')).toBeInTheDocument()
    })

    expect(screen.getByText('Test Webhook 1')).toBeInTheDocument()
    expect(screen.getByText('Test Webhook 2')).toBeInTheDocument()
  })

  it('renders empty state when no webhooks exist', async () => {
    render(
      <MockedProvider mocks={emptyMocks} addTypename={false}>
        <WebhooksPage />
      </MockedProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    })

    expect(screen.getByText('No webhooks found')).toBeInTheDocument()
  })

  it('renders error state when query fails', async () => {
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <WebhooksPage />
      </MockedProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument()
    })

    expect(screen.getByText('Error: Failed to fetch webhooks')).toBeInTheDocument()
  })

  it('renders page header consistently', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <WebhooksPage />
      </MockedProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('page-header')).toBeInTheDocument()
    })

    expect(screen.getByText('Webhooks Header')).toBeInTheDocument()
  })
})
