import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useQuery } from '@tanstack/react-query';
import LoginButton from '../../components/Header/login'; // Assuming this component is already Tailwind-styled or will be handled separately
import { HTTP_ENDPOINT } from '../../constants';
import { fetchSSOSettings } from '../../service/sso';

function AuthorizePage() {
  const { data: settings } = useQuery({
    queryKey: ['auth', 'settings'],
    queryFn: ({ signal }) => fetchSSOSettings({ signal }),
  })

  const [dom] = useAutoAnimate()

  return (
    <div className='min-h-4/5 flex flex-col items-center justify-center p-4 '>
      <div className='w-full max-w-md p-8 space-y-8 bg-white/80 dark:bg-black/70 backdrop-blur-xl rounded-2xl shadow-2xl'>
        <div className='text-center space-y-4'>
          <h1 className='text-7xl'>😔</h1>
          <h2 className='text-3xl font-bold text-purple-700 dark:text-purple-400'>
            Access Denied
          </h2>
          <p className='text-md text-gray-600 dark:text-gray-300'>
            You need to be logged in to view this page and access all features.
          </p>
        </div>

        <div
          className='flex flex-col items-center gap-6'
          ref={dom}
        >
          {/* Ensure LoginButton is styled to fit this new design, preferably w-full */}
          <LoginButton buttonText='Login with Metamask' />

          {settings?.enableSsoGoogle && (
            <a
              href={`${HTTP_ENDPOINT}/api/v1/sso/login/google`}
              target='_blank'
              referrerPolicy='no-referrer'
              className='w-full flex items-center justify-center px-6 py-3.5
                         bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600
                         text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl
                         focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75
                         transition-all duration-300 ease-in-out transform hover:scale-105'
              rel='noreferrer'
            >
              <svg className='w-6 h-6 mr-3 -ml-1' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' />
                <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
                <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' />
                <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
              </svg>
              Login with Google
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthorizePage
