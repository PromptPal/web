import { createFileRoute } from '@tanstack/react-router'
import SystemAdminTab from '../../pages/profile/components/SystemAdminTab'

export const Route = createFileRoute('/profile/admin')({
  component: SystemAdminTab,
})
