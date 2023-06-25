import React from 'react'

type headerProps = {
}

function header(props: headerProps) {
  // get user info
  return (
    <header className='py-2 px-8 bg-blue-300 bg-opacity-10 backdrop-blur-sm mt-4 rounded-full items-center justify-between flex'>
      <div className='flex items-center '>
        <h2 className='mr-2'>PromptPal</h2>
        <div className='text-xs daisyui-badge daisyui-badge-info'>Alpha</div>
      </div>
      <div>
        <button className='daisyui-btn daisyui-btn-neutral'>Login</button>
      </div>
    </header>
  )
}

export default header