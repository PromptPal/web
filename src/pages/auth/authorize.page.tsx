import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Button, Divider } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import LoginButton from '../../components/Header/login'
import { HTTP_ENDPOINT } from '../../constants'
import { fetchSSOSettings } from '../../service/sso'

function AuthorizePage() {
  const { data: settings } = useQuery({
    queryKey: ['auth', 'settings'],
    queryFn: ({ signal }) => fetchSSOSettings({ signal }),
  })

  const [dom] = useAutoAnimate()

  return (
    <div className=' container mt-8'>
      <div>
        <h1 className='text-center text-5xl'>😔</h1>
        <h2 className='text-center'>
          Sorry, you need to login to view all the content
        </h2>
      </div>
      <Divider className='my-8 w-1/2 mx-auto' />

      <div
        className='flex justify-center flex-col w-fit mx-auto gap-4'
        ref={dom}
      >
        <LoginButton buttonText='Metamask' />
        {settings?.enableSsoGoogle && (
          <Button
            component='a'
            href={`${HTTP_ENDPOINT}/api/v1/sso/login/google`}
            target='_blank'
            referrerPolicy='no-referrer'
          >
            Google
          </Button>
        )}
      </div>
    </div>
  )
}

export default AuthorizePage
