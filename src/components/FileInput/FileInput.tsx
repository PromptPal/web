import { useRef } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@/utils'

interface FileInputProps {
  label?: string
  placeholder?: string
  value?: File | null
  onChange?: (file: File | null) => void
  onBlur?: () => void
  error?: string
  accept?: string
  className?: string
  id?: string
}

export default function FileInput({
  label,
  placeholder = 'Choose a file...',
  value,
  onChange,
  onBlur,
  error,
  accept,
  className,
  id,
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onChange?.(file)
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    onChange?.(null)
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label
          htmlFor={id}
          className='block text-sm font-medium text-gray-700 dark:text-gray-200'
        >
          {label}
        </label>
      )}
      <div className='relative'>
        <input
          ref={inputRef}
          type='file'
          id={id}
          accept={accept}
          onChange={handleChange}
          onBlur={onBlur}
          className='sr-only'
        />
        <div
          className={cn(
            'flex items-center justify-between w-full px-4 py-2.5 rounded-lg transition-all duration-200',
            'bg-white/5 backdrop-blur-xl border border-gray-200/10',
            'hover:bg-white/10 hover:border-gray-200/20',
            'focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent',
            error && 'border-red-500/50 focus-within:ring-red-500',
          )}
        >
          <button
            type='button'
            onClick={handleButtonClick}
            className='flex items-center gap-3 flex-1 text-left'
          >
            <Upload className='w-5 h-5 text-gray-400' />
            <span className={cn('text-sm', value ? 'text-gray-200' : 'text-gray-400')}>
              {value?.name || placeholder}
            </span>
          </button>
          {value && (
            <button
              type='button'
              onClick={handleClear}
              className='ml-2 text-gray-400 hover:text-gray-200 transition-colors'
            >
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          )}
        </div>
      </div>
      {error && (
        <p className='text-xs text-red-400 mt-1'>{error}</p>
      )}
    </div>
  )
}
