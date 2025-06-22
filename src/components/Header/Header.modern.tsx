import { Link, useMatch } from '@tanstack/react-router'
import { BookText, Home, PlusCircle, Settings, Sparkles } from 'lucide-react'
import React from 'react'
import Profile from './Profile'
import ProjectSelector from './ProjectSelector'
import LoginButton from './login'

interface NavItemProps {
  icon: React.ReactNode
  label: string
  to: React.ComponentProps<typeof Link>['to']
  active?: boolean
}

export function Header() {
  const pid = useMatch({ from: '/$pid', shouldThrow: false })?.params.pid

  return (
    <header className='sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50 transition-all duration-300'>
      <div className='mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo and Brand */}
          <div className='flex items-center gap-8'>
            <Link to='/' className='flex items-center gap-3 group'>
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity' />
                <div className='relative bg-gradient-to-br from-violet-500 to-indigo-600 p-2.5 rounded-xl shadow-lg transform group-hover:scale-110 transition-all duration-300'>
                  <BookText className='h-5 w-5 text-white' strokeWidth={2.5} />
                </div>
              </div>
              <div className='flex items-center gap-1.5'>
                <span className='text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent'>
                  PromptPal
                </span>
                <Sparkles className='h-4 w-4 text-violet-500 dark:text-violet-400 animate-pulse' />
              </div>
            </Link>

            <div className='hidden lg:block h-8 w-px bg-gray-200 dark:bg-gray-700' />

            <ProjectSelector />
          </div>

          {/* Navigation and Actions */}
          <div className='flex items-center gap-2'>
            {pid && (
              <nav className='hidden md:flex items-center gap-1 mr-4'>
                <NavItem
                  icon={<Home size={18} strokeWidth={2} />}
                  to={`/${pid}`}
                  label='Dashboard'
                />
                <NavItem
                  icon={<PlusCircle size={18} strokeWidth={2} />}
                  to={`/${pid}/prompts/new`}
                  label='New Prompt'
                />
                <NavItem
                  icon={<Settings size={18} strokeWidth={2} />}
                  to={`/${pid}/edit`}
                  label='Settings'
                />
              </nav>
            )}

            <div className='flex items-center gap-3'>
              <Profile />
              <LoginButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function NavItem({ icon, label, active, to }: NavItemProps) {
  return (
    <Link
      to={to}
      className={`
        relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
        transition-all duration-200 group
        ${
    active
      ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10'
      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800/50'
    }
      `}
      activeProps={{
        className: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10',
      }}
    >
      <span className='relative z-10 flex items-center gap-2'>
        {icon}
        <span className='hidden lg:inline'>{label}</span>
      </span>
      {active && (
        <div className='absolute inset-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 dark:from-violet-500/20 dark:to-indigo-500/20 rounded-lg' />
      )}
    </Link>
  )
}

export default Header
