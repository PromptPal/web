import { useAtomValue } from 'jotai'
import { Navigate, Outlet } from 'react-router-dom'
import { tokenAtom } from '../../stats/profile'

function AuthLayout() {
  const token = useAtomValue(tokenAtom)

  if (token) {
    return <Navigate to="/" />
  }

  return <Outlet />
}

export default AuthLayout