import { graphql } from '@/gql'
import { tokenAtom } from '@/stats/profile'
import { useLazyQuery } from '@apollo/client'
import { useSDK } from '@metamask/sdk-react'
import { useAtom } from 'jotai'
import { ArrowRight } from 'lucide-react'
import { useCallback } from 'react'
import { toast } from 'react-hot-toast'

const LoginWelcomeText = 'Welcome to the PromptPal~ \n It`s your nonce: '

const q = graphql(`
  query auth($auth: AuthInput!) {
    auth(auth: $auth) {
      token
      user {
        id
        addr
        name
      }
    }
  }
`)

type LoginButtonProps = {
  buttonText?: string
}

function LoginButton(props: LoginButtonProps) {
  const { buttonText = 'Login' } = props
  const [t, setToken] = useAtom(tokenAtom)

  const [doLoginMutation] = useLazyQuery(q)

  const { sdk } = useSDK()

  const web3Login = useCallback(async () => {
    const accounts = await sdk?.connect()
    if (!accounts) {
      throw new Error('accounts not found')
    }

    const address = accounts[0]
    if (!address) {
      throw new Error('address not found')
    }

    const nonce = Date.now()
    const text = LoginWelcomeText + nonce
    const msg = text
    const signature = await sdk?.connectAndSign({
      msg,
    })
    if (!signature) {
      throw new Error('signature not found')
    }
    const res = await doLoginMutation({
      variables: {
        auth: {
          address,
          signature,
          message: msg,
        },
      },
    })
    if (!res.data?.auth) {
      throw new Error('token not found')
    }
    setToken(res.data.auth.token)
    return res.data.auth
  }, [doLoginMutation, sdk])

  const doWeb3Login = useCallback(() => {
    return toast.promise(web3Login(), {
      loading: 'Logging in...',
      success: (data: Awaited<ReturnType<typeof web3Login>>) =>
        `Welcome ${data.user.addr}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: (err: any) => {
        return err.message ?? err.error ?? err.toString()
      },
    })
  }, [web3Login])

  if (t) {
    return null
  }
  return (
    <button
      className='group relative w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]'
      onClick={doWeb3Login}
    >
      <div className='absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300' />
      <svg
        className='w-5 h-5 mr-3 relative z-10'
        viewBox='0 0 318.6 318.6'
        fill='currentColor'
        aria-hidden='true'
      >
        <path d='M274.1,35.5l-99.5,99.3V35.5z' />
        <path d='M44.5,35.5v99.3l99.5-99.3H44.5z' />
        <path d='M134.8,283.1l99.5-99.5v99.5H134.8z' />
        <path d='M44.5,183.6v99.5h99.5L44.5,183.6z' />
        <path d='M238.5,35.5h41.9c4.1,0,7.4,3.3,7.4,7.4v41.9L238.5,35.5z' />
        <path d='M30.9,35.5L80.2,84.8V42.9c0-4.1-3.3-7.4-7.4-7.4H30.9z' />
        <path d='M287.8,233.8l-49.3,49.3h41.9c4.1,0,7.4-3.3,7.4-7.4V233.8z' />
        <path d='M80.2,233.8v41.9c0,4.1-3.3,7.4-7.4,7.4H30.9L80.2,233.8z' />
      </svg>
      <span className='relative z-10'>{buttonText}</span>
      <ArrowRight className='w-4 h-4 ml-2 relative z-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300' />
    </button>
  )
}

export default LoginButton
