import { Badge } from '@mantine/core'
import React, { useMemo } from 'react'

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
  }
}

function UABadge(props: UABadgeProps) {
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
    <Badge color={visualMap[kind].color} size='xs' className={className}>
      {kind}
    </Badge>
  )
}

export default UABadge