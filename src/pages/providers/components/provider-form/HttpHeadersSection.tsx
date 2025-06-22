import InputField from '@annatarhe/lake-ui/form-input-field'
import Tooltip from '@annatarhe/lake-ui/tooltip'
import { motion } from 'framer-motion'
import { Globe, Info, Plus, Trash2 } from 'lucide-react'
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
    <div className='group relative'>
      <div className='relative rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-300'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm border border-blue-500/20'>
              <Globe className='w-5 h-5 text-blue-400' />
            </div>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                HTTP Headers
              </h3>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Custom headers for API requests
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type='button'
            onClick={() => append({ key: '', value: '' })}
            className='inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 text-blue-300 border border-blue-500/30 backdrop-blur-sm transition-all duration-200 hover:shadow-lg'
          >
            <Plus className='w-4 h-4' />
            Add Header
          </motion.button>
        </div>

        <div className='space-y-6'>
          <div className='flex items-start gap-2 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 backdrop-blur-sm'>
            <Tooltip content='Custom headers are sent with every API request to your provider'>
              <Info className='w-4 h-4 text-blue-400 dark:text-blue-300 mt-0.5 flex-shrink-0' />
            </Tooltip>
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              <p className='font-medium text-gray-900 dark:text-white mb-1'>Custom HTTP Headers</p>
              <p>
                Add custom headers for API authentication, custom parameters, or any other
                headers required by your provider. Common examples include authorization tokens
                or API version headers.
              </p>
            </div>
          </div>

          {fields.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className='p-8 rounded-xl border border-dashed border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 backdrop-blur-sm text-center'
            >
              <div className='flex flex-col items-center gap-3'>
                <div className='p-3 rounded-full bg-blue-500/10'>
                  <Globe className='w-6 h-6 text-blue-400' />
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-900 dark:text-white mb-1'>
                    No headers configured
                  </p>
                  <p className='text-xs text-gray-600 dark:text-gray-400'>
                    Click &quot;Add Header&quot; to start adding custom HTTP headers for your provider
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className='space-y-3'>
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className='group/item flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200/30 dark:border-slate-800/30 hover:border-blue-500/30 transition-all duration-200 backdrop-blur-sm'
              >
                <div className='flex-1 space-y-1'>
                  <InputField
                    label={(
                      <label className='text-xs font-medium text-gray-600 dark:text-gray-400'>Header Key</label>
                    )}
                    {...register(`headers.${index}.key`)}
                    placeholder='Authorization, X-API-Version, etc.'
                    error={errors.headers?.[index]?.key?.message}
                  />
                </div>
                <div className='flex-1 space-y-1'>
                  <InputField
                    label={(
                      <label className='text-xs font-medium text-gray-600 dark:text-gray-400'>Header Value</label>
                    )}
                    {...register(`headers.${index}.value`)}
                    placeholder='Bearer token, v1, etc.'
                    error={errors.headers?.[index]?.value?.message}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type='button'
                  onClick={() => remove(index)}
                  className='p-2 h-10 w-10 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 opacity-70 group-hover/item:opacity-100'
                  aria-label='Remove header'
                >
                  <Trash2 className='w-4 h-4' />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
