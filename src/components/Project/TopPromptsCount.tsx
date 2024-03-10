import { useMemo } from 'react'
import { BarChart } from '@mantine/charts'
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

  console.log('chartdata', chartData)

  return (
    <div>
      <BarChart
        h={300}
        data={chartData ?? []}
        dataKey='name'
        series={[{
          name: 'count',
          color: 'violet.6'
        }]}
        tooltipAnimationDuration={150}
        tickLine="y"
        yAxisProps={{
          allowDecimals: false,
        }}
      />
    </div>
  )
}

export default ProjectTopPromptsCount