import { createLazyFileRoute } from '@tanstack/react-router'
import AuthorizePage from '../pages/auth/authorize.page'

export const Route = createLazyFileRoute('/auth/')({
  component: AuthorizePage,
})
