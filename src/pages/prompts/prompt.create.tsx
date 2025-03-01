import PromptTestButton from '@/components/PromptTestButton/PromptTestButton'
import PromptTestPreview from '@/components/PromptTestPreview'
import { PromptRole, PromptVariableTypes, PublicLevel } from '@/gql/graphql'
import { useProjectId } from '@/hooks/route'
import { testPromptResponse } from '@/service/prompt'
import { PromptVariable } from '@/service/types'
import { cn } from '@/utils'
import {
  useApolloClient,
  useMutation as useGraphQLMutation,
  useQuery as useGraphQLQuery,
  useLazyQuery,
} from '@apollo/client'
import { useAutoAnimate } from '@formkit/auto-animate/react'
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
import Zod from 'zod'
import { VariablesSection } from './components/VariablesSection'
import { cm, q, qd, um } from './prompt.create.query'
import { mutatePromptType } from './types'

function findPlaceholderValues(sentence: string): string[] {
  const regex = /{{\s*([a-zA-Z][a-zA-Z0-9]*)\s*}}/g
  const matches = sentence.match(regex)

  if (!matches) {
    return []
  }
  const values = matches.map((match) =>
    match.replace(/{{\s*|\s*}}/g, '').trim(),
  )
  return values
}

const schema: Zod.ZodType<mutatePromptType> = Zod.object({
  projectId: Zod.number(),
  name: Zod.string(),
  description: Zod.string(),
  tokenCount: Zod.number(),
  enabled: Zod.boolean(),
  debug: Zod.boolean(),
  prompts: Zod.array(
    Zod.object({
      prompt: Zod.string(),
      role: Zod.enum([
        PromptRole.Assistant,
        PromptRole.User,
        PromptRole.System,
      ]),
    }),
  ),
  variables: Zod.array(
    Zod.object({
      name: Zod.string(),
      type: Zod.nativeEnum(PromptVariableTypes),
    }),
  ),
  publicLevel: Zod.enum([
    PublicLevel.Private,
    PublicLevel.Public,
    PublicLevel.Protected,
  ]),
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
  const [fetchPrompt] = useLazyQuery(qd, {
    variables: {
      id,
    },
  })

  const { watch, control, handleSubmit, getValues, setValue } =
    useReactHookForm<mutatePromptType>({
      resolver: hookFormZodResolver(schema),
      defaultValues: async () => {
        const def = {
          projectId: pid ?? -1,
          name: '',
          description: undefined,
          tokenCount: undefined,
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
        }

        if (!isUpdate) {
          return def
        }

        const resp = await fetchPrompt({ variables: { id } })
        const prompt = structuredClone(
          resp.data?.prompt ?? def,
        ) as mutatePromptType
        prompt.projectId = pid
        return prompt
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

  const prompts = watch('prompts') ?? []

  useEffect(() => {
    // only prompt change
    if (!prompts) {
      return
    }

    const allPlaceholders = prompts.reduce<string[]>((acc, prompt) => {
      if (!prompt?.prompt) {
        return acc
      }
      acc.push(...findPlaceholderValues(prompt.prompt))
      return acc
    }, [])

    const prevVariables = getValues('variables') ?? []
    const flattedPrevVariables = prevVariables.map((x) => x.name)
    const nextVariables = allPlaceholders
      .map((placeholder) => {
        if (flattedPrevVariables.includes(placeholder)) {
          return prevVariables.find((z) => z.name === placeholder)!
        }
        return {
          name: placeholder,
          type: PromptVariableTypes.String,
        }
      })
      .reduce<PromptVariable[]>((acc, cur) => {
        const has = acc.map((x) => x.name).includes(cur.name)
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
        projectId: ~~data.projectId,
        description: data.description ?? '',
        tokenCount: data.tokenCount ?? 0,
      }
      if (isUpdate) {
        return updatePrompt({
          variables: {
            id,
            data: payload,
          },
        })
      }
      return createPrompt({
        variables: {
          data: payload,
        },
      })
    },
    [id, isUpdate, createPrompt, updatePrompt],
  )
  const isLoading = updating || creating

  const onSubmit = (data: mutatePromptType) => {
    if (data.tokenCount === undefined) {
      toast.error('please test it first to make sure it works')
      return
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

  const [promptsAnimateParent] = useAutoAnimate()

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
              <h1 className='text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500'>
                {isUpdate ? 'Update Prompt' : 'Create New Prompt'}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
        <section className='w-full backdrop-blur-xs bg-linear-to-br from-gray-900/80 to-gray-800/80 rounded-xl overflow-hidden p-6'>
          <div className='flex flex-col gap-6'>
            <div className='grid grid-cols-2 gap-6'>
              <Controller
                name='projectId'
                control={control}
                disabled
                render={({ field }) => (
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-gray-200'>
                      Project
                    </label>
                    <select
                      {...field}
                      className='w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-200 disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                    >
                      <option value=''>Select Project</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id.toString()}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              />
              <Controller
                control={control}
                name='name'
                render={({ field }) => (
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-gray-200'>
                      Name
                    </label>
                    <input
                      type='text'
                      placeholder='Name'
                      {...field}
                      className='w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                    />
                  </div>
                )}
              />
            </div>
          </div>
        </section>

        <Controller
          control={control}
          name='description'
          render={({ field }) => (
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-medium text-gray-200'>
                Description
              </label>
              <textarea
                placeholder='Description'
                rows={4}
                {...field}
                className='w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-200 placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
              />
            </div>
          )}
        />

        <section className='w-full backdrop-blur-xs bg-linear-to-br from-gray-900/80 to-gray-800/80 rounded-xl overflow-hidden p-6'>
          <div className='flex flex-col gap-6'>
            <h3 className='text-xl font-bold tracking-tight bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent'>
              Prompts
            </h3>
            <div className='flex flex-col gap-4' ref={promptsAnimateParent}>
              {promptsFields.map((field, index) => {
                return (
                  <div
                    key={field.id}
                    className='flex flex-row gap-4 p-4 rounded-xl bg-linear-to-br from-gray-800/40 via-gray-800/20 to-gray-800/40 backdrop-blur-xl border border-gray-700/50 hover:border-blue-500/50 transition-all'
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
                        <textarea
                          placeholder='Prompt'
                          className='w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-200 placeholder-gray-400'
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
                  'flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all',
                  promptsFields.length >= 20 && 'opacity-50 cursor-not-allowed',
                )}
                disabled={promptsFields.length >= 20}
                onClick={() =>
                  appendPromptField({ prompt: '', role: PromptRole.User })
                }
              >
                <PlusIcon className='w-4 h-4' />
                Add
              </button>
            </div>
          </div>
        </section>

        <VariablesSection control={control} variablesFields={variablesFields} />

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
                projectId: getValues('projectId')!,
              }}
              onTested={onTestPassed}
            />
            <div className='relative group'>
              <button
                type='submit'
                className={cn(
                  'flex items-center gap-2 px-6 py-2 rounded-lg bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all',
                  !testResult && 'opacity-50 cursor-not-allowed',
                )}
                disabled={!testResult}
              >
                {isLoading ? (
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                ) : null}
                Save
              </button>
              {!testResult && (
                <div className='absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-sm bg-gray-800 text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity'>
                  Please test it first to make sure it can work
                  <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45' />
                </div>
              )}
            </div>
          </div>
        </section>
      </form>
    </div>
  )
}

export default PromptCreatePage
