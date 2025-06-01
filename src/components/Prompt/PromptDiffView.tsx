import { diffChars } from 'diff'
import { useMemo } from 'react'
import { PromptRow } from '../../gql/graphql'

type PromptDiffViewProps = {
  originalPrompt: PromptRow[]
  latestPrompt: PromptRow[]
}

function stringifyPrompt(prompt: PromptRow[]) {
  return prompt.map(x => `${x.role}:\n${x.prompt}`).join('\n\n')
}

function PromptDiffView(props: PromptDiffViewProps) {
  const { originalPrompt, latestPrompt } = props
  const diffResult = useMemo(() => {
    const op = stringifyPrompt(originalPrompt)
    const lp = stringifyPrompt(latestPrompt)

    return diffChars(op, lp)
  }, [originalPrompt, latestPrompt])
  return (
    <div className='whitespace-break-spaces bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm border border-gray-700/30 rounded-lg p-4 shadow-lg'>
      {diffResult.map((x, idx) => (
        <span
          key={idx}
          className={`${
            x.added
              ? 'bg-gradient-to-r from-green-500/20 to-green-500/10 text-green-300 px-1 rounded'
              : x.removed
                ? 'bg-gradient-to-r from-red-500/20 to-red-500/10 text-red-300 px-1 rounded'
                : 'text-gray-300'
          }`}
        >
          {x.value}
        </span>
      ))}
    </div>
  )
}

export default PromptDiffView
