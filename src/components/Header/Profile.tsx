import { useApolloClient, useQuery as useGraphQLQuery } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { FolderKanban, LogOut, Server } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { graphql } from '../../gql'
import { useClickOutside } from '../../hooks/useClickOutside'
import { tokenAtom } from '../../stats/profile'
import UserAvatar from '../User/UserAvatar'

const q = graphql(`
  query getUserProfile($id: Int!) {
    user(id: $id) {
      id
      name
      addr
    }
  }
`)

function Profile() {
  const profileRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [token, setToken] = useAtom(tokenAtom)
  const loggedIn = !!token
  const qc = useQueryClient()
  const nav = useNavigate()

  useClickOutside(profileRef, () => {
    if (isOpen) {
      setIsOpen(false)
    }
  })

  const client = useApolloClient()
  const { data } = useGraphQLQuery(q, {
    variables: {
      id: -1,
    },
    skip: !loggedIn,
  })

  const user = data?.user

  const onLogout = useCallback(() => {
    setToken(null)
    qc.clear()
    client.resetStore()
    // TODO: redirect to overall page
    nav({ to: '/auth' })
  }, [])

  if (!loggedIn) {
    return null
  }

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center space-x-3 p-2 rounded-full hover:bg-purple-500/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-opacity-75'
      >
        <UserAvatar addr={user?.addr} name={user?.name ?? ''} />
      </button>

      {isOpen && (
        <div ref={profileRef} className='absolute right-0 mt-2 w-72 bg-gradient-to-br from-purple-600 to-indigo-700 backdrop-blur-lg bg-opacity-80 rounded-xl shadow-2xl z-10 with-slide-in overflow-hidden'>
          {/* User Info Section - No border, adjusted padding and text for new bg */}
          <div className='p-4'>
            <div className='flex items-center space-x-3'>
              <UserAvatar addr={user?.addr} name={user?.name ?? ''} />
            </div>
          </div>

          {/* Menu Items - Updated text colors and hover effects */}
          <div className='p-2'>
            <Link
              to='/projects'
              className='flex items-center px-4 py-3 text-sm text-purple-100 hover:bg-white/10 hover:text-white rounded-md transition-colors'
            >
              <FolderKanban className='mr-3 h-5 w-5 text-purple-300' />
              Projects
            </Link>
            <Link
              to='/providers'
              className='flex items-center px-4 py-3 text-sm text-purple-100 hover:bg-white/10 hover:text-white rounded-md transition-colors'
            >
              <Server className='mr-3 h-5 w-5 text-purple-300' />
              Providers
            </Link>
            <button
              onClick={onLogout}
              className='flex w-full items-center px-4 py-3 text-sm text-red-300 hover:bg-red-500/20 hover:text-red-200 rounded-md transition-colors'
            >
              <LogOut className='mr-3 h-5 w-5 text-red-300' />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
