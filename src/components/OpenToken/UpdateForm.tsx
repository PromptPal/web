import InputField from '@annatarhe/lake-ui/form-input-field'
import Switch from '@annatarhe/lake-ui/form-switch-field'
import Tooltip from '@annatarhe/lake-ui/tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
import { InfoIcon, Link, Save } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import Zod from 'zod'
import { OpenTokenUpdate } from '../../gql/graphql'
import Button from '../Button/Button'
type OpenTokenUpdateFormProps = {
  validatePath: string
  enabled: boolean

  isSubmitting: boolean
  onSubmit: (data: OpenTokenInputForm) => void
  onClose: () => void
}

type OpenTokenInputForm = Pick<
  OpenTokenUpdate,
  'apiValidateEnabled' | 'apiValidatePath'
>

const schema: Zod.ZodType<OpenTokenInputForm> = Zod.object({
  apiValidateEnabled: Zod.boolean(),
  apiValidatePath: Zod.string().url().trim().max(255),
})

function OpenTokenUpdateForm(props: OpenTokenUpdateFormProps) {
  const { validatePath, enabled, isSubmitting, onSubmit, onClose } = props
  const f = useForm<OpenTokenInputForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      apiValidateEnabled: enabled,
      apiValidatePath: validatePath,
    },
  })

  return (
    <form onSubmit={f.handleSubmit(onSubmit)} className='space-y-6 p-1'>
      <div className='bg-gray-800/40 backdrop-blur-sm rounded-lg p-5'>
        <div className='mb-5'>
          <Controller
            name='apiValidateEnabled'
            control={f.control}
            render={({ field }) => (
              <Switch
                label='Enable Advanced Validation'
                {...field}
                value={field.value ?? false}
              >
                {field.value ? 'Enabled' : 'Disabled'}
              </Switch>
            )}
          />
        </div>

        <div className='mb-2'>
          <Controller
            name='apiValidatePath'
            control={f.control}
            render={({ field, formState }) => (
              <InputField
                label={
                  <div className='flex items-center'>
                    <span className='block text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 mb-2'>
                      Advanced API Validate Path
                    </span>
                    <Tooltip content='Enter the URL that will be called to validate API requests'>
                      <InfoIcon className='w-4 h-4 ml-2' />
                    </Tooltip>
                  </div>
                }
                type='url'
                {...field}
                value={field.value ?? ''}
                error={formState.errors.apiValidatePath?.message}
              />
            )}
          />
        </div>
      </div>

      <div className='flex justify-end items-center gap-4 mt-6'>
        <Button variant='ghost' onClick={onClose}>
          Cancel
        </Button>
        <Button
          type='submit'
          disabled={isSubmitting}
          isLoading={isSubmitting}
          icon={Save}
        >
          Save
        </Button>
      </div>
    </form>
  )
}

export default OpenTokenUpdateForm
