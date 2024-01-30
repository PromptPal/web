import ReactEChartsCore from 'echarts-for-react/lib/core'
import { useMemo } from 'react'
import echarts from '../../utils/echarts'
import { GetOverallProjectDataQuery } from '../../gql/graphql'
import { useColorMode } from '@chakra-ui/react'

type ProjectTopPromptsChartProps = {
  recentCounts?: GetOverallProjectDataQuery['project']['promptMetrics']['recentCounts']
}

function ProjectTopPromptsChart(props: ProjectTopPromptsChartProps) {
  const { recentCounts } = props

  const echartDataOptions = useMemo<echarts.EChartsCoreOption>(() => {
    return {
      // title: 'Top Prompts',
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: recentCounts?.map((p) => p.prompt.name),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: recentCounts?.map((p) => p.count),
          type: 'bar',
        },
      ],
    } as echarts.EChartsCoreOption
  }, [recentCounts])

  const { colorMode } = useColorMode()

  return (
    <div>
      <ReactEChartsCore
        echarts={echarts}
        option={echartDataOptions}
        notMerge={true}
        lazyUpdate={true}
        theme={colorMode === 'dark' ? 'dark' : 'light'}
      />
    </div>
  )
}

export default ProjectTopPromptsChart