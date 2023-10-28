import { Button, FormControl, FormErrorMessage, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useDisclosure } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import omit from 'lodash/omit'
import toast from 'react-hot-toast'
import { testPrompt, testPromptPayload, testPromptResponse } from '../../service/prompt'
import { useFieldArray, useForm } from 'react-hook-form'
import Zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { PromptPayload } from '../../gql/graphql'

type PromptTestButtonProps = {
  testable?: boolean
  data: Omit<testPromptPayload, 'variables'> & { variables: PromptPayload['variables'] }
  onTested: (data: testPromptResponse) => void
}

type variableFormType = {
  variables: {
    name: string,
    type: string,
    value: string
  }[]
}

const variablesSchema = Zod.object({
  variables: Zod.array(Zod.object({
    name: Zod.string().min(2).max(32),
    type: Zod.string(),
    value: Zod.string().min(1),
  }))
})

function PromptTestButton(props: PromptTestButtonProps) {
  const { testable, data, onTested } = props
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<variableFormType>({
    resolver: zodResolver(variablesSchema),
    defaultValues: { variables: [] },
  })

  useEffect(() => {
    if (!data.variables) {
      return
    }
    setValue(
      'variables',
      data.
        variables.
        map(v => ({
          name: v.name,
          type: v.type,
          value: ''
        }))
    )
  }, [data.variables])

  const { fields } = useFieldArray({
    control,
    name: 'variables',
  })

  const { mutateAsync: doTestPrompt, isPending: testing } = useMutation({
    mutationKey: ['prompt', 'test', data],
    mutationFn(variables: variableFormType) {
      const vs = omit(data, 'variables') as testPromptPayload
      vs.variables = variables.variables.reduce<Record<string, string>>((acc, v) => {
        acc[v.name] = v.value
        return acc
      }, {})
      vs.projectId = ~~vs.projectId
      return testPrompt(vs)
    },
    onSuccess(res) {
      onClose()
      toast.success('Test Passed!')
      onTested(res)
    }
  })

  const onSubmit = (data: variableFormType) => {
    return doTestPrompt(data)
  }

  return (
    <>
      <Button
        isDisabled={!testable}
        isLoading={testing}
        loadingText='Testing'
        onClick={onOpen}
      >
        Test
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Test the Prompt</ModalHeader>
          <ModalCloseButton />
          <form>
            <ModalBody>
              {fields.map((field, index) => (
                <FormControl key={field.id}>
                  <FormLabel htmlFor='name'>{field.name}</FormLabel>
                  <Textarea
                    id='name'
                    cols={8}
                    placeholder='Value'
                    {...register(`variables.${index}.value`)}
                  />
                  <FormErrorMessage>
                    {errors.variables && errors.variables[index]?.message}
                  </FormErrorMessage>
                </FormControl>
              ))}
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={onClose}>
                Close
              </Button>
              <Button
                colorScheme='teal'
                isLoading={testing}
                loadingText='Testing'
                isDisabled={(errors.variables?.length ?? 0) > 0}
                onClick={handleSubmit(onSubmit)}
              >
                Test
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

export default PromptTestButton