import { createLazyFileRoute } from '@tanstack/react-router'
import OverallPage from '../pages/overall/overall.page'

export const Route = createLazyFileRoute('/$pid/')({
  component: OverallPage,
})
