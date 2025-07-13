import { MockRole } from '../permissions.query'

interface RoleSelectorProps {
  roles: MockRole[]
  selectedRole: string
  onRoleSelect: (roleId: string) => void
  error?: string
}

export function RoleSelector({ roles, selectedRole, onRoleSelect, error }: RoleSelectorProps) {
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

  const nonSystemRoles = roles.filter(role => !role.isSystemRole)

  return (
    <div className='space-y-3'>
      {nonSystemRoles.map(role => (
        <div
          key={role.id}
          className={`p-4 cursor-pointer transition-all duration-200 border rounded-lg ${
            selectedRole === role.name
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-gray-700/50 hover:border-gray-600'
          }`}
          onClick={() => onRoleSelect(role.name)}
        >
          <div className='flex items-start gap-3'>
            <input
              type='radio'
              value={role.name}
              checked={selectedRole === role.name}
              onChange={() => onRoleSelect(role.name)}
              className='mt-1'
            />
            <div className='flex-1 space-y-2'>
              <div className='flex items-center gap-3'>
                <h4 className='font-semibold text-white'>{role.name.replace('_', ' ')}</h4>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getRoleBadgeColor(
                    role.name,
                  )}`}
                >
                  {role.name}
                </span>
              </div>
              {role.description && (
                <p className='text-sm text-gray-400'>
                  {role.description}
                </p>
              )}
              {role.permissions.length > 0 && (
                <>
                  <div className='border-t border-gray-700 my-2' />
                  <div>
                    <p className='text-xs font-semibold text-gray-400 mb-2'>
                      Permissions:
                    </p>
                    <div className='space-y-1'>
                      {role.permissions.map(permission => (
                        <p key={permission.id} className='text-xs text-gray-500'>
                          •
                          {' '}
                          {permission.action}
                          {' '}
                          {permission.resource}
                        </p>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
      {error && (
        <p className='text-sm text-red-400'>{error}</p>
      )}
    </div>
  )
}
