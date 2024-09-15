import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import BaseLayout from '../components/layout/Base'

export const Route = createRootRoute({
  component: () => (
    <>
      <BaseLayout />
      <TanStackRouterDevtools />
    </>
  ),
})
