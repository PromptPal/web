import { CubeIcon, HomeIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { NavLink } from '@mantine/core'
import dayjs from 'dayjs'
import { Link, useParams } from 'react-router-dom'
import { lastTag } from '~build/info'
import buildTime from '~build/time'
import LinkGlow from './Button/LinkGlow'

const menus = [
  {
    icon: <HomeIcon className='w-3 h-3' />,
    text: 'Overall',
    link: (id: number) => `/${id}`,
  },
  {
    icon: <CubeIcon className='w-3 h-3' />,
    text: 'Detail',
    link: (id: number) => `/${id}/view`,
  },
  // {
  //   icon: <Bars3BottomLeftIcon className='w-3 h-3' />,
  //   text: 'Projects',
  //   link: '/projects',
  // },
  {
    icon: <SparklesIcon className='w-3 h-3' />,
    text: 'Prompts',
    link: (id: number) => `/${id}/prompts`,
  },
]

function Menubar() {
  const params = useParams<{ pid: string }>()
  return (
    <nav className='py-2 w-40 hover:backdrop-blur-sm rounded-lg flex flex-col items-center justify-between'>
      <ul className='flex flex-col gap-4'>
        {menus.map((menu) => (
          <li key={menu.text}>
            <LinkGlow
              to={menu.link(params?.pid ? ~~params.pid : 0)}
              className='flex items-center px-4 py-2 rounded font-bold text-sm cursor-pointer'
            >
              <div className='flex items-center'>
                {menu.icon}
                <span className='ml-2'>{menu.text}</span>
              </div>
            </LinkGlow>
          </li>
        ))}
      </ul>
      <div className='w-full pb-2 mr-4'>
        <hr className='divide-x my-4' />
        <div className='text-xs text-gray-600 dark:text-gray-300 flex flex-col gap-2'>
          <span>FE build tag: {lastTag}</span>
          <span>
            FE BuildTime: {dayjs(buildTime).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        </div>
      </div>
    </nav>
  )
}

export default Menubar
