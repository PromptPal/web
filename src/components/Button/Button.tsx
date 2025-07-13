import { cn } from '@/utils'
import { LucideIcon } from 'lucide-react'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import LoadingIcon from './loading'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant that determines the visual style
   * @default 'primary'
   */
  variant?: ButtonVariant
  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize
  /**
   * Whether the button is in loading state
   * @default false
   */
  isLoading?: boolean
  /**
   * Icon to display before the button content
   */
  icon?: LucideIcon
  /**
   * Button content
   */
  children: ReactNode
  /**
   * Additional class names
   */
  className?: string
}

/**
 * Button component with multiple variants, gradient colors, and states
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon: Icon,
  children,
  className,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || isLoading

  const baseClasses
    = 'relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 rounded-lg'

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 space-x-1.5',
    md: 'text-sm px-4 py-2 space-x-2',
    lg: 'text-base px-6 py-3 space-x-3',
  }

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500 disabled:from-sky-400 disabled:to-blue-400',
    secondary:
      'bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white shadow-md hover:shadow-lg focus:ring-cyan-400 disabled:from-teal-300 disabled:to-cyan-400',
    danger:
      'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md hover:shadow-lg focus:ring-orange-500 disabled:from-orange-400 disabled:to-red-400',
    ghost:
      'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:ring-gray-400',
  }

  const iconSizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <button
      type={type}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        isDisabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
        'backdrop-blur-sm',
        className,
      )}
      disabled={isDisabled}
      {...rest}
    >
      {isLoading && (
        <span className='absolute inset-0 flex items-center justify-center'>
          <LoadingIcon className={cn(iconSizeClasses[size], 'text-current')} />
        </span>
      )}
      <span className={cn('flex flex-row items-center gap-2', isLoading && 'invisible')}>
        {Icon && !isLoading && <Icon className={iconSizeClasses[size]} />}
        {children}
      </span>
    </button>
  )
}

export default Button
