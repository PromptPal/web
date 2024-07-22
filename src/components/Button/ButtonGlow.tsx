import { Tooltip } from '@mantine/core'
import React, { useMemo } from 'react'
import styles from './ButtonGlow.module.css'

type ButtonGlowProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  tooltip?: string
  disabledTooltip?: string
}

// https://theodorusclarence.com/blog/gradient-border-is-hard
function ButtonGlow(props: ButtonGlowProps) {
  const { tooltip, disabledTooltip, disabled, className, onClick, ...rest } =
    props

  const realTooltip = useMemo(() => {
    if (disabled) {
      return disabledTooltip ?? 'Disabled'
    }
    return tooltip
  }, [])

  return (
    <Tooltip label={realTooltip} disabled={!realTooltip}>
      <button
        className={className + ' ' + styles.glow}
        disabled={disabled}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault()
            e.stopPropagation()
            return
          }
          onClick?.(e)
        }}
        {...rest}
      />
    </Tooltip>
  )
}

export default ButtonGlow
