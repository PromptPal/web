import { createLazyFileRoute } from '@tanstack/react-router'
import ProvidersPage from '../pages/providers/providers.page'

export const Route = createLazyFileRoute('/providers/')({
  component: ProvidersPage,
})
