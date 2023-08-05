import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtom, useAtomValue } from 'jotai'
import { MetaMaskAvatar } from 'react-metamask-avatar'
import { getUserProfile } from '../../service/user'
import { tokenAtom } from '../../stats/profile'
import Dropdown from '../Dropdown'
import { Button, Menu, MenuButton, MenuItem, MenuList, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, useColorMode } from '@chakra-ui/react'
import { useApolloClient, useQuery as useGraphQLQuery } from '@apollo/client'
import { graphql } from '../../gql'

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

  const client = useApolloClient()
  const { data } = useGraphQLQuery(q, {
    variables: {
      id: -1
    },
    skip: !loggedIn
  })

  const myProfile = data?.user

  const { colorMode } = useColorMode()

  if (!loggedIn) {
    return null
  }

  return (
    <Popover trigger='hover'>
      <PopoverTrigger>
        <div className='flex items-center px-2 py-1 rounded'>
          <MetaMaskAvatar
            address={myProfile?.addr ?? ''}
          />
          <h6
            className='max-w-[120px] line-clamp-1 text-ellipsis overflow-hidden ml-2 cursor-pointer'>
            {myProfile?.name ?? ''}
          </h6>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <Button
            width='100%'
            backgroundColor='red.400'
            onClick={() => {
              setToken(null)
              qc.clear()
              client.resetStore()
              // TODO: redirect to overall page
            }}>
            Logout
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default Profile