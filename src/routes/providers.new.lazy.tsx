import { createLazyFileRoute } from '@tanstack/react-router'
import ProvidersCreatePage from '../pages/providers/providers.create'

export const Route = createLazyFileRoute('/providers/new')({
  component: ProvidersCreatePage,
})
