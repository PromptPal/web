import Button from '@/components/Button/Button'
import { Check } from 'lucide-react'
import { CreatedUser } from '../types/user-creation'
import { CredentialsDisplay } from './CredentialsDisplay'

interface UserCreatedSuccessProps {
  user: CreatedUser
  onClose: () => void
}

export function UserCreatedSuccess({ user, onClose }: UserCreatedSuccessProps) {
  return (
    <div className='p-6'>
      <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4'>
        <div className='flex items-center gap-3 mb-2'>
          <Check className='w-5 h-5 text-green-600 dark:text-green-400' />
          <h3 className='font-semibold text-green-800 dark:text-green-200'>User Created Successfully</h3>
        </div>
        <p className='text-green-700 dark:text-green-300 text-sm'>
          User
          {' '}
          {user.user.name}
          {' '}
          has been created and assigned to this project.
          Please share these login credentials with the user:
        </p>
      </div>

      <CredentialsDisplay user={user} />

      <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4'>
        <div className='flex items-center gap-3'>
          <div className='w-2 h-2 rounded-full bg-yellow-500' />
          <h3 className='font-semibold text-yellow-800 dark:text-yellow-200'>Important</h3>
        </div>
        <p className='text-yellow-700 dark:text-yellow-300 text-sm mt-2'>
          Make sure to save these credentials securely. The password cannot be retrieved again.
        </p>
      </div>

      <div className='flex justify-end'>
        <Button
          onClick={onClose}
          className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-colors'
        >
          <Check className='w-4 h-4' />
          Done
        </Button>
      </div>
    </div>
  )
}
