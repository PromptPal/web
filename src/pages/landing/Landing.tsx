import { useAtomValue } from 'jotai'
import { Navigate } from 'react-router-dom'
import { tokenAtom } from '../../stats/profile'

function LandingPage() {
  const token = useAtomValue(tokenAtom)
  // TODO: warm welcome page including auth info, project list and how to get started
  console.log('fff', token)
  if (!token) {
    return <Navigate to={'/auth'} />
  }
  return <Navigate to={'/projects'} />
}

export default LandingPage