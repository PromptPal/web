import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Crown,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  Loader2,
} from 'lucide-react'
import { MockUserRole } from '../permissions.query'

interface UserCardProps {
  userRole: MockUserRole
  index: number
  isSystemAdmin: boolean
  loadingUserId: string | null
  onAssignPermission: (userId: string) => void
  onRemoveUser: (userId: string) => void
}

export function UserCard({
  userRole,
  index,
  isSystemAdmin,
  loadingUserId,
  onAssignPermission,
  onRemoveUser,
}: Omit<UserCardProps, 'projectId'>) {
  const [showMenu, setShowMenu] = useState(false)

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'system_admin':
        return <Crown className='w-4 h-4 text-yellow-500' />
      case 'project_admin':
        return <Crown className='w-4 h-4 text-blue-500' />
      case 'edit':
        return <Edit className='w-4 h-4 text-green-500' />
      case 'view':
        return <Eye className='w-4 h-4 text-gray-500' />
      default:
        return <User className='w-4 h-4 text-gray-400' />
    }
  }

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case 'system_admin':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800'
      case 'project_admin':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
      case 'edit':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
      case 'view':
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className='p-6 border border-gray-700/50 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            {/* Avatar */}
            <div className='w-12 h-12 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-600/20 flex items-center justify-center border border-sky-500/30'>
              {userRole.user.avatar
                ? (
                    <img
                      src={userRole.user.avatar}
                      alt={userRole.user.name}
                      className='w-full h-full rounded-full object-cover'
                    />
                  )
                : (
                    <User className='w-5 h-5 text-sky-400' />
                  )}
            </div>

            {/* User Info */}
            <div className='space-y-1'>
              <div className='flex items-center gap-3'>
                <h3 className='font-semibold text-white'>{userRole.user.name}</h3>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getRoleBadgeColor(
                    userRole.role.name,
                  )}`}
                >
                  {getRoleIcon(userRole.role.name)}
                  {userRole.role.name.replace('_', ' ')}
                </span>
              </div>
              <p className='text-sm text-gray-400'>{userRole.user.email}</p>
              <div className='flex items-center gap-2 text-xs text-gray-500'>
                <Calendar className='w-3 h-3' />
                <span>
                  Added
                  {formatDate(userRole.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          <div className='relative'>
            <button
              onClick={() => setShowMenu(!showMenu)}
              disabled={loadingUserId === userRole.user.id}
              className='p-2 rounded-lg hover:bg-gray-700/50 transition-colors disabled:opacity-50'
            >
              {loadingUserId === userRole.user.id
                ? (
                    <Loader2 className='w-4 h-4 animate-spin text-gray-400' />
                  )
                : (
                    <MoreVertical className='w-4 h-4 text-gray-400' />
                  )}
            </button>

            {showMenu && (
              <div className='absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10'>
                <div className='py-1'>
                  <div className='px-3 py-2 text-xs font-medium text-gray-400 border-b border-gray-700'>
                    User Actions
                  </div>
                  <button
                    onClick={() => {
                      onAssignPermission(userRole.user.id)
                      setShowMenu(false)
                    }}
                    className='w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700/50 flex items-center gap-2'
                  >
                    <Edit className='w-4 h-4' />
                    Change Role
                  </button>

                  {isSystemAdmin && (
                    <>
                      <div className='border-t border-gray-700 my-1' />
                      <button
                        onClick={() => {
                          onRemoveUser(userRole.user.id)
                          setShowMenu(false)
                        }}
                        className='w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 flex items-center gap-2'
                      >
                        <Trash2 className='w-4 h-4' />
                        Remove Access
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className='fixed inset-0 z-0'
          onClick={() => setShowMenu(false)}
        />
      )}
    </motion.div>
  )
}
