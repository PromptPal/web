import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AuthorizePage from './authorize.page'

// Mock the lazy-loaded component
vi.mock('@/components/Header/login-container', () => ({
  default: ({ buttonText }: { buttonText: string }) => (
    <button data-testid='metamask-login'>{buttonText}</button>
  ),
}))

// Mock React.lazy
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    lazy: (fn: any) => {
      const Component = vi.fn(({ buttonText }: { buttonText: string }) => (
        <button data-testid='metamask-login'>{buttonText}</button>
      ))
      Component.displayName = 'MockLoginButtonContainer'
      return Component
    },
  }
})

// Mock TanStack Query
const mockSSOSettings = {
  enableSsoGoogle: false,
}

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: mockSSOSettings,
    isLoading: false,
    error: null,
  })),
}))

// Mock auto-animate
vi.mock('@formkit/auto-animate/react', () => ({
  useAutoAnimate: () => [null],
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
}))

// Mock constants
vi.mock('../../constants', () => ({
  HTTP_ENDPOINT: 'http://localhost:7788',
}))

// Mock SSO service
vi.mock('../../service/sso', () => ({
  fetchSSOSettings: vi.fn(() => Promise.resolve({ enableSsoGoogle: false })),
}))

describe('AuthorizePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the main authorization page content', () => {
    render(<AuthorizePage />)

    expect(screen.getByText('Welcome to PromptPal')).toBeInTheDocument()
    expect(screen.getByText(/Sign in to access your AI prompts/)).toBeInTheDocument()
    expect(screen.getByText(/Secure authentication powered by blockchain/)).toBeInTheDocument()
  })

  it('displays the MetaMask login button', () => {
    render(<AuthorizePage />)

    expect(screen.getByTestId('metamask-login')).toBeInTheDocument()
    expect(screen.getByText('Connect with Metamask')).toBeInTheDocument()
  })

  it('does not show Google SSO button when disabled', () => {
    render(<AuthorizePage />)

    expect(screen.queryByText('Continue with Google')).not.toBeInTheDocument()
  })

  describe('when Google SSO is enabled', () => {
    beforeEach(() => {
      const mockUseQuery = vi.mocked(require('@tanstack/react-query').useQuery)
      mockUseQuery.mockReturnValue({
        data: { enableSsoGoogle: true },
        isLoading: false,
        error: null,
      })
    })

    it('shows Google SSO button when enabled', () => {
      render(<AuthorizePage />)

      expect(screen.getByText('Continue with Google')).toBeInTheDocument()
    })

    it('Google SSO button has correct attributes', () => {
      render(<AuthorizePage />)

      const googleButton = screen.getByText('Continue with Google').closest('a')
      expect(googleButton).toHaveAttribute('href', 'http://localhost:7788/api/v1/sso/login/google')
      expect(googleButton).toHaveAttribute('target', '_blank')
      expect(googleButton).toHaveAttribute('rel', 'noreferrer')
    })
  })

  describe('loading state', () => {
    beforeEach(() => {
      const mockUseQuery = vi.mocked(require('@tanstack/react-query').useQuery)
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      })
    })

    it('renders without SSO settings during loading', () => {
      render(<AuthorizePage />)

      expect(screen.getByText('Welcome to PromptPal')).toBeInTheDocument()
      expect(screen.getByTestId('metamask-login')).toBeInTheDocument()
      expect(screen.queryByText('Continue with Google')).not.toBeInTheDocument()
    })
  })

  describe('error state', () => {
    beforeEach(() => {
      const mockUseQuery = vi.mocked(require('@tanstack/react-query').useQuery)
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Failed to fetch settings'),
      })
    })

    it('renders basic auth options when settings fail to load', () => {
      render(<AuthorizePage />)

      expect(screen.getByText('Welcome to PromptPal')).toBeInTheDocument()
      expect(screen.getByTestId('metamask-login')).toBeInTheDocument()
      expect(screen.queryByText('Continue with Google')).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has proper heading structure', () => {
      render(<AuthorizePage />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Welcome to PromptPal')
    })

    it('has accessible buttons', () => {
      render(<AuthorizePage />)

      const metamaskButton = screen.getByTestId('metamask-login')
      expect(metamaskButton).toBeInTheDocument()
      expect(metamaskButton).toHaveAccessibleName()
    })

    it('has proper links with accessible names when Google SSO is enabled', () => {
      const mockUseQuery = vi.mocked(require('@tanstack/react-query').useQuery)
      mockUseQuery.mockReturnValue({
        data: { enableSsoGoogle: true },
        isLoading: false,
        error: null,
      })

      render(<AuthorizePage />)

      const googleLink = screen.getByText('Continue with Google').closest('a')
      expect(googleLink).toHaveAccessibleName()
      expect(googleLink).toHaveAttribute('href')
    })

    it('has proper ARIA attributes for icons', () => {
      render(<AuthorizePage />)

      // SVG icons should have aria-hidden="true" - check for SVG instead of role img
      const svgIcons = document.querySelectorAll('svg[aria-hidden="true"]')
      expect(svgIcons.length).toBeGreaterThan(0)
    })
  })

  describe('responsive design', () => {
    it('applies responsive classes correctly', () => {
      render(<AuthorizePage />)

      const container = screen.getByText('Welcome to PromptPal').closest('div')
      expect(container?.parentElement?.parentElement).toHaveClass('max-w-lg')
    })
  })

  describe('security considerations', () => {
    it('Google SSO link has proper security attributes', () => {
      const mockUseQuery = vi.mocked(require('@tanstack/react-query').useQuery)
      mockUseQuery.mockReturnValue({
        data: { enableSsoGoogle: true },
        isLoading: false,
        error: null,
      })

      render(<AuthorizePage />)

      const googleLink = screen.getByText('Continue with Google').closest('a')
      expect(googleLink).toHaveAttribute('referrerPolicy', 'no-referrer')
      expect(googleLink).toHaveAttribute('rel', 'noreferrer')
    })
  })
})
