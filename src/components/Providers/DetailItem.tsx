import { cn } from '@/utils'
import Tooltip from '@annatarhe/lake-ui/tooltip'
import { Info } from 'lucide-react'
import React from 'react'

export interface DetailItemProps {
  icon: React.ElementType
  label: string
  value?: string | number | null | boolean
  valueClassName?: string
  tooltip?: string
}

export const DetailItem: React.FC<DetailItemProps> = ({
  icon: Icon,
  label,
  value,
  valueClassName,
  tooltip,
}) => {
  if (value === null || value === undefined || value === '') {
    return null
  }

  let displayValue: React.ReactNode = value
  if (typeof value === 'boolean') {
    displayValue = value ? 'Yes' : 'No'
  }

  return (
    <div className='flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors duration-200'>
      <Icon className='w-4 h-4 text-gray-400 flex-shrink-0' />
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2'>
          <span className='text-xs font-medium text-gray-400 uppercase tracking-wide'>
            {label}
          </span>
          {tooltip && (
            <Tooltip content={tooltip}>
              <Info className='w-3 h-3 text-gray-500 hover:text-gray-300 transition-colors cursor-help' />
            </Tooltip>
          )}
        </div>
        <span
          className={cn('text-sm text-gray-200 break-words', valueClassName)}
        >
          {displayValue}
        </span>
      </div>
    </div>
  )
}
