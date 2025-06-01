import { cn } from '@/utils'
import InputField from '@annatarhe/lake-ui/form-input-field'
import Tooltip from '@annatarhe/lake-ui/tooltip'
import { Info } from 'lucide-react'
import { Controller, UseFormReturn } from 'react-hook-form'
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
  } = form

  return (
    <div className='space-y-6 rounded-xl bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-500/20 p-6 backdrop-blur-xl shadow-lg'>
      <h3 className='text-base font-semibold text-foreground bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent'>
        Model Parameters
      </h3>

      <div className='space-y-6'>
        {/* Temperature Slider */}
        <div className='space-y-2'>
          <Controller
            name='temperature'
            control={form.control}
            render={({ field }) => (
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1'>
                  <label className='text-sm font-medium leading-none'>
                    Temperature
                  </label>
                  <Tooltip content='Controls randomness: lower values make the output more deterministic, higher values make it more creative.'>
                    <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
                  </Tooltip>
                </div>
                <div className='flex items-start gap-2'>
                  <div className='relative pt-1'>
                    <input
                      type='range'
                      min='0'
                      max='2'
                      step='0.1'
                      value={field.value}
                      onChange={e =>
                        field.onChange(parseFloat(e.target.value))}
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
                  <span className='text-sm font-medium'>
                    {field.value?.toFixed(1)}
                  </span>
                  {errors.temperature && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.temperature.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          />
        </div>

        {/* Top P Slider */}
        <div className='space-y-2'>
          <Controller
            name='topP'
            control={form.control}
            render={({ field, fieldState }) => (
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1'>
                  <label className='text-sm font-medium leading-none'>Top P</label>
                  <Tooltip content='Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered.'>
                    <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
                  </Tooltip>
                </div>
                <div className='flex items-start gap-2'>
                  <div className='relative pt-1'>
                    <input
                      type='range'
                      min='0'
                      max='1'
                      step='0.1'
                      value={field.value}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
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
                  <span className='text-sm font-medium'>
                    {field.value?.toFixed(1)}
                  </span>

                  {fieldState.error && (
                    <p className='text-sm text-destructive mt-1'>
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          />

          {/* Max Tokens */}
          <div className='space-y-2'>
            <Controller
              name='maxTokens'
              control={form.control}
              render={({ field, fieldState }) => (
                <InputField
                  label={(
                    <div className='flex items-center gap-1'>
                      <label className='text-sm font-medium leading-none'>
                        Max Tokens
                      </label>
                      <Tooltip content='The maximum number of tokens to generate in the response.'>
                        <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
                      </Tooltip>
                    </div>
                  )}
                  type='number'
                  min='0'
                  placeholder='2048'
                  {...field}
                  error={fieldState.error?.message}
                />
              )}
            />
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
    </div>
  )
}
