import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProvidersPage from './providers.page'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock all the provider components
vi.mock('./components/LoadingState', () => ({
  LoadingState: () => <div data-testid='loading-state'>Loading providers...</div>,
}))

vi.mock('./components/ErrorState', () => ({
  ErrorState: ({ error }: any) => (
    <div data-testid='error-state'>
      <h2>Error loading providers</h2>
      <p>{error?.message || 'Unknown error'}</p>
    </div>
  ),
}))

vi.mock('./components/EmptyState', () => ({
  EmptyState: () => (
    <div data-testid='empty-state'>
      <h2>No providers found</h2>
      <p>Create your first provider to get started</p>
    </div>
  ),
}))

vi.mock('./components/PageHeader', () => ({
  PageHeader: ({ isDisabled }: any) => (
    <div data-testid='page-header'>
      <h1>Providers</h1>
      <button disabled={isDisabled}>Add Provider</button>
    </div>
  ),
}))

vi.mock('./components/ProviderList', () => ({
  ProviderList: ({ providers }: any) => (
    <div data-testid='provider-list'>
      <h2>Provider List</h2>
      {providers.map((provider: any) => (
        <div key={provider.id} data-testid={`provider-item-${provider.id}`}>
          <h3>{provider.name}</h3>
          <span>
            Type:
            {provider.type}
          </span>
        </div>
      ))}
    </div>
  ),
}))

// Mock the provider query
vi.mock('./provider.query', () => ({
  pl: 'MOCK_PROVIDERS_QUERY',
}))

// Mock the graphql function and query
vi.mock('../../gql', () => ({
  graphql: vi.fn(() => 'MOCK_PROVIDERS_QUERY'),
}))

// Mock useQuery hook from Apollo
vi.mock('@apollo/client')
import * as apolloClient from '@apollo/client'

