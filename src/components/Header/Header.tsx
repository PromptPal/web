import { Link } from '@tanstack/react-router'
import Profile from './Profile'
import ProjectLiteInfo from './ProjectLiteInfo'
import ThemeToggle from './ThemeToggle'
import LoginButton from './login'

function Header() {
  // get user info
  return (
    <header className='py-2 px-6 lg:px-0 backdrop-blur-xs mt-4 rounded-full items-center justify-between flex z-50'>
      <div className='flex items-center'>
        <Link
          to='/'
          className='mr-2 px-2 py-1 rounded-sm font-bold text-transparent bg-clip-text bg-linear-to-tr from-blue-300 to-purple-700'
        >
          PromptPal
        </Link>
        <div className='text-xs daisyui-badge daisyui-badge-info'>Alpha</div>
        <ProjectLiteInfo />
        {/* <ProjectSelector /> */}
      </div>
      <div className='flex items-center gap-4'>
        <ThemeToggle />
        <LoginButton />
        <Profile />
      </div>
    </header>
  )
}

export default Header
