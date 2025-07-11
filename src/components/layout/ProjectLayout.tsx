import { Outlet } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { Loader2, Sparkles } from 'lucide-react'
import { Suspense } from 'react'
import AuthorizePage from '../../pages/auth/authorize.page'
import { tokenAtom } from '../../stats/profile'
import Menubar from '../Menubar'

// Enhanced loading component
const LoadingState = () => (
  <div className='flex items-center justify-center min-h-[60vh]'>
    <div className='text-center space-y-4'>
      <div className='relative'>
        <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-600/20 flex items-center justify-center mx-auto border border-sky-500/30'>
          <Loader2 className='w-8 h-8 text-sky-400 animate-spin' />
        </div>
        <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/30 to-blue-600/30 blur-lg opacity-50 animate-pulse' />
      </div>
      <div className='space-y-2'>
        <h3 className='text-lg font-semibold text-white'>Loading</h3>
        <p className='text-sm text-gray-400'>Preparing your workspace...</p>
      </div>
    </div>
  </div>
)

function ProjectLayout() {
  const token = useAtomValue(tokenAtom)

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-sky-900/5 to-slate-900 relative'>
      {/* Ambient background elements */}
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute top-1/4 left-1/6 w-64 h-64 bg-gradient-to-br from-sky-500/3 to-blue-500/3 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-1/3 right-1/6 w-96 h-96 bg-gradient-to-br from-blue-500/3 to-indigo-500/3 rounded-full blur-3xl animate-pulse delay-1000' />
      </div>

      <div className='z-10 flex min-h-screen'>
        {/* Sidebar */}
        <div className='flex-shrink-0 px-4'>
          <Menubar />
        </div>

        {/* Main content area */}
        <main className='flex-1 flex flex-col min-w-0'>
          {/* Content container */}
          <div className='flex-1'>
            <div className='min-h-full'>
              {token
                ? (
                    <div className='min-h-full bg-white/[0.02] backdrop-blur-sm'>
                      <Suspense fallback={<LoadingState />}>
                        <div className='min-h-full'>
                          <Outlet />
                        </div>
                      </Suspense>
                    </div>
                  )
                : (
                    <div className='min-h-full bg-white/[0.02] backdrop-blur-sm'>
                      <AuthorizePage />
                    </div>
                  )}
            </div>
          </div>

          {/* Optional footer for additional info */}
          <div className='flex-shrink-0 px-4 pb-4'>
            <div className='bg-white/[0.02] border border-white/5 rounded-lg px-4 py-2'>
              <div className='flex items-center justify-between text-xs text-gray-500'>
                <div className='flex items-center gap-2'>
                  <Sparkles className='w-3 h-3' />
                  <span>PromptPal Dashboard</span>
                </div>
                <div>
                  <span>AI-Powered Management</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ProjectLayout
