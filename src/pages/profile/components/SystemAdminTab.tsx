import { motion } from 'framer-motion'
import { AlertTriangle, Shield, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AssignPermissionModal } from '../../permissions/components/AssignPermissionModal'
import CreateUserModal from '../../permissions/components/CreateUserModal'
import { UserList } from '../../permissions/components/UserList'
import { MockRole, MockUserRole } from '../../permissions/permissions.query'

function SystemAdminTab() {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
  const [isAssignPermissionModalOpen, setIsAssignPermissionModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  // Mock current user level for demonstration
  const currentUserLevel = 1000

  const isSystemAdmin = currentUserLevel >= 100

  // If not system admin, show access denied
  if (!isSystemAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full space-y-6'
      >
        <div className='backdrop-blur-md bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-700/50 rounded-xl p-8 text-center'>
          <AlertTriangle className='w-16 h-16 text-red-400 mx-auto mb-4' />
          <h3 className='text-xl font-semibold text-red-300 mb-2'>Access Denied</h3>
          <p className='text-gray-400'>Only system administrators can access this section.</p>
        </div>
      </motion.div>
    )
  }

  // Mock data for demonstration - similar to permissions page
  const mockUsers: MockUserRole[] = [
    {
      id: '1',
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: '',
      },
      role: {
        id: '1',
        name: 'project_admin',
        description: 'Full control over projects',
        isSystemRole: false,
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      user: {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: '',
      },
      role: {
        id: '2',
        name: 'system_admin',
        description: 'Full system access',
        isSystemRole: true,
      },
      createdAt: new Date().toISOString(),
    },
  ]

  const mockRoles: MockRole[] = [
    {
      id: '1',
      name: 'system_admin',
      description: 'Full system access',
      isSystemRole: true,
      permissions: [
        { id: '1', name: 'manage_users', action: 'manage', resource: 'users' },
        { id: '2', name: 'manage_projects', action: 'manage', resource: 'projects' },
        { id: '3', name: 'view_analytics', action: 'view', resource: 'analytics' },
      ],
    },
    {
      id: '2',
      name: 'project_admin',
      description: 'Full control over projects',
      isSystemRole: false,
      permissions: [
        { id: '4', name: 'edit_prompts', action: 'edit', resource: 'prompts' },
        { id: '5', name: 'view_analytics', action: 'view', resource: 'analytics' },
      ],
    },
  ]

  const users = useMemo(() => {
    return mockUsers
  }, [])

  const availableRoles = useMemo(() => {
    return mockRoles
  }, [])

  const refetchUsers = () => {
    console.log('Refreshing users...')
  }

  const handleAddUser = () => {
    setIsCreateUserModalOpen(true)
  }

  const handleAssignPermission = (userId: string) => {
    setSelectedUserId(userId)
    setIsAssignPermissionModalOpen(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='w-full space-y-6'
    >
      {/* Header */}
      <div className='backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 rounded-xl p-6'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='p-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-500'>
            <Shield className='w-5 h-5 text-white' />
          </div>
          <h3 className='text-lg font-semibold text-gray-200'>System Administration</h3>
        </div>
        <p className='text-gray-400 mb-4'>
          Manage users, permissions, and system-wide settings. Only accessible to system administrators.
        </p>

        <div className='flex items-center gap-4'>
          <button
            onClick={handleAddUser}
            className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200'
          >
            <Users className='w-4 h-4' />
            Create User
          </button>
        </div>
      </div>

      {/* Users Management */}
      <div className='backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 rounded-xl p-6'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500'>
            <Users className='w-5 h-5 text-white' />
          </div>
          <h4 className='text-lg font-semibold text-gray-200'>User Management</h4>
        </div>

        <UserList
          users={users}
          availableRoles={availableRoles}
          currentUserLevel={currentUserLevel}
          onAssignPermission={handleAssignPermission}
          onRefresh={refetchUsers}
        />
      </div>

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onUserCreated={() => {
          refetchUsers()
          setIsCreateUserModalOpen(false)
        }}
        projectId='system' // System-wide user creation
      />

      <AssignPermissionModal
        isOpen={isAssignPermissionModalOpen}
        onClose={() => {
          setIsAssignPermissionModalOpen(false)
          setSelectedUserId(null)
        }}
        userId={selectedUserId}
        projectId='system'
        availableRoles={availableRoles}
        onPermissionAssigned={() => {
          refetchUsers()
          setIsAssignPermissionModalOpen(false)
          setSelectedUserId(null)
        }}
      />
    </motion.div>
  )
}

export default SystemAdminTab
