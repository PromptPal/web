import { createFileRoute } from '@tanstack/react-router'
import ProjectLayout from '../components/layout/ProjectLayout'

export const Route = createFileRoute('/$pid')({
  component: ProjectLayout,
})
