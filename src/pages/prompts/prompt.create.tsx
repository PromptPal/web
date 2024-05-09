import {
  useApolloClient,
  useMutation as useGraphQLMutation,
  useQuery as useGraphQLQuery,
  useQuery,
} from '@apollo/client'
import { AddIcon } from '@chakra-ui/icons'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { TrashIcon } from '@heroicons/react/24/outline'
import {
  Button,
  Divider,
  Select,
  Stack,
  TextInput,
  Textarea,
  Tooltip,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import Zod from 'zod'
import PromptTestButton from '../../components/PromptTestButton/PromptTestButton'
import PromptTestPreview from '../../components/PromptTestPreview'
import { graphql } from '../../gql'
import { PromptPayload, PromptRole, PublicLevel } from '../../gql/graphql'
import { useProjectId } from '../../hooks/route'
import { testPromptResponse } from '../../service/prompt'
import { PromptVariable } from '../../service/types'

const q = graphql(`
  query allProjectListLite($pagination: PaginationInput!) {
    projects(pagination: $pagination) {
      count
      edges {
        id
        name
      }
    }
  }
`)

const qd = graphql(`
  query getPromptForEdit($id: Int!) {
    prompt(id: $id) {
      id
      name
      description
      enabled
      debug
      tokenCount
      prompts {
        prompt
        role
      }
      variables {
        name
        type
      }
      publicLevel
      createdAt
      updatedAt
    }
  }
`)

const cm = graphql(`
  mutation createPrompt($data: PromptPayload!) {
    createPrompt(data: $data) {
      id
    }
  }
`)

const um = graphql(`
  mutation updatePrompt($id: Int!, $data: PromptPayload!) {
    updatePrompt(id: $id, data: $data) {
      id
    }
  }
`)

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
      type: Zod.string(),
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
  const id = isUpdate ? ~~(useParams().id ?? '0') : 0
  const pid = useProjectId()

  const ac = useApolloClient()

  const [updatePrompt, { loading: updating }] = useGraphQLMutation(um, {
    refetchQueries: ['fetchPrompts'],
    onCompleted(data) {
      toast.success('Prompt updated')
      ac.resetStore()
      navigate(`/${pid}/prompts/` + data.updatePrompt.id)
    },
  })
  const [createPrompt, { loading: creating }] = useGraphQLMutation(cm, {
    refetchQueries: ['fetchPrompts'],
    onCompleted() {
      toast.success('Prompt created')
      ac.resetStore()
      navigate(`/${pid}/prompts`)
    },
  })

  const navigate = useNavigate()

  const [testResult, setTestResult] = useState<testPromptResponse | null>(null)

  const f = useForm<mutatePromptType>({
    validate: zodResolver(schema),
    initialValues: {
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
    },
  })
  useEffect(() => {
    f.setFieldValue('projectId', pid?.toString())
  }, [pid])

  useQuery(qd, {
    variables: {
      id,
    },
    skip: isUpdate ? false : true,
    onCompleted(data) {
      const payload = data.prompt
      if (!payload) {
        return
      }
      f.setValues({
        projectId: pid?.toString(),
        name: payload.name,
        description: payload.description,
        tokenCount: payload.tokenCount,
        publicLevel: payload.publicLevel,
        enabled: payload.enabled,
        debug: payload.debug ?? false,
        prompts: structuredClone(payload.prompts),
        variables: structuredClone(payload.variables),
      })
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

  const prompts = f.values.prompts

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

    const prevVariables = f.values.variables ?? []
    const flattedPrevVariables = prevVariables.map((x) => x.name)

    const nextVariables = allPlaceholders
      .map((placeholder) => {
        if (flattedPrevVariables.includes(placeholder)) {
          return prevVariables.find((z) => z.name === placeholder)!
        }
        return {
          name: placeholder,
          type: 'string',
        }
      })
      .reduce<PromptVariable[]>((acc, cur) => {
        const has = acc.map((x) => x.name).includes(cur.name)
        if (!has) {
          acc.push(cur)
        }
        return acc
      }, [])
    f.setFieldValue('variables', nextVariables)
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
    f.setFieldValue('tokenCount', testRes.usage.total_tokens)
    setTestResult(testRes)
  }

  const [promptsAnimateParent] = useAutoAnimate()
  const [variablesAnimateParent] = useAutoAnimate()

  const testable = prompts.length > 0

  return (
    <form onSubmit={f.onSubmit(onSubmit)} className="container mx-auto">
      <Stack gap={4}>
        <Stack>
          <Select
            label="Project"
            placeholder="Project"
            disabled
            {...f.getInputProps('projectId')}
            data={projects.map((p) => ({
              value: p.id.toString(),
              label: p.name,
            }))}
          />
          <TextInput
            label="Name"
            placeholder="Name"
            {...f.getInputProps('name')}
          />
        </Stack>

        <Textarea
          label="Description"
          placeholder="Description"
          {...f.getInputProps('description')}
        />

        <Divider className="my-4" />

        <Stack ref={promptsAnimateParent}>
          <h3>Prompts</h3>
          {f.values.prompts.map((_, index) => {
            return (
              <div key={index} className="flex flex-row gap-4">
                <Select
                  disabled={index === 0}
                  {...f.getInputProps(`prompts.${index}.role`)}
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
                <Textarea
                  resize="vertical"
                  placeholder="Prompt"
                  className="w-full"
                  rows={8}
                  {...f.getInputProps(`prompts.${index}.prompt`, {
                    type: 'input',
                  })}
                />
                <div className="flex items-start">
                  <Button
                    variant="filled"
                    color="red"
                    leftSection={<TrashIcon className="w-4 h-4" />}
                    disabled={index === 0}
                    onClick={() => f.removeListItem('prompts', index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )
          })}
          <Button
            leftSection={<AddIcon />}
            disabled={f.values.prompts.length >= 20}
            onClick={() =>
              f.insertListItem('prompts', { prompt: '', role: PromptRole.User })
            }
          >
            Add
          </Button>
        </Stack>

        <Divider />

        <Stack>
          <h3>Variables</h3>
          <div className="grid grid-cols-4 gap-4" ref={variablesAnimateParent}>
            {f.values.variables.map((_, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col gap-2 w-full justify-center"
                >
                  <TextInput
                    disabled
                    {...f.getInputProps(`variables.${index}.name`)}
                  />
                  <Select
                    {...f.getInputProps(`variables.${index}.type`)}
                    data={['String', 'Number', 'Boolean'].map((x) => ({
                      label: x,
                      value: x.toLowerCase(),
                    }))}
                  />
                </div>
              )
            })}
          </div>
        </Stack>

        <Divider />

        <PromptTestPreview data={testResult} />

        <div className="flex items-center justify-end gap-4">
          <PromptTestButton
            testable={testable}
            data={{
              ...f.values,
              projectId: parseInt(f.values.projectId!),
            }}
            onTested={onTestPassed}
          />
          <Tooltip
            withArrow
            transitionProps={{ transition: 'pop' }}
            label="Please test it first to make sure it can be work"
            disabled={!!testResult}
          >
            <Button
              variant="gradient"
              gradient={{ from: 'indigo', to: 'cyan' }}
              disabled={!testResult}
              type="submit"
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
