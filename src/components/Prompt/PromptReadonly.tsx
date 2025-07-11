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
      className='flex flex-col sm:flex-row gap-3 sm:gap-6 w-full group'
    >
      <div className='font-semibold w-full sm:w-52 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500/25 to-sky-500/15 text-blue-200 backdrop-blur-md border border-gray-700/40 shadow-lg shadow-blue-500/10 flex items-center justify-center sm:justify-start transition-all duration-200 hover:shadow-blue-500/20 hover:from-blue-500/30 hover:to-sky-500/20'>
        {prompt.role}
      </div>
      <div className='whitespace-break-spaces bg-gradient-to-br from-gray-900/70 via-gray-800/50 to-gray-900/70 backdrop-blur-md border border-gray-700/40 rounded-xl w-full p-6 shadow-xl transition-all duration-200 hover:shadow-2xl hover:bg-gradient-to-br hover:from-gray-900/80 hover:via-gray-800/60 hover:to-gray-900/80 hover:border-gray-600/50'>
        <div
          dangerouslySetInnerHTML={{ __html: highlightedContent }}
          className='prompt-content text-gray-200 leading-relaxed'
        />
      </div>
    </div>
  )
}

export default PromptReadonly
