import AdvancedSettings from '@/components/Project/EditForm/AdvancedSettings'
import FormActions from '@/components/Project/EditForm/FormActions'
import ModelSettings from '@/components/Project/EditForm/ModelSettings'
import ProjectHeader from '@/components/Project/EditForm/ProjectHeader'
import ProvidersSelector from '@/components/Providers/Selector'
import { cn } from '@/utils'
import {
  useMutation as useGraphQLMutation,
  useLazyQuery,
  useQuery,
} from '@apollo/client'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { isEmpty, omitBy } from 'lodash'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Zod from 'zod'
import { OpenAIModels } from '../../constants'
import { graphql } from '../../gql'
import { ProjectPayload } from '../../gql/graphql'
import { useProjectId } from '../../hooks/route'

type localUpdateProject = ProjectPayload

const schema: Zod.ZodType<localUpdateProject> = Zod.object({
  name: Zod.string().trim(),
  enabled: Zod.boolean(),
  openAIModel: Zod.enum(OpenAIModels),
  openAIBaseURL: Zod.string()
    .trim()
    .max(255)
    .optional()
    .default('https://api.openai.com'),
  openAIToken: Zod.string().trim().max(255).optional(),
  geminiBaseURL: Zod.string()
    .trim()
    .max(255)
    .optional()
    .default('https://generativelanguage.googleapis.com'),
  geminiToken: Zod.string().trim().max(255).optional(),
  openAITemperature: Zod.number().min(0).max(2).optional(),
  openAITopP: Zod.number().min(0).max(1),
  openAIMaxTokens: Zod.number().min(0).optional(),
  providerId: Zod.number(),
})

const projectQuery = graphql(`
  query fetchProjectLite($id: Int!) {
    project(id: $id) {
      id
      name
      enabled
      openAIModel
      openAIBaseURL
      geminiBaseURL
      geminiToken
      openAITemperature
      openAITopP
      openAIMaxTokens

      provider {
        id
        name
      }
    }
  }
`)

const updateProjectMutation = graphql(`
  mutation updateProject($id: Int!, $data: ProjectPayload!) {
    updateProject(id: $id, data: $data) {
      id
      name
      enabled
      openAIModel
      openAIBaseURL
      geminiBaseURL
      geminiToken
      openAITemperature
      openAITopP
      openAIMaxTokens
    }
  }
`)

function ProjectEditPage() {
  const navigate = useNavigate()
  const projectId = useProjectId()
  const queryClient = useQueryClient()

  const [fetchProject] = useLazyQuery(projectQuery, {
    variables: {
      id: projectId!,
    },
  })

  const { control, watch, handleSubmit, formState } =
    useForm<localUpdateProject>({
      resolver: zodResolver(schema),
      defaultValues: async () => {
        const result = await fetchProject()

        const project = result.data?.project

        if (!project)
          return {
            name: '',
            enabled: false,
            openAIModel: OpenAIModels[0],
            openAIBaseURL: 'https://api.openai.com',
            openAIToken: undefined,
            geminiBaseURL: 'https://generativelanguage.googleapis.com',
            geminiToken: undefined,
            openAITemperature: 0,
            openAITopP: 0.1,
            openAIMaxTokens: 1000,
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            providerId: undefined as any,
          }

        return {
          name: project.name,
          enabled: project.enabled,
          openAIModel: project.openAIModel,
          openAIBaseURL: project.openAIBaseURL,
          openAIToken: undefined,
          geminiBaseURL: project.geminiBaseURL,
          geminiToken: undefined,
          openAITemperature: project.openAITemperature,
          openAITopP: project.openAITopP,
          openAIMaxTokens: project.openAIMaxTokens,
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          providerId: project.provider?.id ?? (undefined as any),
        }
      },
    })

  const [updateProject, { loading: isLoading }] = useGraphQLMutation(
    updateProjectMutation,
    {
      onCompleted(data) {
        const result = data.updateProject

        // Invalidate queries to refresh data
        queryClient.invalidateQueries({
          queryKey: ['projects'],
        })
        queryClient.invalidateQueries({
          queryKey: ['project', result.id],
        })

        // Navigate to project view page
        navigate({ to: `/${result.id}/view` })
        toast.success('Project updated successfully')
      },
      onError(error) {
        console.error('Failed to update project:', error)
        toast.error('Failed to update project')
      },
    },
  )

  const onSubmit = (data: ProjectPayload) => {
    // Remove empty values except for maxTokens which can be 0
    const payload = omitBy(data, isEmpty) as ProjectPayload
    payload.openAIMaxTokens = data.openAIMaxTokens
    payload.providerId = data.providerId ?? undefined

    return updateProject({
      variables: {
        id: projectId!,
        data: payload,
      },
    })
  }

  const projectName = watch('name')

  return (
    <div className='container max-w-4xl mx-auto px-4 py-10'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-10'>
        <div className='rounded-2xl bg-gradient-to-br from-background/20 via-background/30 to-background/20 p-8 backdrop-blur-xl shadow-xl'>
          {/* Project Header */}
          <Controller
            control={control}
            name='enabled'
            render={({ field }) => (
              <ProjectHeader
                projectName={projectName}
                enabled={field.value ?? false}
                onEnabledChange={(value) => field.onChange(value)}
              />
            )}
          />

          {/* Project Name */}
          <div className='space-y-3 mb-8'>
            <label className='text-sm font-medium leading-none bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'>
              Project Name
            </label>
            <Controller
              control={control}
              name='name'
              render={({ field }) => {
                return (
                  <input
                    type='text'
                    disabled
                    className={cn(
                      'flex h-12 w-full rounded-xl bg-background/30 px-4 py-2',
                      'text-sm ring-offset-background focus-visible:outline-hidden',
                      'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
                      'disabled:cursor-not-allowed disabled:opacity-50',
                      'backdrop-blur-lg transition-all duration-300 ease-in-out',
                      'hover:bg-background/50 border-none shadow-md',
                      'bg-gradient-to-r from-background/40 to-background/20',
                    )}
                    placeholder='Project Name'
                    value={field.value || ''}
                    onChange={field.onChange}
                  />
                )
              }}
            />
          </div>

          <Controller
            control={control}
            name='providerId'
            render={({ field }) => {
              return (
                <ProvidersSelector
                  name='providerId'
                  label={
                    <div className='flex items-center gap-2 justify-between'>
                      <span className='text-sm font-medium leading-none bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'>
                        Model Provider
                      </span>

                      <Link to='/providers' className='text-sm '>
                        Go to providers
                      </Link>
                    </div>
                  }
                  value={field.value}
                  onChange={(providerId) => field.onChange(providerId)}
                />
              )
            }}
          />
        </div>

        {/* Form Actions */}
        <FormActions
          isLoading={isLoading}
          isValid={formState.isValid}
          onCancel={() => navigate({ to: `/${projectId}/view` })}
        />
      </form>
    </div>
  )
}

export default ProjectEditPage
