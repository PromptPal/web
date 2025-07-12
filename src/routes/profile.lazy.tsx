import { createLazyFileRoute } from '@tanstack/react-router'
import ProfilePage from '../pages/profile/profile.page'

export const Route = createLazyFileRoute('/profile')({
  component: ProfilePage,
})
