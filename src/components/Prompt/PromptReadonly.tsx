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

  const highlightedContent = useMemo(() => {
    let content = prompt.prompt
    highlightValues.forEach((value) => {
      const regex = new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
      content = content.replace(regex, `<mark class="highlight-variable">${value}</mark>`)
    })
    return content
  }, [prompt.prompt, highlightValues])

  return (
    <div
      key={index}
      className='flex flex-col sm:flex-row gap-2 sm:gap-4 w-full'
    >
      <span className='font-medium w-full sm:w-48 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/10 text-blue-300 backdrop-blur-sm border border-gray-700/30 shadow-sm shadow-blue-500/10 flex items-center justify-center sm:justify-start'>
        {prompt.role}
      </span>
      <div className='whitespace-break-spaces bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm border border-gray-700/30 rounded-lg w-full p-4 shadow-lg'>
        <div
          dangerouslySetInnerHTML={{ __html: highlightedContent }}
          className='prompt-content'
        />
      </div>
    </div>
  )
}

export default PromptReadonly