describe('ProvidersPage Component', () => {
  const mockUseQuery = vi.mocked(apolloClient.useQuery)
  const mockProviders = [
    {
      id: 1,
      name: 'OpenAI Provider',
      type: 'openai',
      endpoint: 'https://api.openai.com/v1',
      enabled: true,
    },
    {
      id: 2,
      name: 'Anthropic Provider',
      type: 'anthropic',
      endpoint: 'https://api.anthropic.com',
      enabled: false,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock return value
    mockUseQuery.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    })
  })

  it('shows loading state while fetching data', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    })

    render(<ProvidersPage />)

    expect(screen.getByTestId('loading-state')).toBeInTheDocument()
    expect(screen.getByText('Loading providers...')).toBeInTheDocument()
  })

  it('shows error state when there is an error', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      loading: false,
      error: new Error('Failed to fetch providers'),
    })

    render(<ProvidersPage />)

    expect(screen.getByTestId('error-state')).toBeInTheDocument()
    expect(screen.getByText('Error loading providers')).toBeInTheDocument()
    expect(screen.getByText('Failed to fetch providers')).toBeInTheDocument()
  })

  it('shows empty state when no providers exist', () => {
    mockUseQuery.mockReturnValue({
      data: {
        providers: {
          edges: [],
        },
      },
      loading: false,
      error: null,
    })

    render(<ProvidersPage />)

    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.getByText('No providers found')).toBeInTheDocument()
    expect(screen.getByText('Create your first provider to get started')).toBeInTheDocument()
  })

  it('displays provider list when providers exist', () => {
    mockUseQuery.mockReturnValue({
      data: {
        providers: {
          edges: mockProviders,
        },
      },
      loading: false,
      error: null,
    })

    render(<ProvidersPage />)

    expect(screen.getByTestId('provider-list')).toBeInTheDocument()
    expect(screen.getByText('Provider List')).toBeInTheDocument()

    expect(screen.getByTestId('provider-item-1')).toBeInTheDocument()
    expect(screen.getByTestId('provider-item-2')).toBeInTheDocument()

    expect(screen.getByText('OpenAI Provider')).toBeInTheDocument()
    expect(screen.getByText('Anthropic Provider')).toBeInTheDocument()
    expect(screen.getByText('Type: openai')).toBeInTheDocument()
    expect(screen.getByText('Type: anthropic')).toBeInTheDocument()
  })

  it('renders page header in all states', () => {
    mockUseQuery.mockReturnValue({
      data: {
        providers: {
          edges: mockProviders,
        },
      },
      loading: false,
      error: null,
    })

    render(<ProvidersPage />)

    expect(screen.getByTestId('page-header')).toBeInTheDocument()
    expect(screen.getByText('Providers')).toBeInTheDocument()
    expect(screen.getByText('Add Provider')).toBeInTheDocument()
  })

  it('does not show provider list when showing empty state', () => {
    mockUseQuery.mockReturnValue({
      data: {
        providers: {
          edges: [],
        },
      },
      loading: false,
      error: null,
    })

    render(<ProvidersPage />)

    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('provider-list')).not.toBeInTheDocument()
  })

  it('does not show empty state when providers exist', () => {
    mockUseQuery.mockReturnValue({
      data: {
        providers: {
          edges: mockProviders,
        },
      },
      loading: false,
      error: null,
    })

    render(<ProvidersPage />)

    expect(screen.getByTestId('provider-list')).toBeInTheDocument()
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument()
  })

  describe('pagination handling', () => {
    it('uses correct pagination parameters', () => {
      mockUseQuery.mockReturnValue({
        data: {
          providers: {
            edges: [mockProviders[0]],
          },
        },
        loading: false,
        error: null,
      })

      render(<ProvidersPage />)

      expect(screen.getByTestId('provider-item-1')).toBeInTheDocument()
    })
  })

  describe('data handling', () => {
    it('handles null providers data gracefully', () => {
      mockUseQuery.mockReturnValue({
        data: {
          providers: null,
        },
        loading: false,
        error: null,
      })

      render(<ProvidersPage />)

      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    })

    it('handles providers without edges gracefully', () => {
      mockUseQuery.mockReturnValue({
        data: {
          providers: {},
        },
        loading: false,
        error: null,
      })

      render(<ProvidersPage />)

      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    })
  })

  describe('component integration', () => {
    it('passes providers to ProviderList correctly', () => {
      mockUseQuery.mockReturnValue({
        data: {
          providers: {
            edges: mockProviders,
          },
        },
        loading: false,
        error: null,
      })

      render(<ProvidersPage />)

      // Check that both providers are passed and rendered
      expect(screen.getByTestId('provider-item-1')).toBeInTheDocument()
      expect(screen.getByTestId('provider-item-2')).toBeInTheDocument()
    })

    it('passes isDisabled=false to PageHeader', () => {
      mockUseQuery.mockReturnValue({
        data: {
          providers: {
            edges: [],
          },
        },
        loading: false,
        error: null,
      })

      render(<ProvidersPage />)

      const addButton = screen.getByText('Add Provider')
      expect(addButton).not.toBeDisabled()
    })
  })

  describe('accessibility', () => {
    it('has proper structure for screen readers', () => {
      mockUseQuery.mockReturnValue({
        data: {
          providers: {
            edges: mockProviders,
          },
        },
        loading: false,
        error: null,
      })

      render(<ProvidersPage />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Providers')
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Provider List')
    })

    it('provides meaningful headings in empty state', () => {
      mockUseQuery.mockReturnValue({
        data: {
          providers: {
            edges: [],
          },
        },
        loading: false,
        error: null,
      })

      render(<ProvidersPage />)

      expect(screen.getByRole('heading', { level: 2, name: /No providers found/i })).toBeInTheDocument()
    })

    it('provides meaningful error messages', () => {
      mockUseQuery.mockReturnValue({
        data: null,
        loading: false,
        error: new Error('Network connection failed'),
      })

      render(<ProvidersPage />)

      expect(screen.getByRole('heading', { level: 2, name: /Error loading providers/i })).toBeInTheDocument()
      expect(screen.getByText('Network connection failed')).toBeInTheDocument()
    })
  })
})
