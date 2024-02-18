import Header from './Header/Header'
import Menubar from './Menubar'
import { Toaster } from 'react-hot-toast'
import { useAtomValue } from 'jotai'
import { tokenAtom } from '../stats/profile'
import AuthorizePage from './authorize.page'
import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import { usePointerUpdate } from '../hooks/glow'

function Root() {
  const token = useAtomValue(tokenAtom)
  usePointerUpdate()
  return (
    <div
      className='container mx-auto flex flex-col h-full min-h-screen'
      style={{
        '--menu-width': '150px',
        '--body-width': 'calc(100% - var(--menu-width))',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any}
    >
      <Header />
      <div className='flex h-full mt-4 flex-1'>
        <Menubar />
        <section className='py-2 flex-1' style={{ maxWidth: 'var(--body-width)' }}>
          {token ? (
            <Suspense fallback={<div>Loading...</div>}>
              <Outlet />
            </Suspense>
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