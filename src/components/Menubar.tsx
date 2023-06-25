import React from 'react'

type MenubarProps = {
}

function Menubar(props: MenubarProps) {
  return (
    <nav className='py-2 px-8 hover:bg-blue-300 hover:bg-opacity-10 hover:backdrop-blur-sm mt-4 rounded-lg h-full min-h-[500px]'>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
    </nav>
  )
}

export default Menubar