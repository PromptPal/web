import { createLazyFileRoute } from '@tanstack/react-router'
import PromptCreatePage from '../pages/prompts/prompt.create'

export const Route = createLazyFileRoute('/$pid/prompts/new')({
  component: PromptCreatePage,
})
