import { Link, useParams, useLocation } from '@tanstack/react-router'
import dayjs from 'dayjs'
import {
  Clock,
  GitBranch,
  Home,
  Sparkles,
  ChevronRight,
  Zap,
  BarChart3,
} from 'lucide-react'
import { lastTag } from '~build/git'
import buildTime from '~build/time'
import { cn } from '@/utils'

const menus = [
  {
    icon: Home,
    text: 'Dashboard',
    description: 'Project overview',
    link: (id: number) => `/${id}`,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: BarChart3,
    text: 'Analytics',
    description: 'Detailed insights',
    link: (id: number) => `/${id}/view`,
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Sparkles,
    text: 'Prompts',
    description: 'Manage prompts',
    link: (id: number) => `/${id}/prompts`,
    color: 'from-emerald-500 to-teal-500',
  },
]

function Menubar() {
  const params: { pid: string } = useParams({ strict: false })
  const location = useLocation()

  const isActive = (menu: typeof menus[0]) => {
    const currentPath = location.pathname
    const menuPath = menu.link(params?.pid ? ~~params.pid : 0)
    return currentPath === menuPath
  }

  return (
    <nav className='w-64 h-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/20 flex flex-col overflow-hidden'>
      {/* Header */}
      <div className='p-6 border-b border-white/10'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg'>
            <Zap className='w-5 h-5 text-white' />
          </div>
          <div>
            <h2 className='text-lg font-bold text-white'>PromptPal</h2>
            <p className='text-xs text-gray-400'>AI Management Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className='flex-1 p-4 space-y-2'>
        {menus.map((menu) => {
          const Icon = menu.icon
          const active = isActive(menu)

          return (
            <Link
              key={menu.text}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              to={menu.link(params?.pid ? ~~params.pid : 0) as any}
              className={cn(
                'group relative flex items-center w-full p-4 rounded-xl transition-all duration-300 overflow-hidden',
                active
                  ? 'bg-white/[0.08] border border-white/20 shadow-lg'
                  : 'hover:bg-white/[0.05] hover:border-white/10 border border-transparent',
              )}
            >
              {/* Background gradient for active state */}
              {active && (
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-r opacity-10 rounded-xl',
                  menu.color,
                )}
                />
              )}

              {/* Icon container */}
              <div className={cn(
                'relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300',
                active
                  ? `bg-gradient-to-br ${menu.color} shadow-lg`
                  : 'bg-white/[0.05] group-hover:bg-white/[0.08]',
              )}
              >
                <Icon className={cn(
                  'w-5 h-5 transition-colors duration-300',
                  active ? 'text-white' : 'text-gray-400 group-hover:text-gray-200',
                )}
                />
              </div>

              {/* Content */}
              <div className='flex-1 ml-4 min-w-0'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className={cn(
                      'text-sm font-semibold transition-colors duration-300',
                      active ? 'text-white' : 'text-gray-200 group-hover:text-white',
                    )}
                    >
                      {menu.text}
                    </h3>
                    <p className={cn(
                      'text-xs transition-colors duration-300',
                      active ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400',
                    )}
                    >
                      {menu.description}
                    </p>
                  </div>

                  {/* Active indicator or chevron */}
                  {active
                    ? (
                        <div className='w-2 h-2 rounded-full bg-white shadow-lg' />
                      )
                    : (
                        <ChevronRight className='w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300' />
                      )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Footer */}
      <div className='p-4 border-t border-white/10 bg-white/[0.02]'>
        <div className='space-y-3'>
          <div className='flex items-center gap-2 text-xs text-gray-400'>
            <GitBranch className='w-3 h-3' />
            <span className='font-mono'>
              v
              {lastTag}
            </span>
          </div>
          <div className='flex items-center gap-2 text-xs text-gray-500'>
            <Clock className='w-3 h-3' />
            <span>{dayjs(buildTime).format('MMM DD, HH:mm')}</span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Menubar
