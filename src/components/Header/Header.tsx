import React from 'react'
import LoginButton from './login'
import Profile from './Profile'
import { Link } from 'react-router-dom'

type headerProps = {
}

function Header(props: headerProps) {
  // get user info
  return (
    <header className='py-2 pl-6 pr-8 bg-blue-300 bg-opacity-10 backdrop-blur-sm mt-4 rounded-full items-center justify-between flex'>
      <div className='flex items-center '>
        <Link to='/' className=' mr-2 px-2 py-1 dark:text-white hover:bg-black hover:bg-opacity-10 rounded transition-colors duration-300'>
        <h2>PromptPal</h2>
        </Link>
        <div className='text-xs daisyui-badge daisyui-badge-info'>Alpha</div>
      </div>
      <div>
        <LoginButton />
        <Profile />
      </div>
    </header>
  )
}

export default Header