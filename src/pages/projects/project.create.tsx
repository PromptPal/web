import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormControl, FormLabel, Input, FormErrorMessage, Modal, ModalOverlay, ModalContent, ModalHeader, Button, Stack } from '@chakra-ui/react'
import { createProject, createProjectPayload } from '../../service/project'
import zod from 'zod'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

const schema = zod.object({
  name: zod.string().trim().max(100).min(2),
  openaiToken: zod.string().trim().min(3).max(255),
})

function ProjectCreatePage() {
  const nav = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createProjectPayload>({
    resolver: zodResolver(schema),
  })

  const qc = useQueryClient()

  const { isLoading, mutateAsync } = useMutation({
    mutationFn(payload: createProjectPayload) {
      return createProject(payload)
    },
    onSuccess(res) {
      nav(`/projects/${res.id}`)
      qc.invalidateQueries(['projects'])
      toast.success('Project created')
    }
  })

  const onSubmit: SubmitHandler<createProjectPayload> = (data) => {
    return mutateAsync(data)
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

        <FormControl isInvalid={!!errors.openaiToken}>
          <FormLabel htmlFor='openaiToken'>
            OpenAI Token
          </FormLabel>
          <Input {...register('openaiToken')} />
          <FormErrorMessage>
            {errors.openaiToken && errors.openaiToken.message}
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