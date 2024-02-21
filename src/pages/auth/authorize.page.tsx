import { useAtomValue } from 'jotai'
import { tokenAtom } from '../../stats/profile'
import { Navigate } from 'react-router-dom'

function AuthorizePage() {
  const token = useAtomValue(tokenAtom)

  if (token) {
    return <Navigate to="/" />
  }

  return (
    <div className="mt-8">
      <h1 className="text-center">
        😔
      </h1>
      <h2 className="text-center">
        Sorry, you need to login to view all the content
      </h2>
    </div>
  )
}

export default AuthorizePage