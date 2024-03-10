import { graphql } from '../../gql'
import { useQuery } from '@apollo/client'
import { FetchPromptCallsMetricsOnlyQuery } from '../../gql/graphql'

type PromptCallMetricProps = {
  promptId: number
}

const q = graphql(`
  query fetchPromptCallsMetricsOnly($id: Int!) {
    prompt(id: $id) {
      id
      metrics {
        p50
        p90
        p99
      }
    }
  }
`)

function MetricCard(props: {
  title: string
  value: string | number
  index: number
  unit?: string
}) {
  const { title, value, unit = 'ms', index } = props
  return (
    <div
      data-glow
      className='flex flex-col justify-center items-center p-8 rounded-xl'
      style={{
        '--base': 255 * index,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any}
    >
      <h3 className='text-3xl'>
        {value}
        <span className='text-sm ml-2'>{unit}</span>
      </h3>
      <div className='text-sm'>{title}</div>
    </div>
  )
}


const metricKeys: (keyof FetchPromptCallsMetricsOnlyQuery['prompt']['metrics'])[] = ['p50', 'p90', 'p99']

function PromptCallMetric(props: PromptCallMetricProps) {
  const { promptId } = props
  const { data } = useQuery(q, {
    variables: {
      id: promptId
    }
  })

  const metrics = data?.prompt.metrics

  console.log('data', data)

  return (
    <div className='grid grid-cols-3 gap-8 mb-2' >
      {metrics && metricKeys.map((key, idx) => {
        return (
          <MetricCard
            index={idx}
            key={key}
            title={key}
            value={metrics[key] ?? '-'}
            unit='ms'
          />
        )
      })}
    </div>
  )
}

export default PromptCallMetric