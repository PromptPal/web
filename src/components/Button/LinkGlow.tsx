import { Link, LinkProps } from '@tanstack/react-router'
import styles from './ButtonGlow.module.css'

type LinkGlowProps = LinkProps & { className?: string }

// https://theodorusclarence.com/blog/gradient-border-is-hard
function LinkGlow(props: LinkGlowProps) {
  const { children, className, ...rest } = props
  return (
    <Link className={className + ' ' + styles.glow} {...rest}>
      {children}
    </Link>
  )
}

export default LinkGlow
