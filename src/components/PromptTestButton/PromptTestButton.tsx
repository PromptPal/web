import LakeModal from '@annatarhe/lake-ui/modal'
import { FileInput, Switch } from '@mantine/core'
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
      <button
        type='button'
        disabled={!testable || testing}
        onClick={onOpen}
        className='px-6 py-2 bg-linear-to-r from-teal-500 to-emerald-500 text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group'
      >
        <span
          className={`flex items-center justify-center ${testing ? 'opacity-0' : 'opacity-100'}`}
        >
          Test
        </span>
        {testing && (
          <span className='absolute inset-0 flex items-center justify-center'>
            <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
                fill='none'
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              />
            </svg>
          </span>
        )}
      </button>
      <LakeModal isOpen={isOpen} onClose={onClose} title='Test Prompt'>
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
                      id='name'
                      key={f.key(`variables.${index}.value`)}
                      placeholder='Value'
                      {...f.getInputProps(`variables.${index}.value`)}
                    />
                  )
                case PromptVariableTypes.Boolean:
                  return (
                    <Switch
                      type='checkbox'
                      label={field.name}
                      id='name'
                      key={f.key(`variables.${index}.value`)}
                      placeholder='Value'
                      {...f.getInputProps(`variables.${index}.value`)}
                    />
                  )
                case PromptVariableTypes.Number:
                  return (
                    <div
                      className='space-y-2'
                      key={f.key(`variables.${index}.value`)}
                    >
                      <label
                        htmlFor={`var-${index}`}
                        className='block text-sm font-medium text-gray-700 dark:text-gray-200'
                      >
                        {field.name}
                      </label>
                      <input
                        type='number'
                        id={`var-${index}`}
                        className='w-full px-4 py-2 bg-white/5 backdrop-blur-xl rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-hidden transition-all dark:text-white'
                        placeholder='Value'
                        {...f.getInputProps(`variables.${index}.value`)}
                      />
                    </div>
                  )
                case PromptVariableTypes.String:
                  return (
                    <div
                      className='space-y-2'
                      key={f.key(`variables.${index}.value`)}
                    >
                      <label
                        htmlFor={`var-${index}`}
                        className='block text-sm font-medium text-gray-700 dark:text-gray-200'
                      >
                        {field.name}
                      </label>
                      <textarea
                        id={`var-${index}`}
                        className='w-full px-4 py-2 bg-white/5 backdrop-blur-xl rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-hidden transition-all resize-y min-h-[200px] dark:text-white'
                        placeholder='Value'
                        {...f.getInputProps(`variables.${index}.value`)}
                      />
                    </div>
                  )
              }
            })}
          </div>
          <div className='flex justify-end items-center gap-4 mt-4'>
            <button
              type='button'
              onClick={onClose}
              className='mr-3 px-6 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-lg border border-gray-200/10 text-gray-700 dark:text-gray-200 transition-all duration-200 hover:scale-105 active:scale-95'
            >
              Close
            </button>
            <button
              type='button'
              disabled={!f.validate || testing}
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              onClick={f.onSubmit(onSubmit) as any}
              className='px-6 py-2 bg-linear-to-r from-teal-500 to-emerald-500 text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group'
            >
              <span
                className={`flex items-center justify-center ${testing ? 'opacity-0' : 'opacity-100'}`}
              >
                Test
              </span>
              {testing && (
                <span className='absolute inset-0 flex items-center justify-center'>
                  <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                      fill='none'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </form>
      </LakeModal>
    </>
  )
}

export default PromptTestButton
