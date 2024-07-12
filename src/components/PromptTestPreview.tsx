import { Box, Card, Input, Stack, Text, Textarea, Title } from '@mantine/core'
import React from 'react'
import { testPromptResponse } from '../service/prompt'

type PromptTestPreviewProps = {
  data: testPromptResponse | null
}

function PromptTestPreview(props: PromptTestPreviewProps) {
  const { data } = props
  if (!data) {
    return (
      <Box>
        <Title>Empty</Title>
        <Text>Please test the prompt first</Text>
      </Box>
    )
  }
  return (
    <Stack w={'100%'} className='flex-row'>
      <Card flex={1}>
        <Title size='md'>Response</Title>
        <div>
          <Stack gap={4}>
            {data.choices.map((choice, i) => (
              <Stack key={i} className='flex-row'>
                <Input disabled w={'150px'} value={choice.message.role} />
                <Textarea value={choice.message.content} rows={8} disabled />
              </Stack>
            ))}
          </Stack>
        </div>
      </Card>
      <Card flex={1}>
        <Title size='md'>Usage</Title>
        <div>
          <Stack gap={4}>
            <Box>
              <Title size='xs' className='uppercase'>
                Prompt Tokens
              </Title>
              <Text>Tokens: {data.usage.prompt_tokens}</Text>
            </Box>
            <Box>
              <Title size='xs' className='uppercase'>
                Completion Tokens
              </Title>
              <Text>Tokens: {data.usage.completion_tokens}</Text>
            </Box>
            <Box>
              <Title size='xs' className='uppercase'>
                Total Tokens
              </Title>
              <Text>Tokens: {data.usage.total_tokens}</Text>
            </Box>
          </Stack>
        </div>
      </Card>
    </Stack>
  )
}

export default PromptTestPreview
