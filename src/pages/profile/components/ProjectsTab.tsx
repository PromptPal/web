import { motion } from 'framer-motion'
import { FolderKanban, Eye, Edit, Settings, Users } from 'lucide-react'

interface ProjectPermission {
  id: string
  name: string
  description: string
  role: 'admin' | 'editor' | 'viewer'
  lastAccessed: string
  createdAt: string
}

function ProjectsTab() {
  // Mock data for user's project permissions
  const projectPermissions: ProjectPermission[] = [
    {
      id: '1',
      name: 'AI Chat Assistant',
      description: 'Customer support chatbot project',
      role: 'admin',
      lastAccessed: '2024-01-10T10:30:00Z',
      createdAt: '2023-12-01T09:00:00Z',
    },
    {
      id: '2',
      name: 'Content Generator',
      description: 'Blog post and article generation',
      role: 'editor',
      lastAccessed: '2024-01-09T14:15:00Z',
      createdAt: '2023-11-15T16:30:00Z',
    },
    {
      id: '3',
      name: 'Data Analysis Bot',
      description: 'Automated data insights and reports',
      role: 'viewer',
      lastAccessed: '2024-01-08T11:45:00Z',
      createdAt: '2023-10-20T13:20:00Z',
    },
    {
      id: '4',
      name: 'Marketing Assistant',
      description: 'Social media and marketing content',
      role: 'admin',
      lastAccessed: '2024-01-11T08:00:00Z',
      createdAt: '2024-01-05T10:00:00Z',
    },
  ]

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Settings className='w-4 h-4 text-red-400' />
      case 'editor':
        return <Edit className='w-4 h-4 text-blue-400' />
      case 'viewer':
        return <Eye className='w-4 h-4 text-green-400' />
      default:
        return <Eye className='w-4 h-4 text-gray-400' />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/10 text-red-300 border-red-500/20'
      case 'editor':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/20'
      case 'viewer':
        return 'bg-green-500/10 text-green-300 border-green-500/20'
      default:
        return 'bg-gray-500/10 text-gray-300 border-gray-500/20'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
          <div className='p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500'>
            <FolderKanban className='w-5 h-5 text-white' />
          </div>
          <h3 className='text-lg font-semibold text-gray-200'>My Projects</h3>
        </div>
        <p className='text-gray-400'>
          Overview of projects you have access to and your permission levels.
        </p>
      </div>

      {/* Projects Grid */}
      <div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
        {projectPermissions.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className='backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all duration-200'
          >
            {/* Project Header */}
            <div className='flex items-start justify-between mb-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500'>
                  <FolderKanban className='w-4 h-4 text-white' />
                </div>
                <div>
                  <h4 className='text-gray-200 font-semibold'>{project.name}</h4>
                  <p className='text-sm text-gray-400'>{project.description}</p>
                </div>
              </div>
            </div>

            {/* Role Badge */}
            <div className='flex items-center justify-between mb-4'>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getRoleColor(project.role)}`}>
                {getRoleIcon(project.role)}
                <span className='text-xs font-medium capitalize'>{project.role}</span>
              </div>
              <span className='text-xs text-gray-500'>
                ID: #
                {project.id}
              </span>
            </div>

            {/* Project Stats */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-400'>Last Accessed</span>
                <span className='text-gray-300'>{formatDate(project.lastAccessed)}</span>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-400'>Joined</span>
                <span className='text-gray-300'>{formatDate(project.createdAt)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className='flex items-center gap-2 mt-4 pt-4 border-t border-gray-700/50'>
              <button className='flex items-center gap-2 px-3 py-1.5 text-xs bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors'>
                <Eye className='w-3 h-3' />
                View
              </button>
              {(project.role === 'admin' || project.role === 'editor') && (
                <button className='flex items-center gap-2 px-3 py-1.5 text-xs bg-green-600/20 text-green-300 rounded-lg hover:bg-green-600/30 transition-colors'>
                  <Edit className='w-3 h-3' />
                  Edit
                </button>
              )}
              {project.role === 'admin' && (
                <button className='flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-600/20 text-gray-300 rounded-lg hover:bg-gray-600/30 transition-colors'>
                  <Users className='w-3 h-3' />
                  Manage
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className='backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 rounded-xl p-6'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500'>
            <Users className='w-5 h-5 text-white' />
          </div>
          <h4 className='text-lg font-semibold text-gray-200'>Permission Summary</h4>
        </div>

        <div className='grid gap-4 grid-cols-1 md:grid-cols-3'>
          <div className='p-4 rounded-lg bg-red-500/10 border border-red-500/20'>
            <div className='flex items-center gap-2 mb-2'>
              <Settings className='w-4 h-4 text-red-400' />
              <span className='text-sm font-medium text-red-300'>Admin Access</span>
            </div>
            <p className='text-2xl font-bold text-red-300'>
              {projectPermissions.filter(p => p.role === 'admin').length}
            </p>
            <p className='text-xs text-red-400'>Full project control</p>
          </div>

          <div className='p-4 rounded-lg bg-blue-500/10 border border-blue-500/20'>
            <div className='flex items-center gap-2 mb-2'>
              <Edit className='w-4 h-4 text-blue-400' />
              <span className='text-sm font-medium text-blue-300'>Editor Access</span>
            </div>
            <p className='text-2xl font-bold text-blue-300'>
              {projectPermissions.filter(p => p.role === 'editor').length}
            </p>
            <p className='text-xs text-blue-400'>Can edit content</p>
          </div>

          <div className='p-4 rounded-lg bg-green-500/10 border border-green-500/20'>
            <div className='flex items-center gap-2 mb-2'>
              <Eye className='w-4 h-4 text-green-400' />
              <span className='text-sm font-medium text-green-300'>Viewer Access</span>
            </div>
            <p className='text-2xl font-bold text-green-300'>
              {projectPermissions.filter(p => p.role === 'viewer').length}
            </p>
            <p className='text-xs text-green-400'>Read-only access</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectsTab
