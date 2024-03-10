import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { Text, Card, ActionIcon, Title, HoverCard } from '@mantine/core'
import SimpleTable from '../Table/SimpleTable'
import { FetchPromptCallsTableQuery } from '../../gql/graphql'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { graphql } from '../../gql'
import { useQuery } from '@apollo/client'

type PromptCallsProps = {
  promptId: number
}

const q = graphql(`
  query fetchPromptCallsTable($id: Int!) {
    prompt(id: $id) {
      id
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

const columnHelper = createColumnHelper<FetchPromptCallsTableQuery['prompt']['latestCalls']['edges'][0]>()

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
        <HoverCard
          withArrow
          transitionProps={{ transition: 'pop', duration: 150 }}
        >
          <HoverCard.Dropdown>
            <Text className='max-w-96 text-wrap max-h-80 overflow-y-auto'>
              {dataset}
            </Text>
          </HoverCard.Dropdown>
          <HoverCard.Target>
            <Text className='line-clamp-4 whitespace-break-spaces w-fit'>
              {dataset}
            </Text>
          </HoverCard.Target>
        </HoverCard>
      )
    },
  }),
  columnHelper.accessor('message', {
    header: 'Message',
    cell: (info) => (
      <HoverCard
        withArrow
        transitionProps={{ transition: 'pop', duration: 150 }}
      >
        <HoverCard.Dropdown>
          <Text className='max-w-96 text-wrap max-h-80 overflow-y-auto'>
            {info.getValue()}
          </Text>
        </HoverCard.Dropdown>
        <HoverCard.Target>
          <Text className='line-clamp-4 whitespace-normal w-fit'>
            {info.getValue()}
          </Text>
        </HoverCard.Target>
      </HoverCard>
    ),
  }),
  // TODO: add price column
  columnHelper.accessor('createdAt', {
    header: 'Created At',
    cell: (info) => new Intl.DateTimeFormat()
      .format(new Date(info.getValue())),
  })
]

function PromptCalls(props: PromptCallsProps) {
  const { promptId } = props

  const { data: promptData, loading, refetch } = useQuery(q, {
    variables: {
      id: promptId
    },
    pollInterval: 20_000
  })

  const lastestCalls = promptData?.prompt?.latestCalls

  const promptCallsTable = useReactTable({
    data: lastestCalls?.edges ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <Card>
      <Card.Section className='p-4'>
        <div className='flex items-center justify-between'>
          <Title>
            Prompt Calls
            <i className='ml-2 text-gray-400 text-sm'>
              ({lastestCalls?.count ?? 0})
            </i>
          </Title>
          <ActionIcon
            onClick={() => refetch()}
            disabled={loading}
          >
            <ArrowPathIcon className='w-4 h-4' />
          </ActionIcon>
        </div>
      </Card.Section>
      <Card.Section className='p-4'>
        <SimpleTable
          loading={loading}
          table={promptCallsTable}
        />
      </Card.Section>
    </Card>
  )
}

export default PromptCalls