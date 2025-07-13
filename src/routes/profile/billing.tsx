import { createFileRoute } from '@tanstack/react-router'
import BillingTab from '../../pages/profile/components/BillingTab'

export const Route = createFileRoute('/profile/billing')({
  component: BillingTab,
})
