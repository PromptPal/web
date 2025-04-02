import { cn } from '@/utils'
import Tooltip from '@annatarhe/lake-ui/tooltip'
import { Info, Plus, Trash2 } from 'lucide-react'
import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { ProviderFormValues } from './schema'

type HttpHeadersSectionProps = {
  form: UseFormReturn<ProviderFormValues>
}

export const HttpHeadersSection = ({ form }: HttpHeadersSectionProps) => {
  const {
    register,
    formState: { errors },
  } = form

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'headers',
  })

  return (
    <div className='space-y-6 rounded-xl bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-violet-500/20 p-6 backdrop-blur-xl shadow-lg'>
      <div className='flex items-center justify-between'>
        <h3 className='text-base font-semibold text-foreground bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'>
          HTTP Headers
        </h3>
        <button
          type='button'
          onClick={() => append({ key: '', value: '' })}
          className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 transition-colors duration-200'
        >
          <Plus className='w-3.5 h-3.5' />
          Add Header
        </button>
      </div>

      <div className='space-y-4'>
        <div className='flex items-start gap-1'>
          <Tooltip content='Add custom HTTP headers that will be sent with API requests'>
            <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors mt-0.5' />
          </Tooltip>
          <p className='text-sm text-muted-foreground'>
            Add custom HTTP headers for API requests to this provider (e.g.,
            authorization headers, custom parameters)
          </p>
        </div>

        {fields.length === 0 && (
          <div className='p-4 rounded-lg border border-dashed border-muted-foreground/30 bg-background/20 backdrop-blur-sm'>
            <p className='text-sm text-center text-muted-foreground'>
              No headers added yet. Click 'Add Header' to start adding custom
              HTTP headers.
            </p>
          </div>
        )}

        {fields.map((field, index) => (
          <div
            key={field.id}
            className='grid grid-cols-[1fr,1fr,auto] gap-2 items-start'
          >
            <div>
              <input
                type='text'
                className={cn(
                  'flex h-10 w-full rounded-xl bg-background/30 px-3 py-2',
                  'text-sm ring-offset-background focus-visible:outline-hidden',
                  'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'backdrop-blur-lg transition-all duration-300 ease-in-out',
                  'hover:bg-background/50 border-none shadow-sm',
                  'bg-gradient-to-r from-background/40 to-background/20',
                  errors.headers?.[index]?.key ? 'ring-2 ring-destructive' : '',
                )}
                placeholder='Header Key'
                {...register(`headers.${index}.key`)}
              />
              {errors.headers?.[index]?.key && (
                <p className='text-xs text-destructive mt-1'>
                  {errors.headers[index].key?.message}
                </p>
              )}
            </div>
            <div>
              <input
                type='text'
                className={cn(
                  'flex h-10 w-full rounded-xl bg-background/30 px-3 py-2',
                  'text-sm ring-offset-background focus-visible:outline-hidden',
                  'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'backdrop-blur-lg transition-all duration-300 ease-in-out',
                  'hover:bg-background/50 border-none shadow-sm',
                  'bg-gradient-to-r from-background/40 to-background/20',
                  errors.headers?.[index]?.value
                    ? 'ring-2 ring-destructive'
                    : '',
                )}
                placeholder='Header Value'
                {...register(`headers.${index}.value`)}
              />
              {errors.headers?.[index]?.value && (
                <p className='text-xs text-destructive mt-1'>
                  {errors.headers[index].value?.message}
                </p>
              )}
            </div>
            <button
              type='button'
              onClick={() => remove(index)}
              className='p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors duration-200 mt-1'
            >
              <Trash2 className='w-4 h-4' />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
