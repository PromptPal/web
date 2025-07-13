import { Copy, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { CreatedUser } from '../types/user-creation'

interface CredentialsDisplayProps {
  user: CreatedUser
}

export function CredentialsDisplay({ user }: CredentialsDisplayProps) {
  const [showPassword, setShowPassword] = useState(false)

  const handleCopyCredentials = () => {
    const credentials = `Email: ${user.user.email}\nPassword: ${user.password}`
    navigator.clipboard.writeText(credentials)
    toast.success('Login credentials copied to clipboard')
  }

  return (
    <div className='p-4 bg-gray-900/50 border border-gray-700/50 rounded-lg'>
      <div className='flex items-center justify-between mb-4'>
        <h4 className='font-semibold text-sm text-gray-200'>Login Credentials</h4>
        <button
          onClick={handleCopyCredentials}
          className='p-2 rounded-lg hover:bg-gray-700/50 transition-colors'
          title='Copy credentials'
        >
          <Copy className='w-4 h-4 text-blue-400' />
        </button>
      </div>

      <div className='space-y-3'>
        <div className='flex items-center gap-3'>
          <span className='text-sm font-medium text-gray-300'>Email:</span>
          <span className='text-sm text-gray-400'>{user.user.email}</span>
        </div>
        <div className='flex items-center gap-3'>
          <span className='text-sm font-medium text-gray-300'>Password:</span>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-400 font-mono'>
              {showPassword ? user.password : '••••••••••••'}
            </span>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className='p-1 rounded hover:bg-gray-700/50 transition-colors'
            >
              {showPassword
                ? <EyeOff className='w-3 h-3 text-gray-400' />
                : <Eye className='w-3 h-3 text-gray-400' />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
