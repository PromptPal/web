declare module '@annatarhe/lake-ui' {
  import { ReactNode } from 'react'

  export interface TooltipProps {
    content: ReactNode
    children: ReactNode
    side?: 'top' | 'bottom' | 'left' | 'right'
    noWrap?: boolean
    className?: string
    disabled?: boolean
  }

  export function Tooltip(props: TooltipProps): JSX.Element
}
