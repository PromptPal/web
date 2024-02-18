import { HomeIcon, SparklesIcon, Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import { Link, useLocation } from 'react-router-dom'
import { NavLink } from '@mantine/core'
import buildTime from '~build/time'
import { lastTag } from '~build/info'
import dayjs from 'dayjs'

const menus = [
  {
    icon: <HomeIcon className='w-3 h-3' />,
    text: 'Overall',
    link: '/',
  },
  {
    icon: <Bars3BottomLeftIcon className='w-3 h-3' />,
    text: 'Projects',
    link: '/projects',
  },
  {
    icon: <SparklesIcon className='w-3 h-3' />,
    text: 'Prompts',
    link: '/prompts',
  }
]

function Menubar() {
  const sq = useLocation().search
  return (
    <nav className='py-2 w-40 hover:backdrop-blur-sm rounded-lg flex flex-col items-center justify-between'>
      <ul>
        {menus.map((menu) => (
          <li key={menu.text}>
            <NavLink
              component={Link}
              to={menu.link + `${sq.includes('?') ? '' : '?'}${sq}`}
              className='flex items-center mb-2'
              label={(
                <div className='flex items-center'>
                  {menu.icon}
                  <span className='ml-2'>{menu.text}</span>
                </div>
              )}
            >
            </NavLink>
          </li>
        ))}
      </ul>
      <div className='w-full pb-2 mr-4'>
        <hr className='divide-x my-4' />
        <div className='text-xs text-gray-600 dark:text-gray-300 flex flex-col gap-2'>
          <span>
            FE build tag: {lastTag}
          </span>
          <span>
            FE BuildTime: {dayjs(buildTime).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        </div>
      </div>
    </nav>
  )
}

export default Menubar