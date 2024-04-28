import { MetaMaskAvatar } from 'react-metamask-avatar'

type UserAvatarProps = {
  addr?: string
  name: string
}

function UserAvatar(props: UserAvatarProps) {
  const { addr, name } = props
  return (
    <div className='flex items-center px-2 py-1 rounded'>
      <MetaMaskAvatar
        address={addr ?? ''}
      />
      <h6
        className='max-w-[120px] line-clamp-1 text-ellipsis overflow-hidden ml-2 cursor-pointer'>
        {name}
      </h6>
    </div>
  )
}

export default UserAvatar