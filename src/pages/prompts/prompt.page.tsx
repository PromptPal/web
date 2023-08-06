import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Badge, Box, Card, CardBody, CardHeader, Divider, Heading, Highlight, Stack, StackDivider, Switch, Text, Tooltip } from '@chakra-ui/react'
import SimpleTable from '../../components/Table/SimpleTable'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useQuery as useGraphQLQuery } from '@apollo/client'
import { graphql } from '../../gql'
import { FetchPromptDetailQuery } from '../../gql/graphql'

const columnHelper = createColumnHelper<FetchPromptDetailQuery['prompt']['latestCalls']['edges'][0]>()

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
  columnHelper.accessor('createdAt', {
    header: 'Created At',
    cell: (info) => new Intl.DateTimeFormat()
      .format(new Date(info.getValue())),
  })
]

const q = graphql(`
  query fetchPromptDetail($id: Int!) {
    prompt(id: $id) {
      id
      hashId
      name
      description
      enabled
      debug
      tokenCount
      publicLevel
      createdAt
      updatedAt
      prompts {
        prompt
        role
      }
      variables {
        name
        type
      }
      latestCalls {
        count
        edges {
          id
          duration
          totalToken
          message
          createdAt
        }
      }
    }
  }
`)

function PromptPage() {
  const params = useParams()
  const pid = ~~(params?.id ?? '0')
  const { data } = useGraphQLQuery(q, {
    variables: {
      id: pid
    }
  })

  const promptDetail = data?.prompt

  const promptCallsTableData = useMemo(() => {
    return promptDetail?.latestCalls.edges ?? []
  }, [promptDetail])

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
            <Box flex={1} textAlign='center' >Hash ID: {promptDetail?.hashId}</Box>
          </Stack>
          <Divider my={4} />
          <Stack flexDirection='row'>
            <div className='flex-1 text-center'>
              Create Time: {promptDetail ? new Intl.DateTimeFormat().format(new Date(promptDetail?.createdAt)) : 'N/A'}
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