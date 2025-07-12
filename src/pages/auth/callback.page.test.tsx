import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils/test-utils'
import AuthSSOCallbackPage from './callback.page'

// Mock TanStack Router
const mockSearch = { token: undefined }
vi.mock('@tanstack/react-router', () => ({
  useSearch: vi.fn(() => mockSearch)
}))

// Mock jotai
const mockSetToken = vi.fn()
vi.mock('jotai', () => ({
  useAtom: vi.fn(() => [null, mockSetToken])
}))

// Mock the tokenAtom
vi.mock('../../stats/profile', () => ({
  tokenAtom: { init: null }
}))

describe('AuthSSOCallbackPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSearch.token = undefined
  })

  it('renders loading message', () => {
    render(<AuthSSOCallbackPage />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('does not set token when no token in search params', () => {
    render(<AuthSSOCallbackPage />)

    expect(mockSetToken).not.toHaveBeenCalled()
  })

  describe('when token is present in search params', () => {
    beforeEach(() => {
      mockSearch.token = 'test-auth-token'
    })

    it('sets the token when token is present in search params', () => {
      render(<AuthSSOCallbackPage />)

      expect(mockSetToken).toHaveBeenCalledWith('test-auth-token')
    })

    it('still renders loading message while processing', () => {
      render(<AuthSSOCallbackPage />)

      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })

  describe('with different token values', () => {
    it('handles empty string token', () => {
      mockSearch.token = ''
      render(<AuthSSOCallbackPage />)

      expect(mockSetToken).not.toHaveBeenCalled()
    })

    it('handles JWT-like token', () => {
      const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      mockSearch.token = jwtToken
      
      render(<AuthSSOCallbackPage />)

      expect(mockSetToken).toHaveBeenCalledWith(jwtToken)
    })

    it('handles simple string token', () => {
      mockSearch.token = 'simple-token-123'
      
      render(<AuthSSOCallbackPage />)

      expect(mockSetToken).toHaveBeenCalledWith('simple-token-123')
    })
  })

  describe('search params handling', () => {
    it('uses strict: false for search params', () => {
      render(<AuthSSOCallbackPage />)

      expect(vi.mocked(require('@tanstack/react-router').useSearch)).toHaveBeenCalledWith({ strict: false })
    })
  })

  describe('accessibility', () => {
    it('has proper text content for screen readers', () => {
      render(<AuthSSOCallbackPage />)

      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('applies proper layout classes for centering', () => {
      render(<AuthSSOCallbackPage />)

      const loadingElement = screen.getByText('Loading...').closest('div')
      expect(loadingElement).toHaveClass('flex', 'justify-center', 'items-center', 'h-full')
    })
  })

  describe('error scenarios', () => {
    it('handles missing search params gracefully', () => {
      const mockUseSearch = vi.mocked(require('@tanstack/react-router').useSearch)
      mockUseSearch.mockReturnValueOnce({})
      
      render(<AuthSSOCallbackPage />)

      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(mockSetToken).not.toHaveBeenCalled()
    })

    it('handles null search params', () => {
      const mockUseSearch = vi.mocked(require('@tanstack/react-router').useSearch)
      mockUseSearch.mockReturnValueOnce(null)
      
      render(<AuthSSOCallbackPage />)

      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(mockSetToken).not.toHaveBeenCalled()
    })
  })

  describe('component lifecycle', () => {
    it('sets token in useEffect when token changes', () => {
      // First render with no token
      mockSearch.token = undefined
      const { rerender } = render(<AuthSSOCallbackPage />)
      
      // Initially no token should not call setToken
      expect(mockSetToken).not.toHaveBeenCalled()
      
      // Update mock to return a token
      mockSearch.token = 'new-token'
      const mockUseSearch = vi.mocked(require('@tanstack/react-router').useSearch)
      mockUseSearch.mockReturnValueOnce({ token: 'new-token' })
      
      rerender(<AuthSSOCallbackPage />)
      
      expect(mockSetToken).toHaveBeenCalledWith('new-token')
    })
  })
})