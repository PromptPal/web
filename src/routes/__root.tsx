import '@annatarhe/lake-ui/style.css'
import { createRootRoute } from '@tanstack/react-router'
import { lazy } from 'react'
import BaseLayout from '../components/layout/Base'

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : lazy(() =>
      import('@tanstack/react-router-devtools').then(res => ({
        default: res.TanStackRouterDevtools,
      })),
    )

export const Route = createRootRoute({
  component: () => (
    <>
      <BaseLayout />
      <TanStackRouterDevtools />
    </>
  ),
})
