import { graphql } from '@/gql'
import { cn } from '@/utils'
import { useQuery as useGraphQLQuery } from '@apollo/client'
import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { Calendar, CreditCard, FolderKanban, Globe, Mail, Phone, Server, Settings, Shield, User } from 'lucide-react'
import { motion } from 'motion/react'

const userQuery = graphql(`
  query user($id: Int) {
    user(id: $id) {
      id
      name
      addr
      avatar
      email
      phone
      lang
      level
      source
    }
  }
`)

function ProfilePage() {
  const pathname = useLocation({ select: location => location.pathname })

  let activeTab: 'projects' | 'billing' | 'system' | 'admin' = 'projects'

  switch (pathname) {
    case '/profile/projects':
      activeTab = 'projects'
      break
    case '/profile/billing':
      activeTab = 'billing'
      break
    case '/profile/system':
      activeTab = 'system'
      break
    case '/profile/admin':
      activeTab = 'admin'
      break
  }

  const { data, loading } = useGraphQLQuery(userQuery, {
    variables: { id: undefined }, // Will use current user
  })

  if (loading) {
    return (
      <div className='w-full space-y-8'>
        <div className='animate-pulse'>
          <div className='h-48 bg-gray-800 rounded-2xl mb-8' />
          <div className='grid gap-6 grid-cols-1 lg:grid-cols-2'>
            <div className='h-32 bg-gray-800 rounded-xl' />
            <div className='h-32 bg-gray-800 rounded-xl' />
            <div className='h-32 bg-gray-800 rounded-xl' />
            <div className='h-32 bg-gray-800 rounded-xl' />
          </div>
        </div>
      </div>
    )
  }

  const user = data?.user

  if (!user) {
    return (
      <div className='w-full space-y-8'>
        <div className='text-center py-12'>
          <User className='w-16 h-16 text-gray-400 mx-auto mb-4' />
          <h2 className='text-xl font-semibold text-gray-300 mb-2'>Profile not found</h2>
          <p className='text-gray-500'>Unable to load user profile information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full space-y-8'>
      {/* Header Section with User Info */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='relative overflow-hidden'
      >
        <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 blur-3xl' />
        <div className='relative backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 shadow-2xl rounded-2xl'>
          <div className='p-8'>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
              <div className='relative'>
                <div className='w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-1'>
                  <div className='w-full h-full rounded-full bg-gray-800 flex items-center justify-center'>
                    {user.avatar
                      ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className='w-full h-full rounded-full object-cover'
                          />
                        )
                      : (
                          <User className='w-10 h-10 text-gray-400' />
                        )}
                  </div>
                </div>
                <div className='absolute -bottom-2 -right-2 p-1 rounded-full bg-gradient-to-br from-purple-500 to-blue-500'>
                  <Shield className='w-4 h-4 text-white' />
                </div>
              </div>
              <div className='space-y-3 flex-1'>
                <div>
                  <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent'>
                    {user.name}
                  </h1>
                  <p className='text-gray-400 text-sm font-mono'>
                    {user.addr}
                  </p>
                </div>
                <div className='flex items-center gap-4 text-sm'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
                    <span className='text-gray-400'>
                      Level
                      {user.level}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4 text-gray-400' />
                    <span className='text-gray-400'>
                      Source:
                      {user.source}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Profile Details Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='grid gap-6 grid-cols-1 lg:grid-cols-2'
      >
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 rounded-xl p-6'
        >
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500'>
              <Mail className='w-5 h-5 text-white' />
            </div>
            <h3 className='text-lg font-semibold text-gray-200'>Contact Information</h3>
          </div>
          <div className='space-y-4'>
            <div className='flex items-center gap-3 p-3 rounded-lg bg-gray-800/50'>
              <Mail className='w-4 h-4 text-gray-400' />
              <div>
                <p className='text-sm text-gray-400'>Email</p>
                <p className='text-gray-200'>{user.email || 'Not provided'}</p>
              </div>
            </div>
            <div className='flex items-center gap-3 p-3 rounded-lg bg-gray-800/50'>
              <Phone className='w-4 h-4 text-gray-400' />
              <div>
                <p className='text-sm text-gray-400'>Phone</p>
                <p className='text-gray-200'>{user.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 rounded-xl p-6'
        >
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500'>
              <Globe className='w-5 h-5 text-white' />
            </div>
            <h3 className='text-lg font-semibold text-gray-200'>Preferences</h3>
          </div>
          <div className='space-y-4'>
            <div className='flex items-center gap-3 p-3 rounded-lg bg-gray-800/50'>
              <Globe className='w-4 h-4 text-gray-400' />
              <div>
                <p className='text-sm text-gray-400'>Language</p>
                <p className='text-gray-200'>{user.lang}</p>
              </div>
            </div>
            <div className='flex items-center gap-3 p-3 rounded-lg bg-gray-800/50'>
              <Shield className='w-4 h-4 text-gray-400' />
              <div>
                <p className='text-sm text-gray-400'>Account Level</p>
                <p className='text-gray-200'>
                  Level
                  {user.level}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Account Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 rounded-xl p-6 lg:col-span-2'
        >
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500'>
              <User className='w-5 h-5 text-white' />
            </div>
            <h3 className='text-lg font-semibold text-gray-200'>Account Details</h3>
          </div>
          <div className='grid gap-4 grid-cols-1 md:grid-cols-3'>
            <div className='p-3 rounded-lg bg-gray-800/50'>
              <p className='text-sm text-gray-400 mb-1'>User ID</p>
              <p className='text-gray-200 font-mono'>
                #
                {user.id}
              </p>
            </div>
            <div className='p-3 rounded-lg bg-gray-800/50'>
              <p className='text-sm text-gray-400 mb-1'>Wallet Address</p>
              <p className='text-gray-200 font-mono text-xs break-all'>{user.addr}</p>
            </div>
            <div className='p-3 rounded-lg bg-gray-800/50'>
              <p className='text-sm text-gray-400 mb-1'>Registration Source</p>
              <p className='text-gray-200 capitalize'>{user.source}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Tabs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className='space-y-6'
      >
        {/* Tab Navigation */}
        <div className='backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 rounded-xl p-2'>
          <div className='flex flex-wrap gap-1'>
            <Link
              to='/profile/projects'
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 min-w-0',
                activeTab === 'projects'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50',
              )}
            >
              <FolderKanban className='w-4 h-4 flex-shrink-0' />
              <span className='truncate'>Projects</span>
            </Link>
            <Link
              to='/profile/billing'
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 min-w-0',
                activeTab === 'billing'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50',
              )}
            >
              <CreditCard className='w-4 h-4 flex-shrink-0' />
              <span className='truncate'>Billing</span>
            </Link>
            <Link
              to='/profile/system'
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 min-w-0',
                activeTab === 'system'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50',
              )}
            >
              <Server className='w-4 h-4 flex-shrink-0' />
              <span className='truncate'>System</span>
            </Link>
            {user?.level && user.level >= 100 && (
              <Link
                to='/profile/admin'
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 min-w-0',
                  activeTab === 'admin'
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50',
                )}
              >
                <Settings className='w-4 h-4 flex-shrink-0' />
                <span className='truncate'>Admin</span>
              </Link>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className='min-h-[400px]'
        >
          <Outlet />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default ProfilePage
