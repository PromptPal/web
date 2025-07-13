import { createFileRoute } from '@tanstack/react-router'
import PermissionsPage from '../pages/permissions/permissions.page'

export const Route = createFileRoute('/$pid/permissions')({
  component: PermissionsPage,
})
