import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import React, { useDebugValue, useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { PromptCall, getPromptCalls, getPromptDetail } from '../../service/prompt'
import { Badge, Box, Card, CardBody, CardHeader, Divider, Heading, Highlight, Stack, StackDivider, Switch, Text, Tooltip } from '@chakra-ui/react'
import SimpleTable from '../../components/Table/SimpleTable'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'

const columnHelper = createColumnHelper<PromptCall>()

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('duration', {
    header: 'Duration',
    cell: (info) => info.getValue() + ' ms',
  }),
  columnHelper.accessor('totalToken', {
    header: 'Total Tokens',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('message', {
    header: 'Message',
    cell: (info) => (
      <Tooltip label={<Text>{info.getValue()}</Text>}>
        <Text className='line-clamp-1 whitespace-normal'>
          {info.getValue()}
        </Text>
      </Tooltip>
    ),
  }),
  // TODO: add price column
  columnHelper.accessor('create_time', {
    header: 'Created At',
    cell: (info) => new Intl.DateTimeFormat()
      .format(new Date(info.getValue())),
  })
]

function PromptPage() {
  const params = useParams()
  const pid = ~~(params?.id ?? '0')

  const { data: promptDetail } = useQuery({
    queryKey: ['prompt', pid],
    queryFn: ({ signal }) => getPromptDetail(pid, signal),
    enabled: pid > 0,
  })

  const { data: promptCalls } = useInfiniteQuery({
    queryKey: ['prompt', pid, 'calls-all'],
    queryFn: ({ pageParam, signal }) => {
      let cursor = pageParam
      if (!cursor) {
        cursor = 1 << 30
      }
      return getPromptCalls(pid, cursor, signal)
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) {
        return null
      }
      const d = lastPage.data
      if (d.length === 0) {
        return null
      }
      return d[d.length - 1].id
    }
  })

  const promptCallsTableData = useMemo(() => {
    return promptCalls?.pages.flatMap((page) => page.data) ?? []
  }, [promptCalls?.pages.length])

  const promptCallsTable = useReactTable({
    data: promptCallsTableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const variables = useMemo(() => {
    if (!promptDetail?.variables) {
      return []
    }
    return promptDetail.variables.map(x => x.name)
  }, [promptDetail])

  return (
    <div>
      <Card>
        <CardHeader display='flex' alignItems='flex-end' flexDirection='row'>
          <Heading>{promptDetail?.name}</Heading>
          <span className='ml-2 text-gray-400'>{promptDetail?.description}</span>
        </CardHeader>
        <CardBody>
          <Stack flexDirection='row'>
            <Box flex={1} textAlign='center'>id: {promptDetail?.id}</Box>
            <Box flex={1} textAlign='center' >Hash ID: {promptDetail?.hid}</Box>
          </Stack>
          <Divider my={4} />
          <Stack flexDirection='row'>
            <div className='flex-1 text-center'>
              Create Time: {promptDetail ? new Intl.DateTimeFormat().format(new Date(promptDetail?.create_time)) : 'N/A'}
            </div>
            <div className='flex-1 text-center'>
              Visibility: <Badge colorScheme='teal'>{promptDetail?.publicLevel}</Badge>
            </div>
            <div className='flex-1 text-center'>
              Enabled: <Switch isReadOnly defaultChecked checked={promptDetail?.enabled} />
            </div>
            <div className='flex-1 text-center' >
              Debug: <Switch isReadOnly checked={promptDetail?.debug} />
            </div>
          </Stack>

          <Stack mt={4}>
            {promptDetail?.prompts.map((prompt, idx) => (
              <Box key={idx} display='flex' flexDirection='row'>
                <span className='mr-2'>
                  {prompt.role}:
                </span>
                <div
                  className='whitespace-break-spaces'
                >
                  <Highlight
                    query={variables.map((v) => `{{${v}}}`)}
                    styles={{
                      color: 'white',
                      borderRadius: '4px',
                      padding: '1px 4px',
                      backgroundColor: 'teal'
                    }}
                  >
                    {prompt.prompt}
                  </Highlight>
                </div>
              </Box>
            ))}
          </Stack>
        </CardBody>
      </Card>

      <Divider my={8} />

      <Card>
        <CardHeader>
          <Heading>Prompt Calls</Heading>
        </CardHeader>
        <CardBody>
          <SimpleTable table={promptCallsTable} />
        </CardBody>
      </Card>
    </div>
  )
}

export default PromptPage