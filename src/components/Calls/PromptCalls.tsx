import { useQuery } from '@apollo/client'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import {
  ActionIcon,
  Badge,
  Card,
  HoverCard,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { graphql } from '../../gql'
import { FetchPromptCallsTableQuery } from '../../gql/graphql'
import SimpleTable from '../Table/SimpleTable'
import UABadge from './UABadge'

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
          costInCents
          userAgent
          cached
          ip
        }
      }
    }
  }
`)

const columnHelper =
  createColumnHelper<
    FetchPromptCallsTableQuery['prompt']['latestCalls']['edges'][0]
  >()

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',

    cell: (info) => {
      const cached = info.row.original.cached
      const ip = info.row.original.ip || 'No Data exists'
      return (
        <div className='flex flex-row items-center'>
          <span>{info.getValue()}</span>
          <Tooltip
            withArrow
            label={ip}
            transitionProps={{ transition: 'pop', duration: 150 }}
          >
            <UABadge userAgent={info.row.original.userAgent} className='ml-2' />
          </Tooltip>
          {cached && (
            <Badge color='green' className='ml-2'>
              Cached
            </Badge>
          )}
        </div>
      )
    },
  }),
  columnHelper.accessor('duration', {
    header: 'Duration',
    cell: (info) => info.getValue() + ' ms',
  }),
  columnHelper.accessor('totalToken', {
    header: 'Total Tokens(USD)',
    id: 'totalToken',
    cell: (info) => {
      const costInCents = new BigNumber(info.row.original.costInCents)
      return (
        <div>
          <span>{info.getValue()}</span>
          <span className='ml-2 text-xs'>
            (${costInCents.dividedBy(100).toFixed(8)})
          </span>
        </div>
      )
    },
  }),
  columnHelper.accessor('payload', {
    header: 'Payload',
    cell: (info) => {
      const val: Record<string, string> = JSON.parse(info.getValue())
      const dataset = Object.keys(val)
        .map((key) => {
          return `${key}: ${val[key]}`
        })
        .join('\n')

      if (Object.keys(val).length === 0) {
        return <span>-</span>
      }

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
    cell: (info) => {
      const content = info.getValue()

      if (!content) {
        return <span>-</span>
      }

      return (
        <HoverCard
          withArrow
          transitionProps={{ transition: 'pop', duration: 150 }}
        >
          <HoverCard.Dropdown>
            <Text className='max-w-96 text-wrap max-h-80 overflow-y-auto text-sm'>
              {content}
            </Text>
          </HoverCard.Dropdown>
          <HoverCard.Target>
            <Text className='line-clamp-4 whitespace-normal w-fit'>
              {content}
            </Text>
          </HoverCard.Target>
        </HoverCard>
      )
    },
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created At',
    cell: (info) => {
      const date = dayjs(info.getValue())
      let result = date.format('YYYY-MM-DD HH:mm')
      if (date.diff(dayjs(), 'D') < 1) {
        result = date.fromNow()
      }
      return (
        <HoverCard
          withArrow
          position='top'
          transitionProps={{ transition: 'pop', duration: 150 }}
        >
          <HoverCard.Dropdown>
            <Text className='max-w-96 max-h-80 overflow-y-auto text-nowrap'>
              {date.format('YYYY-MM-DD HH:mm:ss')}
            </Text>
          </HoverCard.Dropdown>
          <HoverCard.Target>
            <Text className='text-nowrap'>{result}</Text>
          </HoverCard.Target>
        </HoverCard>
      )
    },
  }),
]

function PromptCalls(props: PromptCallsProps) {
  const { promptId } = props

  const {
    data: promptData,
    loading,
    refetch,
  } = useQuery(q, {
    variables: {
      id: promptId,
    },
    pollInterval: 20_000,
  })

  const latestCalls = promptData?.prompt?.latestCalls

  const promptCallsTable = useReactTable({
    data: latestCalls?.edges ?? [],
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
              ({latestCalls?.count ?? 0})
            </i>
          </Title>
          <ActionIcon onClick={() => refetch()} disabled={loading}>
            <ArrowPathIcon className='w-4 h-4' />
          </ActionIcon>
        </div>
      </Card.Section>
      <Card.Section className='p-4'>
        <SimpleTable loading={loading} table={promptCallsTable} />
      </Card.Section>
    </Card>
  )
}

export default PromptCalls
