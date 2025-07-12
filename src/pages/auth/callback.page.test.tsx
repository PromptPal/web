import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AuthSSOCallbackPage from './callback.page'

// Mock TanStack Router - using factory function to avoid hoisting issues
vi.mock('@tanstack/react-router')

import * as ReactRouter from '@tanstack/react-router'

// Mock jotai
const mockSetToken = vi.fn()
vi.mock('jotai', () => ({
  useAtom: vi.fn(() => [null, mockSetToken]),
}))

// Mock the tokenAtom
vi.mock('../../stats/profile', () => ({
  tokenAtom: { init: null },
}))

describe('AuthSSOCallbackPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Set default mock return value
    vi.mocked(ReactRouter.useSearch).mockReturnValue({ token: undefined } as any)
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
      vi.mocked(ReactRouter.useSearch).mockReturnValue({ token: 'test-auth-token' } as any)
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
      vi.mocked(ReactRouter.useSearch).mockReturnValue({ token: '' } as any)
      render(<AuthSSOCallbackPage />)

      expect(mockSetToken).not.toHaveBeenCalled()
    })

    it('handles JWT-like token', () => {
      const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      vi.mocked(ReactRouter.useSearch).mockReturnValue({ token: jwtToken } as any)

      render(<AuthSSOCallbackPage />)

      expect(mockSetToken).toHaveBeenCalledWith(jwtToken)
    })

    it('handles simple string token', () => {
      vi.mocked(ReactRouter.useSearch).mockReturnValue({ token: 'simple-token-123' } as any)

      render(<AuthSSOCallbackPage />)

      expect(mockSetToken).toHaveBeenCalledWith('simple-token-123')
    })
  })

  describe('search params handling', () => {
    it('uses strict: false for search params', () => {
      render(<AuthSSOCallbackPage />)

      expect(vi.mocked(ReactRouter.useSearch)).toHaveBeenCalledWith({ strict: false })
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
      vi.mocked(ReactRouter.useSearch).mockReturnValueOnce({} as any)

      render(<AuthSSOCallbackPage />)

      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(mockSetToken).not.toHaveBeenCalled()
    })

    it('handles null search params', () => {
      vi.mocked(ReactRouter.useSearch).mockReturnValueOnce({} as any)

      render(<AuthSSOCallbackPage />)

      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(mockSetToken).not.toHaveBeenCalled()
    })
  })

  describe('component lifecycle', () => {
    it('sets token in useEffect when token changes', () => {
      // First render with no token
      vi.mocked(ReactRouter.useSearch).mockReturnValue({ token: undefined } as any)
      const { rerender } = render(<AuthSSOCallbackPage />)

      // Initially no token should not call setToken
      expect(mockSetToken).not.toHaveBeenCalled()

      // Update mock to return a token
      vi.mocked(ReactRouter.useSearch).mockReturnValue({ token: 'new-token' } as any)

      rerender(<AuthSSOCallbackPage />)

      expect(mockSetToken).toHaveBeenCalledWith('new-token')
    })
  })
})
