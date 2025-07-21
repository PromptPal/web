import Button from '@/components/Button/Button'
import PromptTestPreview from '@/components/PromptResultPreview'
import PromptTestButton from '@/components/PromptTestButton/PromptTestButton'
import ProvidersSelector from '@/components/Providers/Selector'
import { PromptRole, PromptVariableTypes, PublicLevel } from '@/gql/graphql'
import { useProjectId } from '@/hooks/route'
import { testPromptResponse } from '@/service/prompt'
import { PromptVariable } from '@/service/types'
import { cn } from '@/utils'
import InputField from '@annatarhe/lake-ui/form-input-field'
import SelectField from '@annatarhe/lake-ui/form-select-field'
import TextareaField from '@annatarhe/lake-ui/form-textarea-field'
import Tooltip from '@annatarhe/lake-ui/tooltip'
import {
  useApolloClient,
  useMutation as useGraphQLMutation,
  useQuery as useGraphQLQuery,
  useLazyQuery,
} from '@apollo/client'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { zodResolver as hookFormZodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import {
  Controller,
  useFieldArray,
  useForm as useReactHookForm,
} from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod/v4'
import { VariablesSection } from './components/VariablesSection'
import { cm, q, qd, um } from './prompt.create.query'
import { mutatePromptType } from './types'

function findPlaceholderValues(sentence: string): string[] {
  const regex = /{{\s*([a-zA-Z][a-zA-Z0-9]*)\s*}}/g
  const matches = sentence.match(regex)

  if (!matches) {
    return []
  }
  const values = matches.map(match =>
    match.replace(/{{\s*|\s*}}/g, '').trim(),
  )
  return values
}

const schema = z.object({
  projectId: z.number(),
  name: z.string()
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Name must be alphanumeric and contain underscores',
    )
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  description: z.string(),
  tokenCount: z.number(),
  enabled: z.boolean(),
  debug: z.boolean(),
  prompts: z.array(
    z.object({
      prompt: z.string(),
      role: z.enum([
        PromptRole.Assistant,
        PromptRole.User,
        PromptRole.System,
      ]),
    }),
  ),
  variables: z.array(
    z.object({
      name: z.string(),
      type: z.nativeEnum(PromptVariableTypes),
    }),
  ),
  publicLevel: z.enum([
    PublicLevel.Private,
    PublicLevel.Public,
    PublicLevel.Protected,
  ]),
  providerId: z.number().optional(),
})

type PromptCreatePageProps = {
  isUpdate?: boolean
}

