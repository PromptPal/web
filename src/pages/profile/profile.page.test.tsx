import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/utils/test-utils'
import { createGraphQLMock } from '@/test/utils/apollo-utils'
import ProfilePage from './profile.page'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}))

// Mock the graphql function and query
vi.mock('../../gql', () => ({
  graphql: vi.fn(() => 'MOCK_USER_QUERY')
}))

// Mock the GraphQL query
const USER_QUERY = 'MOCK_USER_QUERY'

describe('ProfilePage Component', () => {
  const mockUser = {
    id: 1,
    name: 'John Doe',
    addr: '0x1234567890123456789012345678901234567890',
    avatar: 'https://example.com/avatar.jpg',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    lang: 'en',
    level: 5,
    source: 'metamask'
  }

  it('displays loading state while fetching user data', () => {
    const mocks = [
      createGraphQLMock(
        USER_QUERY,
        { id: undefined },
        null,
        'Loading...'
      )
    ]

    render(<ProfilePage />, { mocks })

    // Check for loading skeleton
    const loadingElements = screen.getAllByRole('generic')
    expect(loadingElements.some(el => el.classList.contains('animate-pulse'))).toBe(true)
  })

  it('displays user profile information when data is loaded', async () => {
    const mocks = [
      createGraphQLMock(
        USER_QUERY,
        { id: undefined },
        { user: mockUser }
      )
    ]

    render(<ProfilePage />, { mocks })

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('0x1234567890123456789012345678901234567890')).toBeInTheDocument()
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
      expect(screen.getByText('+1234567890')).toBeInTheDocument()
      expect(screen.getByText('en')).toBeInTheDocument()
      expect(screen.getByText('Level 5')).toBeInTheDocument()
      expect(screen.getByText('Source: metamask')).toBeInTheDocument()
    })
  })

  it('displays user avatar when available', async () => {
    const mocks = [
      createGraphQLMock(
        USER_QUERY,
        { id: undefined },
        { user: mockUser }
      )
    ]

    render(<ProfilePage />, { mocks })

    await waitFor(() => {
      const avatar = screen.getByAltText('John Doe')
      expect(avatar).toBeInTheDocument()
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg')
    })
  })

  it('displays default user icon when no avatar is available', async () => {
    const userWithoutAvatar = { ...mockUser, avatar: null }
    const mocks = [
      createGraphQLMock(
        USER_QUERY,
        { id: undefined },
        { user: userWithoutAvatar }
      )
    ]

    render(<ProfilePage />, { mocks })

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      // Should not have an image element
      expect(screen.queryByAltText('John Doe')).not.toBeInTheDocument()
    })
  })

  it('handles missing contact information gracefully', async () => {
    const userWithoutContact = {
      ...mockUser,
      email: null,
      phone: null
    }
    const mocks = [
      createGraphQLMock(
        USER_QUERY,
        { id: undefined },
        { user: userWithoutContact }
      )
    ]

    render(<ProfilePage />, { mocks })

    await waitFor(() => {
      expect(screen.getByText('Not provided')).toBeInTheDocument()
    })
  })

  it('displays "Profile not found" when user data is null', async () => {
    const mocks = [
      createGraphQLMock(
        USER_QUERY,
        { id: undefined },
        { user: null }
      )
    ]

    render(<ProfilePage />, { mocks })

    await waitFor(() => {
      expect(screen.getByText('Profile not found')).toBeInTheDocument()
      expect(screen.getByText('Unable to load user profile information.')).toBeInTheDocument()
    })
  })

  it('renders all profile sections with correct headings', async () => {
    const mocks = [
      createGraphQLMock(
        USER_QUERY,
        { id: undefined },
        { user: mockUser }
      )
    ]

    render(<ProfilePage />, { mocks })

    await waitFor(() => {
      expect(screen.getByText('Contact Information')).toBeInTheDocument()
      expect(screen.getByText('Preferences')).toBeInTheDocument()
      expect(screen.getByText('Account Details')).toBeInTheDocument()
    })
  })

  it('displays account details correctly', async () => {
    const mocks = [
      createGraphQLMock(
        USER_QUERY,
        { id: undefined },
        { user: mockUser }
      )
    ]

    render(<ProfilePage />, { mocks })

    await waitFor(() => {
      expect(screen.getByText('User ID')).toBeInTheDocument()
      expect(screen.getByText('#1')).toBeInTheDocument()
      expect(screen.getByText('Wallet Address')).toBeInTheDocument()
      expect(screen.getByText('Registration Source')).toBeInTheDocument()
      expect(screen.getByText('Metamask')).toBeInTheDocument() // Capitalized
    })
  })

  it('handles GraphQL error gracefully', async () => {
    const mocks = [
      createGraphQLMock(
        USER_QUERY,
        { id: undefined },
        null,
        'Failed to fetch user'
      )
    ]

    render(<ProfilePage />, { mocks })

    // Should show profile not found when there's an error
    await waitFor(() => {
      expect(screen.getByText('Profile not found')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has proper heading structure', async () => {
      const mocks = [
        createGraphQLMock(
          USER_QUERY,
          { id: undefined },
          { user: mockUser }
        )
      ]

      render(<ProfilePage />, { mocks })

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('John Doe')
        expect(screen.getByRole('heading', { level: 3, name: /Contact Information/i })).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 3, name: /Preferences/i })).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 3, name: /Account Details/i })).toBeInTheDocument()
      })
    })

    it('has proper image alt text', async () => {
      const mocks = [
        createGraphQLMock(
          USER_QUERY,
          { id: undefined },
          { user: mockUser }
        )
      ]

      render(<ProfilePage />, { mocks })

      await waitFor(() => {
        const avatar = screen.getByAltText('John Doe')
        expect(avatar).toBeInTheDocument()
      })
    })

    it('provides meaningful text for empty states', async () => {
      const mocks = [
        createGraphQLMock(
          USER_QUERY,
          { id: undefined },
          { user: null }
        )
      ]

      render(<ProfilePage />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('Profile not found')).toBeInTheDocument()
        expect(screen.getByText('Unable to load user profile information.')).toBeInTheDocument()
      })
    })
  })

  describe('responsive design', () => {
    it('applies responsive grid classes', async () => {
      const mocks = [
        createGraphQLMock(
          USER_QUERY,
          { id: undefined },
          { user: mockUser }
        )
      ]

      render(<ProfilePage />, { mocks })

      await waitFor(() => {
        const gridContainer = screen.getByText('Contact Information').closest('div')?.parentElement
        expect(gridContainer).toHaveClass('grid', 'gap-6', 'grid-cols-1', 'lg:grid-cols-2')
      })
    })
  })

  describe('data formatting', () => {
    it('formats wallet address correctly', async () => {
      const mocks = [
        createGraphQLMock(
          USER_QUERY,
          { id: undefined },
          { user: mockUser }
        )
      ]

      render(<ProfilePage />, { mocks })

      await waitFor(() => {
        const walletAddress = screen.getAllByText('0x1234567890123456789012345678901234567890')[1] // Second occurrence in account details
        expect(walletAddress).toHaveClass('font-mono', 'text-xs', 'break-all')
      })
    })

    it('capitalizes registration source', async () => {
      const mocks = [
        createGraphQLMock(
          USER_QUERY,
          { id: undefined },
          { user: mockUser }
        )
      ]

      render(<ProfilePage />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('Metamask')).toBeInTheDocument() // Should be capitalized from 'metamask'
      })
    })
  })
})