import { useCallback, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ActionIcon, Badge, Box, Button, Card, Divider, Title as Heading, Highlight, Switch, Text, Tooltip } from '@mantine/core'
import SimpleTable from '../../components/Table/SimpleTable'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useQuery as useGraphQLQuery, useMutation } from '@apollo/client'
import { graphql } from '../../gql'
import { FetchPromptDetailQuery } from '../../gql/graphql'
import toast from 'react-hot-toast'
import { useProjectId } from '../../hooks/route'
import { ArrowPathIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

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
  columnHelper.accessor('payload', {
    header: 'Payload',
    cell: (info) => {
      const val: Record<string, string> = JSON.parse(info.getValue())
      const dataset = Object.keys(val).map((key) => {
        return `${key}: ${val[key]}`
      }).join('\n')

      // TODO: compose the variables with the prompt
      return (
        <Tooltip label={<Text>{dataset}</Text>}>
          <div className='line-clamp-4 whitespace-break-spaces'>
            {dataset}
          </div>
        </Tooltip>
      )
    },
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

const pm = graphql(`
  mutation togglePrompt($id: Int!, $payload: PromptPayload!) {
    updatePrompt(id: $id, data: $payload) {
      id
      name
      description
      enabled
      debug
    }
  }
`)

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
      project {
        id
        name
      }
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
          payload
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
  const { data, loading, refetch } = useGraphQLQuery(q, {
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

  const [doPromptUpdate, { loading: isPromptUpdating }] = useMutation(pm)

  const onDebugChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!promptDetail) {
      return
    }
    const n = event.target.checked
    toast.promise(
      doPromptUpdate({
        variables: {
          id: promptDetail?.id ?? 0,
          payload: {
            name: promptDetail.name,
            description: promptDetail.description,
            tokenCount: promptDetail.tokenCount,
            publicLevel: promptDetail.publicLevel,
            enabled: promptDetail.enabled,
            projectId: promptDetail.project.id,
            prompts: promptDetail.prompts,
            variables: promptDetail.variables,
            debug: n
          }
        }
      }),
      {
        loading: 'Updating prompt',
        success: 'Updated prompt',
        error: 'Failed to update prompt'
      })
  }, [doPromptUpdate, promptDetail])

  const pjId = useProjectId()

  return (
    <div>
      <Card>
        <div className='flex justify-between items-center'>
          <div className='flex items-end'>
            <Heading>{promptDetail?.name}</Heading>
            <span className='ml-2 text-gray-400'>{promptDetail?.description}</span>
          </div>
          <div className='flex gap-4 items-center'>
            <Button
              variant='filled'
              color='teal'
              component={Link}
              to={`/prompts/${promptDetail?.id}/edit?pjId=${pjId}`}
            >
              Edit
            </Button>
            <Button
              leftSection={<InformationCircleIcon />}
              onClick={() => {
                toast.success('Help coming soon...')
              }}
            >
              Help
            </Button>
          </div>
        </div>
        <Card.Section className='px-4 mt-4'>
          <div className='flex items-center justify-around'>
            <Box className='text-center'>
              id: {promptDetail?.id}</Box>
            <Box className='text-center' >
              Hash ID: {promptDetail?.hashId}
            </Box>
          </div>
          <Divider my={4} />
          <div className='flex'>
            <div className='flex-1 text-center'>
              Create Time: {promptDetail ? new Intl.DateTimeFormat().format(new Date(promptDetail?.createdAt)) : 'N/A'}
            </div>
            <div className='flex-1 text-center'>
              Visibility: <Badge >{promptDetail?.publicLevel}</Badge>
            </div>
            <div className='flex-1 text-center'>
              Enabled:
              <Switch
                readOnly
                checked={promptDetail?.enabled}
                className='text-center justify-center flex'
                classNames={{
                  body: 'w-fit'
                }}
              />
            </div>
            <div className='flex-1 text-center justify-center'>
              <span>
                Debug:
              </span>
              <Switch
                className='text-center justify-center flex'
                classNames={{
                  body: 'w-fit'
                }}
                readOnly={isPromptUpdating}
                checked={promptDetail?.debug}
                onChange={onDebugChange}
              />
            </div>
          </div>

          <div className='my-4'>
            {promptDetail?.prompts.map((prompt, idx) => (
              <Box key={idx} display='flex' >
                <span className='mr-2'>
                  {prompt.role}:
                </span>
                <div
                  className='whitespace-break-spaces bg-opacity-30 bg-slate-900 rounded w-full p-4'
                >
                  <Highlight highlight={variables.map((v) => `{{${v}}}`)}>
                    {prompt.prompt}
                  </Highlight>
                </div>
              </Box>
            ))}
          </div>
        </Card.Section>
      </Card>

      <Divider my={8} />

      <Card>
        <Card.Section className='p-4'>
          <div className='flex items-center justify-between'>
            <Heading>
              Prompt Calls
              <i className='ml-2 text-gray-400 text-sm'>
                ({promptDetail?.latestCalls.count ?? 0})
              </i>
            </Heading>
            <ActionIcon onClick={() => refetch()} disabled={loading}>
              <ArrowPathIcon className='w-4 h-4' />
            </ActionIcon>
          </div>
        </Card.Section>
        <Card.Section className='p-4'>
          <SimpleTable loading={loading} table={promptCallsTable} />
        </Card.Section>
      </Card>
    </div>
  )
}

export default PromptPage