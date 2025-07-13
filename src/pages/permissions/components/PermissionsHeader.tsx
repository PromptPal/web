import { motion } from 'framer-motion'
import { Shield, Users, Plus } from 'lucide-react'
import { MockUserRole } from '../permissions.query'

interface PermissionsHeaderProps {
  projectName?: string
  users: MockUserRole[]
  isSystemAdmin: boolean
  onCreateUser: () => void
}

export function PermissionsHeader({
  projectName,
  users,
  isSystemAdmin,
  onCreateUser,
}: PermissionsHeaderProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='relative overflow-hidden'
    >
      <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 blur-3xl' />
      <div className='relative backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 shadow-2xl rounded-2xl'>
        <div className='p-8'>
          <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500'>
                  <Shield className='w-6 h-6 text-white' />
                </div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent'>
                  Permissions
                </h1>
              </div>
              <p className='text-gray-300 max-w-xl'>
                Manage user access and permissions for
                {' '}
                {projectName || 'this project'}
              </p>
              <div className='flex items-center gap-4 text-sm'>
                <div className='flex items-center gap-2'>
                  <Users className='w-4 h-4 text-gray-400' />
                  <span className='text-gray-400'>
                    {users.length}
                    {' '}
                    Users with access
                  </span>
                </div>
                {isSystemAdmin && (
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
                    <span className='text-gray-400'>System Admin</span>
                  </div>
                )}
              </div>
            </div>
            {isSystemAdmin && (
              <button
                onClick={onCreateUser}
                className='group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300' />
                <Plus className='w-4 h-4 relative z-10' />
                <span className='relative z-10'>Create User</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
