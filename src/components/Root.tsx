import { Outlet } from '@tanstack/router'
import Header from './Header'
import Menubar from './Menubar'

function Root() {
  return (
    <div className='container mx-auto flex flex-col h-full'>
      <Header />
      <div className='flex h-full'>
        <Menubar />
        <section>
          <Outlet />
        </section>
      </div>
    </div>
  )
}

export default Root