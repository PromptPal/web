import Button from '@/components/Button/Button'
import InputField from '@annatarhe/lake-ui/form-input-field'
import SelectField from '@annatarhe/lake-ui/form-select-field'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus, X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import {
  CreateUserFormData,
  createUserSchema,
  languageOptions,
  roleOptions,
} from '../types/user-creation'

interface UserCreationFormProps {
  onSubmit: (data: CreateUserFormData) => void
  onCancel: () => void
  isLoading: boolean
}

function UserCreationForm({ onSubmit, onCancel, isLoading }: UserCreationFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      lang: 'en',
      level: 1,
      initialRole: 'view',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='p-6 flex flex-col gap-4'>
      <p className='text-sm text-gray-400'>
        Create a new user and assign them to this project
      </p>

      <div className='space-y-4'>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <InputField
              label='Full Name'
              placeholder='Enter user full name'
              {...field}
              error={errors.name?.message}
              required
            />
          )}
        />

        <Controller
          name='email'
          control={control}
          render={({ field }) => (
            <InputField
              label='Email'
              placeholder='user@example.com'
              type='email'
              {...field}
              error={errors.email?.message}
              required
            />
          )}
        />

        <Controller
          name='phone'
          control={control}
          render={({ field }) => (
            <InputField
              label='Phone (Optional)'
              placeholder='+1 234 567 8900'
              {...field}
              error={errors.phone?.message}
            />
          )}
        />

        <Controller
          name='username'
          control={control}
          render={({ field }) => (
            <InputField
              label='Username (Optional)'
              placeholder='username'
              {...field}
              error={errors.username?.message}
            />
          )}
        />

        <Controller
          name='initialRole'
          control={control}
          render={({ field }) => (
            <SelectField
              label='Initial Role'
              options={roleOptions}
              {...field}
              error={errors.initialRole?.message}
              required
            />
          )}
        />

        <Controller
          name='lang'
          control={control}
          render={({ field }) => (
            <SelectField
              label='Language'
              options={languageOptions}
              {...field}
              error={errors.lang?.message}
            />
          )}
        />
      </div>

      <div className='flex justify-end gap-3'>
        <button
          type='button'
          onClick={onCancel}
          className='flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors'
        >
          <X className='w-4 h-4' />
          Cancel
        </button>
        <Button
          type='submit'
          isLoading={isLoading}
          className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-colors'
        >
          <UserPlus className='w-4 h-4' />
          Create User
        </Button>
      </div>
    </form>
  )
}

export default UserCreationForm
