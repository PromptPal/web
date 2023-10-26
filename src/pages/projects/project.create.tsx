import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormControl, FormLabel, Input, FormErrorMessage, Button, Stack } from '@chakra-ui/react'
import zod from 'zod'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useApolloClient, useMutation as useGraphQLMutation } from '@apollo/client'
import { toast } from 'react-hot-toast'
import { graphql } from '../../gql'
import { ProjectPayload } from '../../gql/graphql'

const schema = zod.object({
  name: zod.string().trim().max(100).min(2),
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
      className="px-4 py-6"
    >
      <h3 className="font-bold text-lg">New Project</h3>
      <div>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel htmlFor='name'>
            Project Name
          </FormLabel>
          <Input {...register('name')} />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.openAIToken}>
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