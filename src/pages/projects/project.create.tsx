import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react'
import { createProjectPayload } from '../../service/project'
import zod from 'zod'

type ProjectCreatePageProps = {
}

const schema = zod.object({
  name: zod.string().trim().max(100).min(2),
  openaiToken: zod.string().trim().min(3).max(255),
})

function ProjectCreatePage(props: ProjectCreatePageProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createProjectPayload>({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<createProjectPayload> = (data) => {
    console.log(data)
  }

  return (
    <dialog open className="daisyui-modal">
      <form
        method="dialog"
        onSubmit={handleSubmit(onSubmit)}
        className="daisyui-modal-box"
      >
        <h3 className="font-bold text-lg">New Project</h3>
        <div>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel htmlFor='name'>
              Project Name
            </FormLabel>
            <Input {...register('name')} />
          </FormControl>

          <FormControl isInvalid={!!errors.openaiToken}>
            <FormLabel htmlFor='openaiToken'>
              OpenAI Token
            </FormLabel>
            <Input {...register('openaiToken')} />
          </FormControl>
        </div>
        <div className="modal-action">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn">Close</button>
        </div>
      </form>
    </dialog>
  )
}

export default ProjectCreatePage