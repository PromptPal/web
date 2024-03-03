import { useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { MetaMaskAvatar } from 'react-metamask-avatar'
import { tokenAtom } from '../../stats/profile'
import { Button, Divider, HoverCard } from '@mantine/core'
import { useApolloClient, useQuery as useGraphQLQuery } from '@apollo/client'
import { graphql } from '../../gql'
import { Link, useNavigate } from 'react-router-dom'

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
  const [token, setToken] = useAtom(tokenAtom)
  const loggedIn = !!token
  const qc = useQueryClient()
  const nav = useNavigate()

  const client = useApolloClient()
  const { data } = useGraphQLQuery(q, {
    variables: {
      id: -1
    },
    skip: !loggedIn
  })

  const myProfile = data?.user

  if (!loggedIn) {
    return null
  }

  return (
    <HoverCard withArrow transitionProps={{ transition: 'pop' }}>
      <HoverCard.Target>
        <div className='flex items-center px-2 py-1 rounded'>
          <MetaMaskAvatar
            address={myProfile?.addr ?? ''}
          />
          <h6
            className='max-w-[120px] line-clamp-1 text-ellipsis overflow-hidden ml-2 cursor-pointer'>
            {myProfile?.name ?? ''}
          </h6>
        </div>
      </HoverCard.Target>
      <HoverCard.Dropdown className=' min-w-48'>
        <Button
          component={Link}
          to={'/projects'}
          fullWidth
          variant='filled'
        >
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
            nav('/auth')
          }}>
          Logout
        </Button>
      </HoverCard.Dropdown>
    </HoverCard>
  )
}

export default Profile