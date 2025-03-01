import { useQuery } from '@apollo/client'
import * as Popover from '@radix-ui/react-popover'
import * as Tooltip from '@radix-ui/react-tooltip'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { RotateCw, Search, X } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { graphql } from '../../gql'
import { FetchPromptCallsTableQuery, QueryPromptArgs } from '../../gql/graphql'
import { calcId } from '../../utils/dep-check'
import SimpleTable from '../Table/SimpleTable'
import UABadge from './UABadge'

type PromptCallsProps = {
  promptId: number
}

const q = graphql(`
  query fetchPromptCallsTable($id: Int!, $filters: PromptSearchFilters) {
    prompt(id: $id, filters: $filters) {
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
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <span>
                  <UABadge
                    userAgent={info.row.original.userAgent}
                    className='ml-2'
                  />
                </span>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className='rounded-lg bg-gray-800 px-3 py-2 text-sm text-white shadow-lg'
                  sideOffset={5}
                >
                  {ip}
                  <Tooltip.Arrow className='fill-gray-800' />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
          {cached && (
            <span className='ml-2 px-2 py-1 text-xs font-medium rounded-full bg-linear-to-r from-green-500/20 to-emerald-500/20 text-emerald-400 border border-emerald-500/20'>
              Cached
            </span>
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
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className='text-left line-clamp-4 whitespace-break-spaces w-fit hover:text-blue-400 transition-colors'>
              {dataset}
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className='rounded-lg bg-gray-800/90 backdrop-blur-xs p-4 text-white shadow-xl border border-gray-700/50 max-w-96 max-h-80 overflow-y-auto'
              sideOffset={5}
            >
              <div className='text-sm whitespace-pre-wrap'>{dataset}</div>
              <Popover.Arrow className='fill-gray-800/90' />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
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
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className='text-left line-clamp-4 whitespace-normal w-fit hover:text-blue-400 transition-colors'>
              {content}
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className='rounded-lg bg-gray-800/90 backdrop-blur-xs p-4 text-white shadow-xl border border-gray-700/50 max-w-96 max-h-80 overflow-y-auto'
              sideOffset={5}
            >
              <div className='text-sm whitespace-pre-wrap'>{content}</div>
              <Popover.Arrow className='fill-gray-800/90' />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
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
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className='text-nowrap hover:text-blue-400 transition-colors'>
              {result}
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className='rounded-lg bg-gray-800/90 backdrop-blur-xs px-3 py-2 text-white shadow-xl border border-gray-700/50'
              side='top'
              sideOffset={5}
              align='end'
            >
              <div className='text-sm text-nowrap'>
                {date.format('YYYY-MM-DD HH:mm:ss')}
              </div>
              <Popover.Arrow className='fill-gray-800/90' />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      )
    },
  }),
]

const rm = getCoreRowModel()

function PromptCalls(props: PromptCallsProps) {
  const { promptId } = props

  const [searchingUserId, setSearchingUserId] = useState('')

  const variables = useMemo<QueryPromptArgs>(() => {
    return {
      id: promptId,
      filters: {
        userId: searchingUserId === '' ? null : searchingUserId,
      },
    }
  }, [searchingUserId, promptId])

  const onSearchValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchingUserId(e.target.value)
    },
    [],
  )

  const {
    data: promptData,
    loading,
    refetch,
  } = useQuery(q, {
    variables,
    pollInterval: 20_000,
  })

  const latestCalls = promptData?.prompt?.latestCalls

  const renderCallsTableData = useMemo(() => {
    return latestCalls?.edges ?? []
  }, [calcId(latestCalls?.edges)])

  const promptCallsTable = useReactTable({
    data: renderCallsTableData,
    columns,
    getCoreRowModel: rm,
  })
  return (
    <section className=' w-full backdrop-blur-xs bg-linear-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 shadow-xl rounded-xl'>
      <div className='p-6 border-b border-gray-700/50'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500'>
            Prompt Calls
            <span className='ml-2 text-gray-400 text-sm font-normal'>
              ({latestCalls?.count ?? 0})
            </span>
          </h2>
          <div className='flex gap-4 items-center'>
            <div className='relative'>
              <input
                type='search'
                className='pl-10 pr-10 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/50 transition-all'
                value={searchingUserId}
                placeholder='User ID'
                onChange={onSearchValueChange}
              />
              <Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
              {searchingUserId && (
                <button
                  onClick={() => setSearchingUserId('')}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors'
                >
                  <X className='w-4 h-4' />
                </button>
              )}
            </div>
            <button
              onClick={() => refetch()}
              disabled={loading}
              className='p-2 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <RotateCw className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
      <div className='p-6'>
        <SimpleTable loading={loading} table={promptCallsTable} />
      </div>
    </section>
  )
}

export default PromptCalls
