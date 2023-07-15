import { useMutation, useQuery } from '@tanstack/react-query'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProjectDetail, updateProject, updateProjectPayload } from '../../service/project'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'
import Zod from 'zod'
import { Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Stack, Switch, Tooltip, Link as LinkUI, Box } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { isEmpty, omitBy } from 'lodash'

type localUpdateProject = updateProjectPayload & { name?: string }

const schema: Zod.ZodType<localUpdateProject> = Zod.object({
  name: Zod.string().trim(),
  enabled: Zod.boolean(),
  openAIToken: Zod.string().trim().max(255).optional(),
  openAIModel: Zod.enum(['gpt-3.5-turbo', 'gpt-4-0613']).optional(),
  openAIBaseURL: Zod.string().trim().max(255).optional(),
  openAITemperature: Zod.number().min(0).max(2).optional(),
  openAITopP: Zod.number().min(0).max(1),
  openAIMaxTokens: Zod.number().min(0),
})

function ProjectEditPage() {
  const nav = useNavigate()
  const pidStr = useParams().id ?? '0'
  const pid = ~~pidStr

  const { refetch } = useQuery({
    queryKey: ['projects', pid],
    enabled: false,
    queryFn: ({ signal }) => getProjectDetail(pid, signal),
    refetchInterval: 0,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
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
      const payload = data.data
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
        openAIMaxTokens: payload.openAIMaxTokens ?? 16384,
      }
    },
  })

  const { isLoading, mutateAsync } = useMutation({
    mutationFn(payload: updateProjectPayload) {
      const args: Partial<updateProjectPayload> = omitBy(payload, isEmpty)
      args.openAIMaxTokens = payload.openAIMaxTokens
      return updateProject(pid, args)
    },
    onSuccess(res) {
      nav(`/projects/${res.id}`)
      toast.success('Project updated')
    }
  })

  const onSubmit: SubmitHandler<updateProjectPayload> = (data) => {
    return mutateAsync(data)
  }

  const temperature = watch('openAITemperature')
  const topP = watch('openAITopP')
  const maxTokens = watch('openAIMaxTokens')
  const pjName = watch('name')

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='px-6'>
        <Stack flexDir='row' justifyContent='space-between'>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel htmlFor='name'>Name</FormLabel>
            <Input
              id='name'
              disabled
              placeholder='Name'
              {...register('name')}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.enabled}>
            <FormLabel htmlFor='enabled'>Enabled</FormLabel>
            <Switch
              id='enabled'
              type='checkbox'
              isChecked={watch('enabled')}
              {...register('enabled')}
            />
            <FormErrorMessage>{errors.enabled?.message}</FormErrorMessage>
          </FormControl>
        </Stack>

        <FormControl isInvalid={!!errors.openAIToken}>
          <FormLabel htmlFor='openAIToken'>OpenAI Token</FormLabel>
          <Input
            id='openAIToken'
            placeholder='OpenAI Token'
            {...register('openAIToken')}
          />
          <FormErrorMessage>{errors.openAIToken?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.openAIModel}>
          <FormLabel htmlFor='openAIModel'>OpenAI Model</FormLabel>
          <Select
            id='openAIModel'
            placeholder='OpenAI Model'
            {...register('openAIModel')}
          >
            <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
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
        </FormControl>

        <FormControl isInvalid={!!errors.openAIBaseURL}>
          <FormLabel htmlFor='openAIBaseURL'>OpenAI Base URL</FormLabel>
          <Input
            id='openAIBaseURL'
            placeholder='OpenAI Base URL'
            {...register('openAIBaseURL')}
          />
          <FormErrorMessage>{errors.openAIBaseURL?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.openAITemperature}>
          <FormLabel htmlFor='openAITemperature'>OpenAI Temperature</FormLabel>
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
        </FormControl>

        <FormControl isInvalid={!!errors.openAITopP}>
          <FormLabel htmlFor='openAITopP'>OpenAI TopP</FormLabel>
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
        </FormControl>

        <FormControl isInvalid={!!errors.openAIMaxTokens}>
          <FormLabel htmlFor='openAIMaxTokens'>OpenAI Max Tokens</FormLabel>
          <NumberInput
            id='openAIMaxTokens'
            placeholder='OpenAI Max Tokens'
            {...register('openAIMaxTokens')}
            value={maxTokens}
            onChange={sliderValue => setValue('openAIMaxTokens', ~~sliderValue)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormErrorMessage>{errors.openAIMaxTokens?.message}</FormErrorMessage>
        </FormControl>

      </div>
      <Box>
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