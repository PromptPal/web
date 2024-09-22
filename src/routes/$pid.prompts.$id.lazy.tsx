import { Outlet, createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/$pid/prompts/$id')({
  component: () => <Outlet />,
})
