import React, { ForwardedRef, forwardRef, useMemo } from 'react'

type UABadgeProps = {
  className?: string
  userAgent: string
}

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: 'green' | 'blue' | 'orange' | string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

function Badge({
  className = '',
  color = 'default',
  size = 'xs',
  ref,
  ...props
}: BadgeProps & { ref?: ForwardedRef<HTMLDivElement> }) {
  // Generate gradient classes based on color
  const getGradient = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-gradient-to-r from-emerald-500 to-green-500'
      case 'blue':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500'
      case 'orange':
        return 'bg-gradient-to-r from-amber-500 to-orange-500'
      default:
        return 'bg-gradient-to-r from-purple-500 to-pink-500'
    }
  }

  // Size classes
  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  const baseClasses
      = 'inline-flex items-center justify-center rounded-full font-medium transition-all text-white backdrop-blur-sm shadow-sm'
  const colorClasses = getGradient(color)
  const sizeClass
      = sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.xs

  // Combine all classes
  const classes = [baseClasses, colorClasses, sizeClass, className]
    .filter(Boolean)
    .join(' ')

  return <div ref={ref} className={classes} {...props} />
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
