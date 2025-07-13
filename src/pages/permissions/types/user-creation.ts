import { z } from 'zod/v4'

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  phone: z.string().optional(),
  lang: z.string().optional(),
  level: z.number().min(0).max(100).optional(),
  avatar: z.url().optional().or(z.literal('')),
  username: z.string().optional(),
  initialRole: z.string().min(1, 'Initial role is required'),
})

export type CreateUserFormData = z.infer<typeof createUserSchema>

export interface CreatedUser {
  user: {
    id: string
    name: string
    email: string
  }
  password: string
}

export const roleOptions = [
  { value: 'view', label: 'View - Read-only access' },
  { value: 'edit', label: 'Edit - Can modify content' },
  { value: 'project_admin', label: 'Project Admin - Full project control' },
]

export const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
]
