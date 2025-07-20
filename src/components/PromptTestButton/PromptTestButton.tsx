import LakeModal from '@annatarhe/lake-ui/modal'
import Switch from '@annatarhe/lake-ui/form-switch-field'
import InputField from '@annatarhe/lake-ui/form-input-field'
import TextareaField from '@annatarhe/lake-ui/form-textarea-field'
import FileInput from '../FileInput'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import omit from 'lodash/omit'
import { useEffect, useState } from 'react'
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
        SupportedVariableType.map(x => x.toLowerCase()) as [string, string],
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
  const [isOpen, setIsOpen] = useState(false)
  // const [isOpen, { open: onOpen, close: onClose }] = useDisclosure()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<variableFormType>({
    resolver: zodResolver(variablesSchema),
    defaultValues: {
      variables: [],
    },
  })

  useEffect(() => {
    if (!data.variables) {
      return
    }
    reset({
      variables: data.variables.map(v => ({
        name: v.name,
        type: v.type,
        value: '',
      })),
    })
  }, [data.variables, reset])

  const fields = watch('variables') || []

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
      setIsOpen(false)
      toast.success('Test Passed!')
      onTested(res)
    },
  })

  const onSubmit = handleSubmit((data: variableFormType) => {
    return doTestPrompt(data)
  })

  return (
    <>
      <button
        type='button'
        disabled={!testable || testing}
        onClick={() => setIsOpen(true)}
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
      <LakeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title='Test Prompt'
      >
        <form
          className='p-6 overflow-y-scroll'
          style={{
            maxHeight: '80vh',
          }}
        >
          <div>
            {fields.map((field, index) => {
              switch (field.type) {
                case PromptVariableTypes.Audio:
                case PromptVariableTypes.Image:
                case PromptVariableTypes.Video:
                  return (
                    <div key={`file-${index}`} className='mb-4'>
                      <FileInput
                        label={field.name}
                        id={`file-${index}`}
                        placeholder='Choose file...'
                        value={watch(`variables.${index}.value`) as File}
                        onChange={file => file && setValue(`variables.${index}.value`, file)}
                        error={errors.variables?.[index]?.value?.message}
                        accept={field.type === PromptVariableTypes.Image ? 'image/*' : field.type === PromptVariableTypes.Audio ? 'audio/*' : 'video/*'}
                      />
                    </div>
                  )
                case PromptVariableTypes.Boolean:
                  return (
                    <div key={`switch-${index}`} className='mb-4'>
                      <Switch
                        label={field.name}
                        value={watch(`variables.${index}.value`) as boolean}
                        onChange={value => setValue(`variables.${index}.value`, value)}
                      />
                    </div>
                  )
                case PromptVariableTypes.Number:
                  return (
                    <div
                      className='space-y-2'
                      key={`number-${index}`}
                    >
                      <InputField
                        label={field.name}
                        type='number'
                        placeholder='Value'
                        {...register(`variables.${index}.value`, { valueAsNumber: true })}
                      />
                    </div>
                  )
                case PromptVariableTypes.String:
                  return (
                    <div
                      className='space-y-2'
                      key={`string-${index}`}
                    >
                      <TextareaField
                        label={field.name}
                        placeholder='Value'
                        rows={8}
                        {...register(`variables.${index}.value`)}
                      />
                    </div>
                  )
              }
            })}
          </div>
          <div className='flex justify-end items-center gap-4 mt-4'>
            <button
              type='button'
              onClick={() => setIsOpen(false)}
              className='mr-3 px-6 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-lg border border-gray-200/10 text-gray-700 dark:text-gray-200 transition-all duration-200 hover:scale-105 active:scale-95'
            >
              Close
            </button>
            <button
              type='button'
              disabled={testing}
              onClick={onSubmit}
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
