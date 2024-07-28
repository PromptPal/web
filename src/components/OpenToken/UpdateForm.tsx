import { Button, Input, Switch, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import Zod from 'zod'
import { OpenTokenUpdate } from '../../gql/graphql'
type OpenTokenUpdateFormProps = {
  validatePath: string
  enabled: boolean

  isSubmitting: boolean
  onSubmit: (data: OpenTokenInputForm) => void
  onClose: () => void
}

type OpenTokenInputForm = Pick<
  OpenTokenUpdate,
  'apiValidateEnabled' | 'apiValidatePath'
>

const schema: Zod.ZodType<OpenTokenInputForm> = Zod.object({
  apiValidateEnabled: Zod.boolean(),
  apiValidatePath: Zod.string().url().trim().max(255),
})

function OpenTokenUpdateForm(props: OpenTokenUpdateFormProps) {
  const { validatePath, enabled, isSubmitting, onSubmit, onClose } = props
  const f = useForm<OpenTokenInputForm>({
    validate: zodResolver(schema),
    initialValues: {
      apiValidateEnabled: enabled,
      apiValidatePath: validatePath,
    },
  })

  return (
    <form onSubmit={f.onSubmit(onSubmit)}>
      <Input.Wrapper
        label='Enable Advanced Validation'
        {...f.getInputProps('apiValidateEnabled')}
      >
        <Switch className='w-full' {...f.getInputProps('apiValidateEnabled')} />
      </Input.Wrapper>
      <TextInput
        label='Advanced API Validate Path'
        placeholder='the API path for advanced API validation, for example https://annatarhe.com/api/validate'
        type='url'
        description='just remind you what you are doing'
        {...f.getInputProps('apiValidatePath')}
      />
      <div className='flex justify-end items-center gap-4 mt-4'>
        <Button color='blue' mr={3} onClick={onClose} variant='outline'>
          Close
        </Button>
        <Button type='submit' color='teal' loading={isSubmitting}>
          Update
        </Button>
      </div>
    </form>
  )
}

export default OpenTokenUpdateForm
