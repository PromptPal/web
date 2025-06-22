import ProjectHeader from '@/components/Project/EditForm/ProjectHeader'
import ProvidersSelector from '@/components/Providers/Selector'
import { cn } from '@/utils'
import InputField from '@annatarhe/lake-ui/form-input-field'
import {
  useMutation as useGraphQLMutation,
  useLazyQuery,
} from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { isEmpty, omitBy } from 'lodash'
import { ArrowLeft, Save, Settings, X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import z from 'zod/v4'
import { OpenAIModels } from '../../constants'
import { graphql } from '../../gql'
import { ProjectPayload } from '../../gql/graphql'
import { useProjectId } from '../../hooks/route'

type localUpdateProject = ProjectPayload

const schema = z.object({
  name: z.string().trim(),
  enabled: z.boolean(),
  openAIModel: z.enum(OpenAIModels),
  openAIBaseURL: z.string()
    .trim()
    .max(255)
    .optional()
    .default('https://api.openai.com'),
  openAIToken: z.string().trim().max(255).optional(),
  geminiBaseURL: z.string()
    .trim()
    .max(255)
    .optional()
    .default('https://generativelanguage.googleapis.com'),
  geminiToken: z.string().trim().max(255).optional(),
  openAITemperature: z.number().min(0).max(2).optional(),
  openAITopP: z.number().min(0).max(1),
  openAIMaxTokens: z.number().min(0).optional(),
  providerId: z.number(),
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

  const { control, watch, handleSubmit, formState }
    = useForm<localUpdateProject>({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolver: zodResolver(schema) as any,
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/5 to-slate-900 p-4'>
      <div className='max-w-4xl mx-auto space-y-6'>
        {/* Enhanced Header */}
        <div className='bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/20'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-4'>
              <Link
                to='/$pid/view'
                params={{ pid: projectId.toString() }}
                className='inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] hover:border-white/15 transition-all duration-200'
              >
                <ArrowLeft className='w-4 h-4' />
                Back
              </Link>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center border border-blue-500/30'>
                  <Settings className='w-5 h-5 text-blue-400' />
                </div>
                <div>
                  <h1 className='text-2xl font-bold text-white'>Edit Project</h1>
                  <p className='text-sm text-gray-400'>Configure your AI project settings</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Main Form Card */}
          <div className='bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/20'>
            {/* Project Header */}
            <div className='mb-8'>
              <Controller
                control={control}
                name='enabled'
                render={({ field }) => (
                  <ProjectHeader
                    projectName={projectName}
                    enabled={field.value ?? false}
                    onEnabledChange={value => field.onChange(value)}
                  />
                )}
              />
            </div>

            {/* Form Sections */}
            <div className='space-y-8'>
              {/* Project Details Section */}
              <div className='space-y-6'>
                <div className='flex items-center gap-2 pb-3 border-b border-white/10'>
                  <h3 className='text-lg font-semibold text-white'>Project Details</h3>
                </div>

                {/* Project Name */}
                <div className='space-y-3'>
                  <Controller
                    control={control}
                    name='name'
                    disabled
                    render={({ field, fieldState }) => (
                      <InputField
                        label={(
                          <label className='text-sm font-medium text-gray-300 flex items-center gap-2'>
                            Project Name
                            <span className='text-xs text-gray-500 bg-gray-500/10 px-2 py-1 rounded-md'>Required</span>
                          </label>
                        )}
                        {...field}
                        value={field.value || ''}
                        placeholder='Enter project name'
                        error={fieldState.error?.message}
                      />

                    )}
                  />
                </div>
              </div>

              {/* Provider Configuration Section */}
              <div className='space-y-6'>
                <div className='flex items-center justify-between pb-3 border-b border-white/10'>
                  <h3 className='text-lg font-semibold text-white'>AI Provider</h3>
                  <Link
                    to='/providers'
                    className='inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15 hover:border-blue-500/30 transition-all duration-200'
                  >
                    Manage Providers
                  </Link>
                </div>

                <Controller
                  control={control}
                  name='providerId'
                  render={({ field }) => (
                    <ProvidersSelector
                      name='providerId'
                      label={null}
                      value={field.value}
                      onChange={providerId => field.onChange(providerId)}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/20'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-400'>
                Changes will be saved immediately after submission
              </div>
              <div className='flex items-center gap-3'>
                <button
                  type='button'
                  onClick={() => navigate({ to: `/${projectId}/view` })}
                  className='inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] hover:border-white/15 transition-all duration-200'
                >
                  <X className='w-4 h-4' />
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={!formState.isValid || isLoading}
                  className={cn(
                    'inline-flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    formState.isValid && !isLoading
                      ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25'
                      : 'text-gray-400 bg-gray-600/50 cursor-not-allowed',
                  )}
                >
                  {isLoading
                    ? (
                        <>
                          <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                          Saving...
                        </>
                      )
                    : (
                        <>
                          <Save className='w-4 h-4' />
                          Save Changes
                        </>
                      )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectEditPage
