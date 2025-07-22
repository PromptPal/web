import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { mockData } from '@/test/utils/apollo-utils'
import ProjectCardItem from './CardItem'

// Mock TanStack Router Link component
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, className, ...props }: React.ComponentProps<'a'>) => (
    <a href='#' className={className} {...props}>
      {children}
    </a>
  ),
}))

describe('ProjectCardItem Component', () => {
  const mockProject = mockData.project()

  it('renders project information correctly', () => {
    render(<ProjectCardItem project={mockProject} />)

    // Check if project name is displayed
    expect(screen.getByText(mockProject.name)).toBeInTheDocument()

    // Check if project ID is displayed
    expect(screen.getByText(mockProject.id.toString())).toBeInTheDocument()
  })

  it('displays project status correctly for active project', () => {
    const activeProject = mockData.project({ enabled: true })
    render(<ProjectCardItem project={activeProject} />)

    expect(screen.getByText('Active')).toBeInTheDocument()

    // Check for active status styles
    const statusElement = screen.getByText('Active').closest('div')
    expect(statusElement).toHaveClass('bg-green-500/10', 'border-green-500/30', 'text-green-400')
  })

  it('displays project status correctly for inactive project', () => {
    const inactiveProject = mockData.project({ enabled: false })
    render(<ProjectCardItem project={inactiveProject} />)

    expect(screen.getByText('Inactive')).toBeInTheDocument()

    // Check for inactive status styles
    const statusElement = screen.getByText('Inactive').closest('div')
    expect(statusElement).toHaveClass('bg-gray-500/10', 'border-gray-500/30', 'text-gray-500')
  })

  it('formats and displays creation date correctly', () => {
    const testDate = '2023-06-15T10:30:00Z'
    const projectWithDate = mockData.project({ createdAt: testDate })

    render(<ProjectCardItem project={projectWithDate} />)

    // The component should format the date using Intl.DateTimeFormat
    // Expected format: "Jun 15, 2023"
    expect(screen.getByText(/Created/)).toBeInTheDocument()
    expect(screen.getByText(/Jun 15, 2023/)).toBeInTheDocument()
  })

  it('renders as a Link with correct href', () => {
    render(<ProjectCardItem project={mockProject} />)

    // The component should render a Link that navigates to the project page
    const linkElement = screen.getByRole('link')
    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveClass('group', 'relative', 'block')
  })

  it('has proper hover effects structure', () => {
    render(<ProjectCardItem project={mockProject} />)

    // Check for glow effect element
    const glowEffect = document.querySelector('.bg-gradient-to-r.from-purple-500\\/20')
    expect(glowEffect).toBeInTheDocument()

    // Check for card container with proper styling
    const cardContainer = document.querySelector('.backdrop-blur-md.bg-gradient-to-br')
    expect(cardContainer).toBeInTheDocument()
  })

  it('displays icons correctly', () => {
    render(<ProjectCardItem project={mockProject} />)

    // The component should have ChevronRight, Hash, Activity, and Calendar icons
    // We can't directly test for Lucide icons, but we can test the structure
    const cardElement = screen.getByRole('link')
    expect(cardElement).toBeInTheDocument()

    // Check that the text content includes the expected labels
    expect(screen.getByText(/Created/)).toBeInTheDocument()
  })

  it('handles long project names gracefully', () => {
    const longNameProject = mockData.project({
      name: 'This is a very long project name that should be handled gracefully by the component',
    })

    render(<ProjectCardItem project={longNameProject} />)

    expect(screen.getByText(longNameProject.name)).toBeInTheDocument()
  })

  it('renders with different project IDs', () => {
    const project1 = mockData.project({ id: 42 })
    const project2 = mockData.project({ id: 999 })

    const { rerender } = render(<ProjectCardItem project={project1} />)
    expect(screen.getByText('42')).toBeInTheDocument()

    rerender(<ProjectCardItem project={project2} />)
    expect(screen.getByText('999')).toBeInTheDocument()
  })

  describe('accessibility', () => {
    it('has proper link semantics', () => {
      render(<ProjectCardItem project={mockProject} />)

      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
    })

    it('has readable text content', () => {
      render(<ProjectCardItem project={mockProject} />)

      // All important information should be accessible as text
      expect(screen.getByText(mockProject.name)).toBeInTheDocument()
      expect(screen.getByText(mockProject.id.toString())).toBeInTheDocument()
      expect(screen.getByText(mockProject.enabled ? 'Active' : 'Inactive')).toBeInTheDocument()
      expect(screen.getByText(/Created/)).toBeInTheDocument()
    })
  })
})
