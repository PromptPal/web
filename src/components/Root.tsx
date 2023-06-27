import Header from './Header/Header'
import Menubar from './Menubar'
import { Toaster } from 'react-hot-toast'
import { useAtomValue } from 'jotai'
import { tokenAtom } from '../stats/profile'
import AuthorizePage from './authorize.page'
import { Outlet } from 'react-router-dom'

function Root() {
  const token = useAtomValue(tokenAtom)
  return (
    <div className='container mx-auto flex flex-col h-full'>
      <Header />
      <div className='flex h-full mt-4'>
        <Menubar />
        <section className='py-2 px-8 bg-gray-800 bg-opacity-50 w-full'>
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