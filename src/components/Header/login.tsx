import { graphql } from '@/gql'
import { tokenAtom } from '@/stats/profile'
import { useLazyQuery } from '@apollo/client'
import { useSDK } from '@metamask/sdk-react'
import { useAtom } from 'jotai'
import { LogIn } from 'lucide-react'
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

  const [doLoginMutation] = useLazyQuery(q, {})

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
  }, [doLoginMutation])

  const doWeb3Login = useCallback(() => {
    return toast.promise(web3Login(), {
      loading: 'Logging in...',
      success: (data: Awaited<ReturnType<typeof web3Login>>) =>
        `Welcome ${data.user.addr}`,
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
      className='flex items-center px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-colors'
      onClick={doWeb3Login}
    >
      <LogIn size={18} className='mr-2' />
      {buttonText}
    </button>
  )
}

export default LoginButton
