import { createLazyFileRoute } from '@tanstack/react-router'
import WebhookDetailPage from '../pages/webhooks/webhook.page'

export const Route = createLazyFileRoute('/$pid/webhooks/$id/')({
  component: WebhookDetailPage,
})
