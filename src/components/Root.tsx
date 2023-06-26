import { Outlet } from '@tanstack/router'
import Header from './Header/Header'
import Menubar from './Menubar'
import { Toaster } from 'react-hot-toast'
import { useAtomValue } from 'jotai'
import { tokenAtom } from '../stats/profile'
import AuthorizePage from './authorize.page'

function Root() {
  const token = useAtomValue(tokenAtom)
  return (
    <div className='container mx-auto flex flex-col h-full'>
      <Header />
      <div className='flex h-full'>
        <Menubar />
        <section>
          {token ? (
            <Outlet />
          ) : (
            <AuthorizePage />
          )}
        </section>
      </div>
      <Toaster />
    </div>
  )
}

export default Root