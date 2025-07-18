import { createLazyFileRoute } from '@tanstack/react-router'
import CreateWebhookPage from '../pages/webhooks/webhook.create'

export const Route = createLazyFileRoute('/$pid/webhooks/new')({
  component: CreateWebhookPage,
})
