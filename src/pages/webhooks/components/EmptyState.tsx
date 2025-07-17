import { Link, useParams } from '@tanstack/react-router'
import { Plus, Webhook, Zap } from 'lucide-react'

export function EmptyState() {
  const params = useParams({ from: '/$pid/webhooks' })
  const projectId = params.pid

  return (
    <div className='flex flex-col items-center justify-center p-12 text-center space-y-6'>
      {/* Icon and illustration */}
      <div className='relative'>
        <div className='absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full blur-2xl opacity-20 animate-pulse' />
        <div className='relative bg-gradient-to-br from-violet-500 to-purple-600 p-6 rounded-full shadow-lg'>
          <Webhook className='h-12 w-12 text-white' />
        </div>
        {/* Decorative elements */}
        <div className='absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 p-1.5 rounded-full shadow-lg animate-bounce'>
          <Zap className='h-4 w-4 text-white' />
        </div>
      </div>

      {/* Content */}
      <div className='space-y-3 max-w-md'>
        <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
          No webhooks configured yet
        </h3>
        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>
          Webhooks allow you to receive real-time notifications when events occur in your project.
          Get started by creating your first webhook endpoint.
        </p>
      </div>

      {/* Action buttons */}
      <div className='flex flex-col sm:flex-row gap-4 pt-4'>
        <Link
          to={`/${projectId}/webhooks/new`}
          className='inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
        >
          <Plus className='h-4 w-4' />
          Create your first webhook
        </Link>

        <button className='inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'>
          <Webhook className='h-4 w-4' />
          Learn about webhooks
        </button>
      </div>

      {/* Feature highlights */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 max-w-2xl'>
        {[
          {
            title: 'Real-time Events',
            description: 'Get notified instantly when prompts are called or modified',
            icon: Zap,
          },
          {
            title: 'Secure Delivery',
            description: 'Webhooks are signed with a secret for secure verification',
            icon: '🔒',
          },
          {
            title: 'Retry Logic',
            description: 'Failed deliveries are automatically retried with backoff',
            icon: '🔄',
          },
        ].map((feature, index) => (
          <div key={index} className='p-4 bg-white/20 dark:bg-gray-800/20 rounded-lg border border-white/10 dark:border-gray-700/50'>
            <div className='text-2xl mb-2'>
              {typeof feature.icon === 'string' ? feature.icon : <feature.icon className='h-6 w-6 text-violet-500' />}
            </div>
            <h4 className='font-medium text-gray-900 dark:text-white text-sm'>
              {feature.title}
            </h4>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
