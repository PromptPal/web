import { Provider as JotaiProvider } from 'jotai'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  RouterProvider,
} from 'react-router-dom'
import { router } from './routes'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from './service/apollo'
import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 20_000
    }
  }
})

const theme = extendTheme({
  initialColorMode: 'dark',
})

function App() {
  return (
    <JotaiProvider>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <RouterProvider router={router} />
          </ChakraProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ApolloProvider>
    </JotaiProvider>
  )
}

export default App
