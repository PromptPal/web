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
import { motion } from 'framer-motion'
import { Folder, Plus, Sparkles, X } from 'lucide-react'
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
    <div className='w-full space-y-8'>
      {/* Header Section with Gradient Background */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='relative overflow-hidden'
      >
        <div className='absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-blue-500/10 blur-3xl' />
        <div className='relative backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 shadow-2xl rounded-2xl'>
          <div className='p-8'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='p-2 rounded-lg bg-gradient-to-br from-sky-500 to-blue-500'>
                <Folder className='w-6 h-6 text-white' />
              </div>
              <h1 className='text-3xl font-bold bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent'>
                Create New Project
              </h1>
              <Sparkles className='w-5 h-5 text-sky-400 animate-pulse' />
            </div>
            <p className='text-gray-300 max-w-xl'>
              Set up a new project to organize your AI prompts, configure providers, and manage your workflow efficiently
            </p>
          </div>
        </div>
      </motion.section>

      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='container max-w-2xl mx-auto px-4'
      >
        <form
          onSubmit={
            handleSubmit(onSubmit, (errors) => {
              console.log('errors', errors)
            })
          }
          className='space-y-8'
        >
          <div className='backdrop-blur-xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 rounded-2xl p-8 shadow-2xl'>
            <div className='space-y-6'>
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
                        <span className='text-sm text-gray-300'>AI Provider</span>
                        {fieldState.error && (
                          <span className='text-xs text-red-400'>
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
          </div>

          <div className='flex items-center justify-end gap-4'>
            <Button
              type='button'
              onClick={() => nav({ to: '/projects' })}
              disabled={isSubmitting}
              variant='ghost'
              icon={X}
              className='hover:bg-gray-800/50 hover:border-gray-600 transition-all duration-200'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting || isLoading}
              icon={Plus}
              className='group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-xl shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <div className='absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300' />
              <span className='relative z-10'>
                {isSubmitting || isLoading ? 'Creating...' : 'Create Project'}
              </span>
              <Sparkles className='w-4 h-4 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default ProjectCreatePage
