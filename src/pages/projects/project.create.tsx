import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormControl, FormLabel, Input, FormErrorMessage, Button, Stack, Select, Tooltip } from '@chakra-ui/react'
import zod from 'zod'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useApolloClient, useMutation as useGraphQLMutation } from '@apollo/client'
import { toast } from 'react-hot-toast'
import { graphql } from '../../gql'
import { ProjectPayload } from '../../gql/graphql'
import { OpenAIModels } from '../../constants'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

const schema = zod.object({
  name: zod.string().trim().max(100).min(2),
  openAIModel: zod.enum(OpenAIModels).default('gpt-3.5-turbo'),
  openAIBaseURL: zod.string().trim().url().max(255).default('https://api.openai.com/v1'),
  openAIToken: zod.string().trim().min(3).max(255),
})

const m = graphql(`
  mutation createProject($data: ProjectPayload!) {
    createProject(data: $data) {
      id
      name
      enabled
      openAIModel
      openAIBaseURL
      openAITemperature
      openAITopP
      openAIMaxTokens
    }
  }
`)

function ProjectCreatePage() {
  const nav = useNavigate()

  const c = useApolloClient()

  const [mutateAsync, { loading: isLoading }] = useGraphQLMutation(m, {
    refetchQueries: ['projects'],
    onCompleted(data) {
      nav(`/projects/${data.createProject.id}`)
      qc.invalidateQueries({
        queryKey: ['projects']
      })
      c.resetStore()
      toast.success('Project created')
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectPayload & { openAIToken: string }>({
    resolver: zodResolver(schema),
    defaultValues: {
      openAIModel: 'gpt-3.5-turbo',
      openAIBaseURL: 'https://api.openai.com/v1',
    }
  })

  const qc = useQueryClient()

  const onSubmit: SubmitHandler<ProjectPayload> = (data) => {
    return mutateAsync({
      variables: {
        data,
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-4 py-6 container mx-auto"
    >
      <h3 className="font-bold text-lg">New Project</h3>
      <div>
        <FormControl isInvalid={!!errors.name} className='mt-4'>
          <FormLabel htmlFor='name'>
            Project Name
          </FormLabel>
          <Input {...register('name')} />
          <FormErrorMessage>
            {errors.name?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.openAIModel} className='mt-4'>
          <FormLabel htmlFor='openAIModel'>
            <div className='flex items-center'>
              <span>
                Model
              </span>
              <Tooltip label="The model to use. See https://platform.openai.com">
                <InformationCircleIcon className="w-4 h-4 ml-1" />
              </Tooltip>
            </div>
          </FormLabel>
          <Select {...register('openAIModel')}>
            {OpenAIModels.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
          <FormErrorMessage>
            {errors.openAIModel?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.openAIBaseURL} className='mt-4'>
          <FormLabel htmlFor='openAIBaseURL'>
            <div className='flex items-center'>
              <span>
                Base URL
              </span>
              <Tooltip label="The base URL of the OpenAI API. you can set this for proxy(大陆项目可以用此字段设置转发服务器代理)">
                <InformationCircleIcon className="w-4 h-4 ml-1" />
              </Tooltip>
            </div>
          </FormLabel>
          <Input {...register('openAIBaseURL')} />
          <FormErrorMessage>
            {errors.openAIBaseURL?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.openAIToken} className='mt-4'>
          <FormLabel htmlFor='openAIToken'>
            OpenAI Token
          </FormLabel>
          <Input {...register('openAIToken')} />
          <FormErrorMessage>
            {errors.openAIToken && errors.openAIToken.message}
          </FormErrorMessage>
        </FormControl>
      </div>
      <Stack flexDirection={'row'} justifyContent={'flex-end'} mt={4}>
        <Button
          variant={'outline'}
          onClick={() => {
            nav('/projects')
          }}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          isLoading={isLoading}
          colorScheme='teal'
          loadingText='Submitting'
          type='submit'
        >
          Create
        </Button>
      </Stack>
    </form>
  )
}

export default ProjectCreatePage