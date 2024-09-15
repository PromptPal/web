import { createLazyFileRoute } from '@tanstack/react-router'
import PromptPage from '../pages/prompts/prompt.page'

export const Route = createLazyFileRoute('/$pid/prompts/$id')({
  component: PromptPage,
})
