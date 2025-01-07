import { useLazyQuery } from '@apollo/client'
import { Button } from '@mantine/core'
import { useSDK } from '@metamask/sdk-react'
import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { graphql } from '../../gql'
import { tokenAtom } from '../../stats/profile'

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
    // const m = sdk
    // await m.init()
    // const eth = m.getProvider()
    // if (!eth) {
    //   throw new Error('MetaMask is not connected')
    // }

    const accounts = await sdk?.connect()
    // const accounts = await eth.request<string[]>({ method: 'eth_requestAccounts', params: [] })
    if (!accounts) {
      throw new Error('accounts not found')
    }

    const address = accounts[0]
    if (!address) {
      throw new Error('address not found')
    }

    // const address = sdk?.connect()
    const nonce = Date.now()
    const text = LoginWelcomeText + nonce
    const msg = text
    const signature = await sdk?.connectAndSign({
      msg,
    })
    // const signature = await eth.request<string>({
    //   method: 'personal_sign',
    //   params: [msg, address],
    // })
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
      success: (data) => `Welcome ${data.user.addr}`,
      error: (err) => {
        return err.message ?? err.error ?? err.toString()
      },
    })
  }, [web3Login])

  if (t) {
    return null
  }
  return (
    <Button
      variant='gradient'
      gradient={{
        from: 'indigo',
        to: 'cyan',
      }}
      onClick={doWeb3Login}
    >
      {buttonText}
    </Button>
  )
}

export default LoginButton
