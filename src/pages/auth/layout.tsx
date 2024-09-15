import { Navigate, Outlet } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { tokenAtom } from '../../stats/profile'

function AuthLayout() {
  const token = useAtomValue(tokenAtom)

  if (token) {
    return <Navigate to='/' />
  }

  return <Outlet />
}

export default AuthLayout
