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
        'group relative inline-flex items-center justify-center rounded-lg text-sm font-medium',
        'transition-all duration-300 ease-in-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'h-10 px-5 py-2 overflow-hidden',
        'text-primary dark:text-white hover:text-primary-foreground',
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Gradient background with blur effect */}
      <span
        className={cn(
          'absolute inset-0 w-full h-full transition-all duration-300',
          'bg-gradient-to-r from-primary/20 via-secondary/30 to-primary/20 dark:from-primary/40 dark:via-secondary/60 dark:to-primary/40',
          'opacity-0 group-hover:opacity-100 blur-[2px] group-hover:blur-[1px]',
          'scale-110 group-hover:scale-100',
        )}
      />

      {/* Button content with backdrop blur */}
      <span
        className={cn(
          'relative flex items-center justify-center z-10',
          'backdrop-blur-sm',
          'transition-transform duration-300 group-hover:translate-x-0.5',
        )}
      >
        <ArrowLeft
          className={cn(
            'mr-2 h-4 w-4 transition-transform duration-300',
            'group-hover:-translate-x-1',
          )}
        />
        <span className='font-medium'>Back</span>
      </span>
    </Link>
  )
}
