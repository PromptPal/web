import { Box, Highlight } from '@mantine/core'
import { useMemo } from 'react'

import { PromptRow, PromptVariable } from '../../gql/graphql'

type PromptReadonlyProps = {
  prompt: PromptRow
  index: number
  promptVariables: PromptVariable[]
}

function PromptReadonly(props: PromptReadonlyProps) {
  const { prompt, index, promptVariables } = props

  const highlightValues = useMemo(() => {
    const variables = promptVariables.map(x => x.name)
    const withSpaces = variables.reduce<string[]>((acc, v) => {
      // left space and right space
      acc.push(v, ` ${v} `, `${v} `, ` ${v}`)
      return acc
    }, [])

    return withSpaces.map(v => `{{${v}}}`)
  }, [promptVariables])

  return (
    <Box
      key={index}
      display='flex'
      className='flex-col sm:flex-row gap-2 sm:gap-4 w-full'
    >
      <span className='font-medium w-full sm:w-48 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/10 text-blue-300 backdrop-blur-sm border border-gray-700/30 shadow-sm shadow-blue-500/10 flex items-center justify-center sm:justify-start'>
        {prompt.role}
      </span>
      <div className='whitespace-break-spaces bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm border border-gray-700/30 rounded-lg w-full p-4 shadow-lg'>
        <Highlight
          highlight={highlightValues}
          highlightStyles={{
            background:
              'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(168, 85, 247, 0.2))',
            padding: '2px 6px',
            borderRadius: '4px',
            color: '#93c5fd',
            fontWeight: 500,
          }}
        >
          {prompt.prompt}
        </Highlight>
      </div>
    </Box>
  )
}

export default PromptReadonly
