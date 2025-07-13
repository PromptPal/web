import { useQuery } from '@apollo/client'
import { useParams } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { AssignPermissionModal } from './components/AssignPermissionModal'
import CreateUserModal from './components/CreateUserModal'
import { PermissionsHeader } from './components/PermissionsHeader'
import { PermissionsStatus } from './components/PermissionsStatus'
import { UserList } from './components/UserList'
import { GET_PROJECT, MockRole, MockUserRole } from './permissions.query'

function PermissionsPage() {
  console.log('popppppp')
  const pid = useParams({ strict: false }).pid ?? '0'
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
  const [isAssignPermissionModalOpen, setIsAssignPermissionModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  // Mock current user for demo - assume system admin
  const currentUserLevel = 100 // System admin level

  const { data: projectData } = useQuery(GET_PROJECT, {
    variables: { id: ~~pid },
    skip: !pid || pid === '0',
  })

  // Mock data for demonstration - this will be replaced with real GraphQL queries
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
        description: 'Full control over the project',
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
        name: 'edit',
        description: 'Can edit prompts and providers',
        isSystemRole: false,
      },
      createdAt: new Date().toISOString(),
    },
  ]

  const mockRoles: MockRole[] = [
    {
      id: '1',
      name: 'project_admin',
      description: 'Full control over the project',
      isSystemRole: false,
      permissions: [
        { id: '1', name: 'manage_users', action: 'manage', resource: 'users' },
        { id: '2', name: 'edit_prompts', action: 'edit', resource: 'prompts' },
        { id: '3', name: 'view_analytics', action: 'view', resource: 'analytics' },
      ],
    },
    {
      id: '2',
      name: 'edit',
      description: 'Can edit prompts and providers',
      isSystemRole: false,
      permissions: [
        { id: '4', name: 'edit_prompts', action: 'edit', resource: 'prompts' },
        { id: '5', name: 'view_analytics', action: 'view', resource: 'analytics' },
      ],
    },
    {
      id: '3',
      name: 'view',
      description: 'Read-only access to the project',
      isSystemRole: false,
      permissions: [
        { id: '6', name: 'view_prompts', action: 'view', resource: 'prompts' },
        { id: '7', name: 'view_analytics', action: 'view', resource: 'analytics' },
      ],
    },
  ]

  const users = useMemo(() => {
    return mockUsers
  }, [])

  const availableRoles = useMemo(() => {
    return mockRoles
  }, [])

  const usersLoading = false
  const usersError = null

  const refetchUsers = () => {
    // Mock refetch function
    console.log('Refreshing users...')
  }

  const isSystemAdmin = currentUserLevel >= 100
  const isProjectAdmin = users.some(
    userRole =>
      userRole.user.id === '1'
      && userRole.role.name === 'project_admin',
  )
  const canManagePermissions = isSystemAdmin || isProjectAdmin

  const handleAddUser = () => {
    if (!isSystemAdmin) {
      toast.error('Only system administrators can create new users')
      return
    }
    setIsCreateUserModalOpen(true)
  }

  const handleAssignPermission = (userId: string) => {
    setSelectedUserId(userId)
    setIsAssignPermissionModalOpen(true)
  }

  if (usersLoading || usersError) {
    return (
      <PermissionsStatus
        isLoading={usersLoading}
        error={usersError}
        hasNoProject={!pid || pid === '0'}
        hasNoPermission={!canManagePermissions}
      />
    )
  }

  return (
    <div className='w-full p-8 rounded-2xl'>
      <PermissionsHeader
        projectName={projectData?.project?.name}
        users={users}
        isSystemAdmin={isSystemAdmin}
        onCreateUser={handleAddUser}
      />

      {/* Users List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <UserList
          users={users}
          availableRoles={availableRoles}
          currentUserLevel={currentUserLevel}
          onAssignPermission={handleAssignPermission}
          onRefresh={refetchUsers}
        />
      </motion.div>

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onUserCreated={() => {
          refetchUsers()
          setIsCreateUserModalOpen(false)
        }}
        projectId={pid}
      />

      <AssignPermissionModal
        isOpen={isAssignPermissionModalOpen}
        onClose={() => {
          setIsAssignPermissionModalOpen(false)
          setSelectedUserId(null)
        }}
        userId={selectedUserId}
        projectId={pid}
        availableRoles={availableRoles}
        onPermissionAssigned={() => {
          refetchUsers()
          setIsAssignPermissionModalOpen(false)
          setSelectedUserId(null)
        }}
      />
    </div>
  )
}

export default PermissionsPage
