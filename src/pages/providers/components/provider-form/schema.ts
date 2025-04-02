import * as z from 'zod'

// Define the schema for provider form
export const providerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  enabled: z.boolean().default(true),
  source: z
    .string()
    .trim()
    .min(2, 'Source must be at least 2 characters')
    .max(100, 'Source cannot exceed 100 characters'),
  endpoint: z
    .string()
    .trim()
    .url('Please enter a valid URL')
    .max(255, 'Endpoint URL cannot exceed 255 characters'),
  apiKey: z
    .string()
    .trim()
    .min(3, 'API Key must be at least 3 characters')
    .max(255, 'API Key cannot exceed 255 characters'),
  organizationId: z
    .string()
    .trim()
    .max(100, 'Organization ID cannot exceed 100 characters')
    .optional(),
  defaultModel: z
    .string()
    .trim()
    .min(2, 'Default model must be at least 2 characters')
    .max(100, 'Default model cannot exceed 100 characters'),
  temperature: z
    .number()
    .min(0, 'Temperature must be at least 0')
    .max(2, 'Temperature cannot exceed 2')
    .default(0.7),
  topP: z
    .number()
    .min(0, 'Top P must be at least 0')
    .max(1, 'Top P cannot exceed 1')
    .default(1),
  maxTokens: z
    .number()
    .min(1, 'Max tokens must be at least 1')
    .max(100000, 'Max tokens cannot exceed 100000')
    .default(2048),
  config: z
    .string()
    .trim()
    .max(5000, 'Config cannot exceed 5000 characters')
    .optional(),
  headers: z
    .array(
      z.object({
        key: z.string().trim().min(1, 'Key cannot be empty'),
        value: z.string().trim().min(1, 'Value cannot be empty'),
      }),
    )
    .optional()
    .default([]),
})

export type ProviderFormValues = z.infer<typeof providerSchema>

export const defaultProviderValues: Partial<ProviderFormValues> = {
  name: '',
  description: '',
  enabled: true,
  source: 'openai',
  endpoint: 'https://api.openai.com',
  organizationId: '',
  defaultModel: '',
  temperature: 0.7,
  topP: 1,
  maxTokens: 2048,
  config: '',
  headers: [],
}
