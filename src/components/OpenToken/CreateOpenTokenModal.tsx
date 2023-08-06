import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormErrorMessage, FormLabel, Input, Button, ModalFooter } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import DatePicker from 'react-datepicker'
import { useMutation as useGraphQLMutation } from '@apollo/client'
import 'react-datepicker/dist/react-datepicker.css'
import { useMemo } from 'react'
import { graphql } from '../../gql'
import { OpenToken, OpenTokenInput } from '../../gql/graphql'

type CreateOpenTokenModalProps = {
  isOpen: boolean
  onClose: () => void
  projectId: number
}

const secondsIn3Year = 3 * 365 * 24 * 60 * 60

const schema: Zod.ZodType<OpenTokenInput> = Zod.object({
  projectId: Zod.number(),
  name: Zod.string().trim().max(100).min(2),
  description: Zod.string().trim().max(255),
  ttl: Zod.number().min(1).max(secondsIn3Year),
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<OpenTokenInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      projectId,
      ttl: 365 * 24 * 60 * 60
    }
  })

  const [mutateAsync, { loading: isLoading }] = useGraphQLMutation(m, {
    onCompleted(data) {
      const res = data.createOpenToken
      reset()
      navigator.clipboard.writeText(res.token)
      // qc.invalidateQueries(['projects', projectId, 'openTokens'])
      toast.success('the token has been copied to clipboard')
      onClose()
    }
  })

  const onSubmit: SubmitHandler<OpenTokenInput> = (data: OpenTokenInput) => {
    return mutateAsync({
      variables: {
        data: {
          ...data,
          projectId,
        }
      }
    })
  }

  const ttlValue = watch('ttl')

  return (
    <Modal
      isOpen={isOpen} onClose={onClose} isCentered
    >
      <ModalOverlay backdropFilter='blur(5px)' />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Open Token</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel htmlFor='name'>
                Name
              </FormLabel>
              <Input {...register('name')} />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.description}>
              <FormLabel htmlFor='description'>
                Description
              </FormLabel>
              <Input {...register('description')} />
              <FormErrorMessage>
                {errors.description && errors.description.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.ttl}>
              <FormLabel htmlFor='ttl'>
                TTL
              </FormLabel>
              <DatePicker
                className='w-full'
                {...register('ttl')}
                selected={dayjs(n).add(ttlValue, 'seconds').toDate()}
                onChange={(d) => {
                  if (!d) {
                    return
                  }
                  setValue('ttl', dayjs(d).diff(n, 'seconds'))
                }}
              />
              <FormErrorMessage>
                {errors.ttl && errors.ttl.message}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button type='submit' isLoading={isLoading}>
              Create
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default CreateOpenTokenModal
