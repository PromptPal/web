import { cn } from '@/utils'
import { Loader2, Save, X } from 'lucide-react'

interface FormActionsProps {
  isLoading: boolean
  isValid: boolean
  onCancel: () => void
}

function FormActions({ isLoading, isValid, onCancel }: FormActionsProps) {
  return (
    <div className='flex flex-col sm:flex-row items-center justify-end gap-4 mt-10'>
      <button
        type='button'
        onClick={onCancel}
        disabled={isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl w-full sm:w-auto px-6 py-3',
          'bg-background/40 hover:bg-background/60',
          'text-sm font-medium transition-all duration-300 ease-in-out',
          'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
          'disabled:pointer-events-none disabled:opacity-50',
          'backdrop-blur-xl shadow-lg hover:shadow-xl',
          'border-none transform hover:-translate-y-0.5',
        )}
      >
        <X className='w-4 h-4' />
        Cancel
      </button>
      <button
        type='submit'
        disabled={!isValid || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl w-full sm:w-auto px-8 py-3',
          'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:brightness-110',
          'text-sm font-medium transition-all duration-300 ease-in-out',
          'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
          'disabled:pointer-events-none disabled:opacity-50',
          'backdrop-blur-xl shadow-lg hover:shadow-xl',
          'border-none transform hover:-translate-y-0.5',
        )}
      >
        {isLoading ? (
          <Loader2 className='w-4 h-4 animate-spin' />
        ) : (
          <Save className='w-4 h-4' />
        )}
        Update Project
      </button>
    </div>
  )
}

export default FormActions
