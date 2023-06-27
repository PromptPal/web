import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtom, useAtomValue } from 'jotai'
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { getUserProfile } from '../../service/user'
import { tokenAtom } from '../../stats/profile'
import Dropdown from '../Dropdown';

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

  if (!loggedIn) {
    return null
  }

  return (
    <Dropdown
      content={(
        <ul className='w-full z-10 pt-2'>
          <li className='w-full'>
            <button
              className='w-full daisyui-btn daisyui-btn-error'
              onClick={() => {
                setToken(null)
                qc.clear()
                // redirect to overall page
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      )}>
      <div className='flex items-center hover:bg-gray-900 px-2 py-1 rounded'>
        <MetaMaskAvatar
          address={myProfile?.addr ?? ''}
        />
        <h6
          className='max-w-[120px] text-ellipsis overflow-hidden ml-2 cursor-pointer'>
          {myProfile?.name ?? ''}
        </h6>
      </div>
    </Dropdown>

  )
}

export default Profile