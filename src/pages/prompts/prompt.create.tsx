import Zod from 'zod'
import { AddIcon } from '@chakra-ui/icons'
import { testPromptResponse } from '../../service/prompt'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Stack, FormControl, FormLabel, Input, FormErrorMessage, Divider, Textarea, Select, Button, Tooltip } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import PromptTestButton from '../../components/PromptTestButton/PromptTestButton'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import PromptTestPreview from '../../components/PromptTestPreview'
import { PromptVariable } from '../../service/types'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { graphql } from '../../gql'
import { useQuery as useGraphQLQuery, useLazyQuery as useGraphQLLazyQuery, useMutation as useGraphQLMutation } from '@apollo/client'
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

  const [fetchPromptDetail] = useGraphQLLazyQuery(qd, {
    variables: {
      id,
    },
  })

  const [updatePrompt, { loading: updating }] = useGraphQLMutation(um, {
    onCompleted() {
      toast.success('Prompt updated')
      navigate('/prompts')
    }
  })
  const [createPrompt, { loading: creating }] = useGraphQLMutation(cm, {
    onCompleted() {
      toast.success('Prompt created')
      navigate('/prompts')
    }
  })

  const [sp] = useSearchParams()
  const pid = ~~(sp.get('pid') ?? '0')
  const navigate = useNavigate()

  const [testResult, setTestResult] = useState<testPromptResponse | null>(null)

  const {
    register,
    watch,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<mutatePromptType>({
    resolver: zodResolver(schema),
    async defaultValues() {
      const data = await fetchPromptDetail()
      const payload = data.data?.prompt
      if (!payload) {
        return {
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
      }
      return {
        projectId: pid,
        name: payload.name,
        description: payload.description,
        tokenCount: payload.tokenCount,
        publicLevel: payload.publicLevel,
        enabled: payload.enabled,
        debug: payload.debug ?? false,
        prompts: payload.prompts ?? [],
        variables: payload.variables ?? [],
      }
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

  const selectedProjectId = watch('projectId')

  useEffect(() => {
    if (selectedProjectId) {
      return
    }
    if (projects.length === 0) {
      return
    }
    setValue('projectId', projects[0].id)
  }, [selectedProjectId, projects, setValue])

  useEffect(() => {
    // only prompt change
    const subscribe = watch((data, { name, type }) => {
      if (!data.prompts) {
        return
      }
      if (!name || type !== 'change') {
        return
      }

      if (!/prompts\.(\d+)\.prompt/.test(name)) {
        return
      }

      const allPlaceholders = data.prompts.reduce<string[]>((acc, prompt) => {
        if (!prompt?.prompt) {
          return acc
        }
        acc.push(...findPlaceholderValues(prompt.prompt))
        return acc
      }, [])

      const prevVariables = getValues('variables') ?? []
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
      setValue('variables', nextVariables)
    })
    return () => subscribe.unsubscribe()
  }, [watch])

  const qc = useQueryClient()

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'prompts',
  })

  const { fields: variables } = useFieldArray({
    control,
    name: 'variables',
  })

  const onTestPassed = (testRes: testPromptResponse) => {
    setValue('tokenCount', testRes.usage.total_tokens)
    setTestResult(testRes)
  }

  const [promptsAnimateParent] = useAutoAnimate()
  const [variablesAnimateParent] = useAutoAnimate()

  const testable = Object.values(errors).length === 0

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='container mx-auto'
    >
      <Stack spacing={4}>
        <Stack flexDirection='row'>
          <FormControl isInvalid={!!errors.projectId}>
            <FormLabel htmlFor='projectId'>Project</FormLabel>
            <Select
              placeholder='Project'
              {...register('projectId')}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </Select>
            <FormErrorMessage>{errors.projectId?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel htmlFor='name'>Name</FormLabel>
            <Input
              id='name'
              type='text'
              placeholder='Name'
              {...register('name')}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>
        </Stack>

        <FormControl isInvalid={!!errors.description}>
          <FormLabel htmlFor='description'>Description</FormLabel>
          <Textarea
            id='description'
            {...register('description')}
          />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>

        <Divider />

        <Stack ref={promptsAnimateParent}>
          <h3>Prompts</h3>
          {fields.map((field, index) => {
            return (
              <div
                key={field.id}
                className='flex flex-row'
              >
                <FormControl
                  isInvalid={errors.prompts && !!errors.prompts[index]?.role}
                  width='200px'
                  mr={4}
                >
                  <Select
                    id='prompts'
                    width='200px'
                    disabled={index === 0}
                    {...register(`prompts.${index}.role`)}
                  >
                    <option value='system'>System</option>
                    <option value='assistant'>Assistant</option>
                    <option value='user'>User</option>
                  </Select>
                  <FormErrorMessage>{
                    errors.prompts &&
                    errors.prompts[index]?.role?.message
                  }</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={errors.prompts && !!errors.prompts[index]?.prompt}
                >
                  <Textarea
                    id='prompts'
                    placeholder='Prompt'
                    height='300px'
                    resize='vertical'
                    {...register(`prompts.${index}.prompt`)}
                  />
                  <FormErrorMessage>
                    {errors.prompts && errors.prompts[index]?.prompt?.message}
                  </FormErrorMessage>
                </FormControl>
                <div className='flex items-center ml-2'>
                  <Button
                    leftIcon={<TrashIcon className='w-4 h-4' />}
                    isDisabled={index === 0}
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )
          })}
          <Button
            leftIcon={<AddIcon />}
            disabled={fields.length >= 20}
            onClick={() => append({ prompt: '', role: PromptRole.User })}
          >
            Add
          </Button>
        </Stack>

        <Divider />

        <Stack>
          <h3>Variables</h3>
          <div className='grid grid-cols-4 gap-4' ref={variablesAnimateParent}>
            {variables.map((variable, index) => {
              return (
                <div
                  key={variable.id}
                  className='flex flex-row w-full justify-center'
                >
                  <FormControl
                    isInvalid={errors.variables && !!errors.variables[index]?.name}
                    width='200px'
                  >
                    <Input
                      disabled
                      {...register(`variables.${index}.name`)}
                    />
                    <FormErrorMessage>
                      {errors.variables && errors.variables[index]?.name?.message}
                    </FormErrorMessage>

                    <FormControl
                      isInvalid={errors.variables && !!errors.variables[index]?.type}
                      mt={2}
                    >
                      <Select
                        id='variables'
                        width='200px'
                        {...register(`variables.${index}.type`)}
                      >
                        <option value='string'>String</option>
                        <option value='number'>Number</option>
                        <option value='boolean'>Boolean</option>
                      </Select>
                      <FormErrorMessage>
                        {errors.variables && errors.variables[index]?.type?.message}
                      </FormErrorMessage>
                    </FormControl>

                  </FormControl>
                </div>
              )
            })}
          </div>
        </Stack>

        <Divider />

        <PromptTestPreview data={testResult} />

        <Stack flexDirection='row' justifyContent='flex-end'>
          <PromptTestButton
            testable={testable}
            data={getValues()}
            onTested={onTestPassed}
          />
          <Tooltip
            label='Please test it first to make sure it works'
            isDisabled={!!testResult}
          >
            <Button
              colorScheme='teal'
              isDisabled={!testResult}
              type='submit'
              isLoading={isLoading}
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