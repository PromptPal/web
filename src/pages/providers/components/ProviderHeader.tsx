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
        'rounded-2xl overflow-hidden mb-8',
        'bg-white dark:bg-zinc-900',
        'shadow-md hover:shadow-xl transition-all duration-300',
        'border border-zinc-100 dark:border-zinc-800',
        className,
      )}
    >
      <div className='relative p-6'>
        {/* Subtle background gradient */}
        <div className='absolute inset-0 bg-gradient-to-br from-zinc-50/30 to-transparent dark:from-indigo-950/5 dark:to-transparent pointer-events-none' />

        <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 relative'>
          <div className='space-y-3'>
            <div className='flex flex-wrap items-center gap-3'>
              <h1 className='text-2xl font-bold tracking-tight text-zinc-900 dark:text-white'>
                {provider.name}
              </h1>
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                  'transition-all duration-200 backdrop-blur-sm',
                  'shadow-sm',
                  provider.enabled
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300',
                )}
              >
                {provider.enabled
                  ? (
                      <>
                        <Check className='h-3 w-3' />
                        <span>Enabled</span>
                      </>
                    )
                  : (
                      <>
                        <X className='h-3 w-3' />
                        <span>Disabled</span>
                      </>
                    )}
              </span>
            </div>
            <p className='text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl'>
              {provider.description || 'No description provided'}
            </p>
          </div>

          <div className='flex items-center gap-3 md:self-end'>
            <Link
              to='/providers/$id/edit'
              params={{ id: provider.id.toString() }}
              className={cn(
                'group inline-flex items-center justify-center rounded-lg text-sm font-medium',
                'h-10 px-4 py-2',
                'text-zinc-700 dark:text-zinc-300',
                'bg-zinc-100 dark:bg-zinc-800/80',
                'hover:bg-indigo-100 hover:text-indigo-700 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-300',
                'transition-all duration-200 ease-in-out',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
              )}
            >
              <Edit className='mr-2 h-4 w-4 transition-all duration-200 group-hover:scale-110' />
              <span>Edit</span>
            </Link>
            <button
              onClick={onDeleteClick}
              className={cn(
                'group inline-flex items-center justify-center rounded-lg text-sm font-medium',
                'h-10 px-4 py-2',
                'text-zinc-700 dark:text-zinc-300',
                'bg-zinc-100 dark:bg-zinc-800/80',
                'hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-900/30 dark:hover:text-rose-300',
                'transition-all duration-200 ease-in-out',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
              )}
            >
              <Trash2 className='mr-2 h-4 w-4 transition-all duration-200 group-hover:scale-110' />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
