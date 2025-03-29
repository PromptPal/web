import { createLazyFileRoute } from '@tanstack/react-router'
import ProvidersUpdatePage from '../pages/providers/providers.update'

export const Route = createLazyFileRoute('/providers/$id/edit')({
  component: ProvidersUpdatePage,
})
