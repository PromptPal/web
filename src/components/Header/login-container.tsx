import { MetaMaskProvider } from '@metamask/sdk-react'
import LoginButton from './login'

type Props = React.ComponentProps<typeof LoginButton>

function LoginButtonContainer(props: Props) {
  return (
    <MetaMaskProvider
      sdkOptions={{
        dappMetadata: {
          name: 'PromptPal',
          url: window.location.href,
        },
        // infuraAPIKey: process.env.INFURA_API_KEY,
        // Other options.
      }}
    >
      <LoginButton {...props} />
    </MetaMaskProvider>
  )
}

export default LoginButtonContainer
