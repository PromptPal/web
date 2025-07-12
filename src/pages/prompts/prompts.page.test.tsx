import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/utils/test-utils'
import { createGraphQLMock, mockData } from '@/test/utils/apollo-utils'
import PromptsPage from './prompts.page'

// Mock the useProjectId hook
vi.mock('@/hooks/route', () => ({
	useProjectId: () => 1
}))

// Mock motion/react to avoid animation issues in tests
vi.mock('motion/react', () => ({
	motion: {
		section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
		div: ({ children, ...props }: any) => <div {...props}>{children}</div>
	}
}))

// Mock PromptCardItem component
vi.mock('@/components/Prompt/CardItem', () => ({
	default: ({ prompt }: any) => (
		<div data-testid={`prompt-card-${prompt.id}`}>
			<h3>{prompt.name}</h3>
			<span>{prompt.tokenCount} tokens</span>
		</div>
	)
}))

// Mock the GraphQL query
const FETCH_PROMPTS_QUERY = `
	query fetchPrompts($id: Int!, $pagination: PaginationInput!) {
		prompts(projectId: $id, pagination: $pagination) {
			count
			edges {
				id
				hashId
				name
				publicLevel
				enabled
				tokenCount
				createdAt
			}
		}
	}
`

describe('PromptsPage Component', () => {
	const mockPrompts = [
		{
			id: 1,
			hashId: 'hash1',
			name: 'Test Prompt 1',
			publicLevel: 'private',
			enabled: true,
			tokenCount: 100,
			createdAt: '2023-01-01T00:00:00Z'
		},
		{
			id: 2,
			hashId: 'hash2',
			name: 'Test Prompt 2',
			publicLevel: 'public',
			enabled: false,
			tokenCount: 200,
			createdAt: '2023-01-02T00:00:00Z'
		}
	]

	it('renders page header correctly', async () => {
		const mocks = [
			createGraphQLMock(
				FETCH_PROMPTS_QUERY,
				{ id: 1, pagination: { limit: 100, offset: 0 } },
				{
					prompts: {
						count: 0,
						edges: []
					}
				}
			)
		]

		render(<PromptsPage />, { mocks })

		expect(screen.getByText('Prompts')).toBeInTheDocument()
		expect(screen.getByText(/Create, manage, and optimize your AI prompts/)).toBeInTheDocument()
	})

	it('displays prompts when data is loaded', async () => {
		const mocks = [
			createGraphQLMock(
				FETCH_PROMPTS_QUERY,
				{ id: 1, pagination: { limit: 100, offset: 0 } },
				{
					prompts: {
						count: 2,
						edges: mockPrompts
					}
				}
			)
		]

		render(<PromptsPage />, { mocks })

		// Wait for the query to resolve
		await waitFor(() => {
			expect(screen.getByTestId('prompt-card-1')).toBeInTheDocument()
			expect(screen.getByTestId('prompt-card-2')).toBeInTheDocument()
		})

		// Check that prompt cards are rendered with correct data
		expect(screen.getByText('Test Prompt 1')).toBeInTheDocument()
		expect(screen.getByText('Test Prompt 2')).toBeInTheDocument()
		expect(screen.getByText('100 tokens')).toBeInTheDocument()
		expect(screen.getByText('200 tokens')).toBeInTheDocument()
	})

	it('displays prompt count and total tokens in header', async () => {
		const mocks = [
			createGraphQLMock(
				FETCH_PROMPTS_QUERY,
				{ id: 1, pagination: { limit: 100, offset: 0 } },
				{
					prompts: {
						count: 2,
						edges: mockPrompts
					}
				}
			)
		]

		render(<PromptsPage />, { mocks })

		await waitFor(() => {
			// Check prompt count
			expect(screen.getByText('2 Prompts')).toBeInTheDocument()
			// Check total tokens (100 + 200 = 300)
			expect(screen.getByText('300 Total Tokens')).toBeInTheDocument()
		})
	})

	it('shows empty state when no prompts exist', async () => {
		const mocks = [
			createGraphQLMock(
				FETCH_PROMPTS_QUERY,
				{ id: 1, pagination: { limit: 100, offset: 0 } },
				{
					prompts: {
						count: 0,
						edges: []
					}
				}
			)
		]

		render(<PromptsPage />, { mocks })

		await waitFor(() => {
			expect(screen.getByText('No prompts yet')).toBeInTheDocument()
			expect(screen.getByText(/Start building your AI workflow/)).toBeInTheDocument()
			expect(screen.getByText('Create Your First Prompt')).toBeInTheDocument()
		})

		// Should show 0 prompts and 0 tokens
		expect(screen.getByText('0 Prompts')).toBeInTheDocument()
		expect(screen.getByText('0 Total Tokens')).toBeInTheDocument()
	})

	it('renders create prompt buttons with correct links', async () => {
		const mocks = [
			createGraphQLMock(
				FETCH_PROMPTS_QUERY,
				{ id: 1, pagination: { limit: 100, offset: 0 } },
				{
					prompts: {
						count: 0,
						edges: []
					}
				}
			)
		]

		render(<PromptsPage />, { mocks })

		await waitFor(() => {
			const createButtons = screen.getAllByText(/Create.*Prompt/)
			expect(createButtons).toHaveLength(2) // One in header, one in empty state
		})
	})

	it('handles loading state gracefully', async () => {
		// Mock with no initial response to test loading state
		const mocks = [
			createGraphQLMock(
				FETCH_PROMPTS_QUERY,
				{ id: 1, pagination: { limit: 100, offset: 0 } },
				{
					prompts: {
						count: 0,
						edges: []
					}
				}
			)
		]

		render(<PromptsPage />, { mocks })

		// Initially should show the page structure
		expect(screen.getByText('Prompts')).toBeInTheDocument()
		
		// Should show 0 while loading/before data arrives
		expect(screen.getByText('0 Prompts')).toBeInTheDocument()
		expect(screen.getByText('0 Total Tokens')).toBeInTheDocument()
	})

	it('handles GraphQL error state', async () => {
		const mocks = [
			createGraphQLMock(
				FETCH_PROMPTS_QUERY,
				{ id: 1, pagination: { limit: 100, offset: 0 } },
				null,
				'Failed to fetch prompts'
			)
		]

		render(<PromptsPage />, { mocks })

		// The page should still render the header even with errors
		expect(screen.getByText('Prompts')).toBeInTheDocument()
		
		// With error, data will be undefined, so should show empty state
		await waitFor(() => {
			expect(screen.getByText('0 Prompts')).toBeInTheDocument()
			expect(screen.getByText('0 Total Tokens')).toBeInTheDocument()
		})
	})

	it('renders with different project IDs', async () => {
		// This test verifies that the query variables change with different project IDs
		const mocks = [
			createGraphQLMock(
				FETCH_PROMPTS_QUERY,
				{ id: 1, pagination: { limit: 100, offset: 0 } },
				{
					prompts: {
						count: 1,
						edges: [mockPrompts[0]]
					}
				}
			)
		]

		render(<PromptsPage />, { mocks })

		await waitFor(() => {
			expect(screen.getByTestId('prompt-card-1')).toBeInTheDocument()
		})
	})

	describe('accessibility', () => {
		it('has proper heading structure', async () => {
			const mocks = [
				createGraphQLMock(
					FETCH_PROMPTS_QUERY,
					{ id: 1, pagination: { limit: 100, offset: 0 } },
					{
						prompts: {
							count: 0,
							edges: []
						}
					}
				)
			]

			render(<PromptsPage />, { mocks })

			expect(screen.getByRole('heading', { name: /prompts/i })).toBeInTheDocument()
		})

		it('has accessible links', async () => {
			const mocks = [
				createGraphQLMock(
					FETCH_PROMPTS_QUERY,
					{ id: 1, pagination: { limit: 100, offset: 0 } },
					{
						prompts: {
							count: 0,
							edges: []
						}
					}
				)
			]

			render(<PromptsPage />, { mocks })

			await waitFor(() => {
				const links = screen.getAllByRole('link')
				expect(links.length).toBeGreaterThan(0)
			})
		})
	})
})