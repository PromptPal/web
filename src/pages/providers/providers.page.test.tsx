import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/utils/test-utils'
import { createGraphQLMock } from '@/test/utils/apollo-utils'
import ProvidersPage from './providers.page'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}))

// Mock all the provider components
vi.mock('./components/LoadingState', () => ({
  LoadingState: () => <div data-testid="loading-state">Loading providers...</div>
}))

vi.mock('./components/ErrorState', () => ({
  ErrorState: ({ error }: any) => (
    <div data-testid="error-state">
      <h2>Error loading providers</h2>
      <p>{error?.message || 'Unknown error'}</p>
    </div>
  )
}))

vi.mock('./components/EmptyState', () => ({
  EmptyState: () => (
    <div data-testid="empty-state">
      <h2>No providers found</h2>
      <p>Create your first provider to get started</p>
    </div>
  )
}))

vi.mock('./components/PageHeader', () => ({
  PageHeader: ({ isDisabled }: any) => (
    <div data-testid="page-header">
      <h1>Providers</h1>
      <button disabled={isDisabled}>Add Provider</button>
    </div>
  )
}))

vi.mock('./components/ProviderList', () => ({
  ProviderList: ({ providers }: any) => (
    <div data-testid="provider-list">
      <h2>Provider List</h2>
      {providers.map((provider: any) => (
        <div key={provider.id} data-testid={`provider-item-${provider.id}`}>
          <h3>{provider.name}</h3>
          <span>Type: {provider.type}</span>
        </div>
      ))}
    </div>
  )
}))

// Mock the provider query
vi.mock('@/pages/providers/provider.query', () => ({
  pl: `
    query providers($pagination: PaginationInput!) {
      providers(pagination: $pagination) {
        edges {
          id
          name
          type
          endpoint
          enabled
        }
      }
    }
  `
}))

const PROVIDERS_QUERY = `
  query providers($pagination: PaginationInput!) {
    providers(pagination: $pagination) {
      edges {
        id
        name
        type
        endpoint
        enabled
      }
    }
  }
`

