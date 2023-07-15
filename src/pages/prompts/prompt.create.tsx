import Zod from 'zod'
import { AddIcon } from '@chakra-ui/icons'
import { createPrompt, createPromptPayload, testPromptResponse } from '../../service/prompt'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Stack, FormControl, FormLabel, Input, FormErrorMessage, Divider, Textarea, Select, Button, Tooltip } from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import PromptTestButton from '../../components/PromptTestButton/PromptTestButton'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getProjectList } from '../../service/project'
import PromptTestPreview from '../../components/PromptTestPreview'

function findPlaceholderValues(sentence: string): string[] {
  const regex = /{{\s*([a-zA-Z][a-zA-Z0-9]*)\s*}}/g
  const matches = sentence.match(regex)

  if (!matches) {
    return []
  }
  const values = matches.map(match => match.replace(/{{\s*|\s*}}/g, '').trim())
  return values
}

const schema: Zod.ZodType<createPromptPayload> = Zod.object({
  projectId: Zod.number(),
  name: Zod.string(),
  description: Zod.string(),
  tokenCount: Zod.number(),
  enabled: Zod.boolean(),
  debug: Zod.boolean(),
  prompts: Zod.array(Zod.object({
    prompt: Zod.string(),
    role: Zod.enum(['user', 'system', 'assistant']),
  })),
  variables: Zod.array(Zod.object({
    name: Zod.string(),
    type: Zod.string(),
  })),
  publicLevel: Zod.enum(['public', 'private', 'protected']),
})

function PromptCreatePage() {
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
  } = useForm<createPromptPayload>({
    resolver: zodResolver(schema),
    defaultValues: {
      projectId: pid,
      publicLevel: 'protected',
      enabled: true,
      debug: false,
      prompts: [{
        prompt: '',
        role: 'system',
      }],
      variables: [],
    }
  })


  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: ({ signal }) => getProjectList(1 << 30, signal),
  })

  const selectedProjectId = watch('projectId')

  useEffect(() => {
    if (selectedProjectId) {
      return
    }
    if (!projects?.data || projects.data.length === 0) {
      return
    }
    setValue('projectId', projects.data[0].id)
  }, [selectedProjectId, projects?.data, setValue])

  // const { data: project } = useQuery({
  //   queryKey: ['projects', pid],
  //   enabled: !!pid,
  //   queryFn({ signal }) {
  //     return getProjectDetail(pid, signal)
  //   },
  // })

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

      const prevVariables = getValues('variables')
      const flattedPrevVariables = prevVariables.map(x => x.name)

      const nextVariables = allPlaceholders.map((placeholder) => {
        if (flattedPrevVariables.includes(placeholder)) {
          return prevVariables.find(z => z.name === placeholder)!
        }
        return {
          name: placeholder,
          type: 'string',
        }
      })

      setValue('variables', nextVariables)
    })
    return () => subscribe.unsubscribe()
  }, [watch])

  const { isLoading, mutateAsync } = useMutation({
    mutationFn(payload: createPromptPayload) {
      payload.projectId = ~~payload.projectId
      return createPrompt(payload)
    },
    onSuccess() {
      toast.success('Prompt created')
      // redirect to prompts list page
      navigate('/prompts')
    }
  })

  const onSubmit = (data: createPromptPayload) => {
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
              {projects?.data?.map((project) => (
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

        <Stack>
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
            onClick={() => append({ prompt: '', role: 'user' })}
          >
            Add
          </Button>
        </Stack>

        <Divider />

        <Stack>
          <h3>Variables</h3>
          <div className='grid grid-cols-4 gap-4'>
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