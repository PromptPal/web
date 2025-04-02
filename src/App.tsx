import { ApolloProvider } from '@apollo/client'
import { MantineProvider } from '@mantine/core'
import { MetaMaskProvider } from '@metamask/sdk-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider as JotaiProvider } from 'jotai'
import { apolloClient } from './service/apollo'

import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

import './App.css'
import './styles/glow.css'
import '@mantine/core/styles.css'
import '@mantine/code-highlight/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/charts/styles.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 20_000,
    },
  },
})

function App() {
  return (
    <MetaMaskProvider
      sdkOptions={{
        dappMetadata: {
          name: 'PromptPal',
          url: window.location.href,
        },
        // infuraAPIKey: process.env.INFURA_API_KEY,
        // Other options.
      }}
    >
      <JotaiProvider>
        <ApolloProvider client={apolloClient}>
          <QueryClientProvider client={queryClient}>
            <MantineProvider forceColorScheme='dark'>
              <RouterProvider router={router} />
            </MantineProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ApolloProvider>
      </JotaiProvider>
    </MetaMaskProvider>
  )
}

export default App
