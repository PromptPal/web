import { cn } from '@/utils'
import { Link } from '@tanstack/react-router'
import { Check, Edit, Trash2, X } from 'lucide-react'

type ProviderHeaderProps = {
  provider: {
    id: number
    name: string
    description?: string | null
    enabled: boolean
  }
  className?: string
  onDeleteClick: () => void
}

export function ProviderHeader({
  provider,
  className,
  onDeleteClick,
}: ProviderHeaderProps) {
  return (
    <div
      className={cn(
        'rounded-xl p-[2px] bg-gradient-to-br from-primary/30 via-secondary/20 to-primary/10 overflow-hidden mb-6',
        'shadow-lg hover:shadow-primary/20 transition-all duration-500 ease-in-out',
        'hover:scale-[1.005] hover:from-primary/40 hover:via-secondary/30 hover:to-primary/20',
        className,
      )}
    >
      <div className='rounded-lg bg-card/80 p-6 backdrop-blur-xl h-full border-background/10'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div className='space-y-2'>
            <h1 className='text-2xl font-bold tracking-tight flex items-center gap-3'>
              {provider.name}
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                  'transition-all duration-300 backdrop-blur-sm',
                  provider.enabled
                    ? 'bg-gradient-to-r from-emerald-500/30 to-green-500/30 text-emerald-400 dark:text-emerald-300'
                    : 'bg-gradient-to-r from-red-500/30 to-rose-500/30 text-rose-400 dark:text-rose-300',
                )}
              >
                {provider.enabled
                  ? (
                      <>
                        <Check className='h-3 w-3' />
                        Enabled
                      </>
                    )
                  : (
                      <>
                        <X className='h-3 w-3' />
                        Disabled
                      </>
                    )}
              </span>
            </h1>
            <p className='text-sm text-muted-foreground leading-relaxed max-w-2xl'>
              {provider.description || 'No description provided'}
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <Link
              to='/providers/$id/edit'
              params={{ id: provider.id.toString() }}
              className={cn(
                'group relative inline-flex items-center justify-center rounded-lg text-sm font-medium',
                'transition-all duration-300 ease-in-out',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
                'h-10 px-5 py-2 overflow-hidden',
                'text-primary dark:text-white hover:text-primary-foreground',
              )}
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
              {/* Button content */}
              <span
                className={cn(
                  'relative flex items-center justify-center z-10',
                  'transition-transform duration-300',
                )}
              >
                <Edit
                  className={cn(
                    'mr-2 h-4 w-4 transition-all duration-300 group-hover:scale-110',
                  )}
                />
                <span className='font-medium'>Edit</span>
              </span>
            </Link>
            <button
              onClick={onDeleteClick}
              className={cn(
                'group relative inline-flex items-center justify-center rounded-lg text-sm font-medium',
                'transition-all duration-300 ease-in-out',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
                'h-10 px-5 py-2 overflow-hidden',
                'text-destructive dark:text-destructive hover:text-destructive-foreground',
              )}
            >
              {/* Gradient background with blur effect */}
              <span
                className={cn(
                  'absolute inset-0 w-full h-full transition-all duration-300',
                  'bg-gradient-to-r from-destructive/20 via-destructive/30 to-destructive/20 dark:from-destructive/40 dark:via-destructive/60 dark:to-destructive/40',
                  'opacity-0 group-hover:opacity-100 blur-[2px] group-hover:blur-[1px]',
                  'scale-110 group-hover:scale-100',
                )}
              />
              {/* Button content */}
              <span
                className={cn(
                  'relative flex items-center justify-center z-10',
                  'backdrop-blur-sm',
                  'transition-transform duration-300',
                )}
              >
                <Trash2
                  className={cn(
                    'mr-2 h-4 w-4 transition-all duration-300 group-hover:scale-110',
                  )}
                />
                <span className='font-medium'>Delete</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
