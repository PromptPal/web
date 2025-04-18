import Tooltip from '@annatarhe/lake-ui/tooltip'
import { MetaMaskAvatar } from 'react-metamask-avatar'

type UserAvatarProps = {
  addr?: string
  name: string
}

function UserAvatar(props: UserAvatarProps) {
  const { addr, name } = props
  return (
    <div className='flex items-center justify-center px-2 py-1 rounded-sm gap-2'>
      <MetaMaskAvatar address={addr ?? ''} />
      <Tooltip content={name}>
        <span className='max-w-[120px] line-clamp-1 text-ellipsis overflow-hidden ml-2 cursor-pointer'>
          {name}
        </span>
      </Tooltip>
    </div>
  )
}

export default UserAvatar
