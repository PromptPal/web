import { createFileRoute } from '@tanstack/react-router'
import PromptPage from '../pages/prompts/prompt.page'

export const Route = createFileRoute('/$pid/prompts/$id/')({
  component: PromptPage,
  loader: () => Promise.resolve(1),
})
