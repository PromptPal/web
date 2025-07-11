import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Sparkles } from 'lucide-react'
import React from 'react'
import { HTTP_ENDPOINT } from '../../constants'
import { fetchSSOSettings } from '../../service/sso'
const LoginButtonContainer = React.lazy(() => import('@/components/Header/login-container'))

function AuthorizePage() {
  const { data: settings } = useQuery({
    queryKey: ['auth', 'settings'],
    queryFn: ({ signal }) => fetchSSOSettings({ signal }),
  })

  const [dom] = useAutoAnimate()

  return (
    <div className='min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden'>
      {/* Background Effects */}
      <div className='absolute inset-0'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse' />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='relative z-10 w-full max-w-lg'
      >
        {/* Main Auth Card */}
        <div className='relative'>
          <div className='absolute inset-0 bg-gradient-to-r from-sky-500/20 to-blue-500/20 blur-xl rounded-3xl' />
          <div className='relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl p-8 space-y-8'>

            {/* Header */}
            <div className='text-center space-y-4'>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className='inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-500 mx-auto mb-4'
              >
                <Shield className='w-10 h-10 text-white' />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className='text-3xl font-bold bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent'
              >
                Welcome to PromptPal
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className='text-gray-300 max-w-sm mx-auto'
              >
                Sign in to access your AI prompts, providers, and projects with enterprise-grade security
              </motion.p>
            </div>

            {/* Auth Methods */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className='space-y-4'
              ref={dom}
            >
              <div className='w-full'>
                <LoginButtonContainer buttonText='Connect with Metamask' />
              </div>

              {settings?.enableSsoGoogle && (
                <motion.a
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  href={`${HTTP_ENDPOINT}/api/v1/sso/login/google`}
                  target='_blank'
                  referrerPolicy='no-referrer'
                  className='group relative w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]'
                  rel='noreferrer'
                >
                  <div className='absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300' />
                  <svg className='w-5 h-5 mr-3 relative z-10' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                    <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' />
                    <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
                    <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' />
                    <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
                  </svg>
                  <span className='relative z-10'>Continue with Google</span>
                  <ArrowRight className='w-4 h-4 ml-2 relative z-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300' />
                </motion.a>
              )}
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className='text-center pt-6 border-t border-gray-700/50'
            >
              <div className='flex items-center justify-center gap-2 text-sm text-gray-400'>
                <Sparkles className='w-4 h-4' />
                <span>Secure authentication powered by blockchain</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AuthorizePage
