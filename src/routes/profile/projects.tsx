import { createFileRoute } from '@tanstack/react-router'
import ProjectsTab from '../../pages/profile/components/ProjectsTab'

export const Route = createFileRoute('/profile/projects')({
  component: ProjectsTab,
})
