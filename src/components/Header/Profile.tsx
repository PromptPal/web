import { useApolloClient, useQuery as useGraphQLQuery } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { FolderKanban, LogOut, Server, User, Settings, CreditCard } from 'lucide-react'
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
    nav({ to: '/auth' })
  }, [setToken, qc, client, nav])

  if (!loggedIn) {
    return null
  }

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative group flex items-center p-1.5 rounded-lg transition-all duration-200
          hover:bg-gray-100 dark:hover:bg-gray-800/50
          focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:focus-visible:ring-violet-400
          ${
    isOpen
      ? 'bg-gray-100 dark:bg-gray-800/50'
      : ''
    }
        `}
        aria-label='User menu'
      >
        <div className='relative'>
          <UserAvatar addr={user?.addr} name={user?.name ?? ''} showName={false} />
          <div className='absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-900' />
        </div>
      </button>

      {isOpen && (
        <div
          ref={profileRef}
          className='absolute right-0 mt-2 w-80 origin-top-right animate-in fade-in slide-in-from-top-1 duration-200'
        >
          <div className='rounded-xl bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black/5 dark:ring-white/10 overflow-hidden'>
            {/* User Info Section */}
            <div className='p-4 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30'>
              <div className='flex items-center gap-3'>
                <UserAvatar addr={user?.addr} name={user?.name ?? ''} size='md' />
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold text-gray-900 dark:text-gray-100 truncate'>
                    {user?.name || 'Anonymous User'}
                  </p>
                  <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                    {user?.addr ? `${user.addr.slice(0, 6)}...${user.addr.slice(-4)}` : 'No address'}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className='p-1.5'>
              <div className='px-2 py-1.5'>
                <p className='text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider'>Account</p>
              </div>

              <Link
                to='/profile'
                onClick={() => setIsOpen(false)}
                className='flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors group'
              >
                <User className='h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300' strokeWidth={2} />
                <span>Profile Settings</span>
              </Link>

              <Link
                to='/billing'
                onClick={() => setIsOpen(false)}
                className='flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors group'
              >
                <CreditCard className='h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300' strokeWidth={2} />
                <span>Billing & Usage</span>
              </Link>

              <div className='my-1.5 h-px bg-gray-100 dark:bg-gray-800' />

              <div className='px-2 py-1.5'>
                <p className='text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider'>Workspace</p>
              </div>

              <Link
                to='/projects'
                onClick={() => setIsOpen(false)}
                className='flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors group'
              >
                <FolderKanban className='h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300' strokeWidth={2} />
                <span>All Projects</span>
              </Link>

              <Link
                to='/providers'
                onClick={() => setIsOpen(false)}
                className='flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors group'
              >
                <Server className='h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300' strokeWidth={2} />
                <span>API Providers</span>
              </Link>

              <Link
                to='/settings'
                onClick={() => setIsOpen(false)}
                className='flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors group'
              >
                <Settings className='h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300' strokeWidth={2} />
                <span>Settings</span>
              </Link>

              <div className='my-1.5 h-px bg-gray-100 dark:bg-gray-800' />

              <button
                onClick={onLogout}
                className='flex w-full items-center gap-3 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors group'
              >
                <LogOut className='h-4 w-4' strokeWidth={2} />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
