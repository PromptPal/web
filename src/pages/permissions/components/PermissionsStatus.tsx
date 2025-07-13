import { Loader2 } from 'lucide-react'
import { AlertMessage } from './AlertMessage'

interface PermissionsStatusProps {
  isLoading?: boolean
  error?: Error | null
  hasNoProject?: boolean
  hasNoPermission?: boolean
  canManagePermissions?: boolean
}

export function PermissionsStatus({
  isLoading,
  error,
  hasNoProject,
  hasNoPermission,
}: PermissionsStatusProps) {
  if (hasNoProject) {
    return (
      <div className='w-full p-8'>
        <AlertMessage
          type='warning'
          message='Please select a project from the header to manage permissions'
        />
      </div>
    )
  }

  if (hasNoPermission) {
    return (
      <div className='w-full p-8'>
        <AlertMessage
          type='error'
          message="You don't have permission to access this page. Only system administrators and project administrators can manage permissions."
        />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-sky-500' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='w-full p-8'>
        <AlertMessage
          type='error'
          message={`Failed to load users: ${error.message}`}
        />
      </div>
    )
  }

  return null
}
