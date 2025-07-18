import { createLazyFileRoute } from '@tanstack/react-router'
import EditWebhookPage from '../pages/webhooks/webhook.edit'

export const Route = createLazyFileRoute('/$pid/webhooks/$id/edit')({
  component: EditWebhookPage,
})
