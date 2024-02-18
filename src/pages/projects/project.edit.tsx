import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useForm } from '@mantine/form'
import toast from 'react-hot-toast'
import Zod from 'zod'
import { TextInput, NumberInput, Slider, Button, Stack, Switch, Box, Divider, Title, Alert, Select } from '@mantine/core'
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
      f.setInitialValues({
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
        <Title>Editing {pjName}</Title>
        <Divider my={6} />
      </Box>
      <div className='px-6'>
        <Stack className='w-full flex-row' >
          <TextInput label='Project Name' placeholder='Project Name' {...f.getInputProps('name')} />
          <Switch {...f.getInputProps('enabled')} />

        </Stack>

        <TextInput
          label='OpenAI Token'
          placeholder='OpenAI Token'
          {...f.getInputProps('openAIToken')}
        />

        <Alert>
          Create your own API key
          <Button
            component='a'
            href="https://platform.openai.com/account/api-keys"
            className='ml-1'
          // isExternal
          >
            here <ExternalLinkIcon mx='2px' />
          </Button>
        </Alert>


        <Select
          label='OpenAI Model'
          data={OpenAIModels}
          {...f.getInputProps('openAIModel')}
        >
        </Select>
        <Alert>
          Find more models
          <Button
            component='a'
            href="https://platform.openai.com/docs/models/overview"
            className='ml-1'
          // isExternal
          >
            here <ExternalLinkIcon mx='2px' />
          </Button>
        </Alert>


        <TextInput
          label='OpenAI Base URL'
          placeholder='OpenAI Base URL'
          {...f.getInputProps('openAIBaseURL')}
        />

        <Slider
          {...f.getInputProps('openAITemperature')}
          min={0}
          max={2}
          step={0.1}
          label='OpenAI Temperature'
        // onMouseEnter={() => setShowTooltip(true)}
        // onMouseLeave={() => setShowTooltip(false)}
        ></Slider>


        <Slider
          {...f.getInputProps('openAITopP')}
          min={0}
          max={1}
          step={0.1}
          label='OpenAI TopP'
        // onMouseEnter={() => setShowTooltip(true)}
        // onMouseLeave={() => setShowTooltip(false)}
        ></Slider>

        <NumberInput label='OpenAI Max Tokens' {...f.getInputProps('openAIMaxTokens')} />

      </div>
      <Box mr={6}>
        <Stack mt={4}>
          <Button
            onClick={() => {
              nav(`/projects/${pid}`)
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={!f.isValid}
            loading={isLoading}
            type='submit'
          >
            Update
          </Button>
        </Stack>
      </Box>
    </form>
  )
}

export default ProjectEditPage