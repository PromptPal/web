import LoginButton from './login'
import Profile from './Profile'
import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import ProjectLiteInfo from './ProjectLiteInfo'

function Header() {
  // get user info
  return (
    <header className='py-2 px-6 lg:px-0 backdrop-blur-sm mt-4 rounded-full items-center justify-between flex z-50'>
      <div className='flex items-center'>
        <Link to='/' className=' mr-2 px-2 py-1 dark:text-white rounded transition-colors duration-300'>
          <h2>PromptPal</h2>
        </Link>
        <div className='text-xs daisyui-badge daisyui-badge-info'>Alpha</div>
        <ProjectLiteInfo />
        {/* <ProjectSelector /> */}
      </div>
      <div className='flex items-center'>
        <ThemeToggle />
        <LoginButton />
        <Profile />
      </div>
    </header>
  )
}

export default Header