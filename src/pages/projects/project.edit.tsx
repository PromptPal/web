import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'
import Zod from 'zod'
import { Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Slider, SliderFilledTrack, SliderMark, Text, SliderThumb, SliderTrack, Stack, Switch, Tooltip, Link as LinkUI, Box, Heading, Divider } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { isEmpty, omitBy } from 'lodash'
import { useLazyQuery as useGraphQLLazyQuery, useMutation as useGraphQLMutation } from '@apollo/client'
import { graphql } from '../../gql'
import { ProjectPayload } from '../../gql/graphql'
import { OpenAIModels } from '../../constants'

type localUpdateProject = ProjectPayload

const schema: Zod.ZodType<localUpdateProject> = Zod.object({
  name: Zod.string().trim(),
  enabled: Zod.boolean(),
  openAIToken: Zod.string().trim().max(255).optional(),
  openAIModel: Zod.enum(OpenAIModels),
  openAIBaseURL: Zod.string().trim().max(255).optional(),
  openAITemperature: Zod.number().min(0).max(2).optional(),
  openAITopP: Zod.number().min(0).max(1),
  openAIMaxTokens: Zod.number().min(0).optional(),
})

const q = graphql(`
  query fetchProjectLite($id: Int!) {
    project(id: $id) {
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

const m = graphql(`
  mutation updateProject($id: Int!, $data: ProjectPayload!) {
    updateProject(id: $id, data: $data) {
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

function ProjectEditPage() {
  const nav = useNavigate()
  const pidStr = useParams().id ?? '0'
  const pid = ~~pidStr

  const [refetch] = useGraphQLLazyQuery(q, {
    variables: {
      id: pid
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<localUpdateProject>({
    resolver: zodResolver(schema),
    async defaultValues() {
      const data = await refetch()
      const payload = data.data?.project
      if (!payload) {
        return {}
      }
      return {
        name: payload.name,
        enabled: payload.enabled,
        openAIToken: undefined,
        openAIModel: payload.openAIModel,
        openAIBaseURL: payload.openAIBaseURL,
        openAITemperature: payload.openAITemperature,
        openAITopP: payload.openAITopP,
        openAIMaxTokens: payload.openAIMaxTokens,
      }
    },
  })
  const qc = useQueryClient()
  const [mutateAsync, { loading: isLoading }] = useGraphQLMutation(m, {
    onCompleted(data) {
      const res = data.updateProject
      qc.invalidateQueries({
        queryKey: ['projects']
      })
      qc.invalidateQueries({
        queryKey: ['project', res.id]
      })
      nav(`/projects/${res.id}`)
      toast.success('Project updated')
    },
  })

  const onSubmit: SubmitHandler<ProjectPayload> = (data) => {
    const args: ProjectPayload = omitBy(data, isEmpty)
    args.openAIMaxTokens = data.openAIMaxTokens
    return mutateAsync({
      variables: {
        id: pid,
        data: args
      }
    })
  }

  const temperature = watch('openAITemperature')
  const topP = watch('openAITopP')
  const maxTokens = watch('openAIMaxTokens')
  const pjName = watch('name')
  const isEnabled = watch('enabled')

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box>
        <Heading>Editing {pjName}</Heading>
        <Divider my={6} />
      </Box>
      <div className='px-6'>
        <Stack flexDir='row'>
          <FormControl isInvalid={!!errors.name} className='flex justify-center items-center'>
            <FormLabel htmlFor='name' className='w-40' >Name</FormLabel>
            <Box className='w-full flex items-center'>
              <Input
                id='name'
                disabled
                placeholder='Name'
                {...register('name')}
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              <Stack flexDirection='row' alignItems='center' ml={4}>
                <Switch
                  id='enabled'
                  type='checkbox'
                  isChecked={isEnabled ?? true}
                  {...register('enabled')}
                />
                <Text>{isEnabled ? 'Enabled' : 'Disabled'}</Text>
              </Stack>
            </Box>
          </FormControl>
        </Stack>

        <FormControl isInvalid={!!errors.openAIToken} className='mt-4 flex items-center w-full'>
          <FormLabel htmlFor='openAIToken' className='w-40'>OpenAI Token</FormLabel>
          <Box className='w-full '>
            <Input
              id='openAIToken'
              placeholder='OpenAI Token'
              className='w-full'
              {...register('openAIToken')}
            />
            <FormErrorMessage>{errors.openAIToken?.message}</FormErrorMessage>
            <FormHelperText>
              Create your own API key
              <LinkUI
                href="https://platform.openai.com/account/api-keys"
                className='ml-1'
                isExternal
              >
                here <ExternalLinkIcon mx='2px' />
              </LinkUI>
            </FormHelperText>
          </Box>
        </FormControl>

        <FormControl isInvalid={!!errors.openAIModel} className='mt-4 flex items-center'>
          <FormLabel htmlFor='openAIModel' className='w-40' >OpenAI Model</FormLabel>
          <Box className='w-full'>
            <Select
              id='openAIModel'
              placeholder='OpenAI Model'
              {...register('openAIModel')}
            >
              {OpenAIModels.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>
            <FormHelperText>
              Find more models
              <LinkUI
                href="https://platform.openai.com/docs/models/overview"
                className='ml-1'
                isExternal
              >
                here <ExternalLinkIcon mx='2px' />
              </LinkUI>
            </FormHelperText>
            {/* add help info */}
            <FormErrorMessage>{errors.openAIModel?.message}</FormErrorMessage>
          </Box>
        </FormControl>
        <FormControl isInvalid={!!errors.openAIBaseURL} className='mt-4 flex items-center'>
          <FormLabel htmlFor='openAIBaseURL' className=' w-40' >OpenAI Base URL</FormLabel>
          <Box className='w-full'>
            <Input
              id='openAIBaseURL'
              placeholder='OpenAI Base URL'
              {...register('openAIBaseURL')}
            />
            <FormErrorMessage>{errors.openAIBaseURL?.message}</FormErrorMessage>
          </Box>
        </FormControl>

        <FormControl isInvalid={!!errors.openAITemperature} className='mt-4 flex items-center'>
          <FormLabel
            htmlFor='openAITemperature'
            className='w-40'
          >OpenAI Temperature</FormLabel>
          <Box className='w-full'>
            <Slider
              placeholder='OpenAI Temperature'
              {...register('openAITemperature')}
              min={0}
              max={2}
              colorScheme='teal'
              step={0.1}
              onChange={sliderValue => setValue('openAITemperature', sliderValue)}
            // onMouseEnter={() => setShowTooltip(true)}
            // onMouseLeave={() => setShowTooltip(false)}
            >
              <SliderMark value={1} mt='1' ml='-2.5' fontSize='sm'>
                1
              </SliderMark>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <Tooltip
                hasArrow
                bg='teal.500'
                color='white'
                placement='top'
                // isOpen={showTooltip}
                label={`${temperature}`}
              >
                <SliderThumb />
              </Tooltip>
            </Slider>

            <FormErrorMessage>{errors.openAITemperature?.message}</FormErrorMessage>
          </Box>
        </FormControl>

        <FormControl isInvalid={!!errors.openAITopP} className='mt-4 flex items-center'>
          <FormLabel htmlFor='openAITopP' className='w-40' >OpenAI TopP</FormLabel>
          <Box className='w-full'>
            <Slider
              placeholder='OpenAI TopP'
              {...register('openAITopP')}
              min={0}
              max={1}
              step={0.1}
              colorScheme='teal'
              onChange={sliderValue => setValue('openAITopP', sliderValue)}
            // onMouseEnter={() => setShowTooltip(true)}
            // onMouseLeave={() => setShowTooltip(false)}
            >
              <SliderMark value={1} mt='1' ml='-2.5' fontSize='sm'>
                1
              </SliderMark>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <Tooltip
                hasArrow
                bg='teal.500'
                color='white'
                placement='top'
                // isOpen={showTooltip}
                label={`${topP}`}
              >
                <SliderThumb />
              </Tooltip>
            </Slider>
          </Box>
        </FormControl>

        <FormControl isInvalid={!!errors.openAIMaxTokens} className='mt-4 flex items-center'>
          <FormLabel htmlFor='openAIMaxTokens' className='w-40'>OpenAI Max Tokens</FormLabel>
          <Box className='w-full'>
            <NumberInput
              id='openAIMaxTokens'
              placeholder='OpenAI Max Tokens'
              {...register('openAIMaxTokens')}
              value={maxTokens ?? 0}
              onChange={sliderValue => setValue('openAIMaxTokens', ~~sliderValue)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.openAIMaxTokens?.message}</FormErrorMessage>
          </Box>
        </FormControl>

      </div>
      <Box mr={6}>
        <Stack direction='row' justifyContent='flex-end' mt={4}>
          <Button
            onClick={() => {
              nav(`/projects/${pid}`)
            }}
          >
            Cancel
          </Button>
          <Button
            colorScheme='teal'
            disabled={Object.keys(errors).length > 0}
            isLoading={isLoading}
            loadingText='Updating'
            type='submit'
          >
            Update
          </Button>
        </Stack>
      </Box>
    </form>
  )
}

export default ProjectEditPage