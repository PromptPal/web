import { cn } from '@/utils'
import Tooltip from '@annatarhe/lake-ui/tooltip'
import { Info } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { ProviderFormValues } from './schema'

type ModelParametersSectionProps = {
  form: UseFormReturn<ProviderFormValues>
}

export const ModelParametersSection = ({
  form,
}: ModelParametersSectionProps) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form

  return (
    <div className='space-y-6 rounded-xl bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-500/20 p-6 backdrop-blur-xl shadow-lg'>
      <h3 className='text-base font-semibold text-foreground bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent'>
        Model Parameters
      </h3>

      <div className='space-y-6'>
        {/* Temperature Slider */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1'>
              <label className='text-sm font-medium leading-none'>
                Temperature
              </label>
              <Tooltip content='Controls randomness: lower values make the output more deterministic, higher values make it more creative.'>
                <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
              </Tooltip>
            </div>
            <span className='text-sm font-medium'>
              {watch('temperature').toFixed(1)}
            </span>
          </div>

          <div className='relative pt-1'>
            <input
              type='range'
              min='0'
              max='2'
              step='0.1'
              value={watch('temperature')}
              onChange={(e) =>
                setValue('temperature', parseFloat(e.target.value))
              }
              className={cn(
                'w-full h-3 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-lg appearance-none cursor-pointer',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                'transition-all duration-300 ease-in-out',
              )}
            />
            <div className='flex justify-between text-xs text-muted-foreground mt-2'>
              <span>0</span>
              <span>1</span>
              <span>2</span>
            </div>
          </div>

          {errors.temperature && (
            <p className='text-sm text-destructive mt-1'>
              {errors.temperature.message}
            </p>
          )}
        </div>

        {/* Top P Slider */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1'>
              <label className='text-sm font-medium leading-none'>Top P</label>
              <Tooltip content='Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered.'>
                <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
              </Tooltip>
            </div>
            <span className='text-sm font-medium'>
              {watch('topP').toFixed(1)}
            </span>
          </div>

          <div className='relative pt-1'>
            <input
              type='range'
              min='0'
              max='1'
              step='0.1'
              value={watch('topP')}
              onChange={(e) => setValue('topP', parseFloat(e.target.value))}
              className={cn(
                'w-full h-3 bg-gradient-to-r from-pink-400/30 to-orange-400/30 rounded-lg appearance-none cursor-pointer',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                'transition-all duration-300 ease-in-out',
              )}
            />
            <div className='flex justify-between text-xs text-muted-foreground mt-2'>
              <span>0</span>
              <span>0.5</span>
              <span>1</span>
            </div>
          </div>

          {errors.topP && (
            <p className='text-sm text-destructive mt-1'>
              {errors.topP.message}
            </p>
          )}
        </div>

        {/* Max Tokens */}
        <div className='space-y-2'>
          <div className='flex items-center gap-1'>
            <label className='text-sm font-medium leading-none'>
              Max Tokens
            </label>
            <Tooltip content='The maximum number of tokens to generate in the response.'>
              <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
            </Tooltip>
          </div>

          <input
            type='number'
            className={cn(
              'flex h-12 w-full rounded-xl bg-background/30 px-4 py-2',
              'text-sm ring-offset-background focus-visible:outline-hidden',
              'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'backdrop-blur-lg transition-all duration-300 ease-in-out',
              'hover:bg-background/50 border-none shadow-md',
              'bg-gradient-to-r from-background/40 to-background/20',
            )}
            value={watch('maxTokens')}
            onChange={(e) =>
              setValue(
                'maxTokens',
                e.target.value ? parseInt(e.target.value) : 0,
              )
            }
            placeholder='2048'
            min='0'
          />

          {errors.maxTokens && (
            <p className='text-sm text-destructive mt-1'>
              {errors.maxTokens.message}
            </p>
          )}
        </div>

        {/* Additional Configuration */}
        <div className='space-y-2'>
          <div className='flex items-center gap-1'>
            <label className='text-sm font-medium leading-none'>
              Additional Configuration
            </label>
            <Tooltip content='Additional JSON configuration for the provider (optional)'>
              <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
            </Tooltip>
          </div>
          <textarea
            className={cn(
              'flex w-full rounded-xl bg-background/30 px-4 py-2',
              'text-sm ring-offset-background file:border-0 file:bg-transparent',
              'file:text-sm file:font-medium placeholder:text-muted-foreground',
              'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'backdrop-blur-lg transition-all duration-300 ease-in-out min-h-[120px]',
              'hover:bg-background/50 border-none shadow-md font-mono',
              'bg-gradient-to-r from-background/40 to-background/20',
            )}
            placeholder='{"key": "value"}'
            {...register('config')}
            aria-invalid={errors.config ? 'true' : 'false'}
          />
          {errors.config && (
            <p className='text-sm text-destructive mt-1'>
              {errors.config.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
