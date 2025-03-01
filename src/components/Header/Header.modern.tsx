import { Project } from '@/gql/graphql'
import { Link, useMatch } from '@tanstack/react-router'
import { BookText, Home, PlusCircle, Settings } from 'lucide-react'
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
    <header className='bg-gray-800 border-b border-gray-700'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center space-x-8'>
            <div className='flex items-center'>
              <div className='bg-linear-to-r from-purple-500 to-pink-500 p-2 rounded-lg'>
                <BookText className='h-6 w-6 text-white' />
              </div>
              <span className='ml-2 text-xl font-bold text-white'>
                PromptPal
              </span>
            </div>

            <ProjectSelector />
          </div>

          <div className='flex items-center space-x-4'>
            {pid && (
              <nav className='flex space-x-2'>
                <NavItem
                  icon={<Home size={20} />}
                  to={`/${pid}`}
                  label='Home'
                />
                <NavItem
                  icon={<PlusCircle size={20} />}
                  to={`/${pid}/prompts/new`}
                  label='New Prompt'
                />
                <NavItem
                  icon={<Settings size={20} />}
                  to={`/${pid}/edit`}
                  label='Settings'
                />
              </nav>
            )}

            <Profile />
            <LoginButton />
          </div>
        </div>
      </div>
    </header>
  )
}

function NavItem({ icon, label, active, to }: NavItemProps) {
  return (
    <Link
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
        active
          ? 'bg-linear-to-r from-purple-500/20 to-pink-500/20 text-purple-400'
          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
      }`}
      to={to}
    >
      {icon}
      <span className='ml-2'>{label}</span>
    </Link>
  )
}

export default Header
