import { Link, useParams } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { Box, Clock, GitBranch, Home, Sparkles } from 'lucide-react'
import { lastTag } from '~build/info'
import buildTime from '~build/time'
import LinkGlow from './Button/LinkGlow'

const menus = [
  {
    icon: Home,
    text: 'Overall',
    link: (id: number) => `/${id}`,
  },
  {
    icon: Box,
    text: 'Detail',
    link: (id: number) => `/${id}/view`,
  },
  {
    icon: Sparkles,
    text: 'Prompts',
    link: (id: number) => `/${id}/prompts`,
  },
]

function Menubar() {
  const params: { pid: string } = useParams({ strict: false })
  return (
    <nav className='py-4 w-48 backdrop-blur-sm bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 shadow-xl rounded-xl flex flex-col items-center justify-between transition-all duration-300 hover:shadow-2xl hover:from-gray-900/90 hover:to-gray-800/90'>
      <ul className='w-full flex flex-col gap-2 px-2'>
        {menus.map((menu) => {
          const Icon = menu.icon
          return (
            <li key={menu.text}>
              <Link
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                to={menu.link(params?.pid ? ~~params.pid : 0) as any}
                className='w-full flex items-center px-4 py-3 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 hover:bg-gray-700/30 group'
              >
                <div className='flex items-center text-gray-400 group-hover:text-blue-400'>
                  <Icon className='w-4 h-4' />
                  <span className='mx-3'>{menu.text}</span>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
      <div className='w-full px-4 pb-2'>
        <div className='h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent my-4' />
        <div className='text-xs text-gray-500 flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <GitBranch className='w-3 h-3' />
            <span>Build: {lastTag}</span>
          </div>
          <div className='flex items-center gap-2'>
            <Clock className='w-3 h-3' />
            <span>{dayjs(buildTime).format('YYYY-MM-DD HH:mm')}</span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Menubar
