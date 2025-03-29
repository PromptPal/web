import { createLazyFileRoute } from '@tanstack/react-router'
import ProviderPage from '../pages/providers/provider.page'

export const Route = createLazyFileRoute('/providers/$id/')({
  component: ProviderPage,
})
