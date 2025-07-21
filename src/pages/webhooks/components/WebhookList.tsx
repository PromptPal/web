import { AllWebhooksListQuery } from '@/gql/graphql'
import { useProjectId } from '@/hooks/route'
import InputField from '@annatarhe/lake-ui/form-input-field'
import { useMutation } from '@apollo/client'
import { Link } from '@tanstack/react-router'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  HeaderGroup,
  RowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table'
import {
  Activity,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Edit,
  MoreHorizontal,
  Search,
  Trash2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { WEBHOOK_STATUS_COLORS } from '../types'
import { deleteWebhook } from '../webhook.query'

type Webhook = AllWebhooksListQuery['webhooks']['edges'][number]

// Define the webhook type structure based on our GraphQL query
// Table header component
interface TableHeaderProps {
  headerGroups: HeaderGroup<Webhook>[]
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
  rows: RowModel<Webhook>['rows']
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
        <Search className='absolute left-3 top-1/2 transform translate-y-0.5  h-5 w-5 text-gray-400 z-10' />
        <InputField
          label='Search Webhooks'
          type='search'
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
  const projectId = useProjectId()

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
              // to={`/${projectId}/webhooks/${row.original.id}`}
              to='/$pid/webhooks/$id'
              params={{ pid: projectId.toString(), id: row.original.id.toString() }}
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
            <InputField
              value={getValue()}
              readOnly
              className='bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 w-full'
              disabled
            />
          </div>
        ),
      }),
      columnHelper.accessor('event', {
        header: 'Event',
        cell: ({ getValue }) => {
          const events = getValue()
          return (
            <div className='flex flex-wrap gap-1'>
              <span
                className='px-2 py-1 text-xs bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200 rounded-full'
              >
                {events}
              </span>
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
              to='/$pid/webhooks/$id/edit'
              params={{ pid: projectId.toString(), id: row.original.id.toString() }}

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
