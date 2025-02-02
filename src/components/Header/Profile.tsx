import { useApolloClient, useQuery as useGraphQLQuery } from '@apollo/client'
import { Button, Divider, HoverCard } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { FolderKanban, LogOut } from 'lucide-react'
import { useCallback, useState } from 'react'
import { graphql } from '../../gql'
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
  const [isOpen, setIsOpen] = useState(false)
  const [token, setToken] = useAtom(tokenAtom)
  const loggedIn = !!token
  const qc = useQueryClient()
  const nav = useNavigate()

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
        className='flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 transition-colors'
      >
        {/* <span className='text-gray-300 text-sm max-w-[150px] truncate'>
          {user?.name}
        </span> */}
        {/* <img
        src={avatarUrl}
        alt={`${user.name}'s avatar`}
        className="h-8 w-8 rounded-full ring-2 ring-purple-500"
      /> */}
        <UserAvatar addr={user?.addr} name={user?.name ?? ''} />
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-72 bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10'>
          {/* User Info Section */}
          <div className='p-4 border-b border-gray-700'>
            <div className='flex items-center space-x-3'>
              <UserAvatar addr={user?.addr} name={user?.name ?? ''} />
            </div>
          </div>

          {/* Menu Items */}
          <div className='p-2'>
            <a
              href='/projects'
              className='flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md'
            >
              <FolderKanban className='mr-3 h-5 w-5 text-gray-400' />
              Projects
            </a>
            <button
              onClick={onLogout}
              className='flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md'
            >
              <LogOut className='mr-3 h-5 w-5' />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <HoverCard withArrow transitionProps={{ transition: 'pop' }}>
      <HoverCard.Target>
        {/* <UserAvatar addr={myProfile?.addr} name={myProfile?.name ?? ''} /> */}
        <div className='flex items-center space-x-3'>
          <span className='text-gray-300 text-sm'>{user?.name}</span>
          {/* <img
                  src={user?.avatar}
                  alt='User avatar'
                  className='h-8 w-8 rounded-full ring-2 ring-purple-500'
                /> */}
          <UserAvatar addr={user?.addr} name={user?.name ?? ''} />
        </div>
      </HoverCard.Target>
      <HoverCard.Dropdown className=' min-w-48'>
        <Button component={Link} to={'/projects'} fullWidth variant='filled'>
          Projects
        </Button>
        <Divider className='my-4' />
        <Button
          fullWidth
          bg='red'
          className='min-w-24'
          onClick={() => {
            setToken(null)
            qc.clear()
            client.resetStore()
            // TODO: redirect to overall page
            nav({ to: '/auth' })
          }}
        >
          Logout
        </Button>
      </HoverCard.Dropdown>
    </HoverCard>
  )
}

export default Profile
