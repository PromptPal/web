// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createLazyFileRoute, createRootRoute } from '@tanstack/react-router'
import AuthLayout from '../pages/auth/layout'

export const Route = createLazyFileRoute('/auth')({
  component: AuthLayout,
})
