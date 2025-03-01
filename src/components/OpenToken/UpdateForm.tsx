import { Switch } from '@mantine/core'
import { useForm } from '@mantine/form'
import { Link } from 'lucide-react'
import { zodResolver } from 'mantine-form-zod-resolver'
import Zod from 'zod'
import { OpenTokenUpdate } from '../../gql/graphql'
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
    validate: zodResolver(schema),
    initialValues: {
      apiValidateEnabled: enabled,
      apiValidatePath: validatePath,
    },
  })

  return (
    <form onSubmit={f.onSubmit(onSubmit)} className='space-y-6 p-1'>
      <div className='bg-gray-800/40 backdrop-blur-sm rounded-lg p-5'>
        <div className='mb-5'>
          <label className='block text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 mb-2'>
            Enable Advanced Validation
          </label>
          <div className='flex items-center space-x-3'>
            <Switch
              size='lg'
              color='teal'
              checked={f.values.apiValidateEnabled}
              classNames={{
                track: 'backdrop-blur-md',
                thumb: f.values.apiValidateEnabled
                  ? 'bg-gradient-to-r from-teal-400 to-blue-500'
                  : 'bg-gradient-to-r from-gray-400 to-gray-500',
              }}
              {...f.getInputProps('apiValidateEnabled')}
            />
            <span className='text-gray-300'>
              {f.values.apiValidateEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        <div className='mb-2'>
          <label className='block text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 mb-2'>
            Advanced API Validate Path
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500'>
              <Link className='h-5 w-5' />
            </div>
            <input
              type='url'
              className='pl-10 w-full bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-lg py-3 px-4 text-gray-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition duration-200'
              placeholder='https://example.com/api/validate'
              {...f.getInputProps('apiValidatePath')}
            />
          </div>
          {f.errors.apiValidatePath && (
            <p className='mt-2 text-sm text-red-400'>
              {f.errors.apiValidatePath}
            </p>
          )}
          <p className='mt-2 text-xs text-gray-400'>
            Enter the URL that will be called to validate API requests
          </p>
        </div>
      </div>

      <div className='flex justify-end items-center gap-4 mt-6'>
        <button
          type='button'
          onClick={onClose}
          className='px-6 py-2.5 rounded-lg font-medium text-sm backdrop-blur-sm bg-gray-800/80 hover:bg-gray-700/80 text-gray-200 border border-gray-700/50 shadow-lg transition-all duration-200'
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={isSubmitting}
          className='px-6 py-2.5 rounded-lg font-medium text-sm cursor-pointer backdrop-blur-sm bg-gradient-to-r from-teal-500/90 to-blue-600/90 hover:from-teal-400 hover:to-blue-500 text-white shadow-lg shadow-teal-500/20 transition-all duration-200 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:from-teal-500/90 disabled:hover:to-blue-600/90'
        >
          {isSubmitting ? (
            <span className='flex items-center justify-center'>
              <svg
                className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Updating...
            </span>
          ) : (
            'Update'
          )}
        </button>
      </div>
    </form>
  )
}

export default OpenTokenUpdateForm
