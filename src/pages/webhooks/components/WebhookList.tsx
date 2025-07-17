import { useMemo, useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MoreHorizontal,
  Edit,
  Trash2,
  Activity,
  AlertCircle,
  Search,
} from 'lucide-react'
import { useMutation } from '@apollo/client'
import { deleteWebhook } from '../webhook.query'
import { WEBHOOK_STATUS_COLORS } from '../types'

// Define the webhook type structure based on our GraphQL query
interface Webhook {
  id: number
  name: string
  url: string
  events: string[]
  enabled: boolean
  createdAt: string
  updatedAt: string
}

// Table header component
interface TableHeaderProps {
  headerGroups: ReturnType<typeof useReactTable>['getHeaderGroups']
}

function TableHeader({ headerGroups }: TableHeaderProps) {
  return (
    <thead>
      {headerGroups.map(headerGroup => (
        <tr key={headerGroup.id} className='border-b border-gray-200 dark:border-gray-700'>
          {headerGroup.headers.map(header => (
            <th
              key={header.id}
              className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
            >
              {header.isPlaceholder
                ? null
                : (
                    <div
                      className={`flex items-center gap-2 ${
                        header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <div className='flex flex-col'>
                          {header.column.getIsSorted() === 'asc'
                            ? (
                                <ChevronUp className='h-3 w-3' />
                              )
                            : header.column.getIsSorted() === 'desc'
                              ? (
                                  <ChevronDown className='h-3 w-3' />
                                )
                              : (
                                  <MoreHorizontal className='h-3 w-3 opacity-50' />
                                )}
                        </div>
                      )}
                    </div>
                  )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  )
}

// Table body component
interface TableBodyProps {
  rows: ReturnType<typeof useReactTable>['getRowModel']['rows']
}

function TableBody({ rows }: TableBodyProps) {
  return (
    <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
      {rows.map(row => (
        <tr
          key={row.id}
          className='hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors'
        >
          {row.getVisibleCells().map(cell => (
            <td key={cell.id} className='px-4 py-4 whitespace-nowrap'>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

// No results component
function NoResults() {
  return (
    <div className='text-center py-12'>
      <AlertCircle className='h-8 w-8 text-gray-400 mx-auto mb-3' />
      <p className='text-gray-500 dark:text-gray-400'>
        No webhooks found matching your search.
      </p>
    </div>
  )
}

// Search and filter bar component
interface SearchBarProps {
  globalFilter: string
  setGlobalFilter: (value: string) => void
  webhooks: Webhook[]
}

function SearchBar({ globalFilter, setGlobalFilter, webhooks }: SearchBarProps) {
  return (
    <div className='mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between'>
      <div className='relative flex-1 max-w-md'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
        <input
          type='text'
          placeholder='Search webhooks...'
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          className='w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent'
        />
      </div>

      <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
        <Activity className='h-4 w-4' />
        {webhooks.filter(w => w.enabled).length}
        {' '}
        of
        {webhooks.length}
        {' '}
        active
      </div>
    </div>
  )
}

interface WebhookListProps {
  webhooks: Webhook[]
  onRefetch: () => void
}

const columnHelper = createColumnHelper<Webhook>()

export function WebhookList({ webhooks, onRefetch }: WebhookListProps) {
  const params = useParams({ from: '/$pid/webhooks' })
  const projectId = params.pid

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const [deleteWebhookMutation] = useMutation(deleteWebhook, {
    onCompleted: () => {
      onRefetch()
    },
    onError: (error) => {
      console.error('Failed to delete webhook:', error)
    },
  })

  const handleDelete = async (webhookId: number) => {
    if (confirm('Are you sure you want to delete this webhook? This action cannot be undone.')) {
      deleteWebhookMutation({
        variables: { id: webhookId },
      })
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <div className={`w-3 h-3 rounded-full ${
              row.original.enabled
                ? 'bg-green-500 shadow-lg shadow-green-500/50'
                : 'bg-gray-400 dark:bg-gray-600'
            }`}
            />
            <Link
              to={`/${projectId}/webhooks/${row.original.id}`}
              className='font-medium text-gray-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors'
            >
              {row.original.name}
            </Link>
          </div>
        ),
      }),
      columnHelper.accessor('url', {
        header: 'Endpoint URL',
        cell: ({ getValue }) => (
          <div className='flex items-center gap-2'>
            <code className='px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded font-mono max-w-xs truncate'>
              {getValue()}
            </code>
            <button
              onClick={() => window.open(getValue(), '_blank')}
              className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            >
              <ExternalLink className='h-3 w-3' />
            </button>
          </div>
        ),
      }),
      columnHelper.accessor('events', {
        header: 'Events',
        cell: ({ getValue }) => {
          const events = getValue()
          return (
            <div className='flex flex-wrap gap-1'>
              {events.slice(0, 2).map(event => (
                <span
                  key={event}
                  className='px-2 py-1 text-xs bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200 rounded-full'
                >
                  {event}
                </span>
              ))}
              {events.length > 2 && (
                <span className='px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded-full'>
                  +
                  {events.length - 2}
                  {' '}
                  more
                </span>
              )}
            </div>
          )
        },
      }),
      columnHelper.accessor('enabled', {
        header: 'Status',
        cell: ({ getValue }) => (
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
            getValue()
              ? WEBHOOK_STATUS_COLORS.success
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          }`}
          >
            {getValue() ? 'Active' : 'Disabled'}
          </span>
        ),
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created',
        cell: ({ getValue }) => (
          <span className='text-sm text-gray-500 dark:text-gray-400'>
            {new Date(getValue()).toLocaleDateString()}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Link
              to={`/${projectId}/webhooks/${row.original.id}/edit`}
              className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
            >
              <Edit className='h-4 w-4' />
            </Link>
            <button
              onClick={() => handleDelete(row.original.id)}
              className='p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors'
            >
              <Trash2 className='h-4 w-4' />
            </button>
          </div>
        ),
      }),
    ],
    [projectId, onRefetch, deleteWebhookMutation],
  )

  const table = useReactTable({
    data: webhooks,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className='p-6'>
      <SearchBar
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        webhooks={webhooks}
      />

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <TableHeader headerGroups={table.getHeaderGroups()} />
          <TableBody rows={table.getRowModel().rows} />
        </table>
      </div>

      {/* No results */}
      {table.getRowModel().rows.length === 0 && <NoResults />}
    </div>
  )
}
