import {
  useApolloClient,
  useMutation as useGraphQLMutation,
} from '@apollo/client'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Button, Select, TextInput, Tooltip } from '@mantine/core'
// import { useForm, SubmitHandler } from 'react-hook-form'
import { useForm } from '@mantine/form'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { zodResolver } from 'mantine-form-zod-resolver'
import { toast } from 'react-hot-toast'
import zod from 'zod'
import { OpenAIModels } from '../../constants'
import { graphql } from '../../gql'
import { ProjectPayload } from '../../gql/graphql'

const schema = zod.object({
  name: zod.string().trim().max(100).min(2),
  openAIModel: zod.enum(OpenAIModels).default('gpt-3.5-turbo'),
  openAIBaseURL: zod
    .string()
    .trim()
    .url()
    .max(255)
    .default('https://api.openai.com/v1'),
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
      geminiBaseURL
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
      nav({ to: `/${data.createProject.id}/view` })
      qc.invalidateQueries({
        queryKey: ['projects'],
      })
      c.resetStore()
      toast.success('Project created')
    },
  })

  const form = useForm<ProjectPayload>({
    validate: zodResolver(schema),
    initialValues: {
      openAIModel: 'gpt-3.5-turbo',
      openAIBaseURL: 'https://api.openai.com/v1',
      openAIToken: '',
      geminiBaseURL: 'https://generativelanguage.googleapis.com',
      geminiToken: '',
    },
  })

  const qc = useQueryClient()
  const [settingAreaRef] = useAutoAnimate()

  return (
    <form
      onSubmit={form.onSubmit((data) =>
        mutateAsync({
          variables: {
            data,
          },
        }),
      )}
      className='px-4 py-6 container mx-auto flex flex-col gap-4'
    >
      <h3 className='font-bold text-lg'>New Project</h3>
      <div>
        <TextInput
          label='Name'
          className='mt-4'
          {...form.getInputProps('name')}
        />

        <Select
          label='GPT Model'
          description={
            <div>
              Find more models
              <a
                href='https://platform.openai.com/docs/models/overview'
                className='inline-flex ml-1'
                target='_blank'
                rel='noreferrer'
              >
                Here
                <ExternalLinkIcon className='ml-1' />
              </a>
            </div>
          }
          data={OpenAIModels}
          {...form.getInputProps('openAIModel')}
        />

        <div ref={settingAreaRef}>
          {form.values.openAIModel?.startsWith('gpt') && (
            <>
              <TextInput
                label={
                  <div className='flex items-center'>
                    <span>Base URL</span>
                    <Tooltip label='The base URL of the OpenAI API. you can set this for proxy(大陆项目可以用此字段设置转发服务器代理)'>
                      <InformationCircleIcon className='w-4 h-4 ml-1' />
                    </Tooltip>
                  </div>
                }
                className='mt-4'
                {...form.getInputProps('openAIBaseURL')}
              />

              <TextInput
                label='OpenAI Token'
                className='mt-4'
                {...form.getInputProps('openAIToken')}
              />
            </>
          )}

          {form.values.openAIModel?.startsWith('gemini') && (
            <>
              <TextInput
                label={
                  <div className='flex items-center'>
                    <span>Base URL</span>
                    <Tooltip label='The base URL of the Google gemini API. you can set this for proxy(大陆项目可以用此字段设置转发服务器代理)'>
                      <InformationCircleIcon className='w-4 h-4 ml-1' />
                    </Tooltip>
                  </div>
                }
                className='mt-4'
                {...form.getInputProps('geminiBaseURL')}
              />
              <TextInput
                label='Gemini Token'
                className='mt-4'
                {...form.getInputProps('geminiToken')}
              />
            </>
          )}
        </div>
      </div>
      <div className='flex flex-row justify-end mt-4 gap-4'>
        <Button
          variant={'outline'}
          onClick={() => {
            nav({ to: '/projects' })
          }}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button loading={isLoading} color='teal' type='submit'>
          Create
        </Button>
      </div>
    </form>
  )
}

export default ProjectCreatePage
