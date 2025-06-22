import { MockedProvider } from '@apollo/client/testing'
import type { Preview } from '@storybook/react'

import '../src/App.css'
import '../src/styles/glow.css'

const preview: Preview = {
  parameters: {
    apolloClient: {
      MockedProvider,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    Story => (
      <Story />
    ),
  ],

}

export default preview
