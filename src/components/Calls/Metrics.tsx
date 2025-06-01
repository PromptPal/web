import { useQuery } from '@apollo/client'
import { Clock3, Timer, Zap } from 'lucide-react'
import { useMemo } from 'react'
import { graphql } from '../../gql'
import { FetchPromptCallsMetricsOnlyQuery } from '../../gql/graphql'

type PromptCallMetricProps = {
  promptId: number
}

export const q = graphql(`
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

const metricIcons = {
  p50: Clock3,
  p90: Timer,
  p99: Zap,
} as const

function MetricCard(props: {
  title: string
  value: string | number
  index: number
  unit?: string
}) {
  const { title, value, unit = 'ms' } = props
  const displayValue = useMemo(() => {
    if (typeof value === 'number') {
      return value.toFixed(2)
    }
    return value
  }, [value])

  const Icon = metricIcons[title as keyof typeof metricIcons]

  return (
    <div
      data-glow
      className='relative overflow-hidden backdrop-blur-xs bg-linear-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 shadow-xl rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl group'
    >
      <div className='absolute inset-0 bg-linear-to-br from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

      <div className='relative flex flex-col justify-center items-center p-8 z-10'>
        <div className='mb-4'>
          {Icon && <Icon className='w-6 h-6 text-blue-400' />}
        </div>

        <h3 className='text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent'>
          {displayValue}
          <span className='text-sm ml-2 text-gray-400 font-normal'>{unit}</span>
        </h3>

        <div className='mt-2 text-sm font-medium text-gray-400 uppercase tracking-wider'>
          {title}
          {' '}
          Latency
        </div>
      </div>
    </div>
  )
}

const metricKeys: (keyof FetchPromptCallsMetricsOnlyQuery['prompt']['metrics'])[]
  = ['p50', 'p90', 'p99']

function PromptCallMetric(props: PromptCallMetricProps) {
  const { promptId } = props
  const { data } = useQuery(q, {
    variables: {
      id: promptId,
    },
  })

  const metrics = data?.prompt.metrics

  return (
    <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-2'>
      {metrics
        && metricKeys.map((key, idx) => {
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
