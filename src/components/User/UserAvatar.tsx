import { Text, Tooltip } from '@mantine/core'
import { MetaMaskAvatar } from 'react-metamask-avatar'

type UserAvatarProps = {
  addr?: string
  name: string
}

function UserAvatar(props: UserAvatarProps) {
  const { addr, name } = props
  return (
    <div className='flex items-center px-2 py-1 rounded gap-2'>
      <MetaMaskAvatar address={addr ?? ''} />
      <Tooltip
        withArrow
        transitionProps={{
          transition: 'pop',
        }}
        label={name}
      >
        <Text className='max-w-[120px] line-clamp-1 text-ellipsis overflow-hidden ml-2 cursor-pointer'>
          {name}
        </Text>
      </Tooltip>
    </div>
  )
}

export default UserAvatar
