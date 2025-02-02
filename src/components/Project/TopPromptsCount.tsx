import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { GetOverallProjectDataQuery } from '../../gql/graphql'

type ProjectTopPromptsChartProps = {
  recentCounts?: GetOverallProjectDataQuery['project']['promptMetrics']['recentCounts']
}

function ProjectTopPromptsCount(props: ProjectTopPromptsChartProps) {
  const { recentCounts } = props

  const chartData = useMemo(() => {
    return recentCounts?.reduce<Record<string, number | string>[]>((acc, p) => {
      acc.push({
        name: p.prompt.name,
        count: p.count,
      })
      return acc
    }, [])
  }, [recentCounts])

  return (
    <div className='w-full h-[400px]'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={chartData ?? []}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 40,
          }}
        >
          <CartesianGrid
            strokeDasharray='3 3'
            stroke='rgba(79, 70, 229, 0.2)'
            vertical={false}
          />
          <XAxis
            dataKey='name'
            tick={{ fill: '#D1D5DB', fontSize: 12 }}
            tickLine={{ stroke: '#4B5563' }}
            axisLine={{ stroke: '#4B5563' }}
            angle={-45}
            textAnchor='end'
            height={60}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: '#D1D5DB', fontSize: 12 }}
            tickLine={{ stroke: '#4B5563' }}
            axisLine={{ stroke: '#4B5563' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              border: '1px solid rgba(75, 85, 99, 0.5)',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(8px)',
            }}
            cursor={{ fill: 'rgba(67, 56, 202, 0.3)' }}
            labelStyle={{ color: '#D1D5DB' }}
            itemStyle={{ color: '#A78BFA' }}
          />
          <Bar
            dataKey='count'
            fill='url(#colorGradient)'
            radius={[4, 4, 0, 0]}
          />
          <defs>
            <linearGradient id='colorGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#4C1D95' stopOpacity={1} />
              <stop offset='100%' stopColor='#312E81' stopOpacity={0.95} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ProjectTopPromptsCount
