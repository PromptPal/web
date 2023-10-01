import React, { useCallback } from 'react'
import MetaMaskSDK from '@metamask/sdk'
import { useAtom } from 'jotai'
import { tokenAtom } from '../../stats/profile'
import { doLogin } from '../../service/login'
import { toast } from 'react-hot-toast'
import { graphql } from '../../gql'
import { useLazyQuery, useQuery } from '@apollo/client'

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

function LoginButton() {
  const [t, setToken] = useAtom(tokenAtom)

  const [doLoginMutation] = useLazyQuery(q, {
  })

  const web3Login = useCallback(async () => {
    const m = new MetaMaskSDK()
    const eth = m.getProvider()
    if (!eth) {
      throw new Error('MetaMask is not connected')
    }

    const accounts = await eth.request<string[]>({ method: 'eth_requestAccounts', params: [] })

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
    const signature = await eth.request<string>({
      method: 'personal_sign',
      params: [msg, address],
    })
    if (!signature) {
      throw new Error('signature not found')
    }
    const res = await doLoginMutation({
      variables: {
        auth: {
          address,
          signature,
          message: msg
        }
      }
    })
    if (!res.data?.auth) {
      throw new Error('token not found')
    }
    setToken(res.data.auth.token)
    return res.data.auth
  }, [doLoginMutation])

  const doWeb3Login = useCallback(
    () => {
      return toast.promise(
        web3Login(),
        {
          loading: 'Logging in...',
          success: (data) => `Welcome ${data.user.addr}`,
          error: (err) => {
            return err.message ?? err.error ?? err.toString()
          }
        }
      )
    }
    , [web3Login])

  if (t) {
    return null
  }
  return (
    <button
      className='daisyui-btn daisyui-btn-neutral mx-2'
      onClick={doWeb3Login}
    >
      Login
    </button>
  )
}

export default LoginButton
