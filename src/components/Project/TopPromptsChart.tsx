import { useQuery } from '@tanstack/react-query'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import React, { useMemo } from 'react'
import { getProjectTopPrompts } from '../../service/project'
import echarts from '../../utils/echarts'

type ProjectTopPromptsChartProps = {
  projectId: number
}

function ProjectTopPromptsChart(props: ProjectTopPromptsChartProps) {
  const { projectId } = props
  const { data: topPrompts } = useQuery({
    queryKey: ['projects', ~~projectId, 'top-prompts'],
    queryFn: ({ signal }) => getProjectTopPrompts(~~projectId, signal),
    suspense: true
  })

  const echartDataOptions = useMemo<echarts.EChartsCoreOption>(() => {
    return {
      // title: 'Top Prompts',
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: topPrompts?.data.map((p) => p.prompt.name),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: topPrompts?.data.map((p) => p.count),
          type: 'bar',
        },
      ],
    } as echarts.EChartsCoreOption
  }, [topPrompts?.data])

  return (
    <div>
      <ReactEChartsCore
        echarts={echarts}
        option={echartDataOptions}
        notMerge={true}
        lazyUpdate={true}
        theme={"dark"}
      // onChartReady={this.onChartReadyCallback}
      // onEvents={EventsDict}
      // opts={}
      />
    </div>
  )
}

export default ProjectTopPromptsChart