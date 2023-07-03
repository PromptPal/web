import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormErrorMessage, FormLabel, Input, Button, ModalFooter, useClipboard } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { createOpenToken, createOpenTokenPayload } from '../../service/open-token'
import { SubmitHandler, useForm } from 'react-hook-form'
import Zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import { useMemo } from 'react'

type CreateOpenTokenModalProps = {
  isOpen: boolean
  onClose: () => void
  projectId: number
}

const secondsInYear = 365 * 24 * 60 * 60

const schema: Zod.ZodType<createOpenTokenPayload> = Zod.object({
  name: Zod.string().trim().max(100).min(2),
  description: Zod.string().trim().max(255),
  ttl: Zod.number().min(1).max(secondsInYear),
})

function CreateOpenTokenModal(props: CreateOpenTokenModalProps) {
  const { projectId, isOpen, onClose } = props

  const n = useMemo(() => {
    return dayjs()
  }, [])

  const { setValue: setClipboardValue } = useClipboard('')

  const { isLoading, mutateAsync } = useMutation({
    mutationKey: ['createOpenToken'],
    mutationFn: (val: createOpenTokenPayload) => createOpenToken(projectId, val),
    onSuccess(res) {
      setClipboardValue(res.token)
      toast.success(`the Token has been copied to clipboard`)
      onClose()
    }
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<createOpenTokenPayload>({
    resolver: zodResolver(schema),
    defaultValues: {
      ttl: 30 * 24 * 60 * 60
    }
  })

  const onSubmit: SubmitHandler<createOpenTokenPayload> = (data: createOpenTokenPayload) => {
    return mutateAsync(data)
  }

  const ttlValue = watch('ttl')

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
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
              <Input {...register('ttl')} />
              <DatePicker
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
