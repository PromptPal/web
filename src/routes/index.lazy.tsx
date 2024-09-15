import { createLazyFileRoute } from '@tanstack/react-router'
import LandingPage from '../pages/landing/Landing'

export const Route = createLazyFileRoute('/')({
  component: LandingPage,
})
