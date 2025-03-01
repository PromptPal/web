import dayjs from 'dayjs'
import { LineChart as LineChartIcon } from 'lucide-react'
import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { GetOverallProjectDataQuery } from '../../gql/graphql'
import { chartColors } from '../../utils/colors'

type ProjectTopPromptsChartProps = {
  recentCounts?: GetOverallProjectDataQuery['project']['promptMetrics']['last7Days']
  loading?: boolean
}

function ProjectTopPromptsByDate(props: ProjectTopPromptsChartProps) {
  const { recentCounts, loading } = props

  const chartData = useMemo(() => {
    let start = dayjs().add(-7, 'day')
    const now = dayjs()
    const result: Record<string, number | string>[] = []
    while (start.isBefore(now)) {
      const dateData = recentCounts?.filter((d) =>
        dayjs(d.date).isSame(start, 'day'),
      )

      const pair = dateData?.reduce<Record<string, number>>((acc, p) => {
        p.prompts.forEach((p) => {
          if (!acc[p.prompt.name]) {
            acc[p.prompt.name] = p.count
          }
          acc[p.prompt.name] += p.count
        })
        return acc
      }, {})

      result.push({
        date: start.format('YYYY-MM-DD'),
        ...pair,
      })
      start = start.add(1, 'day')
    }
    return result
  }, [recentCounts])

  const series = useMemo(() => {
    return chartData
      .reduce<string[]>((acc, p) => {
        Object.keys(p).forEach((k) => {
          if (!acc.includes(k)) {
            acc.push(k)
          }
        })
        return acc
      }, [])
      .filter((k) => k !== 'date')
  }, [chartData])

  if (loading) {
    return (
      <div className='rounded-xl bg-linear-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 shadow-xl backdrop-blur-xs p-6'>
        <div className='flex items-center gap-2 mb-4'>
          <LineChartIcon className='w-5 h-5 text-blue-400' />
          <h3 className='text-lg font-bold text-gray-200'>
            Prompt Usage Trends
          </h3>
        </div>
        <div className='h-[300px] w-full flex items-center justify-center'>
          <div className='animate-pulse text-gray-500'>Loading data...</div>
        </div>
      </div>
    )
  }

  if (!recentCounts || recentCounts.length === 0 || chartData.length === 0) {
    return (
      <div className='rounded-xl bg-linear-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 shadow-xl backdrop-blur-xs p-6'>
        <div className='flex items-center gap-2 mb-4'>
          <LineChartIcon className='w-5 h-5 text-blue-400' />
          <h3 className='text-lg font-bold text-gray-200'>
            Prompt Usage Trends
          </h3>
        </div>
        <div className='h-[300px] w-full flex items-center justify-center'>
          <p className='text-gray-500'>No data available for the last 7 days</p>
        </div>
      </div>
    )
  }

  return (
    <div className='rounded-xl bg-linear-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xs p-6'>
      <div className='flex items-center gap-2 mb-4'>
        <LineChartIcon className='w-5 h-5 text-blue-400' />
        <h3 className='text-lg font-bold text-gray-200'>Prompt Usage Trends</h3>
      </div>
      <p className='text-sm text-gray-500 mb-6'>
        Usage patterns of your prompts over the last 7 days
      </p>
      <div className='w-full h-[300px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              {series.map((dataKey, index) => (
                <linearGradient
                  key={dataKey}
                  id={`color-${dataKey}`}
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop
                    offset='5%'
                    stopColor={chartColors[index % chartColors.length]}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor={chartColors[index % chartColors.length]}
                    stopOpacity={0}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
            <XAxis
              dataKey='date'
              className='text-xs text-muted-foreground'
              tickFormatter={(value) => dayjs(value).format('MM-DD')}
            />
            <YAxis className='text-xs text-muted-foreground' />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
              labelFormatter={(value) => dayjs(value).format('YYYY-MM-DD')}
              formatter={(value: number) => [value.toLocaleString(), '']}
            />
            <Legend />
            {series.map((dataKey, index) => (
              <Area
                key={dataKey}
                type='monotone'
                dataKey={dataKey}
                name={dataKey}
                stroke={chartColors[index % chartColors.length]}
                fill={`url(#color-${dataKey})`}
                stackId='1'
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ProjectTopPromptsByDate
