import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtom, useAtomValue } from 'jotai'
import { MetaMaskAvatar } from 'react-metamask-avatar'
import { getUserProfile } from '../../service/user'
import { tokenAtom } from '../../stats/profile'
import Dropdown from '../Dropdown'
import { Button, Menu, MenuButton, MenuItem, MenuList, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, useColorMode } from '@chakra-ui/react'

type ProfileProps = {
}

function Profile(props: ProfileProps) {
  const [token, setToken] = useAtom(tokenAtom)
  const loggedIn = !!token
  const qc = useQueryClient()
  const { data: myProfile } = useQuery({
    queryKey: ['user', -1],
    queryFn: ({ signal }) => getUserProfile(-1, signal),
    enabled: !!loggedIn,
  })

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
      <PopoverContent >
        <PopoverArrow />
        <PopoverBody>
          <Button
            width='100%'
            backgroundColor='red.400'
            onClick={() => {
              setToken(null)
              qc.clear()
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