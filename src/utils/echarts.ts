// Init for echarts
import {
  BarChart,
  LineChart,
} from 'echarts/charts'
import {
  // GridSimpleComponent,
  GridComponent,
  // AxisPointerComponent,
  // BrushComponent,
  TitleComponent,
  // PolarComponent,
  // RadarComponent,
  // GeoComponent,
  // SingleAxisComponent,
  // ParallelComponent,
  // CalendarComponent,
  // GraphicComponent,
  // ToolboxComponent,
  TooltipComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
// Import renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
import {
  CanvasRenderer,
} from 'echarts/renderers'

echarts.use(
  [TitleComponent, TooltipComponent, GridComponent, LineChart, BarChart, CanvasRenderer],
)

export default echarts
