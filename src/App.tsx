import { RouterProvider } from '@tanstack/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './routes'
import './App.css'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
