import { createFileRoute } from '@tanstack/react-router'
import SystemTab from '../../pages/profile/components/SystemTab'

export const Route = createFileRoute('/profile/system')({
  component: SystemTab,
})
