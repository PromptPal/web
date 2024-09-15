import { createLazyFileRoute } from '@tanstack/react-router'
import AuthSSOCallbackPage from '../pages/auth/callback.page'

export const Route = createLazyFileRoute('/auth/sso/cb')({
  component: AuthSSOCallbackPage,
})
