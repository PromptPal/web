import { Link, useParams } from '@tanstack/react-router'
import { Plus, Webhook, Settings, Activity } from 'lucide-react'

export function PageHeader() {
  const params = useParams({ from: '/$pid/webhooks' })
  const projectId = params.pid

  return (
    <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
      {/* Title and description */}
      <div className='space-y-2'>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl blur-lg opacity-75' />
            <div className='relative bg-gradient-to-br from-violet-500 to-purple-600 p-3 rounded-xl shadow-lg'>
              <Webhook className='h-6 w-6 text-white' />
            </div>
          </div>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              Webhooks
            </h1>
            <p className='text-gray-500 dark:text-gray-400 mt-1'>
              Manage webhook endpoints for real-time event notifications
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className='flex items-center gap-3'>
        {/* Quick stats */}
        <div className='hidden lg:flex items-center gap-4 mr-4'>
          <div className='flex items-center gap-2 px-3 py-2 bg-white/20 dark:bg-gray-800/20 rounded-lg border border-white/10 dark:border-gray-700/50'>
            <Activity className='h-4 w-4 text-green-500' />
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Active
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className='flex items-center gap-2'>
          <Link
            to={`/${projectId}/webhooks/new`}
            className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
          >
            <Plus className='h-4 w-4' />
            <span className='hidden sm:inline'>New Webhook</span>
          </Link>

          <button className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-800/30 border border-white/10 dark:border-gray-700/50 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'>
            <Settings className='h-4 w-4' />
            <span className='hidden sm:inline'>Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}