function PromptCreatePage(props: PromptCreatePageProps) {
  const { isUpdate } = props
  const id = isUpdate ? ~~(useParams({ strict: false }).id ?? '0') : 0
  const pid = useProjectId()

  const ac = useApolloClient()

  const [updatePrompt, { loading: updating }] = useGraphQLMutation(um, {
    refetchQueries: ['fetchPrompts'],
    onCompleted(data) {
      toast.success('Prompt updated')
      ac.resetStore()
      navigate({ to: `/${pid}/prompts/` + data.updatePrompt.id })
    },
  })
  const [createPrompt, { loading: creating }] = useGraphQLMutation(cm, {
    refetchQueries: ['fetchPrompts'],
    onCompleted() {
      toast.success('Prompt created')
      ac.resetStore()
      navigate({ to: `/${pid}/prompts` })
    },
  })

  const navigate = useNavigate()

  const [testResult, setTestResult] = useState<testPromptResponse | null>(null)
  const [fetchPrompt, { data: promptData }] = useLazyQuery(qd, {
    variables: {
      id,
    },
  })

  const { watch, control, handleSubmit, getValues, setValue }
    = useReactHookForm({
      resolver: hookFormZodResolver(schema),
      defaultValues: async () => {
        const def = {
          projectId: pid ?? -1,
          name: '',
          description: undefined as unknown as string,
          tokenCount: undefined as unknown as number,
          publicLevel: PublicLevel.Protected,
          enabled: true,
          debug: false,
          prompts: [
            {
              prompt: '',
              role: PromptRole.System,
            },
          ],
          variables: [],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          providerId: undefined as any,
        }

        if (!isUpdate) {
          return def
        }

        const resp = await fetchPrompt({ variables: { id } })
        const prompt = structuredClone(
          resp.data?.prompt ?? def,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as any

        prompt.providerId = prompt.provider?.id ?? undefined
        delete prompt.provider

        prompt.projectId = pid
        return prompt as z.infer<typeof schema>
      },
    })

  const { data: pjs } = useGraphQLQuery(q, {
    variables: {
      pagination: {
        limit: 100,
        offset: 0,
      },
    },
    onCompleted(data) {
      const payload = data.projects
      if (!payload) {
        return
      }
    },
  })

  const projects = pjs?.projects.edges ?? []

  const prompts: { prompt: string, role: PromptRole }[] = watch('prompts') ?? []
  const providerId = watch('providerId')

  useEffect(() => {
    // only prompt change
    if (!prompts) {
      return
    }

    const allPlaceholders: string[] = prompts.reduce<string[]>((acc, prompt) => {
      if (!prompt?.prompt) {
        return acc
      }
      acc.push(...findPlaceholderValues(prompt.prompt))
      return acc
    }, [])

    const prevVariables = getValues('variables') ?? []
    const flattedPrevVariables = prevVariables.map(x => x.name)
    const nextVariables = allPlaceholders
      .map((placeholder) => {
        if (flattedPrevVariables.includes(placeholder)) {
          return prevVariables.find(z => z.name === placeholder)!
        }
        return {
          name: placeholder,
          type: PromptVariableTypes.String,
        }
      })
      .reduce<PromptVariable[]>((acc, cur) => {
        const has = acc.map(x => x.name).includes(cur.name)
        if (!has) {
          acc.push(cur)
        }
        return acc
      }, [])
    setValue('variables', nextVariables, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }, [JSON.stringify(prompts)])

  const mutateAsync = useCallback(
    (data: mutatePromptType) => {
      if (!data.projectId) {
        throw new Error('projectId is required')
      }
      const payload = {
        ...data,
        name: promptData?.prompt.name ?? data.name,
        projectId: ~~data.projectId,
        description: data.description ?? '',
        tokenCount: data.tokenCount ?? 0,
      }
      if (isUpdate) {
        return updatePrompt({
          variables: {
            id,
            data: {
              ...payload,
              providerId: payload.providerId ?? -1,
            },
          },
        })
      }
      return createPrompt({
        variables: {
          data: {
            ...payload,
            providerId: payload.providerId ?? -1,
          },
        },
      })
    },
    [id, isUpdate, promptData?.prompt.name, createPrompt, updatePrompt],
  )
  const isLoading = updating || creating

  const onSubmit = (data: mutatePromptType) => {
    if (data.tokenCount === undefined) {
      toast.error('please test it first to make sure it works')
      return
    }
    data.projectId = pid
    if (!data.providerId) {
      data.providerId = -1
    }
    return mutateAsync(data)
  }

  const onTestPassed = (testRes: testPromptResponse) => {
    setValue('tokenCount', testRes.usage.total_tokens, {
      shouldValidate: true,
      shouldDirty: true,
    })
    setTestResult(testRes)
  }

  const testable = prompts.length > 0

  const {
    fields: promptsFields = [],
    append: appendPromptField,
    remove: removePromptField,
  } = useFieldArray({
    control,
    name: 'prompts',
  })

  const { fields: variablesFields = [] } = useFieldArray({
    control,
    name: 'variables',
  })

  return (
    <div className='w-full flex flex-col gap-6'>
      <section className='w-full backdrop-blur-xs bg-linear-to-br from-gray-900/80 to-gray-800/80 rounded-xl overflow-hidden'>
        <div className='p-6'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-3'>
              <h1 className='text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-sky-400 to-blue-500'>
                {isUpdate ? 'Update Prompt' : 'Create New Prompt'}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <form
        onSubmit={handleSubmit(onSubmit, (err) => {
          console.error(err)
        })}
        className='flex flex-col gap-6'
      >
        <section className='w-full backdrop-blur-xs bg-linear-to-br from-gray-900/80 to-gray-800/80 rounded-xl overflow-hidden p-6'>
          <div className='flex flex-col gap-6'>
            <div className='grid grid-cols-2 gap-6'>
              <Controller
                name='projectId'
                control={control}
                disabled
                render={({ field }) => (
                  <SelectField
                    label='Project'
                    options={projects.map(p => ({
                      value: p.id.toString(),
                      label: p.name,
                    }))}
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name='name'
                disabled={isUpdate}
                render={({ field }) => (
                  <InputField label='Name' placeholder='Name' {...field} />
                )}
              />
            </div>
          </div>
        </section>

        <Controller
          control={control}
          name='description'
          render={({ field }) => (
            <TextareaField
              label='Description'
              placeholder='Description'
              rows={4}
              {...field}
            />
          )}
        />

        <section className='w-full backdrop-blur-xs bg-linear-to-br from-gray-900/80 to-gray-800/80 rounded-xl overflow-hidden p-6'>
          <div className='flex flex-col gap-6'>
            <h3 className='text-xl font-bold tracking-tight bg-linear-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent'>
              Prompts
            </h3>
            <div className='flex flex-col gap-4'>
              {promptsFields.map((field, index) => {
                return (
                  <div
                    key={field.id}
                    className='flex flex-row gap-4 p-4 rounded-xl bg-linear-to-br from-gray-800/40 via-gray-800/20 to-gray-800/40 backdrop-blur-xl border border-gray-700/50 hover:border-sky-500/50 transition-all'
                  >
                    <Controller
                      control={control}
                      name={`prompts.${index}.role`}
                      render={({ field }) => (
                        <select
                          disabled={index === 0}
                          {...field}
                          className='w-48 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-200 disabled:opacity-50'
                        >
                          <option value={PromptRole.User}>User</option>
                          <option value={PromptRole.Assistant}>
                            Assistant
                          </option>
                          <option value={PromptRole.System}>System</option>
                        </select>
                      )}
                    />

                    <Controller
                      control={control}
                      name={`prompts.${index}.prompt`}
                      render={({ field }) => (
                        <TextareaField
                          placeholder='Prompt'
                          rows={8}
                          {...field}
                        />
                      )}
                    />
                    <div className='flex items-start'>
                      <button
                        type='button'
                        className={cn(
                          'flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium transition-all',
                          index === 0 && 'opacity-50 cursor-not-allowed',
                        )}
                        disabled={index === 0}
                        onClick={() => removePromptField(index)}
                      >
                        <TrashIcon className='w-4 h-4' />
                        Remove
                      </button>
                    </div>
                  </div>
                )
              })}
              <button
                type='button'
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium transition-all',
                  promptsFields.length >= 20 && 'opacity-50 cursor-not-allowed',
                )}
                disabled={promptsFields.length >= 20}
                onClick={() =>
                  appendPromptField({ prompt: '', role: PromptRole.User })}
              >
                <PlusIcon className='w-4 h-4' />
                Add
              </button>
            </div>
          </div>
        </section>

        <VariablesSection
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          control={control as any}
          variablesFields={variablesFields}
        />

        <Controller
          name='providerId'
          control={control}
          render={({ field }) => {
            return <ProvidersSelector label='Provider' {...field} />
          }}
        />

        {testResult && (
          <section className='w-full backdrop-blur-xs bg-linear-to-br from-gray-900/80 to-gray-800/80 rounded-xl overflow-hidden p-6'>
            <PromptTestPreview data={testResult} />
          </section>
        )}

        <section className='w-full backdrop-blur-xs bg-linear-to-br from-gray-900/80 to-gray-800/80 rounded-xl overflow-hidden p-6'>
          <div className='flex items-center justify-end gap-4'>
            <PromptTestButton
              testable={testable}
              data={{
                ...getValues(),
                providerId: providerId!,
                projectId: getValues('projectId')!,
              }}
              onTested={onTestPassed}
            />
            <div className='relative group'>
              <Tooltip
                content='Please test it first to make sure it can work'
                disabled={!!testResult}
              >
                <Button
                  type='submit'
                  isLoading={isLoading}
                  disabled={!testResult}
                >
                  Save
                </Button>
              </Tooltip>
            </div>
          </div>
        </section>
      </form>
    </div>
  )
}

export default PromptCreatePage
