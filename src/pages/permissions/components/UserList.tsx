import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { MockUserRole, MockRole } from '../permissions.query'
import { UserCard } from './UserCard'

type UserRole = MockUserRole
type Role = MockRole

interface UserListProps {
  users: UserRole[]
  availableRoles: Role[]
  currentUserLevel: number
  projectId: string
  onAssignPermission: (userId: string) => void
  onRefresh: () => void
}

export function UserList({
  users,
  currentUserLevel,
  onAssignPermission,
  onRefresh,
}: Omit<UserListProps, 'projectId'>) {
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null)

  const isSystemAdmin = currentUserLevel >= 100

  const handleRemoveUser = async (userId: string) => {
    if (!isSystemAdmin) {
      toast.error('Only system administrators can remove users')
      return
    }

    setLoadingUserId(userId)

    // Mock remove user functionality
    setTimeout(() => {
      toast.success('User removed from project successfully (Demo)')
      onRefresh()
      setLoadingUserId(null)
    }, 1000)
  }

  if (users.length === 0) {
    return (
      <div className='p-12 text-center bg-gray-900/50 border border-gray-700/50 rounded-xl'>
        <div className='space-y-4'>
          <div className='mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center'>
            <UserPlus className='w-8 h-8 text-purple-400' />
          </div>
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold text-gray-300'>
              No users assigned
            </h3>
            <p className='text-sm text-gray-400'>
              Assign users to this project to manage their permissions
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-semibold text-gray-300'>
        Project Users (
        {users.length}
        )
      </h2>

      <div className='grid gap-4'>
        {users.map((userRole, index) => (
          <UserCard
            key={userRole.id}
            userRole={userRole}
            index={index}
            isSystemAdmin={isSystemAdmin}
            loadingUserId={loadingUserId}
            onAssignPermission={onAssignPermission}
            onRemoveUser={handleRemoveUser}
          />
        ))}
      </div>
    </div>
  )
}
