import Tooltip from '@annatarhe/lake-ui/tooltip'
import { MetaMaskAvatar } from 'react-metamask-avatar'

type UserAvatarProps = {
  addr?: string
  name: string
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
}

function UserAvatar(props: UserAvatarProps) {
  const { addr, name, size = 'sm', showName = true } = props

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }

  return (
    <div className='flex items-center gap-2'>
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0`}>
        <MetaMaskAvatar address={addr ?? ''} />
      </div>
      {showName && (
        <Tooltip content={name}>
          <span className='max-w-[120px] line-clamp-1 text-ellipsis overflow-hidden cursor-pointer'>
            {name}
          </span>
        </Tooltip>
      )}
    </div>
  )
}

export default UserAvatar
