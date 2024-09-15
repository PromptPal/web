import { createLazyFileRoute } from '@tanstack/react-router'
import PromptsPage from '../pages/prompts/prompts.page'

export const Route = createLazyFileRoute('/$pid/prompts/')({
  component: PromptsPage,
})
