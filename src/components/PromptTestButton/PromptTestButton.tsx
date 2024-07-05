import {
  Button,
  FileInput,
  Modal,
  NumberInput,
  Switch,
  Textarea,
} from '@mantine/core'
import { useForm as useMantineForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useMutation } from '@tanstack/react-query'
import omit from 'lodash/omit'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import Zod from 'zod'
import { SupportedVariableType } from '../../constants'
import { PromptPayload, PromptVariableTypes } from '../../gql/graphql'
import {
  testPrompt,
  testPromptPayload,
  testPromptResponse,
} from '../../service/prompt'

type PromptTestButtonProps = {
  testable?: boolean
  data: Omit<testPromptPayload, 'variables'> & {
    variables: PromptPayload['variables']
  }
  onTested: (data: testPromptResponse) => void
}

const variablesSchema = Zod.object({
  variables: Zod.array(
    Zod.object({
      name: Zod.string().min(2).max(32),
      type: Zod.enum(
        SupportedVariableType.map((x) => x.toLowerCase()) as [string, string],
      ),
      value: Zod.union([
        Zod.string().min(1),
        Zod.instanceof(File),
        Zod.number(),
        Zod.boolean(),
      ]),
    }),
  ),
})

type variableFormType = Zod.infer<typeof variablesSchema>
// type variableFormType = {
//   variables: {
//     name: string
//     type: PromptVariableTypes
//     value: string | number | boolean
//   }[]
// }

function PromptTestButton(props: PromptTestButtonProps) {
  const { testable, data, onTested } = props
  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure()

  const f = useMantineForm<variableFormType>({
    validate: zodResolver(variablesSchema),
    initialValues: {
      variables: [],
    },
  })

  useEffect(() => {
    if (!data.variables) {
      return
    }
    f.setValues({
      variables: data.variables.map((v) => ({
        name: v.name,
        type: v.type,
        value: '',
      })),
    })
  }, [data.variables])

  const fields = f.values.variables

  const { mutateAsync: doTestPrompt, isPending: testing } = useMutation({
    mutationKey: ['prompt', 'test', data],
    mutationFn(variables: variableFormType) {
      // TODO: upload image first!!!
      const vs = omit(data, 'variables') as testPromptPayload
      vs.variables = variables.variables.reduce<testPromptPayload['variables']>(
        (acc, v) => {
          acc[v.name] = v.value
          return acc
        },
        {},
      )
      vs.projectId = ~~vs.projectId
      return testPrompt(vs)
    },
    onSuccess(res) {
      onClose()
      toast.success('Test Passed!')
      onTested(res)
    },
  })

  const onSubmit = (data: variableFormType) => {
    return doTestPrompt(data)
  }

  return (
    <>
      <Button
        disabled={!testable}
        loading={testing}
        // loadingText='Testing'
        onClick={onOpen}
      >
        Test
      </Button>
      <Modal
        opened={isOpen}
        onClose={onClose}
        centered
        title="Test Prompt"
        overlayProps={{ backgroundOpacity: 0.5, blur: 8 }}
      >
        <form>
          <div>
            {fields.map((field, index) => {
              switch (field.type) {
                case PromptVariableTypes.Audio:
                case PromptVariableTypes.Image:
                case PromptVariableTypes.Video:
                  return (
                    <FileInput
                      label={field.name}
                      id="name"
                      key={f.key(`variables.${index}.value`)}
                      placeholder="Value"
                      {...f.getInputProps(`variables.${index}.value`)}
                    />
                  )
                case PromptVariableTypes.Boolean:
                  return (
                    <Switch
                      type="checkbox"
                      label={field.name}
                      id="name"
                      key={f.key(`variables.${index}.value`)}
                      placeholder="Value"
                      {...f.getInputProps(`variables.${index}.value`)}
                    />
                  )
                case PromptVariableTypes.Number:
                  return (
                    <NumberInput
                      label={field.name}
                      id="name"
                      key={f.key(`variables.${index}.value`)}
                      placeholder="Value"
                      {...f.getInputProps(`variables.${index}.value`)}
                    />
                  )
                case PromptVariableTypes.String:
                  return (
                    <Textarea
                      label={field.name}
                      id="name"
                      key={f.key(`variables.${index}.value`)}
                      cols={8}
                      placeholder="Value"
                      {...f.getInputProps(`variables.${index}.value`)}
                    />
                  )
              }
            })}
          </div>
          <div className="flex justify-end items-center gap-4 mt-4">
            <Button mr={3} onClick={onClose} variant="outline">
              Close
            </Button>
            <Button
              color="teal"
              loading={testing}
              disabled={!f.validate}
              onClick={
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                f.onSubmit(onSubmit) as any
              }
            >
              Test
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default PromptTestButton
