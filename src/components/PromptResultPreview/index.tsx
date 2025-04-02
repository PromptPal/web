import NoPreviewAvailable from './NoPreviewAvailable'
import ResponseSection from './ResponseSection'
import UsageStatistics from './UsageStatistics'
import { PromptTestPreviewProps, ResponseChoice } from './types'

/**
 * Main component for displaying prompt test results
 * This component orchestrates the rendering of the preview components
 */
function PromptTestPreview(props: PromptTestPreviewProps) {
  const { data } = props

  if (!data || !data.choices) {
    return <NoPreviewAvailable />
  }

  return (
    <div className='w-full flex flex-col md:flex-row gap-6'>
      <ResponseSection choices={data.choices as ResponseChoice[]} />
      <UsageStatistics usage={data.usage} />
    </div>
  )
}

export default PromptTestPreview
