import InputField from '@annatarhe/lake-ui/form-input-field'
import Switch from '@annatarhe/lake-ui/form-switch-field'
import TextareaField from '@annatarhe/lake-ui/form-textarea-field'
import LakeModal from '@annatarhe/lake-ui/modal'
import Tooltip from '@annatarhe/lake-ui/tooltip'
import { useMutation as useGraphQLMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import {
  CalendarIcon,
  HelpCircle,
  InfoIcon,
  MessageSquare,
  Save,
} from 'lucide-react'
import { useMemo } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod/v4'
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

const schema = z.object({
  projectId: z.number(),
  name: z.string().trim().max(100).min(2),
  description: z.string().trim().max(255),
  // ttl: z.number().min(1).max(secondsIn3Year),
  expireAt: z.coerce.date()
    .max(dayjs().add(3, 'year').toDate())
    .min(dayjs().toDate()),
  apiValidateEnabled: z.boolean(),
  apiValidatePath: z.string().url().trim().max(255),
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
      title={(
        <span className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500'>
          Create Open Token
        </span>
      )}
    >
      <form onSubmit={f.handleSubmit(onSubmit)} className='space-y-5 p-1'>
        <div className='bg-gray-800/40 backdrop-blur-sm rounded-lg p-5'>
          <div className='space-y-5'>
            {/* Name Field */}
            <InputField
              label={(
                <div>
                  <span className='text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500'>
                    Name
                  </span>
                  <Tooltip content='A name to help you identify this token'>
                    <InfoIcon className='w-4 h-4 ml-2' />
                  </Tooltip>
                </div>
              )}
              placeholder='My API Token'
              // icon={<KeyIcon />}
              {...f.register('name')}
              error={f.formState.errors.name?.message}
            />

            {/* Description Field */}
            <TextareaField
              label={(
                <div>
                  <span className='text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500'>
                    Description
                  </span>
                  <Tooltip content='Optional description for better organization'>
                    <MessageSquare className='w-4 h-4 ml-2' />
                  </Tooltip>
                </div>
              )}
              placeholder='Describe the purpose of this token'
              rows={3}
              {...f.register('description')}
              error={f.formState.errors.description?.message}
            />

            {/* Expiration Date Field */}
            <InputField
              label={(
                <div>
                  <span className='text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500'>
                    Expiration Date
                  </span>
                  <Tooltip content='When this token will expire (maximum 3 years from now)'>
                    <CalendarIcon className='w-4 h-4 ml-2' />
                  </Tooltip>
                </div>
              )}
              type='date'
              {...f.register('expireAt')}
              error={f.formState.errors.expireAt?.message}
            />

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
                label={(
                  <div>
                    <span>Validation Path</span>
                    <Tooltip
                      content={(
                        <span className='text-xs text-gray-400'>
                          URL to validate API requests
                        </span>
                      )}
                    >
                      <HelpCircle className='w-4 h-4 ml-2' />
                    </Tooltip>
                  </div>
                )}
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
