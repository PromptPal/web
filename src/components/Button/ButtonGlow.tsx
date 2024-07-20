import React from 'react'
import styles from './ButtonGlow.module.css'

type ButtonGlowProps = {
  className?: string
  children: string | React.ReactNode
}

// https://theodorusclarence.com/blog/gradient-border-is-hard
function ButtonGlow(props: ButtonGlowProps) {
  const { children, className } = props
  return <button className={className + ' ' + styles.glow}>{children}</button>
}

export default ButtonGlow
