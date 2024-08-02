import { Badge } from '@mantine/core'
import React, { ForwardedRef, forwardRef, useMemo } from 'react'

type UABadgeProps = {
  className?: string
  userAgent: string
}

const visualMap = {
  js: {
    color: 'green',
  },
  go: {
    color: 'blue',
  },
  web: {
    color: 'orange',
  },
}

function UABadge(props: UABadgeProps, ref: ForwardedRef<HTMLDivElement>) {
  const { userAgent, className } = props

  const kind = useMemo(() => {
    const ua = userAgent.toLowerCase()
    if (ua.includes('jssdk')) {
      return 'js'
    }
    if (ua.includes('gosdk')) {
      return 'go'
    }
    return 'web'
  }, [userAgent])

  return (
    <Badge
      ref={ref}
      color={visualMap[kind].color}
      size='xs'
      className={className}
    >
      {kind}
    </Badge>
  )
}

export default forwardRef(UABadge)
