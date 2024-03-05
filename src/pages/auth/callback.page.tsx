import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { tokenAtom } from '../../stats/profile'

function AuthSSOCallbackPage() {
  const [sp] = useSearchParams()
  const [, setToken] = useAtom(tokenAtom)

  useEffect(() => {
    if (!sp.has('token')) {
      return
    }
    const token = sp.get('token')
    setToken(token)
  }, [sp])

  return (
    <div className='flex justify-center items-center h-full'>
      Loading...
    </div>
  )
}

export default AuthSSOCallbackPage