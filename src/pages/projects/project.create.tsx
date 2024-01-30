// import { useForm, SubmitHandler } from 'react-hook-form'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { Button, Stack, Select, Tooltip, TextInput } from '@mantine/core'
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

  const form = useForm<ProjectPayload & { openAIToken: string }>({
    validate: zodResolver(schema),
    initialValues: {
      openAIModel: 'gpt-3.5-turbo',
      openAIBaseURL: 'https://api.openai.com/v1',
      openAIToken: '',
    }
  })

  const qc = useQueryClient()

  return (
    <form
      onSubmit={form.onSubmit((data) => mutateAsync({
        variables: {
          data
        }
      }))}
      className="px-4 py-6 container mx-auto"
    >
      <h3 className="font-bold text-lg">New Project</h3>
      <div>
        <TextInput label="Name" className='mt-4' {...form.getInputProps('name')} />

        <Select
          label={(
            <div className='flex items-center'>
              <span>
                Model
              </span>
              <Tooltip label="The model to use. See https://platform.openai.com">
                <InformationCircleIcon className="w-4 h-4 ml-1" />
              </Tooltip>
            </div>
          )}
          {...form.getInputProps('openAIModel')}
        />


        <TextInput
          label={(
            <div className='flex items-center'>
              <span>
                Base URL
              </span>
              <Tooltip label="The base URL of the OpenAI API. you can set this for proxy(大陆项目可以用此字段设置转发服务器代理)">
                <InformationCircleIcon className="w-4 h-4 ml-1" />
              </Tooltip>
            </div>
          )}
          className='mt-4'
          {...form.getInputProps('openAIBaseURL')}
        />

        <TextInput label='OpenAI Token' className='mt-4' {...form.getInputProps('openAIToken')} />
      </div>
      <Stack className='flex flex-row justify-end' mt={4}>
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
          loading={isLoading}
          color='teal'
          // loadingText='Submitting'
          type='submit'
        >
          Create
        </Button>
      </Stack>
    </form>
  )
}

export default ProjectCreatePage