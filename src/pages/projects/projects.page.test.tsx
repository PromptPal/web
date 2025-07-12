import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/utils/test-utils'
import { createGraphQLMock } from '@/test/utils/apollo-utils'
import ProjectsPage from './projects.page'

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  )
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}))

// Mock components
vi.mock('../../components/Project/CardItem', () => ({
  default: ({ project }: any) => (
    <div data-testid={`project-card-${project.id}`}>
      <h3>{project.name}</h3>
      <span>Status: {project.enabled ? 'enabled' : 'disabled'}</span>
      <span>Created: {project.createdAt}</span>
    </div>
  )
}))

vi.mock('./components/ProjectEmptyState', () => ({
  ProjectEmptyState: () => (
    <div data-testid="project-empty-state">
      <h3>No projects yet</h3>
      <p>Create your first project to get started</p>
    </div>
  )
}))

// Mock the graphql function and query
vi.mock('../../gql', () => ({
  graphql: vi.fn(() => 'MOCK_PROJECTS_QUERY')
}))

// Mock the GraphQL query
const PROJECTS_QUERY = 'MOCK_PROJECTS_QUERY'

describe('ProjectsPage Component', () => {
  const mockProjects = [
    {
      id: 1,
      name: 'AI Chat Bot',
      enabled: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'Content Generator',
      enabled: false,
      createdAt: '2024-01-02T00:00:00Z'
    },
    {
      id: 3,
      name: 'Data Analyzer',
      enabled: true,
      createdAt: '2024-01-03T00:00:00Z'
    }
  ]

  it('renders the page header correctly', async () => {
    const mocks = [
      createGraphQLMock(
        PROJECTS_QUERY,
        { pagination: { limit: 100, offset: 0 } },
        {
          projects: {
            count: 3,
            edges: mockProjects
          }
        }
      )
    ]

    render(<ProjectsPage />, { mocks })

    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText(/Organize your AI prompts and providers/)).toBeInTheDocument()
  })

  it('displays correct project count', async () => {
    const mocks = [
      createGraphQLMock(
        PROJECTS_QUERY,
        { pagination: { limit: 100, offset: 0 } },
        {
          projects: {
            count: 3,
            edges: mockProjects
          }
        }
      )
    ]

    render(<ProjectsPage />, { mocks })

    await waitFor(() => {
      expect(screen.getByText('3 Active Projects')).toBeInTheDocument()
    })
  })

  it('renders project cards when projects exist', async () => {
    const mocks = [
      createGraphQLMock(
        PROJECTS_QUERY,
        { pagination: { limit: 100, offset: 0 } },
        {
          projects: {
            count: 3,
            edges: mockProjects
          }
        }
      )
    ]

    render(<ProjectsPage />, { mocks })

    await waitFor(() => {
      expect(screen.getByTestId('project-card-1')).toBeInTheDocument()
      expect(screen.getByTestId('project-card-2')).toBeInTheDocument()
      expect(screen.getByTestId('project-card-3')).toBeInTheDocument()
    })

    expect(screen.getByText('AI Chat Bot')).toBeInTheDocument()
    expect(screen.getByText('Content Generator')).toBeInTheDocument()
    expect(screen.getByText('Data Analyzer')).toBeInTheDocument()
  })

  it('shows empty state when no projects exist', async () => {
    const mocks = [
      createGraphQLMock(
        PROJECTS_QUERY,
        { pagination: { limit: 100, offset: 0 } },
        {
          projects: {
            count: 0,
            edges: []
          }
        }
      )
    ]

    render(<ProjectsPage />, { mocks })

    await waitFor(() => {
      expect(screen.getByTestId('project-empty-state')).toBeInTheDocument()
      expect(screen.getByText('No projects yet')).toBeInTheDocument()
      expect(screen.getByText('Create your first project to get started')).toBeInTheDocument()
    })
  })

  it('shows 0 active projects when empty', async () => {
    const mocks = [
      createGraphQLMock(
        PROJECTS_QUERY,
        { pagination: { limit: 100, offset: 0 } },
        {
          projects: {
            count: 0,
            edges: []
          }
        }
      )
    ]

    render(<ProjectsPage />, { mocks })

    await waitFor(() => {
      expect(screen.getByText('0 Active Projects')).toBeInTheDocument()
    })
  })

  it('has create project button with correct link', () => {
    const mocks = [
      createGraphQLMock(
        PROJECTS_QUERY,
        { pagination: { limit: 100, offset: 0 } },
        {
          projects: {
            count: 0,
            edges: []
          }
        }
      )
    ]

    render(<ProjectsPage />, { mocks })

    const createButton = screen.getByText('Create Project').closest('a')
    expect(createButton).toHaveAttribute('href', '/projects/new')
  })

  it('handles loading state gracefully', () => {
    const mocks = [
      createGraphQLMock(
        PROJECTS_QUERY,
        { pagination: { limit: 100, offset: 0 } },
        {
          projects: {
            count: 0,
            edges: []
          }
        }
      )
    ]

    render(<ProjectsPage />, { mocks })

    // Page should render basic structure immediately
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Create Project')).toBeInTheDocument()
  })

  it('handles GraphQL error by showing empty state', async () => {
    const mocks = [
      createGraphQLMock(
        PROJECTS_QUERY,
        { pagination: { limit: 100, offset: 0 } },
        null,
        'Failed to fetch projects'
      )
    ]

    render(<ProjectsPage />, { mocks })

    await waitFor(() => {
      // When there's an error, data is undefined, so we get empty state
      expect(screen.getByText('0 Active Projects')).toBeInTheDocument()
      expect(screen.getByTestId('project-empty-state')).toBeInTheDocument()
    })
  })

  describe('pagination', () => {
    it('uses correct pagination parameters', async () => {
      const mocks = [
        createGraphQLMock(
          PROJECTS_QUERY,
          { pagination: { limit: 100, offset: 0 } },
          {
            projects: {
              count: 1,
              edges: [mockProjects[0]]
            }
          }
        )
      ]

      render(<ProjectsPage />, { mocks })

      await waitFor(() => {
        expect(screen.getByTestId('project-card-1')).toBeInTheDocument()
      })
    })
  })

  describe('accessibility', () => {
    it('has proper heading structure', async () => {
      const mocks = [
        createGraphQLMock(
          PROJECTS_QUERY,
          { pagination: { limit: 100, offset: 0 } },
          {
            projects: {
              count: 1,
              edges: [mockProjects[0]]
            }
          }
        )
      ]

      render(<ProjectsPage />, { mocks })

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Projects')
    })

    it('has accessible links', () => {
      const mocks = [
        createGraphQLMock(
          PROJECTS_QUERY,
          { pagination: { limit: 100, offset: 0 } },
          {
            projects: {
              count: 0,
              edges: []
            }
          }
        )
      ]

      render(<ProjectsPage />, { mocks })

      const createButton = screen.getByText('Create Project').closest('a')
      expect(createButton).toHaveAccessibleName()
      expect(createButton).toHaveAttribute('href')
    })
  })

  describe('responsive design', () => {
    it('applies responsive grid classes', async () => {
      const mocks = [
        createGraphQLMock(
          PROJECTS_QUERY,
          { pagination: { limit: 100, offset: 0 } },
          {
            projects: {
              count: 3,
              edges: mockProjects
            }
          }
        )
      ]

      render(<ProjectsPage />, { mocks })

      await waitFor(() => {
        const gridContainer = screen.getByTestId('project-card-1').closest('div')?.parentElement
        expect(gridContainer).toHaveClass('grid', 'gap-6', 'grid-cols-1', 'lg:grid-cols-2', 'xl:grid-cols-3')
      })
    })
  })

  describe('project data handling', () => {
    it('handles projects with different states', async () => {
      const mocks = [
        createGraphQLMock(
          PROJECTS_QUERY,
          { pagination: { limit: 100, offset: 0 } },
          {
            projects: {
              count: 2,
              edges: [
                { id: 1, name: 'Enabled Project', enabled: true, createdAt: '2024-01-01T00:00:00Z' },
                { id: 2, name: 'Disabled Project', enabled: false, createdAt: '2024-01-02T00:00:00Z' }
              ]
            }
          }
        )
      ]

      render(<ProjectsPage />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('Status: enabled')).toBeInTheDocument()
        expect(screen.getByText('Status: disabled')).toBeInTheDocument()
      })
    })

    it('handles partial project data', async () => {
      const partialProject = {
        id: 1,
        name: 'Partial Project',
        enabled: true,
        createdAt: null
      }

      const mocks = [
        createGraphQLMock(
          PROJECTS_QUERY,
          { pagination: { limit: 100, offset: 0 } },
          {
            projects: {
              count: 1,
              edges: [partialProject]
            }
          }
        )
      ]

      render(<ProjectsPage />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('Partial Project')).toBeInTheDocument()
        expect(screen.getByText('Created: ')).toBeInTheDocument() // null is rendered as empty string
      })
    })
  })

  describe('component integration', () => {
    it('passes correct props to ProjectCardItem', async () => {
      const mocks = [
        createGraphQLMock(
          PROJECTS_QUERY,
          { pagination: { limit: 100, offset: 0 } },
          {
            projects: {
              count: 1,
              edges: [mockProjects[0]]
            }
          }
        )
      ]

      render(<ProjectsPage />, { mocks })

      await waitFor(() => {
        expect(screen.getByTestId('project-card-1')).toBeInTheDocument()
        expect(screen.getByText('AI Chat Bot')).toBeInTheDocument()
        expect(screen.getByText('Status: enabled')).toBeInTheDocument()
        expect(screen.getByText('Created: 2024-01-01T00:00:00Z')).toBeInTheDocument()
      })
    })

    it('renders ProjectEmptyState only when no projects', async () => {
      const mocks = [
        createGraphQLMock(
          PROJECTS_QUERY,
          { pagination: { limit: 100, offset: 0 } },
          {
            projects: {
              count: 1,
              edges: [mockProjects[0]]
            }
          }
        )
      ]

      render(<ProjectsPage />, { mocks })

      await waitFor(() => {
        expect(screen.getByTestId('project-card-1')).toBeInTheDocument()
        expect(screen.queryByTestId('project-empty-state')).not.toBeInTheDocument()
      })
    })
  })
})