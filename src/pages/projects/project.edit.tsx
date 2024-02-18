import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useForm } from '@mantine/form'
import toast from 'react-hot-toast'
import Zod from 'zod'
import {
  Fieldset,
  Tooltip,
  Input,
  TextInput, NumberInput, Slider, Button, Stack, Switch, Box, Divider, Title, Alert, Select
} from '@mantine/core'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { isEmpty, omitBy } from 'lodash'
import { useMutation as useGraphQLMutation, useQuery } from '@apollo/client'
import { graphql } from '../../gql'
import { ProjectPayload } from '../../gql/graphql'
import { OpenAIModels } from '../../constants'

type localUpdateProject = ProjectPayload

const schema: Zod.ZodType<localUpdateProject> = Zod.object({
  name: Zod.string().trim(),
  enabled: Zod.boolean(),
  openAIToken: Zod.string().trim().max(255).optional(),
  openAIModel: Zod.enum(OpenAIModels),
  openAIBaseURL: Zod.string().trim().max(255).optional(),
  openAITemperature: Zod.number().min(0).max(2).optional(),
  openAITopP: Zod.number().min(0).max(1),
  openAIMaxTokens: Zod.number().min(0).optional(),
})

const q = graphql(`
  query fetchProjectLite($id: Int!) {
    project(id: $id) {
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

const m = graphql(`
  mutation updateProject($id: Int!, $data: ProjectPayload!) {
    updateProject(id: $id, data: $data) {
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

function ProjectEditPage() {
  const nav = useNavigate()
  const pidStr = useParams().id ?? '0'
  const pid = ~~pidStr

  const f = useForm<localUpdateProject>({
    validate: zodResolver(schema),
  })

  useQuery(q, {
    variables: {
      id: pid
    },
    onCompleted(data) {
      const payload = data.project
      if (!payload) {
        return
      }
      f.setValues({
        name: payload.name,
        enabled: payload.enabled,
        openAIToken: undefined,
        openAIModel: payload.openAIModel,
        openAIBaseURL: payload.openAIBaseURL,
        openAITemperature: payload.openAITemperature,
        openAITopP: payload.openAITopP,
        openAIMaxTokens: payload.openAIMaxTokens,
      })
    },
  })
  const qc = useQueryClient()
  const [mutateAsync, { loading: isLoading }] = useGraphQLMutation(m, {
    onCompleted(data) {
      const res = data.updateProject
      qc.invalidateQueries({
        queryKey: ['projects']
      })
      qc.invalidateQueries({
        queryKey: ['project', res.id]
      })
      nav(`/projects/${res.id}`)
      toast.success('Project updated')
    },
  })

  const onSubmit = (data: ProjectPayload) => {
    const args: ProjectPayload = omitBy(data, isEmpty)
    args.openAIMaxTokens = data.openAIMaxTokens
    return mutateAsync({
      variables: {
        id: pid,
        data: args
      }
    })
  }

  const pjName = f.values.name

  return (
    <form
      onSubmit={f.onSubmit(onSubmit)}
    >
      <Box>
        <div className='w-full flex justify-between items-center'>
          <Title>Editing {pjName}</Title>
          <Tooltip label='Enable/Disable Project' withArrow refProp='rootRef'>
            <Switch
              onLabel="Enabled"
              offLabel="Disabled"
              size='lg'
              {...f.getInputProps('enabled')}
            />
          </Tooltip>
        </div>
        <Divider my={6} />
      </Box>
      <div className='container flex flex-col gap-4'>
        <Stack className='w-full flex-row items-center' >
          <TextInput
            disabled
            label='Project Name'
            className='w-full'
            placeholder='Project Name'
            {...f.getInputProps('name')}
          />
        </Stack>

        <TextInput
          label={'OpenAI Token'}
          description={
            <div>
              Create your own API key
              <a
                href="https://platform.openai.com/account/api-keys"
                target='_blank'
                className='inline-flex ml-1' rel="noreferrer"
              >
                Here
                <ExternalLinkIcon className='ml-1' />
              </a>
            </div>

          }
          placeholder='OpenAI Token'
          {...f.getInputProps('openAIToken')}
        />

        <Select
          label={'GPT Model'}
          description={
            <div>
              Find more models
              <a
                href="https://platform.openai.com/docs/models/overview"
                className='inline-flex ml-1'
                target='_blank'
                rel="noreferrer"
              >
                Here
                <ExternalLinkIcon className='ml-1' />
              </a>
            </div>
          }
          data={OpenAIModels}
          {...f.getInputProps('openAIModel')}
        >
        </Select>

        <TextInput
          label='OpenAI Base URL'
          labelProps={{
            className: 'pb-4'
          }}
          placeholder='OpenAI Base URL'
          {...f.getInputProps('openAIBaseURL')}
        />

        <Fieldset legend='OpenAI Settings'>
          <Input.Wrapper label='OpenAI Temperature' className='w-full' {...f.getInputProps('openAITemperature')}>
            <Slider
              {...f.getInputProps('openAITemperature')}
              min={0}
              max={2}
              step={0.1}
            ></Slider>
          </Input.Wrapper>

          <Input.Wrapper label='OpenAI TopP' className='w-full' {...f.getInputProps('openAITopP')}>
            <Slider
              {...f.getInputProps('openAITopP')}
              min={0}
              max={1}
              step={0.1}
            ></Slider>
          </Input.Wrapper>

          <NumberInput label='OpenAI Max Tokens' {...f.getInputProps('openAIMaxTokens')} />
        </Fieldset>

      </div>
      <div className='flex w-full items-center justify-end gap-4 mt-8'>
        <Button
          variant='outline'
          onClick={() => {
            nav(`/projects/${pid}`)
          }}
        >
          Cancel
        </Button>
        <Button
          variant='gradient'
          gradient={{ from: 'indigo', to: 'cyan' }}
          // variant='filled'
          // color='blue'
          disabled={!f.isValid()}
          loading={isLoading}
          type='submit'
        >
          Update
        </Button>
      </div>
    </form>
  )
}

export default ProjectEditPage