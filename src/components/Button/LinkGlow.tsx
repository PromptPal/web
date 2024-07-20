import { Link, LinkProps } from 'react-router-dom'
import styles from './ButtonGlow.module.css'

type LinkGlowProps = LinkProps

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
