import { Modal, TextInput, Button, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import Zod from 'zod'
import { zodResolver } from 'mantine-form-zod-resolver'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { DatePicker } from '@mantine/dates'
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
      overlayProps={{ opacity: 0.5, blur: 8 }}
    >
      <form onSubmit={f.onSubmit(onSubmit)}>
        <Title>Open Token</Title>
        <div>
          <TextInput
            label='Name'
            {...f.getInputProps('name')}
          />
          <TextInput label='Description' {...f.getInputProps('description')} />

          <div>
            <span>Expire At:</span>
            <DatePicker
              className='w-full'
              {...f.getInputProps('ttl')}
            // selected={dayjs(n).add(ttlValue, 'seconds').toDate()}
            // onChange={(d) => {
            //   if (!d) {
            //     return
            //   }
            //   setValue('ttl', dayjs(d).diff(n, 'seconds'))
            // }}
            />
          </div>

        </div>
        <div>
          <Button color='blue' mr={3} onClick={onClose}>
            Close
          </Button>
          <Button type='submit' loading={isLoading}>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateOpenTokenModal
