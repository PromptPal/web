import { createLazyFileRoute } from '@tanstack/react-router'
import ProjectCreatePage from '../pages/projects/project.create'

export const Route = createLazyFileRoute('/projects/new')({
  component: ProjectCreatePage,
})
