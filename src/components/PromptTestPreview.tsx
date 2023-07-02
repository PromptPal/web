import React from 'react'
import { testPromptResponse } from '../service/prompt'
import { Box, Text, Card, CardBody, CardHeader, Heading, Stack, StackDivider, Textarea, Input } from '@chakra-ui/react'

type PromptTestPreviewProps = {
  data: testPromptResponse | null
}

function PromptTestPreview(props: PromptTestPreviewProps) {
  const { data } = props
  if (!data) {
    return (
      <Box>
        <Heading>
          Empty
        </Heading>
        <Text>
          Please test the prompt first
        </Text>
      </Box>
    )
  }
  return (
    <Stack divider={<StackDivider />} direction='row' width='100%'>
      <Card flex={1}>
        <CardHeader>
          <Heading size='md'>Response</Heading>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing={4}>
            {data.choices.map((choice, i) => (
              <Stack key={i} direction='row'>
                <Input
                  isDisabled
                  w={'150px'}
                  value={choice.message.role}
                />
                <Textarea
                  value={choice.message.content}
                  isDisabled
                />
              </Stack>
            ))}
          </Stack>
        </CardBody>
      </Card>
      <Card flex={1}>
        <CardHeader>
          <Heading size='md'>Usage</Heading>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing={4}>
            <Box>
              <Heading size='xs' textTransform='uppercase'>
                Prompt Tokens
              </Heading>
              <Text>
                Tokens: {data.usage.prompt_tokens}
              </Text>
            </Box>
            <Box>
              <Heading size='xs' textTransform='uppercase'>
                Completion Tokens
              </Heading>
              <Text>
                Tokens: {data.usage.completion_tokens}
              </Text>
            </Box>
            <Box>
              <Heading size='xs' textTransform='uppercase'>
                Total Tokens
              </Heading>
              <Text>
                Tokens: {data.usage.total_tokens}
              </Text>
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  )
}

export default PromptTestPreview