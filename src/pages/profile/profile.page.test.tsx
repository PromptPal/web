import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProfilePage from './profile.page'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock the graphql function and query
vi.mock('../../gql', () => ({
  graphql: vi.fn(() => 'MOCK_USER_QUERY'),
}))

// Mock useQuery hook from Apollo
vi.mock('@apollo/client')
import * as apolloClient from '@apollo/client'

describe('ProfilePage Component', () => {
  const mockUseQuery = vi.mocked(apolloClient.useQuery)
  const mockUser = {
    id: 1,
    name: 'John Doe',
    addr: '0x1234567890123456789012345678901234567890',
    avatar: 'https://example.com/avatar.jpg',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    lang: 'en',
    level: 5,
    source: 'metamask',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock return value
    mockUseQuery.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    })
  })

  it('displays loading state while fetching user data', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    })

    render(<ProfilePage />)

    // Check for loading skeleton
    const loadingElements = screen.getAllByRole('generic')
    expect(loadingElements.some(el => el.classList.contains('animate-pulse'))).toBe(true)
  })

  it('displays user profile information when data is loaded', () => {
    mockUseQuery.mockReturnValue({
      data: { user: mockUser },
      loading: false,
      error: null,
    })

    render(<ProfilePage />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    // Wallet address appears twice on the page (header and account details)
    const walletAddresses = screen.getAllByText('0x1234567890123456789012345678901234567890')
    expect(walletAddresses).toHaveLength(2)
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
    expect(screen.getByText('+1234567890')).toBeInTheDocument()
    expect(screen.getByText('en')).toBeInTheDocument()
    // Level appears in two places - check for the combined text
    const levelTexts = screen.getAllByText(/Level\s*5/)
    expect(levelTexts).toHaveLength(2)
    // Source and value are in the same element
    expect(screen.getByText(/Source:\s*metamask/)).toBeInTheDocument()
  })

  it('displays user avatar when available', () => {
    mockUseQuery.mockReturnValue({
      data: { user: mockUser },
      loading: false,
      error: null,
    })

    render(<ProfilePage />)

    const avatar = screen.getByAltText('John Doe')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })

  it('displays default user icon when no avatar is available', () => {
    const userWithoutAvatar = { ...mockUser, avatar: null }
    mockUseQuery.mockReturnValue({
      data: { user: userWithoutAvatar },
      loading: false,
      error: null,
    })

    render(<ProfilePage />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    // Should not have an image element
    expect(screen.queryByAltText('John Doe')).not.toBeInTheDocument()
  })

  it('handles missing contact information gracefully', () => {
    const userWithoutContact = {
      ...mockUser,
      email: null,
      phone: null,
    }
    mockUseQuery.mockReturnValue({
      data: { user: userWithoutContact },
      loading: false,
      error: null,
    })

    render(<ProfilePage />)

    // "Not provided" appears for both email and phone when both are null
    const notProvidedTexts = screen.getAllByText('Not provided')
    expect(notProvidedTexts).toHaveLength(2)
  })

  it('displays "Profile not found" when user data is null', () => {
    mockUseQuery.mockReturnValue({
      data: { user: null },
      loading: false,
      error: null,
    })

    render(<ProfilePage />)

    expect(screen.getByText('Profile not found')).toBeInTheDocument()
    expect(screen.getByText('Unable to load user profile information.')).toBeInTheDocument()
  })

  it('renders all profile sections with correct headings', () => {
    mockUseQuery.mockReturnValue({
      data: { user: mockUser },
      loading: false,
      error: null,
    })

    render(<ProfilePage />)

    expect(screen.getByText('Contact Information')).toBeInTheDocument()
    expect(screen.getByText('Preferences')).toBeInTheDocument()
    expect(screen.getByText('Account Details')).toBeInTheDocument()
  })

  it('displays account details correctly', () => {
    mockUseQuery.mockReturnValue({
      data: { user: mockUser },
      loading: false,
      error: null,
    })

    render(<ProfilePage />)

    expect(screen.getByText('User ID')).toBeInTheDocument()
    expect(screen.getByText('#1')).toBeInTheDocument()
    expect(screen.getByText('Wallet Address')).toBeInTheDocument()
    expect(screen.getByText('Registration Source')).toBeInTheDocument()
    expect(screen.getByText('metamask')).toBeInTheDocument() // Raw value, CSS handles capitalization
  })

  it('handles GraphQL error gracefully', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      loading: false,
      error: new Error('Failed to fetch user'),
    })

    render(<ProfilePage />)

    // Should show profile not found when there's an error
    expect(screen.getByText('Profile not found')).toBeInTheDocument()
  })

  describe('accessibility', () => {
    it('has proper heading structure', () => {
      mockUseQuery.mockReturnValue({
        data: { user: mockUser },
        loading: false,
        error: null,
      })

      render(<ProfilePage />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('John Doe')
      expect(screen.getByRole('heading', { level: 3, name: /Contact Information/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 3, name: /Preferences/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 3, name: /Account Details/i })).toBeInTheDocument()
    })

    it('has proper image alt text', () => {
      mockUseQuery.mockReturnValue({
        data: { user: mockUser },
        loading: false,
        error: null,
      })

      render(<ProfilePage />)

      const avatar = screen.getByAltText('John Doe')
      expect(avatar).toBeInTheDocument()
    })

    it('provides meaningful text for empty states', () => {
      mockUseQuery.mockReturnValue({
        data: { user: null },
        loading: false,
        error: null,
      })

      render(<ProfilePage />)

      expect(screen.getByText('Profile not found')).toBeInTheDocument()
      expect(screen.getByText('Unable to load user profile information.')).toBeInTheDocument()
    })
  })

  describe('responsive design', () => {
    it('applies responsive grid classes', () => {
      mockUseQuery.mockReturnValue({
        data: { user: mockUser },
        loading: false,
        error: null,
      })

      render(<ProfilePage />)

      // Find the grid container by testing role or data attributes
      const gridContainer = screen.getByText('Contact Information').closest('div')?.parentElement?.parentElement
      expect(gridContainer).toHaveClass('grid', 'gap-6', 'grid-cols-1', 'lg:grid-cols-2')
    })
  })

  describe('data formatting', () => {
    it('formats wallet address correctly', () => {
      mockUseQuery.mockReturnValue({
        data: { user: mockUser },
        loading: false,
        error: null,
      })

      render(<ProfilePage />)

      const walletAddress = screen.getAllByText('0x1234567890123456789012345678901234567890')[1] // Second occurrence in account details
      expect(walletAddress).toHaveClass('font-mono', 'text-xs', 'break-all')
    })

    it('capitalizes registration source', () => {
      mockUseQuery.mockReturnValue({
        data: { user: mockUser },
        loading: false,
        error: null,
      })

      render(<ProfilePage />)

      // CSS capitalize class handles visual capitalization, but text content remains 'metamask'
      expect(screen.getByText('metamask')).toBeInTheDocument()
      // Verify the element has the capitalize class
      const sourceElement = screen.getByText('metamask')
      expect(sourceElement).toHaveClass('capitalize')
    })
  })
})
