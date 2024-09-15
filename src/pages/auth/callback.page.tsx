import { useSearch } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { tokenAtom } from '../../stats/profile'

function AuthSSOCallbackPage() {
  const sp: { token?: string } = useSearch({ strict: false })
  const [, setToken] = useAtom(tokenAtom)

  useEffect(() => {
    if (!sp.token) {
      return
    }
    const token = sp.token
    setToken(token)
  }, [sp])

  return (
    <div className='flex justify-center items-center h-full'>Loading...</div>
  )
}

export default AuthSSOCallbackPage
