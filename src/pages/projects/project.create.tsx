import { OpenAIModels } from '@/constants'
import { graphql } from '@/gql'
import { ProjectPayload } from '@/gql/graphql'
import { cn } from '@/utils'
import {
  useApolloClient,
  useMutation as useGraphQLMutation,
} from '@apollo/client'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { ExternalLink, Info, Loader2, Plus, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import * as z from 'zod'

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  openAIModel: z
    .enum(OpenAIModels, {
      required_error: 'Please select a model',
      invalid_type_error: 'Please select a valid model',
    })
    .default('gpt-3.5-turbo'),
  openAIBaseURL: z
    .string()
    .trim()
    .url('Please enter a valid URL')
    .max(255, 'URL cannot exceed 255 characters')
    .default('https://api.openai.com/v1'),
  openAIToken: z
    .string()
    .trim()
    .min(3, 'Token must be at least 3 characters')
    .max(255, 'Token cannot exceed 255 characters'),
  geminiBaseURL: z
    .string()
    .trim()
    .url('Please enter a valid URL')
    .max(255, 'URL cannot exceed 255 characters')
    .default('https://generativelanguage.googleapis.com'),
  geminiToken: z
    .string()
    .trim()
    .min(3, 'Token must be at least 3 characters')
    .max(255, 'Token cannot exceed 255 characters')
    .optional(),
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
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      openAIModel: 'gpt-3.5-turbo',
      openAIBaseURL: 'https://api.openai.com/v1',
      openAIToken: '',
      geminiBaseURL: 'https://generativelanguage.googleapis.com',
      geminiToken: '',
    },
  })

  const selectedModel = watch('openAIModel')

  const qc = useQueryClient()
  const [settingAreaRef] = useAutoAnimate()

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
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
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

          <div className='rounded-xl border border-border bg-gradient-to-br from-background/50 to-background p-6 backdrop-blur-xl space-y-6'>
            <div className='space-y-2'>
              <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                Project Name
              </label>
              <input
                type='text'
                className={cn(
                  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2',
                  'text-sm ring-offset-background file:border-0 file:bg-transparent',
                  'file:text-sm file:font-medium placeholder:text-muted-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                )}
                placeholder='My Awesome Project'
                {...register('name')}
                aria-invalid={errors.name ? 'true' : 'false'}
              />
              {errors.name && (
                <p className='text-sm text-destructive mt-1'>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                Model Provider
              </label>
              <div className='text-sm text-muted-foreground flex items-center gap-1 mb-2'>
                Find more models
                <a
                  href='https://platform.openai.com/docs/models/overview'
                  className='inline-flex items-center gap-1 text-primary hover:underline'
                  target='_blank'
                  rel='noreferrer'
                >
                  here
                  <ExternalLink className='w-3 h-3' />
                </a>
              </div>
              <select
                className={cn(
                  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2',
                  'text-sm ring-offset-background focus-visible:outline-none',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                )}
                {...register('openAIModel')}
                aria-invalid={errors.openAIModel ? 'true' : 'false'}
              >
                <option value=''>Select a model</option>
                {OpenAIModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              {errors.openAIModel && (
                <p className='text-sm text-destructive mt-1'>
                  {errors.openAIModel.message}
                </p>
              )}
            </div>

            <div ref={settingAreaRef} className='space-y-6'>
              {selectedModel?.startsWith('gpt') && (
                <>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-1'>
                      <label className='text-sm font-medium leading-none'>
                        Base URL
                      </label>
                      <div className='group relative'>
                        <Info className='w-4 h-4 text-muted-foreground' />
                        <div
                          className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg
                        bg-popover text-popover-foreground border border-border text-sm min-w-[16rem] hidden
                        group-hover:block shadow-lg'
                        >
                          The base URL of the OpenAI API. You can set this for
                          proxy (大陆项目可以用此字段设置转发服务器代理)
                        </div>
                      </div>
                    </div>
                    <input
                      type='text'
                      className={cn(
                        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2',
                        'text-sm ring-offset-background focus-visible:outline-none',
                        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                      )}
                      {...register('openAIBaseURL')}
                      aria-invalid={errors.openAIBaseURL ? 'true' : 'false'}
                    />
                    {errors.openAIBaseURL && (
                      <p className='text-sm text-destructive mt-1'>
                        {errors.openAIBaseURL.message}
                      </p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium leading-none'>
                      OpenAI Token
                    </label>
                    <input
                      type='password'
                      className={cn(
                        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2',
                        'text-sm ring-offset-background focus-visible:outline-none',
                        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                      )}
                      {...register('openAIToken')}
                      aria-invalid={errors.openAIToken ? 'true' : 'false'}
                    />
                    {errors.openAIToken && (
                      <p className='text-sm text-destructive mt-1'>
                        {errors.openAIToken.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {selectedModel?.startsWith('gemini') && (
                <>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-1'>
                      <label className='text-sm font-medium leading-none'>
                        Base URL
                      </label>
                      <div className='group relative'>
                        <Info className='w-4 h-4 text-muted-foreground' />
                        <div
                          className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg
                        bg-popover text-popover-foreground border border-border text-sm min-w-[16rem] hidden
                        group-hover:block shadow-lg'
                        >
                          The base URL of the Google Gemini API. You can set
                          this for proxy
                          (大陆项目可以用此字段设置转发服务器代理)
                        </div>
                      </div>
                    </div>
                    <input
                      type='text'
                      className={cn(
                        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2',
                        'text-sm ring-offset-background focus-visible:outline-none',
                        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                      )}
                      {...register('geminiBaseURL')}
                      aria-invalid={errors.geminiBaseURL ? 'true' : 'false'}
                    />
                    {errors.geminiBaseURL && (
                      <p className='text-sm text-destructive mt-1'>
                        {errors.geminiBaseURL.message}
                      </p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium leading-none'>
                      Gemini Token
                    </label>
                    <input
                      type='password'
                      className={cn(
                        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2',
                        'text-sm ring-offset-background focus-visible:outline-none',
                        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                      )}
                      {...register('geminiToken')}
                      aria-invalid={errors.geminiToken ? 'true' : 'false'}
                    />
                    {errors.geminiToken && (
                      <p className='text-sm text-destructive mt-1'>
                        {errors.geminiToken.message}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className='flex items-center justify-end gap-4'>
            <button
              type='button'
              onClick={() => nav({ to: '/projects' })}
              disabled={isSubmitting}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2',
                'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                'text-sm font-medium transition-colors focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
              )}
            >
              <X className='w-4 h-4' />
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting || isLoading}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2',
                'bg-primary text-primary-foreground hover:bg-primary/90',
                'text-sm font-medium transition-colors focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
              )}
            >
              {isSubmitting || isLoading ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Plus className='w-4 h-4' />
              )}
              Create Project
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default ProjectCreatePage
