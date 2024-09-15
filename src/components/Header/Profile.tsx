import { useApolloClient, useQuery as useGraphQLQuery } from '@apollo/client'
import { Button, Divider, HoverCard } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { MetaMaskAvatar } from 'react-metamask-avatar'
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

  const myProfile = data?.user

  if (!loggedIn) {
    return null
  }

  return (
    <HoverCard withArrow transitionProps={{ transition: 'pop' }}>
      <HoverCard.Target>
        <UserAvatar addr={myProfile?.addr} name={myProfile?.name ?? ''} />
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
