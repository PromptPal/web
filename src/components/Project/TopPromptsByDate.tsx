import { useMemo } from 'react'
import { AreaChart, AreaChartProps } from '@mantine/charts'
import { GetOverallProjectDataQuery } from '../../gql/graphql'
import dayjs from 'dayjs'
import { chartColors } from '../../utils/colors'

type ProjectTopPromptsChartProps = {
  recentCounts?: GetOverallProjectDataQuery['project']['promptMetrics']['last7Days']
}

function ProjectTopPromptsByDate(props: ProjectTopPromptsChartProps) {
  const { recentCounts } = props

  const chartData = useMemo(() => {
    let start = dayjs().add(-7, 'day')
    const now = dayjs()
    const result: Record<string, number | string>[] = []
    while (start.isBefore(now)) {
      const dateData = recentCounts?.filter((d) => dayjs(d.date).isSame(start, 'day'))

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

  const series = useMemo<AreaChartProps['series']>(() => {
    return chartData.reduce<string[]>((acc, p) => {
      Object.keys(p).forEach((k) => {
        if (!acc.includes(k)) {
          acc.push(k)
        }
      })
      return acc
    }, [])
      .filter((k) => k !== 'date')
      .map((x, i) => ({ name: x, color: chartColors[i % chartColors.length] }))

  }, [chartData])

  return (
    <div>
      <AreaChart
        h={300}
        data={chartData ?? []}
        dataKey='date'
        series={series}
        tooltipAnimationDuration={150}
        curveType="linear"
      />
    </div>
  )
}

export default ProjectTopPromptsByDate