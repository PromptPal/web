import Button from '@/components/Button/Button'
import ProvidersSelector from '@/components/Providers/Selector'
import { graphql } from '@/gql'
import { ProjectPayload } from '@/gql/graphql'
import InputField from '@annatarhe/lake-ui/form-input-field'
import {
  useApolloClient,
  useMutation as useGraphQLMutation,
} from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Plus, X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import z from 'zod/v4'

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  providerId: z.number(),
})

type FormValues = z.infer<typeof schema>

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
    onError(error) {
      console.error('Failed to create project:', error)
      toast.error('Failed to create project')
    },
  })

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {},
  })

  const qc = useQueryClient()
  const onSubmit = async (data: FormValues) => {
    await mutateAsync({
      variables: {
        data: data as ProjectPayload,
      },
    })
  }

  return (
    <>
      <div className='container max-w-2xl mx-auto px-4 py-8'>
        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log('errors', errors)
          })}
          className='space-y-8'
        >
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <h1 className='text-2xl font-bold tracking-tight'>
                Create New Project
              </h1>
              <p className='text-sm text-muted-foreground'>
                Add a new project to manage your prompts and API settings
              </p>
            </div>
          </div>

          <div className='rounded-xl bg-linear-to-br from-background/30 via-background/50 to-background/30 py-6 backdrop-blur-xl space-y-6'>
            <div className='space-y-2'>
              <Controller
                control={control}
                name='name'
                render={({ field, fieldState }) => (
                  <InputField
                    label='Project Name'
                    className='w-full'
                    {...field}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            <Controller
              name='providerId'
              control={control}
              render={({ field, fieldState }) => (
                <ProvidersSelector
                  label={(
                    <div className='flex items-center gap-2 justify-between'>
                      <span className='text-sm'>Provider</span>
                      {fieldState.error && (
                        <span className='text-xs text-red-500'>
                          {fieldState.error.message}
                        </span>
                      )}
                    </div>
                  )}
                  {...field}
                />
              )}
            />
          </div>

          <div className='flex items-center justify-end gap-4'>
            <Button
              type='button'
              onClick={() => nav({ to: '/projects' })}
              disabled={isSubmitting}
              variant='ghost'
              icon={X}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting || isLoading}
              icon={Plus}
            >
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

export default ProjectCreatePage
