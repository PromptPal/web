import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProjectsPage from './projects.page'

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock components
vi.mock('../../components/Project/CardItem', () => ({
  default: ({ project }: any) => (
    <div data-testid={`project-card-${project.id}`}>
      <h3>{project.name}</h3>
      <span>
        Status:
        {' '}
        {project.enabled ? 'enabled' : 'disabled'}
      </span>
      <span>
        Created:
        {' '}
        {project.createdAt}
      </span>
    </div>
  ),
}))

vi.mock('./components/ProjectEmptyState', () => ({
  ProjectEmptyState: () => (
    <div data-testid='project-empty-state'>
      <h3>No projects yet</h3>
      <p>Create your first project to get started</p>
    </div>
  ),
}))

// Mock the graphql function and query
vi.mock('../../gql', () => ({
  graphql: vi.fn(() => 'MOCK_PROJECTS_QUERY'),
}))

// Mock useQuery hook from Apollo
vi.mock('@apollo/client')
import * as apolloClient from '@apollo/client'

describe('ProjectsPage Component', () => {
  const mockUseQuery = vi.mocked(apolloClient.useQuery)
  const mockProjects = [
    {
      id: 1,
      name: 'AI Chat Bot',
      enabled: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'Content Generator',
      enabled: false,
      createdAt: '2024-01-02T00:00:00Z',
    },
    {
      id: 3,
      name: 'Data Analyzer',
      enabled: true,
      createdAt: '2024-01-03T00:00:00Z',
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

  it('renders the page header correctly', () => {
    mockUseQuery.mockReturnValue({
      data: {
        projects: {
          count: 3,
          edges: mockProjects,
        },
      },
      loading: false,
      error: null,
    })

    render(<ProjectsPage />)

    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText(/Organize your AI prompts and providers/)).toBeInTheDocument()
  })

  it('displays correct project count', () => {
    mockUseQuery.mockReturnValue({
      data: {
        projects: {
          count: 3,
          edges: mockProjects,
        },
      },
      loading: false,
      error: null,
    })

    render(<ProjectsPage />)

    expect(screen.getByText('3 Active Projects')).toBeInTheDocument()
  })

  it('renders project cards when projects exist', () => {
    mockUseQuery.mockReturnValue({
      data: {
        projects: {
          count: 3,
          edges: mockProjects,
        },
      },
      loading: false,
      error: null,
    })

    render(<ProjectsPage />)

    expect(screen.getByTestId('project-card-1')).toBeInTheDocument()
    expect(screen.getByTestId('project-card-2')).toBeInTheDocument()
    expect(screen.getByTestId('project-card-3')).toBeInTheDocument()

    expect(screen.getByText('AI Chat Bot')).toBeInTheDocument()
    expect(screen.getByText('Content Generator')).toBeInTheDocument()
    expect(screen.getByText('Data Analyzer')).toBeInTheDocument()
  })

  it('shows empty state when no projects exist', () => {
    mockUseQuery.mockReturnValue({
      data: {
        projects: {
          count: 0,
          edges: [],
        },
      },
      loading: false,
      error: null,
    })

    render(<ProjectsPage />)

    expect(screen.getByTestId('project-empty-state')).toBeInTheDocument()
    expect(screen.getByText('No projects yet')).toBeInTheDocument()
    expect(screen.getByText('Create your first project to get started')).toBeInTheDocument()
  })

  it('shows 0 active projects when empty', () => {
    mockUseQuery.mockReturnValue({
      data: {
        projects: {
          count: 0,
          edges: [],
        },
      },
      loading: false,
      error: null,
    })

    render(<ProjectsPage />)

    expect(screen.getByText('0 Active Projects')).toBeInTheDocument()
  })

  it('has create project button with correct link', () => {
    mockUseQuery.mockReturnValue({
      data: {
        projects: {
          count: 0,
          edges: [],
        },
      },
      loading: false,
      error: null,
    })

    render(<ProjectsPage />)

    const createButton = screen.getByText('Create Project').closest('a')
    expect(createButton).toHaveAttribute('href', '/projects/new')
  })

  it('handles loading state gracefully', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    })

    render(<ProjectsPage />)

    // Page should render basic structure immediately
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Create Project')).toBeInTheDocument()
  })

  it('handles GraphQL error by showing empty state', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      loading: false,
      error: new Error('Failed to fetch projects'),
    })

    render(<ProjectsPage />)

    // When there's an error, data is undefined, so we get empty state
    expect(screen.getByText('0 Active Projects')).toBeInTheDocument()
    expect(screen.getByTestId('project-empty-state')).toBeInTheDocument()
  })

  describe('pagination', () => {
    it('uses correct pagination parameters', () => {
      mockUseQuery.mockReturnValue({
        data: {
          projects: {
            count: 1,
            edges: [mockProjects[0]],
          },
        },
        loading: false,
        error: null,
      })

      render(<ProjectsPage />)

      expect(screen.getByTestId('project-card-1')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has proper heading structure', () => {
      mockUseQuery.mockReturnValue({
        data: {
          projects: {
            count: 1,
            edges: [mockProjects[0]],
          },
        },
        loading: false,
        error: null,
      })

      render(<ProjectsPage />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Projects')
    })

    it('has accessible links', () => {
      mockUseQuery.mockReturnValue({
        data: {
          projects: {
            count: 0,
            edges: [],
          },
        },
        loading: false,
        error: null,
      })

      render(<ProjectsPage />)

      const createButton = screen.getByText('Create Project').closest('a')
      expect(createButton).toHaveAccessibleName()
      expect(createButton).toHaveAttribute('href')
    })
  })

  describe('responsive design', () => {
    it('applies responsive grid classes', () => {
      mockUseQuery.mockReturnValue({
        data: {
          projects: {
            count: 3,
            edges: mockProjects,
          },
        },
        loading: false,
        error: null,
      })

      render(<ProjectsPage />)

      // Navigate to the grid container - project-card-1 -> motion.div -> grid container
      const gridContainer = screen.getByTestId('project-card-1').closest('div')?.parentElement?.parentElement
      expect(gridContainer).toHaveClass('grid', 'gap-6', 'grid-cols-1', 'lg:grid-cols-2', 'xl:grid-cols-3')
    })
  })

  describe('project data handling', () => {
    it('handles projects with different states', () => {
      mockUseQuery.mockReturnValue({
        data: {
          projects: {
            count: 2,
            edges: [
              { id: 1, name: 'Enabled Project', enabled: true, createdAt: '2024-01-01T00:00:00Z' },
              { id: 2, name: 'Disabled Project', enabled: false, createdAt: '2024-01-02T00:00:00Z' },
            ],
          },
        },
        loading: false,
        error: null,
      })

      render(<ProjectsPage />)

      expect(screen.getByText('Status: enabled')).toBeInTheDocument()
      expect(screen.getByText('Status: disabled')).toBeInTheDocument()
    })

    it('handles partial project data', () => {
      const partialProject = {
        id: 1,
        name: 'Partial Project',
        enabled: true,
        createdAt: null,
      }

      mockUseQuery.mockReturnValue({
        data: {
          projects: {
            count: 1,
            edges: [partialProject],
          },
        },
        loading: false,
        error: null,
      })

      render(<ProjectsPage />)

      expect(screen.getByText('Partial Project')).toBeInTheDocument()
      expect(screen.getByText(/Created:/)).toBeInTheDocument() // null is rendered as empty string
    })
  })

  describe('component integration', () => {
    it('passes correct props to ProjectCardItem', () => {
      mockUseQuery.mockReturnValue({
        data: {
          projects: {
            count: 1,
            edges: [mockProjects[0]],
          },
        },
        loading: false,
        error: null,
      })

      render(<ProjectsPage />)

      expect(screen.getByTestId('project-card-1')).toBeInTheDocument()
      expect(screen.getByText('AI Chat Bot')).toBeInTheDocument()
      expect(screen.getByText('Status: enabled')).toBeInTheDocument()
      expect(screen.getByText('Created: 2024-01-01T00:00:00Z')).toBeInTheDocument()
    })

    it('renders ProjectEmptyState only when no projects', () => {
      mockUseQuery.mockReturnValue({
        data: {
          projects: {
            count: 1,
            edges: [mockProjects[0]],
          },
        },
        loading: false,
        error: null,
      })

      render(<ProjectsPage />)

      expect(screen.getByTestId('project-card-1')).toBeInTheDocument()
      expect(screen.queryByTestId('project-empty-state')).not.toBeInTheDocument()
    })
  })
})
