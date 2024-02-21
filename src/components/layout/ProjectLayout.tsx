import { Suspense } from 'react'
import Menubar from '../Menubar'
import { useAtomValue } from 'jotai'
import { Outlet } from 'react-router-dom'
import { tokenAtom } from '../../stats/profile'
import AuthorizePage from '../../pages/auth/authorize.page'

function ProjectLayout() {
  const token = useAtomValue(tokenAtom)
  return (
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
  )
}

export default ProjectLayout