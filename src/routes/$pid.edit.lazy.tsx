import { createLazyFileRoute } from '@tanstack/react-router'
import ProjectEditPage from '../pages/projects/project.edit'

export const Route = createLazyFileRoute('/$pid/edit')({
  component: ProjectEditPage,
})
