import { Outlet } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { Suspense } from 'react'
import AuthorizePage from '../../pages/auth/authorize.page'
import { tokenAtom } from '../../stats/profile'
import Menubar from '../Menubar'

function ProjectLayout() {
  const token = useAtomValue(tokenAtom)
  return (
    <div className='flex h-full mt-4 flex-1 gap-4'>
      <Menubar />
      <section className='flex-1' style={{ maxWidth: 'var(--body-width)' }}>
        {token
          ? (
              <Suspense fallback={<div>Loading...</div>}>
                <Outlet />
              </Suspense>
            )
          : (
              <AuthorizePage />
            )}
      </section>
    </div>
  )
}

export default ProjectLayout
