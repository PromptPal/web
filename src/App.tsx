import { Provider as JotaiProvider } from 'jotai'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  RouterProvider,
} from 'react-router-dom'
import { router } from './routes'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from './service/apollo'
import { MantineProvider } from '@mantine/core'

import '@mantine/core/styles.css'
import '@mantine/code-highlight/styles.css'
import '@mantine/dates/styles.css'
import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 20_000
    }
  }
})

function App() {
  return (
    <JotaiProvider>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider>
            <RouterProvider router={router} />
          </MantineProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ApolloProvider>
    </JotaiProvider>
  )
}

export default App
