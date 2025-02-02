import PromptTestButton from '@/components/PromptTestButton/PromptTestButton'
import PromptTestPreview from '@/components/PromptTestPreview'
import { SupportedVariableType } from '@/constants'
import {
  PromptPayload,
  PromptRole,
  PromptVariableTypes,
  PublicLevel,
} from '@/gql/graphql'
import { useProjectId } from '@/hooks/route'
import { testPromptResponse } from '@/service/prompt'
import { PromptVariable } from '@/service/types'
import {
  useApolloClient,
  useMutation as useGraphQLMutation,
  useQuery as useGraphQLQuery,
  useLazyQuery,
  useQuery,
} from '@apollo/client'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { zodResolver as hookFormZodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Divider,
  Select,
  Stack,
  TextInput,
  Textarea,
  Tooltip,
} from '@mantine/core'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import {
  Controller,
  useFieldArray,
  useForm as useReactHookForm,
} from 'react-hook-form'
import toast from 'react-hot-toast'
import Zod from 'zod'
import { cm, q, qd, um } from './prompt.create.query'

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

type mutatePromptType = Omit<
  PromptPayload,
  'projectId' | 'description' | 'tokenCount'
> & {
  projectId?: string
  description?: string
  tokenCount?: number
}

const schema: Zod.ZodType<mutatePromptType> = Zod.object({
  projectId: Zod.string(),
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
          projectId: pid?.toString(),
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
        const prompt = resp.data?.prompt ?? def
        return structuredClone(prompt)
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
  const [variablesAnimateParent] = useAutoAnimate()

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
    <form onSubmit={handleSubmit(onSubmit)} className='container mx-auto'>
      <Stack gap={4}>
        <Stack>
          <Controller
            name='projectId'
            control={control}
            render={({ field }) => (
              <Select
                label='Project'
                placeholder='Project'
                disabled
                {...field}
                data={projects.map((p) => ({
                  value: p.id.toString(),
                  label: p.name,
                }))}
              />
            )}
          />
          <Controller
            control={control}
            name='name'
            render={({ field }) => (
              <TextInput label='Name' placeholder='Name' {...field} />
            )}
          />
        </Stack>

        <Controller
          control={control}
          name='description'
          render={({ field }) => (
            <Textarea
              label='Description'
              placeholder='Description'
              rows={8}
              {...field}
            />
          )}
        />

        <Divider className='my-4' />

        <Stack ref={promptsAnimateParent}>
          <h3>Prompts</h3>
          {promptsFields.map((field, index) => {
            return (
              <div key={field.id} className='flex flex-row gap-4'>
                <Controller
                  control={control}
                  name={`prompts.${index}.role`}
                  render={({ field }) => (
                    <Select
                      disabled={index === 0}
                      {...field}
                      data={[
                        {
                          value: PromptRole.User,
                          label: 'User',
                        },
                        {
                          value: PromptRole.Assistant,
                          label: 'Assistant',
                        },
                        {
                          value: PromptRole.System,
                          label: 'System',
                        },
                      ]}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name={`prompts.${index}.prompt`}
                  render={({ field }) => (
                    <Textarea
                      resize='vertical'
                      placeholder='Prompt'
                      className='w-full'
                      rows={8}
                      {...field}
                    />
                  )}
                />
                <div className='flex items-start'>
                  <Button
                    variant='filled'
                    color='red'
                    leftSection={<TrashIcon className='w-4 h-4' />}
                    disabled={index === 0}
                    onClick={() => removePromptField(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )
          })}
          <Button
            leftSection={<PlusIcon className='w-4 h-4' />}
            disabled={promptsFields.length >= 20}
            onClick={() =>
              appendPromptField({ prompt: '', role: PromptRole.User })
            }
          >
            Add
          </Button>
        </Stack>

        <Divider className='my-4' />

        <Stack>
          <h3>Variables</h3>
          <div className='grid grid-cols-4 gap-4' ref={variablesAnimateParent}>
            {variablesFields.map((field, index) => {
              return (
                <div
                  key={field.id}
                  className='flex flex-col gap-2 w-full justify-center'
                >
                  <Controller
                    control={control}
                    name={`variables.${index}.name`}
                    render={({ field }) => <TextInput {...field} disabled />}
                  />
                  <Controller
                    control={control}
                    name={`variables.${index}.type`}
                    render={({ field }) => (
                      <Select
                        {...field}
                        data={SupportedVariableType.map((x) => ({
                          label: x,
                          value: x.toLowerCase(),
                        }))}
                      />
                    )}
                  />
                </div>
              )
            })}
          </div>
        </Stack>

        <Divider className='my-4' />

        <PromptTestPreview data={testResult} />

        <div className='flex items-center justify-end gap-4'>
          <PromptTestButton
            testable={testable}
            data={{
              ...getValues(),
              projectId: parseInt(getValues('projectId')!),
            }}
            onTested={onTestPassed}
          />
          <Tooltip
            withArrow
            transitionProps={{ transition: 'pop' }}
            label='Please test it first to make sure it can be work'
            disabled={!!testResult}
          >
            <Button
              variant='gradient'
              gradient={{ from: 'indigo', to: 'cyan' }}
              disabled={!testResult}
              type='submit'
              loading={isLoading}
            >
              Save
            </Button>
          </Tooltip>
        </div>
      </Stack>
    </form>
  )
}

export default PromptCreatePage
