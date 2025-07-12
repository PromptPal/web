import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/utils/test-utils'
import { createGraphQLMock } from '@/test/utils/apollo-utils'
import OverallPage from './overall.page'

// Mock the useProjectId hook
vi.mock('../../hooks/route', () => ({
  useProjectId: vi.fn(() => 1)
}))

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  )
}))

// Mock components
vi.mock('../../components/Helps/Intergation', () => ({
  default: () => <div data-testid="help-integration">Integration Help</div>
}))

vi.mock('../../components/Project/TopPromptsByDate', () => ({
  default: ({ recentCounts, loading }: any) => (
    <div data-testid="top-prompts-by-date">
      <span>Top Prompts Chart</span>
      {loading && <span>Chart Loading...</span>}
      <span>Data points: {recentCounts?.length || 0}</span>
    </div>
  )
}))

// Mock the graphql function and query
vi.mock('../../gql', () => ({
  graphql: vi.fn(() => 'MOCK_QUERY')
}))

// Mock the GraphQL query
const OVERALL_QUERY = 'MOCK_QUERY'

describe('OverallPage Component', () => {
  const mockProjectData = {
    project: {
      id: 1,
      name: 'Test Project',
      promptMetrics: {
        recentCounts: [
          { prompt: { id: 1, name: 'Prompt 1' }, count: 50 },
          { prompt: { id: 2, name: 'Prompt 2' }, count: 30 }
        ],
        last7Days: [
          {
            date: '2024-01-01',
            prompts: [
              { count: 10, prompt: { id: 1, name: 'Prompt 1' } }
            ]
          },
          {
            date: '2024-01-02',
            prompts: [
              { count: 15, prompt: { id: 2, name: 'Prompt 2' } }
            ]
          }
        ]
      }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when no project is selected', () => {
    beforeEach(() => {
      vi.mocked(require('../../hooks/route').useProjectId).mockReturnValue(null)
    })

    it('shows no project selected state', () => {
      render(<OverallPage />)

      expect(screen.getByText('No Project Selected')).toBeInTheDocument()
      expect(screen.getByText(/Create a new project to start analyzing/)).toBeInTheDocument()
      expect(screen.getByText('Create New Project')).toBeInTheDocument()
    })

    it('has correct link to create new project', () => {
      render(<OverallPage />)

      const createLink = screen.getByText('Create New Project').closest('a')
      expect(createLink).toHaveAttribute('href', '/projects/new')
    })
  })

  describe('when project is selected but no data', () => {
    beforeEach(() => {
      vi.mocked(require('../../hooks/route').useProjectId).mockReturnValue(1)
    })

    it('shows no project selected when project data is null', async () => {
      const mocks = [
        createGraphQLMock(
          OVERALL_QUERY,
          { id: 1 },
          { project: null }
        )
      ]

      render(<OverallPage />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('No Project Selected')).toBeInTheDocument()
      })
    })
  })

  describe('when project data is available', () => {
    beforeEach(() => {
      vi.mocked(require('../../hooks/route').useProjectId).mockReturnValue(1)
    })

    it('displays project name and analytics', async () => {
      const mocks = [
        createGraphQLMock(
          OVERALL_QUERY,
          { id: 1 },
          mockProjectData
        )
      ]

      render(<OverallPage />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('Test Project')).toBeInTheDocument()
        expect(screen.getByText('Project Analytics Overview')).toBeInTheDocument()
      })
    })

    it('displays correct statistics', async () => {
      const mocks = [
        createGraphQLMock(
          OVERALL_QUERY,
          { id: 1 },
          mockProjectData
        )
      ]

      render(<OverallPage />, { mocks })

      await waitFor(() => {
        // Total Executions (50 + 30 = 80)
        expect(screen.getByText('80')).toBeInTheDocument()
        expect(screen.getByText('Total Executions')).toBeInTheDocument()
        
        // Active Prompts (2 prompts)
        expect(screen.getByText('2')).toBeInTheDocument()
        expect(screen.getByText('Active Prompts')).toBeInTheDocument()
        
        // Daily Average (80 / 7 ≈ 11)
        expect(screen.getByText('11')).toBeInTheDocument()
        expect(screen.getByText('Daily Average')).toBeInTheDocument()
      })
    })

    it('renders the chart component when data is available', async () => {
      const mocks = [
        createGraphQLMock(
          OVERALL_QUERY,
          { id: 1 },
          mockProjectData
        )
      ]

      render(<OverallPage />, { mocks })

      await waitFor(() => {
        expect(screen.getByTestId('top-prompts-by-date')).toBeInTheDocument()
        expect(screen.getByText('Top Prompts Chart')).toBeInTheDocument()
        expect(screen.getByText('Data points: 2')).toBeInTheDocument()
      })
    })

    it('does not show help integration when data is available', async () => {
      const mocks = [
        createGraphQLMock(
          OVERALL_QUERY,
          { id: 1 },
          mockProjectData
        )
      ]

      render(<OverallPage />, { mocks })

      await waitFor(() => {
        expect(screen.queryByTestId('help-integration')).not.toBeInTheDocument()
      })
    })
  })

  describe('when project has no metrics data', () => {
    beforeEach(() => {
      vi.mocked(require('../../hooks/route').useProjectId).mockReturnValue(1)
    })

    it('shows help integration when no metrics data', async () => {
      const emptyProjectData = {
        project: {
          id: 1,
          name: 'Empty Project',
          promptMetrics: {
            recentCounts: [],
            last7Days: []
          }
        }
      }

      const mocks = [
        createGraphQLMock(
          OVERALL_QUERY,
          { id: 1 },
          emptyProjectData
        )
      ]

      render(<OverallPage />, { mocks })

      await waitFor(() => {
        expect(screen.getByTestId('help-integration')).toBeInTheDocument()
        expect(screen.getByText('Integration Help')).toBeInTheDocument()
      })
    })

    it('displays zero statistics when no data', async () => {
      const emptyProjectData = {
        project: {
          id: 1,
          name: 'Empty Project',
          promptMetrics: {
            recentCounts: [],
            last7Days: []
          }
        }
      }

      const mocks = [
        createGraphQLMock(
          OVERALL_QUERY,
          { id: 1 },
          emptyProjectData
        )
      ]

      render(<OverallPage />, { mocks })

      await waitFor(() => {
        // Should show 0 for all metrics
        const zeroElements = screen.getAllByText('0')
        expect(zeroElements.length).toBeGreaterThanOrEqual(3) // At least 3 zero values
      })
    })
  })

  describe('loading state', () => {
    beforeEach(() => {
      vi.mocked(require('../../hooks/route').useProjectId).mockReturnValue(1)
    })

    it('shows loading indicator when fetching data', () => {
      const mocks = [
        createGraphQLMock(
          OVERALL_QUERY,
          { id: 1 },
          mockProjectData
        )
      ]

      render(<OverallPage />, { mocks })

      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })

  describe('error handling', () => {
    beforeEach(() => {
      vi.mocked(require('../../hooks/route').useProjectId).mockReturnValue(1)
    })

    it('handles GraphQL errors gracefully', async () => {
      const mocks = [
        createGraphQLMock(
          OVERALL_QUERY,
          { id: 1 },
          null,
          'Failed to fetch project data'
        )
      ]

      render(<OverallPage />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('No Project Selected')).toBeInTheDocument()
      })
    })
  })

  describe('accessibility', () => {
    beforeEach(() => {
      vi.mocked(require('../../hooks/route').useProjectId).mockReturnValue(1)
    })

    it('has proper heading structure', async () => {
      const mocks = [
        createGraphQLMock(
          OVERALL_QUERY,
          { id: 1 },
          mockProjectData
        )
      ]

      render(<OverallPage />, { mocks })

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Project')
      })
    })

    it('has accessible links', () => {
      vi.mocked(require('../../hooks/route').useProjectId).mockReturnValue(null)
      
      render(<OverallPage />)

      const createLink = screen.getByText('Create New Project').closest('a')
      expect(createLink).toHaveAccessibleName()
      expect(createLink).toHaveAttribute('href')
    })
  })

  describe('responsive design', () => {
    beforeEach(() => {
      vi.mocked(require('../../hooks/route').useProjectId).mockReturnValue(1)
    })

    it('applies responsive grid classes', async () => {
      const mocks = [
        createGraphQLMock(
          OVERALL_QUERY,
          { id: 1 },
          mockProjectData
        )
      ]

      render(<OverallPage />, { mocks })

      await waitFor(() => {
        const statsGrid = screen.getByText('Total Executions').closest('div')?.parentElement
        expect(statsGrid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-3')
      })
    })
  })

  describe('data calculations', () => {
    beforeEach(() => {
      vi.mocked(require('../../hooks/route').useProjectId).mockReturnValue(1)
    })

    it('calculates total executions correctly', async () => {
      const customData = {
        project: {
          id: 1,
          name: 'Test Project',
          promptMetrics: {
            recentCounts: [
              { prompt: { id: 1, name: 'Prompt 1' }, count: 100 },
              { prompt: { id: 2, name: 'Prompt 2' }, count: 150 },
              { prompt: { id: 3, name: 'Prompt 3' }, count: 75 }
            ],
            last7Days: []
          }
        }
      }

      const mocks = [
        createGraphQLMock(
          OVERALL_QUERY,
          { id: 1 },
          customData
        )
      ]

      render(<OverallPage />, { mocks })

      await waitFor(() => {
        // Total should be 100 + 150 + 75 = 325
        expect(screen.getByText('325')).toBeInTheDocument()
        // Active prompts should be 3
        expect(screen.getByText('3')).toBeInTheDocument()
        // Daily average should be 325 / 7 = 46 (rounded)
        expect(screen.getByText('46')).toBeInTheDocument()
      })
    })
  })
})