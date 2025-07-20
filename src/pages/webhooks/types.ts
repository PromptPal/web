import { z } from 'zod/v4'

// Webhook form validation schema
export const webhookFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  url: z.string().url('Must be a valid URL'),
  events: z.array(z.string()).min(1, 'At least one event must be selected'),
  enabled: z.boolean().default(true),
})

export type WebhookFormData = z.infer<typeof webhookFormSchema>

// Available webhook events
export const WEBHOOK_EVENTS = [
  'prompt.called', // onPromptFinished is mapped to prompt.called
] as const

// Disabled events for future use
export const DISABLED_WEBHOOK_EVENTS = [
  'prompt.created',
  'prompt.updated',
  'prompt.deleted',
  'project.created',
  'project.updated',
  'project.deleted',
] as const

export type WebhookEvent = typeof WEBHOOK_EVENTS[number]

// Webhook status colors for UI
export const WEBHOOK_STATUS_COLORS = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
} as const

// Webhook call status type
export type WebhookCallStatus = keyof typeof WEBHOOK_STATUS_COLORS