describe('ProvidersPage Component', () => {
  const mockProviders = [
    {
      id: 1,
      name: 'OpenAI Provider',
      type: 'openai',
      endpoint: 'https://api.openai.com/v1',
      enabled: true
    },
    {
      id: 2,
      name: 'Anthropic Provider',
      type: 'anthropic',
      endpoint: 'https://api.anthropic.com',
      enabled: false
    }
  ]

  it('shows loading state while fetching data', () => {
    const mocks = [
      createGraphQLMock(
        PROVIDERS_QUERY,
        { pagination: { limit: 50, offset: 0 } },
        null,
        'Loading...'
      )
    ]

    render(<ProvidersPage />, { mocks })

    expect(screen.getByTestId('loading-state')).toBeInTheDocument()
    expect(screen.getByText('Loading providers...')).toBeInTheDocument()
  })

  it('shows error state when there is an error', async () => {
    const mocks = [
      createGraphQLMock(
        PROVIDERS_QUERY,
        { pagination: { limit: 50, offset: 0 } },
        null,
        'Failed to fetch providers'
      )
    ]

    render(<ProvidersPage />, { mocks })

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument()
      expect(screen.getByText('Error loading providers')).toBeInTheDocument()
      expect(screen.getByText('Failed to fetch providers')).toBeInTheDocument()
    })
  })

  it('shows empty state when no providers exist', async () => {
    const mocks = [
      createGraphQLMock(
        PROVIDERS_QUERY,
        { pagination: { limit: 50, offset: 0 } },
        {
          providers: {
            edges: []
          }
        }
      )
    ]

    render(<ProvidersPage />, { mocks })

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
      expect(screen.getByText('No providers found')).toBeInTheDocument()
      expect(screen.getByText('Create your first provider to get started')).toBeInTheDocument()
    })
  })

  it('displays provider list when providers exist', async () => {
    const mocks = [
      createGraphQLMock(
        PROVIDERS_QUERY,
        { pagination: { limit: 50, offset: 0 } },
        {
          providers: {
            edges: mockProviders
          }
        }
      )
    ]

    render(<ProvidersPage />, { mocks })

    await waitFor(() => {
      expect(screen.getByTestId('provider-list')).toBeInTheDocument()
      expect(screen.getByText('Provider List')).toBeInTheDocument()
      
      expect(screen.getByTestId('provider-item-1')).toBeInTheDocument()
      expect(screen.getByTestId('provider-item-2')).toBeInTheDocument()
      
      expect(screen.getByText('OpenAI Provider')).toBeInTheDocument()
      expect(screen.getByText('Anthropic Provider')).toBeInTheDocument()
      expect(screen.getByText('Type: openai')).toBeInTheDocument()
      expect(screen.getByText('Type: anthropic')).toBeInTheDocument()
    })
  })

  it('renders page header in all states', async () => {
    const mocks = [
      createGraphQLMock(
        PROVIDERS_QUERY,
        { pagination: { limit: 50, offset: 0 } },
        {
          providers: {
            edges: mockProviders
          }
        }
      )
    ]

    render(<ProvidersPage />, { mocks })

    await waitFor(() => {
      expect(screen.getByTestId('page-header')).toBeInTheDocument()
      expect(screen.getByText('Providers')).toBeInTheDocument()
      expect(screen.getByText('Add Provider')).toBeInTheDocument()
    })
  })

  it('does not show provider list when showing empty state', async () => {
    const mocks = [
      createGraphQLMock(
        PROVIDERS_QUERY,
        { pagination: { limit: 50, offset: 0 } },
        {
          providers: {
            edges: []
          }
        }
      )
    ]

    render(<ProvidersPage />, { mocks })

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
      expect(screen.queryByTestId('provider-list')).not.toBeInTheDocument()
    })
  })

  it('does not show empty state when providers exist', async () => {
    const mocks = [
      createGraphQLMock(
        PROVIDERS_QUERY,
        { pagination: { limit: 50, offset: 0 } },
        {
          providers: {
            edges: mockProviders
          }
        }
      )
    ]

    render(<ProvidersPage />, { mocks })

    await waitFor(() => {
      expect(screen.getByTestId('provider-list')).toBeInTheDocument()
      expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument()
    })
  })

  describe('pagination handling', () => {
    it('uses correct pagination parameters', async () => {
      const mocks = [
        createGraphQLMock(
          PROVIDERS_QUERY,
          { pagination: { limit: 50, offset: 0 } },
          {
            providers: {
              edges: [mockProviders[0]]
            }
          }
        )
      ]

      render(<ProvidersPage />, { mocks })

      await waitFor(() => {
        expect(screen.getByTestId('provider-item-1')).toBeInTheDocument()
      })
    })
  })

  describe('data handling', () => {
    it('handles null providers data gracefully', async () => {
      const mocks = [
        createGraphQLMock(
          PROVIDERS_QUERY,
          { pagination: { limit: 50, offset: 0 } },
          {
            providers: null
          }
        )
      ]

      render(<ProvidersPage />, { mocks })

      await waitFor(() => {
        expect(screen.getByTestId('empty-state')).toBeInTheDocument()
      })
    })

    it('handles providers without edges gracefully', async () => {
      const mocks = [
        createGraphQLMock(
          PROVIDERS_QUERY,
          { pagination: { limit: 50, offset: 0 } },
          {
            providers: {}
          }
        )
      ]

      render(<ProvidersPage />, { mocks })

      await waitFor(() => {
        expect(screen.getByTestId('empty-state')).toBeInTheDocument()
      })
    })
  })

  describe('component integration', () => {
    it('passes providers to ProviderList correctly', async () => {
      const mocks = [
        createGraphQLMock(
          PROVIDERS_QUERY,
          { pagination: { limit: 50, offset: 0 } },
          {
            providers: {
              edges: mockProviders
            }
          }
        )
      ]

      render(<ProvidersPage />, { mocks })

      await waitFor(() => {
        // Check that both providers are passed and rendered
        expect(screen.getByTestId('provider-item-1')).toBeInTheDocument()
        expect(screen.getByTestId('provider-item-2')).toBeInTheDocument()
      })
    })

    it('passes isDisabled=false to PageHeader', async () => {
      const mocks = [
        createGraphQLMock(
          PROVIDERS_QUERY,
          { pagination: { limit: 50, offset: 0 } },
          {
            providers: {
              edges: []
            }
          }
        )
      ]

      render(<ProvidersPage />, { mocks })

      await waitFor(() => {
        const addButton = screen.getByText('Add Provider')
        expect(addButton).not.toBeDisabled()
      })
    })
  })

  describe('accessibility', () => {
    it('has proper structure for screen readers', async () => {
      const mocks = [
        createGraphQLMock(
          PROVIDERS_QUERY,
          { pagination: { limit: 50, offset: 0 } },
          {
            providers: {
              edges: mockProviders
            }
          }
        )
      ]

      render(<ProvidersPage />, { mocks })

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Providers')
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Provider List')
      })
    })

    it('provides meaningful headings in empty state', async () => {
      const mocks = [
        createGraphQLMock(
          PROVIDERS_QUERY,
          { pagination: { limit: 50, offset: 0 } },
          {
            providers: {
              edges: []
            }
          }
        )
      ]

      render(<ProvidersPage />, { mocks })

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 2, name: /No providers found/i })).toBeInTheDocument()
      })
    })

    it('provides meaningful error messages', async () => {
      const mocks = [
        createGraphQLMock(
          PROVIDERS_QUERY,
          { pagination: { limit: 50, offset: 0 } },
          null,
          'Network connection failed'
        )
      ]

      render(<ProvidersPage />, { mocks })

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 2, name: /Error loading providers/i })).toBeInTheDocument()
        expect(screen.getByText('Network connection failed')).toBeInTheDocument()
      })
    })
  })
})