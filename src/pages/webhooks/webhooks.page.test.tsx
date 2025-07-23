import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import WebhooksPage from './webhooks.page'

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: { children: React.ReactNode, to: string } & React.ComponentProps<'a'>) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useParams: () => ({ pid: '1' }),
}))

// Mock the route hook
vi.mock('../../hooks/route', () => ({
  useProjectId: () => 1,
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
  },
}))

// Mock components
vi.mock('./components/WebhookList', () => ({
  WebhookList: ({ webhooks }: { webhooks: Array<{ id: number, name: string, enabled: boolean }> }) => (
    <div data-testid='webhook-list'>
      {webhooks.map(webhook => (
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
  ErrorState: ({ error }: { error: { message: string } }) => (
    <div data-testid='error-state'>
      Error:
      {' '}
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

// Mock the graphql function and query
vi.mock('@/gql', () => ({
  graphql: vi.fn(() => 'MOCK_WEBHOOKS_QUERY'),
}))

// Mock useQuery hook from Apollo
vi.mock('@apollo/client')
import * as apolloClient from '@apollo/client'

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

describe('WebhooksPage', () => {
  const mockUseQuery = vi.mocked(apolloClient.useQuery)

  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock return value
    mockUseQuery.mockReturnValue({
      data: null,
      loading: false,
      error: null,
      refetch: vi.fn(),
    })
  })

  it('renders loading state initially', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
    })

    render(<WebhooksPage />)

    expect(screen.getByTestId('loading-state')).toBeInTheDocument()
  })

  it('renders webhooks list when data is loaded', () => {
    mockUseQuery.mockReturnValue({
      data: {
        webhooks: {
          count: 2,
          edges: mockWebhooks,
        },
      },
      loading: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<WebhooksPage />)

    expect(screen.getByTestId('page-header')).toBeInTheDocument()
    expect(screen.getByTestId('webhook-list')).toBeInTheDocument()
    expect(screen.getByTestId('webhook-item-1')).toBeInTheDocument()
    expect(screen.getByTestId('webhook-item-2')).toBeInTheDocument()
    expect(screen.getByText('Test Webhook 1')).toBeInTheDocument()
    expect(screen.getByText('Test Webhook 2')).toBeInTheDocument()
  })

  it('renders empty state when no webhooks exist', () => {
    mockUseQuery.mockReturnValue({
      data: {
        webhooks: {
          count: 0,
          edges: [],
        },
      },
      loading: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<WebhooksPage />)

    expect(screen.getByTestId('page-header')).toBeInTheDocument()
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.getByText('No webhooks found')).toBeInTheDocument()
  })

  it('renders error state when query fails', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      loading: false,
      error: new Error('Failed to fetch webhooks'),
      refetch: vi.fn(),
    })

    render(<WebhooksPage />)

    expect(screen.getByTestId('error-state')).toBeInTheDocument()
    expect(screen.getByText('Error: Failed to fetch webhooks')).toBeInTheDocument()
  })

  it('renders page header consistently', () => {
    mockUseQuery.mockReturnValue({
      data: {
        webhooks: {
          count: 2,
          edges: mockWebhooks,
        },
      },
      loading: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<WebhooksPage />)

    expect(screen.getByTestId('page-header')).toBeInTheDocument()
    expect(screen.getByText('Webhooks Header')).toBeInTheDocument()
  })
})
