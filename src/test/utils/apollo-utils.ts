import { MockedResponse } from '@apollo/client/testing'
import { createMockProject, createMockPrompt, createMockProvider } from '../mocks/handlers/graphql'

// Helper to create GraphQL mocks
export function createGraphQLMock(
	query: any,
	variables: any = {},
	result: any,
	error?: any
): MockedResponse {
	return {
		request: {
			query,
			variables
		},
		result: error ? undefined : { data: result },
		error: error ? new Error(error) : undefined
	}
}

// Common mock data creators for testing
export const mockData = {
	project: createMockProject,
	prompt: createMockPrompt,
	provider: createMockProvider,
	
	// Create multiple items
	projects: (count: number = 2) => 
		Array.from({ length: count }, (_, i) => createMockProject({ 
			id: i + 1, 
			name: `Test Project ${i + 1}` 
		})),
	
	prompts: (count: number = 2) => 
		Array.from({ length: count }, (_, i) => createMockPrompt({ 
			id: i + 1, 
			name: `Test Prompt ${i + 1}` 
		})),
	
	providers: (count: number = 2) => 
		Array.from({ length: count }, (_, i) => createMockProvider({ 
			id: i + 1, 
			name: `Test Provider ${i + 1}` 
		}))
}

// Helper to wait for Apollo queries to complete
export async function waitForApollo() {
	await new Promise(resolve => setTimeout(resolve, 0))
}

// Mock error responses
export const mockErrors = {
	networkError: 'Network error occurred',
	graphQLError: 'GraphQL error occurred',
	authError: 'Authentication required',
	notFound: 'Resource not found'
}