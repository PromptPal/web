import { HomeIcon, SparklesIcon, Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

type MenubarProps = {
}

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

function Menubar(props: MenubarProps) {
  return (
    <nav className='py-2 px-8 hover:bg-blue-300 hover:bg-opacity-10 hover:backdrop-blur-sm mt-4 rounded-lg h-full min-h-[500px]'>
      <ul>
        {menus.map((menu) => (
          <li key={menu.text}>
            <Link
              to={menu.link}
              className='flex items-center'
            >
              {menu.icon}
              <span className='ml-2'>{menu.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Menubar