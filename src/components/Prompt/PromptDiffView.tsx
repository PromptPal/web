import { useMemo } from 'react'
import { diffChars } from 'diff'
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
    <div className='whitespace-break-spaces'>
      {diffResult.map((x, idx) => (
        <span
          key={idx}
          style={{
            backgroundColor: x.added ? 'green' : x.removed ? 'red' : 'transparent'
          }}
        >
          {x.value}
        </span>
      ))}
    </div>
  )
}

export default PromptDiffView