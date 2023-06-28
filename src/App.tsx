import { Provider as JotaiProvider } from 'jotai'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RouterProvider,
} from "react-router-dom";
import { router } from './routes'
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
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <RouterProvider router={router} />
        </ChakraProvider>
      </QueryClientProvider>
    </JotaiProvider>
  )
}

export default App
