import InputField from '@annatarhe/lake-ui/form-input-field'
import SwitchField from '@annatarhe/lake-ui/form-switch-field'
import TextareaField from '@annatarhe/lake-ui/form-textarea-field'
import { motion } from 'framer-motion'
import { Info, User } from 'lucide-react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { ProviderFormValues } from './schema'

type BasicInfoSectionProps = {
  form: UseFormReturn<ProviderFormValues>
}

export const BasicInfoSection = ({ form }: BasicInfoSectionProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = form

  return (
    <div className='group relative'>
      <div className='relative rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-300'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm border border-blue-500/20'>
            <User className='w-5 h-5 text-blue-400' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Basic Information
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Configure the basic details of your provider
            </p>
          </div>
        </div>

        <div className='space-y-6'>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='space-y-2'
          >
            <InputField
              label='Provider Name'
              {...register('name')}
              placeholder='Enter a unique name for your provider'
              error={errors.name?.message}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='space-y-2'
          >
            <TextareaField
              label={(
                <div className='flex items-center gap-2 text-gray-700 dark:text-gray-300'>
                  Description
                  <Info className='w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors' />
                </div>
              )}
              {...register('description')}
              placeholder='Provide a detailed description of what this provider is used for...'
              error={errors.description?.message}
              rows={4}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm'
          >
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-green-500/20'>
                <Info className='w-4 h-4 text-green-400' />
              </div>
              <div>
                <h4 className='text-sm font-medium text-gray-900 dark:text-white'>Provider Status</h4>
                <p className='text-xs text-gray-600 dark:text-gray-400'>Toggle to enable or disable this provider</p>
              </div>
            </div>
            <Controller
              name='enabled'
              control={control}
              render={({ field }) => (
                <SwitchField label={null} {...field} />
              )}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
