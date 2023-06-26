import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { getUserProfile } from '../../service/user'
import { tokenAtom } from '../../stats/profile'

type ProfileProps = {
}

function Profile(props: ProfileProps) {
  const loggedIn = useAtomValue(tokenAtom)
  const { data: myProfile } = useQuery({
    queryKey: ['user', -1],
    queryFn: ({ signal }) => getUserProfile(-1, signal),
    enabled: !!loggedIn,
  })

  if (!loggedIn) {
    return null
  }

  return (
    <details className='daisyui-dropdown daisyui-dropdown-hover'>
      <summary className='flex items-center daisyui-dropdown daisyui-btn'>
        <MetaMaskAvatar
          address={myProfile?.addr ?? ''}
        />
        <h6
          className='max-w-[120px] text-ellipsis overflow-hidden ml-2' >
          {myProfile?.name ?? ''}
        </h6>
      </summary>
      <ul className='daisyui-dropdown-content w-full z-10 pt-2'>
        <li className='w-full'>
          <button className=' w-full daisyui-btn daisyui-btn-error'>Logout</button>
        </li>
      </ul>
    </details>
  )
}

export default Profile