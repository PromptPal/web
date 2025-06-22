import { cn } from '@/utils'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

type BackButtonProps = {
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export function BackButton({ disabled, onClick, className }: BackButtonProps) {
  return (
    <Link
      to='/providers'
      className={cn(
        'group inline-flex items-center gap-2 px-4 py-2 rounded-xl',
        'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
        'hover:bg-white/90 dark:hover:bg-gray-700/90',
        'border border-gray-200/50 dark:border-gray-600/50',
        'shadow-sm hover:shadow-md transition-all duration-200',
        'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <ArrowLeft className='w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5' />
      <span className='text-sm font-medium'>Back to Providers</span>
    </Link>
  )
}
