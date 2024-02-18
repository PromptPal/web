import Zod from 'zod'
import { AddIcon } from '@chakra-ui/icons'
import { testPromptResponse } from '../../service/prompt'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import toast from 'react-hot-toast'
import { Stack, TextInput, Input, Divider, Textarea, Select, Button, Tooltip } from '@mantine/core'
import { useCallback, useEffect, useState } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import PromptTestButton from '../../components/PromptTestButton/PromptTestButton'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import PromptTestPreview from '../../components/PromptTestPreview'
import { PromptVariable } from '../../service/types'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { graphql } from '../../gql'
import { useQuery as useGraphQLQuery, useMutation as useGraphQLMutation, useQuery } from '@apollo/client'
import { PromptPayload, PromptRole, PublicLevel } from '../../gql/graphql'

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
  const values = matches.map(match => match.replace(/{{\s*|\s*}}/g, '').trim())
  return values
}

type mutatePromptType = Omit<PromptPayload, 'description' | 'tokenCount'> & {
  description?: string
  tokenCount?: number
}

const schema: Zod.ZodType<mutatePromptType> = Zod.object({
  projectId: Zod.number(),
  name: Zod.string(),
  description: Zod.string(),
  tokenCount: Zod.number(),
  enabled: Zod.boolean(),
  debug: Zod.boolean(),
  prompts: Zod.array(Zod.object({
    prompt: Zod.string(),
    role: Zod.enum([PromptRole.Assistant, PromptRole.User, PromptRole.System]),
  })),
  variables: Zod.array(Zod.object({
    name: Zod.string(),
    type: Zod.string(),
  })),
  publicLevel: Zod.enum([PublicLevel.Private, PublicLevel.Public, PublicLevel.Protected]),
})

type PromptCreatePageProps = {
  isUpdate?: boolean
}

function PromptCreatePage(props: PromptCreatePageProps) {
  const { isUpdate } = props
  const id = isUpdate ? ~~(useParams().id ?? '0') : 0

  const [updatePrompt, { loading: updating }] = useGraphQLMutation(um, {
    refetchQueries: ['fetchPrompts'],
    onCompleted() {
      toast.success('Prompt updated')
      navigate('/prompts')
    }
  })
  const [createPrompt, { loading: creating }] = useGraphQLMutation(cm, {
    refetchQueries: ['fetchPrompts'],
    onCompleted() {
      toast.success('Prompt created')
      navigate('/prompts')
    }
  })

  const [sp] = useSearchParams()
  const pid = ~~(sp.get('pid') ?? '0')
  const navigate = useNavigate()

  const [testResult, setTestResult] = useState<testPromptResponse | null>(null)

  const f = useForm<mutatePromptType>({
    validate: zodResolver(schema),
    initialValues: {
      projectId: pid,
      name: '',
      description: undefined,
      tokenCount: undefined,
      publicLevel: PublicLevel.Protected,
      enabled: true,
      debug: false,
      prompts: [{
        prompt: '',
        role: PromptRole.System,
      }],
      variables: [],
    }
  })

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
        projectId: pid,
        name: payload.name,
        description: payload.description,
        tokenCount: payload.tokenCount,
        publicLevel: payload.publicLevel,
        enabled: payload.enabled,
        debug: payload.debug ?? false,
        prompts: payload.prompts ?? [],
        variables: payload.variables ?? [],
      })
    }
  })


  const { data: pjs } = useGraphQLQuery(q, {
    variables: {
      pagination: {
        limit: 100,
        offset: 0,
      }
    }
  })

  const projects = pjs?.projects.edges ?? []

  const selectedProjectId = f.values.projectId

  useEffect(() => {
    if (selectedProjectId) {
      return
    }
    if (projects.length === 0) {
      return
    }
    f.setFieldValue('projectId', projects[0].id)
  }, [selectedProjectId, projects])

  const prompts = f.values.prompts

  useEffect(() => {
    const name = f.values.name
    // only prompt change
    if (!prompts) {
      return
    }
    if (!name) {
      return
    }

    if (!/prompts\.(\d+)\.prompt/.test(name)) {
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
    const flattedPrevVariables = prevVariables.map(x => x.name)

    const nextVariables = allPlaceholders.map((placeholder) => {
      if (flattedPrevVariables.includes(placeholder)) {
        return prevVariables.find(z => z.name === placeholder)!
      }
      return {
        name: placeholder,
        type: 'string',
      }
    }).reduce<PromptVariable[]>((acc, cur) => {
      const has = acc.map(x => x.name).includes(cur.name)
      if (!has) {
        acc.push(cur)
      }
      return acc
    }, [])
    f.setFieldValue('variables', nextVariables)
  }, [prompts])

  const mutateAsync = useCallback((data: mutatePromptType) => {
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
        }
      })
    }
    return createPrompt({
      variables: {
        data: payload,
      }
    })
  }, [id, isUpdate, createPrompt, updatePrompt])
  const isLoading = updating || creating

  const onSubmit = (data: mutatePromptType) => {
    if (!data.tokenCount) {
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

  const testable = f.isValid()

  return (
    <form
      onSubmit={f.onSubmit(onSubmit)}
      className='container mx-auto'
    >
      <Stack gap={4}>
        <Stack>

          <Select
            label='Project'
            placeholder='Project'
            {...f.getInputProps('projectId')}
            data={projects.map(p => ({ value: p.id, label: p.name }) as any)}
          >
          </Select>
          <TextInput
            label='Name'
            placeholder='Name'
            {...f.getInputProps('name')}
          />
        </Stack>

        <Textarea
          label='Description'
          placeholder='Description'
          {...f.getInputProps('description')}
        />

        <Divider />

        <Stack ref={promptsAnimateParent}>
          <h3>Prompts</h3>
          {f.values.prompts.map((field, index) => {
            return (
              <div
                key={index}
                className='flex flex-row'
              >
                <Select
                  disabled={index === 0}
                  {...f.getInputProps(`prompts.${index}.name`)}
                  data={['System', 'User', 'Assistant']}
                />
                <Textarea
                  resize='vertical'
                  placeholder='Prompt'
                  {...f.getInputProps(`prompts.${index}.prompt`)}
                />
                <div className='flex items-center ml-2'>
                  <Button
                    leftSection={<TrashIcon className='w-4 h-4' />}
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
            onClick={() => f.insertListItem('prompts', { prompt: '', role: PromptRole.User })}
          >
            Add
          </Button>
        </Stack>

        <Divider />

        <Stack>
          <h3>Variables</h3>
          <div className='grid grid-cols-4 gap-4' ref={variablesAnimateParent}>
            {f.values.variables.map((variable, index) => {
              return (
                <div
                  key={index}
                  className='flex flex-row w-full justify-center'
                >
                  <TextInput
                    disabled
                    {...f.getInputProps(`variables.${index}.name`)}
                  />
                  <Select
                    {...f.getInputProps(`variables.${index}.type`)}
                    data={['String', 'Number', 'Boolean']}
                  />
                </div>
              )
            })}
          </div>
        </Stack>

        <Divider />

        <PromptTestPreview data={testResult} />

        <Stack>
          <PromptTestButton
            testable={testable}
            data={f.values}
            onTested={onTestPassed}
          />
          <Tooltip
            label='Please test it first to make sure it works'
            disabled={!!testResult}
          >
            <Button
              disabled={!testResult}
              type='submit'
              loading={isLoading}
            >
              Save
            </Button>
          </Tooltip>
        </Stack>
      </Stack>
    </form>
  )
}

export default PromptCreatePage