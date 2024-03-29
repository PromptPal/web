import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import PromptCallMetric, { q } from './Metrics'
import { FetchPromptCallsMetricsOnlyQuery } from '../../gql/graphql'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  component: PromptCallMetric,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof PromptCallMetric>

export default meta
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    promptId: 8888
  },
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: q,
            variables: {
              id: 8888
            }
          },
          result: {
            data: {
              prompt: {
                id: 8888,
                metrics: {
                  p50: 50,
                  p90: 90,
                  p99: 99
                }
              }
            } as FetchPromptCallsMetricsOnlyQuery
          }
        }
      ]
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('50')).toBeInTheDocument()
    await expect(await canvas.findByText('90')).toBeInTheDocument()
    await expect(await canvas.findByText('99')).toBeInTheDocument()
  }
}