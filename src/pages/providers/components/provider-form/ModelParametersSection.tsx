import { cn } from '@/utils'
import InputField from '@annatarhe/lake-ui/form-input-field'
import TextareaField from '@annatarhe/lake-ui/form-textarea-field'
import Tooltip from '@annatarhe/lake-ui/tooltip'
import { motion } from 'framer-motion'
import { Info, Sliders } from 'lucide-react'
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
    <div className='group relative'>
      <div className='relative rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-300'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/20'>
            <Sliders className='w-5 h-5 text-emerald-400' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Model Parameters
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Fine-tune the behavior and output of your AI model
            </p>
          </div>
        </div>

        <div className='space-y-6'>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='space-y-4'
          >
            <Controller
              name='temperature'
              control={form.control}
              render={({ field }) => (
                <div className='p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 backdrop-blur-sm'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center gap-2'>
                      <label className='text-sm font-medium leading-none text-gray-700 dark:text-gray-300'>
                        Temperature
                      </label>
                      <Tooltip content='Controls randomness: 0 = deterministic, 2 = very creative'>
                        <Info className='w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors' />
                      </Tooltip>
                    </div>
                    <div className='px-3 py-1 rounded-lg bg-orange-500/20 text-orange-300 text-sm font-medium'>
                      {field.value?.toFixed(1)}
                    </div>
                  </div>
                  <div className='relative'>
                    <input
                      type='range'
                      min='0'
                      max='2'
                      step='0.1'
                      value={field.value}
                      onChange={e =>
                        field.onChange(parseFloat(e.target.value))}
                      className={cn(
                        'w-full h-2 bg-gradient-to-r from-orange-400/30 to-red-400/30 rounded-lg appearance-none cursor-pointer',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50',
                        'transition-all duration-300 ease-in-out slider-thumb',
                      )}
                      style={{
                        background: `linear-gradient(to right, #fb923c ${(field.value / 2) * 100}%, rgba(251, 146, 60, 0.3) ${(field.value / 2) * 100}%)`,
                      }}
                    />
                    <div className='flex justify-between text-xs text-muted-foreground mt-2'>
                      <span>Deterministic</span>
                      <span>Balanced</span>
                      <span>Creative</span>
                    </div>
                  </div>
                  {errors.temperature && (
                    <motion.p
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className='text-sm text-red-400 mt-2 flex items-center gap-1'
                    >
                      <Info className='w-3 h-3' />
                      {errors.temperature.message}
                    </motion.p>
                  )}
                </div>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='space-y-4'
          >
            <Controller
              name='topP'
              control={form.control}
              render={({ field, fieldState }) => (
                <div className='p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-sm'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center gap-2'>
                      <label className='text-sm font-medium leading-none text-gray-700 dark:text-gray-300'>Top P</label>
                      <Tooltip content='Controls diversity via nucleus sampling: lower values = more focused, higher values = more diverse'>
                        <Info className='w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors' />
                      </Tooltip>
                    </div>
                    <div className='px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-sm font-medium'>
                      {field.value?.toFixed(1)}
                    </div>
                  </div>
                  <div className='relative'>
                    <input
                      type='range'
                      min='0'
                      max='1'
                      step='0.1'
                      value={field.value}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                      className={cn(
                        'w-full h-2 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-lg appearance-none cursor-pointer',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50',
                        'transition-all duration-300 ease-in-out slider-thumb',
                      )}
                      style={{
                        background: `linear-gradient(to right, #22d3ee ${field.value * 100}%, rgba(34, 211, 238, 0.3) ${field.value * 100}%)`,
                      }}
                    />
                    <div className='flex justify-between text-xs text-muted-foreground mt-2'>
                      <span>Focused</span>
                      <span>Balanced</span>
                      <span>Diverse</span>
                    </div>
                  </div>
                  {fieldState.error && (
                    <motion.p
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className='text-sm text-red-400 mt-2 flex items-center gap-1'
                    >
                      <Info className='w-3 h-3' />
                      {fieldState.error.message}
                    </motion.p>
                  )}
                </div>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='space-y-3'
          >
            <Controller
              name='maxTokens'
              control={form.control}
              render={({ field, fieldState }) => (
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <label className='text-sm font-medium leading-none text-gray-700 dark:text-gray-300'>
                      Max Tokens
                    </label>
                    <Tooltip content='Maximum number of tokens the model can generate in the response'>
                      <Info className='w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors' />
                    </Tooltip>
                  </div>
                  <InputField
                    type='number'
                    min={1}
                    max={32000}
                    step={1}
                    placeholder='2048'
                    {...field}
                    error={fieldState.error?.message}
                  />
                </div>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='space-y-3'
          >
            <div className='flex items-center gap-2'>
              <label className='text-sm font-medium leading-none text-gray-700 dark:text-gray-300'>
                Additional Configuration
              </label>
              <Tooltip content='Optional JSON configuration for advanced provider settings'>
                <Info className='w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors' />
              </Tooltip>
            </div>
            <div className='relative'>
              <TextareaField
                label={null}
                placeholder={`{
  "stream": true,
  "response_format": "json",
  "custom_parameter": "value"
}`}
                {...register('config')}
                error={errors.config?.message}
                rows={6}
                className='font-mono text-xs'
              />
              <div className='absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded'>
                JSON
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
