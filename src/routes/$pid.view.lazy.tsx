import { createLazyFileRoute } from '@tanstack/react-router'
import ProjectPage from '../pages/projects/project.page'

export const Route = createLazyFileRoute('/$pid/view')({
  component: ProjectPage,
})
