import { cn } from '@/utils'
import InputField from '@annatarhe/lake-ui/form-input-field'
import SwitchField from '@annatarhe/lake-ui/form-switch-field'
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
    <div className='space-y-6 rounded-xl bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-purple-500/20 p-6 backdrop-blur-xl shadow-lg'>
      <h3 className='text-base font-semibold text-foreground bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'>
        Basic Information
      </h3>

      <div className='space-y-4'>
        <div className='space-y-2'>
          <InputField
            label='Provider Name'
            {...register('name')}
            aria-invalid={errors.name ? 'true' : 'false'}
            placeholder='My Provider'
            error={errors.name?.message}
            className={cn(
              'flex h-12 w-full rounded-xl bg-background/30 px-4 py-2',
              'text-sm ring-offset-background focus-visible:outline-hidden',
              'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'backdrop-blur-lg transition-all duration-300 ease-in-out',
              'hover:bg-background/50 border-none shadow-md',
              'bg-gradient-to-r from-background/40 to-background/20',
            )}
          />
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
            Description
          </label>
          <textarea
            className={cn(
              'flex w-full rounded-xl bg-background/30 px-4 py-2',
              'text-sm ring-offset-background file:border-0 file:bg-transparent',
              'file:text-sm file:font-medium placeholder:text-muted-foreground',
              'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'backdrop-blur-lg transition-all duration-300 ease-in-out min-h-[80px]',
              'hover:bg-background/50 border-none shadow-md',
              'bg-gradient-to-r from-background/40 to-background/20',
            )}
            placeholder='Description of the provider'
            {...register('description')}
            aria-invalid={errors.description ? 'true' : 'false'}
          />
          {errors.description && (
            <p className='text-sm text-destructive mt-1'>
              {errors.description.message}
            </p>
          )}
        </div>

        <div className='flex items-center gap-2'>
          <Controller
            name='enabled'
            control={control}
            render={({ field }) => (
              <SwitchField label='Enabled' {...field}></SwitchField>
            )}
          />
        </div>
      </div>
    </div>
  )
}
