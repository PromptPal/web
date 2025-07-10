import { cn } from '@/utils'
import React from 'react'

export interface SectionProps {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  className?: string
}

export const Section: React.FC<SectionProps> = ({
  title,
  icon: Icon,
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Simple section header */}
      <div className='flex items-center gap-2 pb-2 border-b border-white/10'>
        <Icon className='w-4 h-4 text-gray-400' />
        <h3 className='text-sm font-semibold text-gray-300 uppercase tracking-wide'>
          {title}
        </h3>
      </div>

      {/* Section content */}
      <div className='space-y-1'>
        {children}
      </div>
    </div>
  )
}
