import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils/test-utils'
import LandingPage from './Landing'

// Mock the tokenAtom to control authentication state
vi.mock('../../stats/profile', () => ({
  tokenAtom: { init: null }
}))

// Mock jotai
vi.mock('jotai', () => ({
  useAtomValue: vi.fn(() => null) // Return null to simulate unauthenticated state
}))

// Mock TanStack Router
const mockNavigate = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  Navigate: ({ to }: any) => {
    mockNavigate(to)
    return <div data-testid="navigate" data-to={to}>Navigating...</div>
  }
}))

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>
  }
}))

// Mock Button component
vi.mock('../../components/Button/Button', () => ({
  Button: ({ children, variant, className, ...props }: any) => (
    <button className={`${variant} ${className}`} {...props}>
      {children}
    </button>
  )
}))

describe('LandingPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    const mockUseAtomValue = vi.mocked(require('jotai').useAtomValue)
    mockUseAtomValue.mockReturnValue(null) // Reset to unauthenticated state
  })

  it('renders the main hero section with correct content', () => {
    render(<LandingPage />)

    expect(screen.getByText('PromptPal')).toBeInTheDocument()
    expect(screen.getByText(/Your AI-powered companion for managing prompts/)).toBeInTheDocument()
  })

  it('displays call-to-action buttons', () => {
    render(<LandingPage />)

    expect(screen.getByText('Get Started')).toBeInTheDocument()
    expect(screen.getByText('View Demo')).toBeInTheDocument()
  })

  it('renders features section with all features', () => {
    render(<LandingPage />)

    expect(screen.getByText('Powerful Features')).toBeInTheDocument()
    expect(screen.getByText('Smart Prompt Management')).toBeInTheDocument()
    expect(screen.getByText('Multi-Provider Support')).toBeInTheDocument()
    expect(screen.getByText('Secure & Private')).toBeInTheDocument()
    expect(screen.getByText('Project Organization')).toBeInTheDocument()
    expect(screen.getByText('Lightning Fast')).toBeInTheDocument()
    expect(screen.getByText('Developer Friendly')).toBeInTheDocument()
  })

  it('displays stats section with correct statistics', () => {
    render(<LandingPage />)

    expect(screen.getByText('10K+')).toBeInTheDocument()
    expect(screen.getByText('Active Users')).toBeInTheDocument()
    expect(screen.getByText('50K+')).toBeInTheDocument()
    expect(screen.getByText('Prompts Created')).toBeInTheDocument()
    expect(screen.getByText('99.9%')).toBeInTheDocument()
    expect(screen.getByText('Uptime')).toBeInTheDocument()
    expect(screen.getByText('24/7')).toBeInTheDocument()
    expect(screen.getByText('Support')).toBeInTheDocument()
  })

  it('renders final CTA section', () => {
    render(<LandingPage />)

    expect(screen.getByText(/Ready to elevate your AI workflow/)).toBeInTheDocument()
    expect(screen.getByText(/Join thousands of developers/)).toBeInTheDocument()
    expect(screen.getByText('Start Building Today')).toBeInTheDocument()
  })

  it('has correct links pointing to /auth', () => {
    render(<LandingPage />)

    const authLinks = screen.getAllByRole('link')
    authLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '/auth')
    })
  })

  describe('when user is authenticated', () => {
    beforeEach(() => {
      // Mock authenticated state
      const mockUseAtomValue = vi.mocked(require('jotai').useAtomValue)
      mockUseAtomValue.mockReturnValue('mock-token')
    })

    it('redirects to projects page when user has token', () => {
      render(<LandingPage />)

      expect(screen.getByTestId('navigate')).toBeInTheDocument()
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/projects')
    })

    it('does not render landing content when authenticated', () => {
      render(<LandingPage />)

      expect(screen.queryByText('PromptPal')).not.toBeInTheDocument()
      expect(screen.queryByText('Get Started')).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has proper heading structure', () => {
      render(<LandingPage />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('PromptPal')
      expect(screen.getByRole('heading', { level: 2, name: /Powerful Features/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2, name: /Ready to elevate/i })).toBeInTheDocument()
    })

    it('has accessible buttons with proper text', () => {
      render(<LandingPage />)

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
      
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName()
      })
    })

    it('has accessible links', () => {
      render(<LandingPage />)

      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)
      
      links.forEach(link => {
        expect(link).toHaveAccessibleName()
        expect(link).toHaveAttribute('href')
      })
    })
  })

  describe('responsive design elements', () => {
    it('applies responsive classes correctly', () => {
      render(<LandingPage />)

      // Check that responsive classes are applied (these are in the DOM structure)
      const heroText = screen.getByText('PromptPal')
      expect(heroText.closest('h1')).toHaveClass('text-5xl', 'md:text-7xl')
    })
  })
})