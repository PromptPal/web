import Switch from '@annatarhe/lake-ui/form-switch-field'
import LakeModal from '@annatarhe/lake-ui/modal'
import { useMutation as useGraphQLMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import {
  CalendarIcon,
  Clock,
  HelpCircle,
  InfoIcon,
  KeyIcon,
  MessageSquare,
  Save,
  ShieldIcon,
} from 'lucide-react'
import { useMemo } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import InputField from '@annatarhe/lake-ui/form-input-field'
import Tooltip from '@annatarhe/lake-ui/tooltip'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Zod from 'zod'
import { graphql } from '../../gql'
import { OpenTokenInput } from '../../gql/graphql'
import Button from '../Button/Button'

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
    resolver: zodResolver(schema),
    defaultValues: {
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

  const apiValidateEnabled = f.watch('apiValidateEnabled')

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
      <form onSubmit={f.handleSubmit(onSubmit)} className='space-y-5 p-1'>
        <div className='bg-gray-800/40 backdrop-blur-sm rounded-lg p-5'>
          <div className='space-y-5'>
            {/* Name Field */}
            <InputField
              label={
                <div>
                  <span className='text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500'>
                    Name
                  </span>
                  <Tooltip content='A name to help you identify this token'>
                    <InfoIcon className='w-4 h-4 ml-2' />
                  </Tooltip>
                </div>
              }
              placeholder='My API Token'
              // icon={<KeyIcon />}
              {...f.register('name')}
              error={f.formState.errors.name?.message}
            />

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
                  {...f.register('description')}
                />
              </div>
              {f.formState.errors.description && (
                <p className='mt-2 text-sm text-red-400'>
                  {f.formState.errors.description?.message}
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
                <input
                  type='date'
                  className='pl-10 w-full bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-lg py-3 px-4 text-gray-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition duration-200'
                  {...f.register('expireAt')}
                />
              </div>
              {f.formState.errors.expireAt && (
                <p className='mt-2 text-sm text-red-400'>
                  {f.formState.errors.expireAt?.message}
                </p>
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
                <Controller
                  control={f.control}
                  name='apiValidateEnabled'
                  render={({ field }) => (
                    <Switch
                      label='Enable'
                      {...field}
                      error={f.formState.errors.apiValidateEnabled?.message}
                    >
                      {field.value ? 'Enabled' : 'Disabled'}
                    </Switch>
                  )}
                />
              </div>
              <p className='mt-1 text-xs text-gray-400'>
                Enable additional validation for API requests
              </p>
            </div>

            {/* Validate Path Field - conditionally rendered */}
            <div
              style={{
                height: apiValidateEnabled ? 'auto' : 0,
                display: apiValidateEnabled ? 'block' : 'none',
                transition: 'height 0.2s ease-in-out',
              }}
            >
              <InputField
                label={
                  <div>
                    <span>Validation Path</span>
                    <Tooltip
                      content={
                        <span className='text-xs text-gray-400'>
                          URL to validate API requests
                        </span>
                      }
                    >
                      <HelpCircle className='w-4 h-4 ml-2' />
                    </Tooltip>
                  </div>
                }
                type='url'
                {...f.register('apiValidatePath')}
                error={f.formState.errors.apiValidatePath?.message}
              />
            </div>
          </div>
        </div>

        <div className='flex justify-end items-center gap-4 mt-6 p-5'>
          <Button variant='ghost' onClick={onClose}>
            Cancel
          </Button>
          <Button
            icon={Save}
            type='submit'
            disabled={isLoading}
            isLoading={isLoading}
          >
            Create
          </Button>
        </div>
      </form>
    </LakeModal>
  )
}

export default CreateOpenTokenModal
