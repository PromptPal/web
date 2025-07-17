import { createLazyFileRoute } from '@tanstack/react-router'
import WebhooksPage from '../pages/webhooks/webhooks.page'

export const Route = createLazyFileRoute('/$pid/webhooks/')({
  component: WebhooksPage,
})