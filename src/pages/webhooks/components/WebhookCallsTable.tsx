import { WebhookCall } from '@/gql/graphql'
import { ApolloError } from '@apollo/client'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  MoreHorizontal,
  RefreshCw,
  XCircle,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import LakeModal from '@annatarhe/lake-ui/modal'
import { WEBHOOK_STATUS_COLORS } from '../types'

interface WebhookCallsTableProps {
  calls: Omit<WebhookCall, 'webhook'>[]
  loading: boolean
  error?: ApolloError
  onRefetch: () => void
}

const columnHelper = createColumnHelper<Omit<WebhookCall, 'webhook'>>()

// Helper function to format JSON content with proper styling
function formatJsonContent(content: string) {
  try {
    const parsed = JSON.parse(content || '{}')
    return JSON.stringify(parsed, null, 2)
  }
  catch {
    return content || 'Invalid JSON'
  }
}

export function WebhookCallsTable({ calls, loading, error, onRefetch }: WebhookCallsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }])
  const [selectedCall, setSelectedCall] = useState<WebhookCall | null>(null)

  const columns = useMemo(
    () => [
      columnHelper.accessor('statusCode', {
        header: 'Status',
        cell: ({ getValue }) => {
          const statusCode = getValue() ?? 0
          if (statusCode === 0) {
            return (
              <div className='flex items-center gap-2'>
                <Clock className='h-4 w-4 text-yellow-500' />
                <span className='px-2 py-1 text-xs rounded-full font-medium text-yellow-500'>
                  Pending
                </span>
              </div>
            )
          }
          const status = statusCode >= 200 && statusCode < 300 ? 'success' : statusCode >= 400 ? 'error' : 'pending'
          const statusColors = WEBHOOK_STATUS_COLORS[status] || WEBHOOK_STATUS_COLORS.error

          return (
            <div className='flex items-center gap-2'>
              {status === 'success'
                ? (
                    <CheckCircle className='h-4 w-4 text-green-500' />
                  )
                : status === 'error'
                  ? (
                      <XCircle className='h-4 w-4 text-red-500' />
                    )
                  : (
                      <Clock className='h-4 w-4 text-yellow-500' />
                    )}
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusColors}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          )
        },
      }),
      columnHelper.accessor('createdAt', {
        header: 'Timestamp',
        cell: ({ getValue }) => {
          const date = new Date(getValue())
          return (
            <div className='space-y-1'>
              <div className='text-sm font-medium text-gray-900 dark:text-white'>
                {date.toLocaleDateString()}
              </div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>
                {date.toLocaleTimeString()}
              </div>
            </div>
          )
        },
      }),
      columnHelper.accessor('requestBody', {
        header: 'Payload',
        cell: ({ getValue, row }) => {
          const payload = getValue()
          const preview = payload.length > 100 ? payload.substring(0, 100) + '...' : payload

          return (
            <div className='space-y-1'>
              <code className='text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded'>
                {preview}
              </code>
              <button
                onClick={() => setSelectedCall(row.original)}
                className='text-xs text-violet-600 dark:text-violet-400 hover:underline'
              >
                View details
              </button>
            </div>
          )
        },
      }),
      columnHelper.accessor('requestBody', {
        header: 'Response',
        cell: ({ getValue }) => {
          const response = getValue()
          if (!response) {
            return <span className='text-xs text-gray-400'>No response</span>
          }

          const preview = response.length > 50 ? response.substring(0, 50) + '...' : response
          return (
            <code className='text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded'>
              {preview}
            </code>
          )
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <button
            onClick={() => setSelectedCall(row.original)}
            className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
          >
            <Eye className='h-4 w-4' />
          </button>
        ),
      }),
    ],
    [],
  )

  const table = useReactTable({
    data: calls,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (loading) {
    return (
      <div className='p-8 text-center'>
        <div className='w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
        <p className='text-gray-500 dark:text-gray-400'>Loading webhook calls...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-8 text-center space-y-4'>
        <AlertCircle className='h-8 w-8 text-red-500 mx-auto' />
        <div>
          <h3 className='font-medium text-gray-900 dark:text-white'>
            Failed to load webhook calls
          </h3>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            {error.message}
          </p>
        </div>
        <button
          onClick={onRefetch}
          className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
        >
          <RefreshCw className='h-4 w-4' />
          Retry
        </button>
      </div>
    )
  }

  if (calls.length === 0) {
    return (
      <div className='p-12 text-center'>
        <Clock className='h-12 w-12 text-gray-400 mx-auto mb-4' />
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
          No webhook calls yet
        </h3>
        <p className='text-gray-500 dark:text-gray-400'>
          Webhook calls will appear here when events are triggered.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className='border-b border-gray-200 dark:border-gray-700'>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
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
          <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className='hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors'
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className='px-6 py-4'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Call Detail Modal */}
      <LakeModal
        isOpen={!!selectedCall}
        onClose={() => setSelectedCall(null)}
        title='Webhook Call Details'
      >
        {selectedCall && (
          <div className='p-6 space-y-6'>
            {/* Status and timestamp */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Status
                </label>
                <div className='mt-1 flex items-center gap-2'>
                  {selectedCall.status === 'success'
                    ? (
                        <CheckCircle className='h-4 w-4 text-green-500' />
                      )
                    : (
                        <XCircle className='h-4 w-4 text-red-500' />
                      )}
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    WEBHOOK_STATUS_COLORS[selectedCall.statusCode] || WEBHOOK_STATUS_COLORS.error
                  }`}
                  >
                    {selectedCall.statusCode}
                  </span>
                </div>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Timestamp
                </label>
                <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                  {new Date(selectedCall.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Payload */}
            <div>
              <label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                Request Payload
              </label>
              <pre className='mt-2 p-4 bg-black/10 rounded-lg text-xs text-gray-400 overflow-x-auto border border-white/5 font-mono'>
                {formatJsonContent(selectedCall.requestBody)}
              </pre>
            </div>

            {/* Response */}
            <div>
              <label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                Response
              </label>
              <pre className='mt-2 p-4 bg-black/10 rounded-lg text-xs text-gray-400 overflow-x-auto border border-white/5 font-mono'>
                {selectedCall.responseBody || 'No response received'}
              </pre>
            </div>
          </div>
        )}
      </LakeModal>
    </>
  )
}
