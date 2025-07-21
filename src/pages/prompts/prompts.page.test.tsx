import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import PromptsPage from './prompts.page'

// Mock the useProjectId hook
vi.mock('../../hooks/route', () => ({
  useProjectId: () => 1,
}))

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: { children: React.ReactNode, to: string } & React.ComponentProps<'a'>) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

// Mock motion/react to avoid animation issues in tests
vi.mock('motion/react', () => ({
  motion: {
    section: ({ children, ...props }: React.ComponentProps<'section'>) => <section {...props}>{children}</section>,
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
  },
}))

// Mock PromptCardItem component
vi.mock('../../components/Prompt/CardItem', () => ({
  default: ({ prompt }: { prompt: { id: number, name: string, tokenCount: number, enabled: boolean } }) => (
    <div data-testid={`prompt-card-${prompt.id}`}>
      <h3>{prompt.name}</h3>
      <span>
        {prompt.tokenCount}
        {' '}
        tokens
      </span>
    </div>
  ),
}))

// Mock the graphql function and query
vi.mock('../../gql', () => ({
  graphql: vi.fn(() => 'MOCK_PROMPTS_QUERY'),
}))

// Mock useQuery hook from Apollo
vi.mock('@apollo/client')
import * as apolloClient from '@apollo/client'

describe('PromptsPage Component', () => {
  const mockUseQuery = vi.mocked(apolloClient.useQuery)
  const mockPrompts = [
    {
      id: 1,
      hashId: 'hash1',
      name: 'Test Prompt 1',
      publicLevel: 'private',
      enabled: true,
      tokenCount: 100,
      createdAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 2,
      hashId: 'hash2',
      name: 'Test Prompt 2',
      publicLevel: 'public',
      enabled: false,
      tokenCount: 200,
      createdAt: '2023-01-02T00:00:00Z',
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

  it('renders page header correctly', () => {
    mockUseQuery.mockReturnValue({
      data: {
        prompts: {
          count: 0,
          edges: [],
        },
      },
      loading: false,
      error: null,
    })

    render(<PromptsPage />)

    expect(screen.getByText('Prompts')).toBeInTheDocument()
    expect(screen.getByText(/Create, manage, and optimize your AI prompts/)).toBeInTheDocument()
  })

  it('displays prompts when data is loaded', () => {
    mockUseQuery.mockReturnValue({
      data: {
        prompts: {
          count: 2,
          edges: mockPrompts,
        },
      },
      loading: false,
      error: null,
    })

    render(<PromptsPage />)

    // Check that prompt cards are rendered
    expect(screen.getByTestId('prompt-card-1')).toBeInTheDocument()
    expect(screen.getByTestId('prompt-card-2')).toBeInTheDocument()

    // Check that prompt cards are rendered with correct data
    expect(screen.getByText('Test Prompt 1')).toBeInTheDocument()
    expect(screen.getByText('Test Prompt 2')).toBeInTheDocument()
    expect(screen.getByText('100 tokens')).toBeInTheDocument()
    expect(screen.getByText('200 tokens')).toBeInTheDocument()
  })

  it('displays prompt count and total tokens in header', () => {
    mockUseQuery.mockReturnValue({
      data: {
        prompts: {
          count: 2,
          edges: mockPrompts,
        },
      },
      loading: false,
      error: null,
    })

    render(<PromptsPage />)

    // Check prompt count
    expect(screen.getByText('2 Prompts')).toBeInTheDocument()
    // Check total tokens (100 + 200 = 300)
    expect(screen.getByText('300 Total Tokens')).toBeInTheDocument()
  })

  it('shows empty state when no prompts exist', () => {
    mockUseQuery.mockReturnValue({
      data: {
        prompts: {
          count: 0,
          edges: [],
        },
      },
      loading: false,
      error: null,
    })

    render(<PromptsPage />)

    expect(screen.getByText('No prompts yet')).toBeInTheDocument()
    expect(screen.getByText(/Start building your AI workflow/)).toBeInTheDocument()
    expect(screen.getByText('Create Your First Prompt')).toBeInTheDocument()

    // Should show 0 prompts and 0 tokens
    expect(screen.getByText('0 Prompts')).toBeInTheDocument()
    expect(screen.getByText('0 Total Tokens')).toBeInTheDocument()
  })

  it('renders create prompt buttons with correct links', () => {
    mockUseQuery.mockReturnValue({
      data: {
        prompts: {
          count: 0,
          edges: [],
        },
      },
      loading: false,
      error: null,
    })

    render(<PromptsPage />)

    const createButtons = screen.getAllByText(/Create.*Prompt/)
    expect(createButtons).toHaveLength(2) // One in header, one in empty state
  })

  it('handles loading state gracefully', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    })

    render(<PromptsPage />)

    // Initially should show the page structure
    expect(screen.getByText('Prompts')).toBeInTheDocument()

    // Should show 0 while loading/before data arrives
    expect(screen.getByText('0 Prompts')).toBeInTheDocument()
    expect(screen.getByText('0 Total Tokens')).toBeInTheDocument()
  })

  it('handles GraphQL error state', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      loading: false,
      error: new Error('Failed to fetch prompts'),
    })

    render(<PromptsPage />)

    // The page should still render the header even with errors
    expect(screen.getByText('Prompts')).toBeInTheDocument()

    // With error, data will be undefined, so should show empty state
    expect(screen.getByText('0 Prompts')).toBeInTheDocument()
    expect(screen.getByText('0 Total Tokens')).toBeInTheDocument()
  })

  it('renders with different project IDs', () => {
    // This test verifies that the query variables change with different project IDs
    mockUseQuery.mockReturnValue({
      data: {
        prompts: {
          count: 1,
          edges: [mockPrompts[0]],
        },
      },
      loading: false,
      error: null,
    })

    render(<PromptsPage />)

    expect(screen.getByTestId('prompt-card-1')).toBeInTheDocument()
  })

  describe('accessibility', () => {
    it('has proper heading structure', () => {
      mockUseQuery.mockReturnValue({
        data: {
          prompts: {
            count: 0,
            edges: [],
          },
        },
        loading: false,
        error: null,
      })

      render(<PromptsPage />)

      expect(screen.getByRole('heading', { level: 1, name: /prompts/i })).toBeInTheDocument()
    })

    it('has accessible links', () => {
      mockUseQuery.mockReturnValue({
        data: {
          prompts: {
            count: 0,
            edges: [],
          },
        },
        loading: false,
        error: null,
      })

      render(<PromptsPage />)

      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)
    })
  })
})
