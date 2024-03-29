import type { Preview } from "@storybook/react"
import { MantineProvider } from '@mantine/core'
import { MockedProvider } from '@apollo/client/testing'


import '../src/App.css'
import '../src/styles/glow.css'
import '@mantine/core/styles.css'
import '@mantine/code-highlight/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/charts/styles.css'

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
    (Story) => (
      <MantineProvider>
        <Story />
      </MantineProvider>
    ),
  ],

};

export default preview;
