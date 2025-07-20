import { motion } from 'framer-motion'
import { Server, Info, Mail, ExternalLink, Cpu, Database, Clock, Shield } from 'lucide-react'

interface SystemInfo {
  name: string
  version: string
  buildDate: string
  environment: string
  uptime: string
  status: 'healthy' | 'warning' | 'error'
}

function SystemTab() {
  // Mock system information
  const systemInfo: SystemInfo = {
    name: 'PromptPal',
    version: '1.15.0',
    buildDate: '2024-01-12T10:30:00Z',
    environment: 'Production',
    uptime: '45 days, 12 hours',
    status: 'healthy',
  }

  const supportInfo = {
    email: 'annatar.he+pp@gmail.com',
    documentation: 'https://docs.promptpal.net',
    status: 'https://status.promptpal.net',
    github: 'https://github.com/PromptPal',
  }

  const systemStats = [
    {
      icon: <Cpu className='w-5 h-5' />,
      label: 'API Response Time',
      value: '45ms',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <Database className='w-5 h-5' />,
      label: 'Database Health',
      value: '99.9%',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Shield className='w-5 h-5' />,
      label: 'Security Status',
      value: 'Secure',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Clock className='w-5 h-5' />,
      label: 'Last Update',
      value: '2 days ago',
      color: 'from-orange-500 to-red-500',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500/10 text-green-300 border-green-500/20'
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20'
      case 'error':
        return 'bg-red-500/10 text-red-300 border-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-300 border-gray-500/20'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
          <div className='p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500'>
            <Server className='w-5 h-5 text-white' />
          </div>
          <h3 className='text-lg font-semibold text-gray-200'>System Information</h3>
        </div>
        <p className='text-gray-400'>
          Current system status, version information, and support resources.
        </p>
      </div>

      {/* System Overview */}
      <div className='grid gap-6 grid-cols-1 lg:grid-cols-2'>
        {/* System Details */}
        <div className='backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 rounded-xl p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500'>
              <Info className='w-5 h-5 text-white' />
            </div>
            <h4 className='text-lg font-semibold text-gray-200'>System Details</h4>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-400'>System Name</span>
              <span className='text-gray-200 font-semibold'>{systemInfo.name}</span>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-gray-400'>Version</span>
              <span className='text-gray-200 font-mono'>{systemInfo.version}</span>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-gray-400'>Environment</span>
              <span className='text-gray-200'>{systemInfo.environment}</span>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-gray-400'>Build Date</span>
              <span className='text-gray-200'>{formatDate(systemInfo.buildDate)}</span>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-gray-400'>Uptime</span>
              <span className='text-gray-200'>{systemInfo.uptime}</span>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-gray-400'>Status</span>
              <div className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(systemInfo.status)}`}>
                <span className='capitalize'>{systemInfo.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className='backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 rounded-xl p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500'>
              <Mail className='w-5 h-5 text-white' />
            </div>
            <h4 className='text-lg font-semibold text-gray-200'>Get Help</h4>
          </div>

          <div className='space-y-4'>
            <div className='p-4 rounded-lg bg-green-500/10 border border-green-500/20'>
              <div className='flex items-center gap-3 mb-2'>
                <Mail className='w-4 h-4 text-green-400' />
                <span className='text-sm font-medium text-green-300'>Email Support</span>
              </div>
              <p className='text-xs text-green-400 mb-3'>
                For technical issues, feature requests, or general inquiries
              </p>
              <a
                href={`mailto:${supportInfo.email}`}
                className='flex items-center gap-2 text-green-300 hover:text-green-200 transition-colors'
              >
                <span className='font-mono text-sm'>{supportInfo.email}</span>
                <ExternalLink className='w-3 h-3' />
              </a>
            </div>

            <div className='space-y-3'>
              <a
                href={supportInfo.documentation}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors group'
              >
                <div className='flex items-center gap-3'>
                  <Info className='w-4 h-4 text-blue-400' />
                  <span className='text-gray-300 group-hover:text-gray-200'>Documentation</span>
                </div>
                <ExternalLink className='w-4 h-4 text-gray-400 group-hover:text-gray-300' />
              </a>

              <a
                href={supportInfo.status}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors group'
              >
                <div className='flex items-center gap-3'>
                  <Server className='w-4 h-4 text-green-400' />
                  <span className='text-gray-300 group-hover:text-gray-200'>System Status</span>
                </div>
                <ExternalLink className='w-4 h-4 text-gray-400 group-hover:text-gray-300' />
              </a>

              <a
                href={supportInfo.github}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors group'
              >
                <div className='flex items-center gap-3'>
                  <svg className='w-4 h-4 text-purple-400' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                  </svg>
                  <span className='text-gray-300 group-hover:text-gray-200'>GitHub Repository</span>
                </div>
                <ExternalLink className='w-4 h-4 text-gray-400 group-hover:text-gray-300' />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* System Statistics */}
      <div className='backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 rounded-xl p-6'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500'>
            <Cpu className='w-5 h-5 text-white' />
          </div>
          <h4 className='text-lg font-semibold text-gray-200'>System Metrics</h4>
        </div>

        <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
          {systemStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='p-4 rounded-lg bg-gray-800/50'
            >
              <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${stat.color} mb-3`}>
                {stat.icon}
              </div>
              <p className='text-sm text-gray-400 mb-1'>{stat.label}</p>
              <p className='text-xl font-bold text-gray-200'>{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Version History */}
      <div className='backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 rounded-xl p-6'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500'>
            <Clock className='w-5 h-5 text-white' />
          </div>
          <h4 className='text-lg font-semibold text-gray-200'>Recent Updates</h4>
        </div>

        <div className='space-y-3'>
          <div className='p-4 rounded-lg bg-gray-800/50'>
            <div className='flex items-center justify-between mb-2'>
              <span className='font-mono text-green-300'>v1.15.0</span>
              <span className='text-xs text-gray-400'>Current Version</span>
            </div>
            <p className='text-sm text-gray-300'>Enhanced profile management with tabbed interface</p>
          </div>

          <div className='p-4 rounded-lg bg-gray-800/30'>
            <div className='flex items-center justify-between mb-2'>
              <span className='font-mono text-gray-400'>v1.14.2</span>
              <span className='text-xs text-gray-500'>2 weeks ago</span>
            </div>
            <p className='text-sm text-gray-400'>Performance improvements and bug fixes</p>
          </div>

          <div className='p-4 rounded-lg bg-gray-800/30'>
            <div className='flex items-center justify-between mb-2'>
              <span className='font-mono text-gray-400'>v1.14.0</span>
              <span className='text-xs text-gray-500'>1 month ago</span>
            </div>
            <p className='text-sm text-gray-400'>Added advanced analytics and provider management</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SystemTab
