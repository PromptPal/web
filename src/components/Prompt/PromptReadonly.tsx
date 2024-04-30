import { useMemo } from 'react'
import { Box, Highlight } from '@mantine/core'

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

    return withSpaces.map((v) => `{{${v}}}`)
  }, [promptVariables])

  return (
    <Box key={index} display='flex' >
      <span className='mr-2 w-48'>
        {prompt.role}:
      </span>
      <div
        className='whitespace-break-spaces bg-opacity-30 bg-slate-900 rounded w-full p-4'
      >
        <Highlight
          highlight={highlightValues}
          highlightStyles={{
            padding: '2px 4px', borderRadius: '4px'
          }}
        >
          {prompt.prompt}
        </Highlight>
      </div>
    </Box>
  )
}

export default PromptReadonly