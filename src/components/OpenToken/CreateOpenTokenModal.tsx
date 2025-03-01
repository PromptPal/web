import LakeModal from '@annatarhe/lake-ui/modal'
import { useMutation as useGraphQLMutation } from '@apollo/client'
import { Switch } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import dayjs from 'dayjs'
import {
  CalendarIcon,
  Clock,
  KeyIcon,
  MessageSquare,
  ShieldIcon,
} from 'lucide-react'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useMemo } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import toast from 'react-hot-toast'
import Zod from 'zod'
import { graphql } from '../../gql'
import { OpenTokenInput } from '../../gql/graphql'

type CreateOpenTokenModalProps = {
  isOpen: boolean
  onClose: () => void
  projectId: number
}

// const secondsIn3Year = 3 * 365 * 24 * 60 * 60

type OpenTokenInputForm = Omit<OpenTokenInput, 'ttl'> & { expireAt: Date }

const schema: Zod.ZodType<OpenTokenInputForm> = Zod.object({
  projectId: Zod.number(),
  name: Zod.string().trim().max(100).min(2),
  description: Zod.string().trim().max(255),
  // ttl: Zod.number().min(1).max(secondsIn3Year),
  expireAt: Zod.date()
    .max(dayjs().add(3, 'year').toDate())
    .min(dayjs().toDate()),
  apiValidateEnabled: Zod.boolean(),
  apiValidatePath: Zod.string().url().trim().max(255),
})

const m = graphql(`
  mutation createOpenToken($data: openTokenInput!) {
    createOpenToken(data: $data) {
      token
    }
  }
`)

function CreateOpenTokenModal(props: CreateOpenTokenModalProps) {
  const { projectId, isOpen, onClose } = props

  const n = useMemo(() => dayjs(), [])

  const f = useForm<OpenTokenInputForm>({
    validate: zodResolver(schema),
    initialValues: {
      projectId,
      name: '',
      description: '',
      expireAt: n.add(1, 'year').toDate(),
      apiValidateEnabled: false,
      apiValidatePath: 'http://localhost:8080/api/v1/validate',
    },
  })

  const [mutateAsync, { loading: isLoading }] = useGraphQLMutation(m, {
    refetchQueries: ['fetchProject'],
    onCompleted(data) {
      const res = data.createOpenToken
      f.reset()
      navigator.clipboard.writeText(res.token)
      // qc.invalidateQueries(['projects', projectId, 'openTokens'])
      toast.success('the token has been copied to clipboard')
      onClose()
    },
  })

  const onSubmit = (data: OpenTokenInputForm) => {
    const val = { ...data, ttl: dayjs(data.expireAt).diff(n, 'seconds') }
    return mutateAsync({
      variables: {
        data: val,
      },
    })
  }

  return (
    <LakeModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500'>
          Create Open Token
        </span>
      }
    >
      <form onSubmit={f.onSubmit(onSubmit)} className='space-y-5 p-1'>
        <div className='bg-gray-800/40 backdrop-blur-sm rounded-lg p-5'>
          <div className='space-y-5'>
            {/* Name Field */}
            <div>
              <label className='block text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2'>
                Name
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500'>
                  <KeyIcon className='h-5 w-5' />
                </div>
                <input
                  type='text'
                  className='pl-10 w-full bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-lg py-3 px-4 text-gray-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition duration-200'
                  placeholder='My API Token'
                  {...f.getInputProps('name')}
                />
              </div>
              {f.errors.name && (
                <p className='mt-2 text-sm text-red-400'>{f.errors.name}</p>
              )}
              <p className='mt-1 text-xs text-gray-400'>
                A name to help you identify this token
              </p>
            </div>

            {/* Description Field */}
            <div>
              <label className='block text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2'>
                Description
              </label>
              <div className='relative'>
                <div className='absolute top-3 left-0 flex items-start pl-3 pointer-events-none text-gray-500'>
                  <MessageSquare className='h-5 w-5' />
                </div>
                <textarea
                  className='pl-10 w-full bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-lg py-3 px-4 text-gray-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition duration-200 min-h-[80px]'
                  placeholder='Describe the purpose of this token'
                  {...f.getInputProps('description')}
                />
              </div>
              {f.errors.description && (
                <p className='mt-2 text-sm text-red-400'>
                  {f.errors.description}
                </p>
              )}
              <p className='mt-1 text-xs text-gray-400'>
                Optional description for better organization
              </p>
            </div>

            {/* Expiration Date Field */}
            <div>
              <label className='block text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2'>
                Expiration Date
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500'>
                  <CalendarIcon className='h-5 w-5' />
                </div>
                <DateInput
                  placeholder='Select expiration date'
                  classNames={{
                    root: 'w-full',
                    input:
                      'pl-10 w-full bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-lg py-3 px-4 text-gray-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition duration-200',
                  }}
                  {...f.getInputProps('expireAt')}
                />
              </div>
              {f.errors.expireAt && (
                <p className='mt-2 text-sm text-red-400'>{f.errors.expireAt}</p>
              )}
              <p className='mt-1 text-xs text-gray-400'>
                When this token will expire (maximum 3 years from now)
              </p>
            </div>

            {/* Validation Toggle */}
            <div>
              <label className='block text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2'>
                Advanced Validation
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
              <p className='mt-1 text-xs text-gray-400'>
                Enable additional validation for API requests
              </p>
            </div>

            {/* Validate Path Field - conditionally rendered */}
            <div
              style={{
                height: f.values.apiValidateEnabled ? 'auto' : 0,
                display: f.values.apiValidateEnabled ? 'block' : 'none',
                transition: 'height 0.2s ease-in-out',
              }}
            >
              <label className='block text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2'>
                Validation Path
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500'>
                  <ShieldIcon className='h-5 w-5' />
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
              <p className='mt-1 text-xs text-gray-400'>
                URL that will be called to validate requests
              </p>
            </div>
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
            disabled={isLoading}
            className='px-6 py-2.5 rounded-lg font-medium text-sm cursor-pointer backdrop-blur-sm bg-gradient-to-r from-blue-500/90 to-purple-600/90 hover:from-blue-400 hover:to-purple-500 text-white shadow-lg shadow-purple-500/20 transition-all duration-200 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:from-blue-500/90 disabled:hover:to-purple-600/90'
          >
            {isLoading ? (
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
                Creating...
              </span>
            ) : (
              'Create Token'
            )}
          </button>
        </div>
      </form>
    </LakeModal>
  )
}

export default CreateOpenTokenModal
