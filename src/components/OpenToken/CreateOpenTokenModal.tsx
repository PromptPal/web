import { Modal, TextInput, Button, Title, Input } from '@mantine/core'
import { useForm } from '@mantine/form'
import Zod from 'zod'
import { zodResolver } from 'mantine-form-zod-resolver'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { DateInput } from '@mantine/dates'
import { useMutation as useGraphQLMutation } from '@apollo/client'
import 'react-datepicker/dist/react-datepicker.css'
import { useMemo } from 'react'
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
  expireAt: Zod.date().max(dayjs().add(3, 'year').toDate()).min(dayjs().toDate()),
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

  const n = useMemo(() => {
    return dayjs()
  }, [])

  const f = useForm<OpenTokenInputForm>({
    validate: zodResolver(schema),
    initialValues: {
      projectId,
      name: '',
      description: '',
      expireAt: n.add(1, 'year').toDate(),
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
    }
  })

  const onSubmit = (data: OpenTokenInputForm) => {
    const val = { ...data, ttl: dayjs(data.expireAt).diff(n, 'seconds') }
    return mutateAsync({
      variables: {
        data: val
      }
    })
  }

  return (
    <Modal
      opened={isOpen} onClose={onClose} centered
      title='Create Open Token'
      overlayProps={{ backgroundOpacity: 0.5, blur: 8 }}
    >
      <form onSubmit={f.onSubmit(onSubmit)}>
        <TextInput
          label='Name'
          placeholder='name of this token'
          description='just remind you what you are doing'
          {...f.getInputProps('name')}
        />
        <TextInput
          label='Description'
          placeholder='Your purpose on this token'
          {...f.getInputProps('description')}
        />

        <Input.Wrapper
          label='Expire At'
          {...f.getInputProps('expireAt')}
        >
          <DateInput
            placeholder='expire time of this token'
            className='w-full'
            {...f.getInputProps('expireAt')}
          />
        </Input.Wrapper>

        <div className='flex justify-end items-center gap-4 mt-4'>
          <Button color='blue' mr={3} onClick={onClose} variant='outline'>
            Close
          </Button>
          <Button type='submit' color='teal' loading={isLoading}>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateOpenTokenModal
