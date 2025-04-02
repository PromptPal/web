import Tooltip from '@annatarhe/lake-ui/tooltip'
import cls from 'classnames'
import React, { useMemo } from 'react'
import styles from './ButtonGlow.module.css'
import LoadingIcon from './loading'

type ButtonGlowProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  tooltip?: string
  disabledTooltip?: string
  loading?: boolean
  color?: 'red'
}

// https://theodorusclarence.com/blog/gradient-border-is-hard
function ButtonGlow(props: ButtonGlowProps) {
  const {
    tooltip,
    disabledTooltip,
    disabled,
    className,
    loading,
    onClick,
    color,
    children,
    ...rest
  } = props

  const realTooltip = useMemo(() => {
    if (disabled) {
      return disabledTooltip ?? 'Disabled'
    }
    return tooltip
  }, [disabled, disabledTooltip, tooltip])
  return (
    <Tooltip content={realTooltip} disabled={!realTooltip}>
      <button
        className={cls(
          className,
          styles.glow,
          ' flex items-center justify-center gap-2',
          {
            [styles.red]: color === 'red',
          },
        )}
        disabled={disabled || loading}
        onClick={(e) => {
          if (disabled || loading) {
            e.preventDefault()
            e.stopPropagation()
            return
          }
          onClick?.(e)
        }}
        {...rest}
      >
        {loading && <LoadingIcon className='w-4 h-4 with-fade-in' />}
        {children}
      </button>
    </Tooltip>
  )
}

export default ButtonGlow
