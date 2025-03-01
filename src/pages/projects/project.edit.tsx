import AdvancedSettings from '@/components/Project/EditForm/AdvancedSettings'
import FormActions from '@/components/Project/EditForm/FormActions'
import ModelSettings from '@/components/Project/EditForm/ModelSettings'
import ProjectHeader from '@/components/Project/EditForm/ProjectHeader'
import { cn } from '@/utils'
import { useMutation as useGraphQLMutation, useQuery } from '@apollo/client'
import { useForm } from '@mantine/form'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { isEmpty, omitBy } from 'lodash'
import { zodResolver } from 'mantine-form-zod-resolver'
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

  const form = useForm<localUpdateProject>({
    validate: zodResolver(schema),
  })

  useQuery(projectQuery, {
    variables: {
      id: projectId!,
    },
    skip: !projectId,
    onCompleted(data) {
      const project = data.project
      if (!project) return

      form.setValues({
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
      })
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
    const payload: ProjectPayload = omitBy(data, isEmpty)
    payload.openAIMaxTokens = data.openAIMaxTokens

    return updateProject({
      variables: {
        id: projectId!,
        data: payload,
      },
    })
  }

  const projectName = form.values.name

  return (
    <div className='container max-w-4xl mx-auto px-4 py-10'>
      <form onSubmit={form.onSubmit(onSubmit)} className='space-y-10'>
        <div className='rounded-2xl bg-gradient-to-br from-background/20 via-background/30 to-background/20 p-8 backdrop-blur-xl shadow-xl'>
          {/* Project Header */}
          <ProjectHeader
            projectName={projectName}
            enabled={form.values.enabled ?? false}
            onEnabledChange={(value) =>
              form.setValues({ ...form.values, enabled: value })
            }
          />

          {/* Project Name */}
          <div className='space-y-3 mb-8'>
            <label className='text-sm font-medium leading-none bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'>
              Project Name
            </label>
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
              value={form.values.name || ''}
              onChange={(e) => form.setFieldValue('name', e.target.value)}
            />
          </div>

          {/* Model Settings */}
          <div className='space-y-10'>
            <ModelSettings
              model={form.values.openAIModel}
              openAIBaseURL={form.values.openAIBaseURL}
              openAIToken={form.values.openAIToken}
              geminiBaseURL={form.values.geminiBaseURL}
              geminiToken={form.values.geminiToken}
              onModelChange={(value) =>
                form.setFieldValue('openAIModel', value)
              }
              onOpenAIBaseURLChange={(value) =>
                form.setFieldValue('openAIBaseURL', value)
              }
              onOpenAITokenChange={(value) =>
                form.setFieldValue('openAIToken', value)
              }
              onGeminiBaseURLChange={(value) =>
                form.setFieldValue('geminiBaseURL', value)
              }
              onGeminiTokenChange={(value) =>
                form.setFieldValue('geminiToken', value)
              }
              errors={form.errors}
            />

            {/* Advanced Settings */}
            <AdvancedSettings
              temperature={form.values.openAITemperature ?? 0}
              topP={form.values.openAITopP ?? 0}
              maxTokens={form.values.openAIMaxTokens}
              onTemperatureChange={(value) =>
                form.setFieldValue('openAITemperature', value)
              }
              onTopPChange={(value) => form.setFieldValue('openAITopP', value)}
              onMaxTokensChange={(value) =>
                form.setFieldValue('openAIMaxTokens', value)
              }
              errors={{
                openAITemperature:
                  form.getInputProps('openAITemperature').error,
                openAITopP: form.getInputProps('openAITopP').error,
                openAIMaxTokens: form.getInputProps('openAIMaxTokens').error,
              }}
            />
          </div>
        </div>

        {/* Form Actions */}
        <FormActions
          isLoading={isLoading}
          isValid={form.isValid()}
          onCancel={() => navigate({ to: `/${projectId}/view` })}
        />
      </form>
    </div>
  )
}

export default ProjectEditPage
