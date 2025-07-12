import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { MockedProvider, MockedResponse } from '@apollo/client/testing'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
	mocks?: MockedResponse[]
	addTypename?: boolean
}

// Simplified render function that includes Apollo Client provider
export function renderWithProviders(
	ui: React.ReactElement,
	{
		mocks = [],
		addTypename = false,
		...renderOptions
	}: CustomRenderOptions = {}
) {
	function Wrapper({ children }: { children: React.ReactNode }) {
		return (
			<MockedProvider mocks={mocks} addTypename={addTypename}>
				{children}
			</MockedProvider>
		)
	}

	return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export everything from testing-library/react
export * from '@testing-library/react'
export { userEvent } from '@testing-library/user-event'

// Override render method
export { renderWithProviders as render }