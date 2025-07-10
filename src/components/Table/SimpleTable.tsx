import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Table as TableInstance, flexRender } from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'

type SimpleTableProps<T> = {
  table: TableInstance<T>
  loading?: boolean
}

function SimpleTable<T>(props: SimpleTableProps<T>) {
  const { table, loading } = props

  const [autoAnimateRef] = useAutoAnimate()

  return (
    <div className='relative min-h-[200px] overflow-x-auto'>
      {loading && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm z-10 rounded-xl'>
          <div className='bg-gray-800/80 backdrop-blur-md rounded-lg p-4 shadow-lg border border-gray-700/50'>
            <Loader2 className='w-6 h-6 text-blue-400 animate-spin' />
          </div>
        </div>
      )}
      <div className='bg-gray-900/20 backdrop-blur-sm rounded-xl border border-gray-700/30 shadow-lg overflow-hidden'>
        <table className='w-full border-separate border-spacing-0'>
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(header => (
                  <th
                    key={header.id}
                    className='text-left py-4 px-6 text-sm font-semibold text-gray-200 bg-gray-800/60 backdrop-blur-sm border-b border-gray-700/40 first:rounded-tl-xl last:rounded-tr-xl'
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody ref={autoAnimateRef}>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className='group transition-all duration-200 hover:bg-gray-800/40 hover:shadow-sm'
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className='py-4 px-6 text-sm text-gray-300 border-b border-gray-700/30 group-last:border-0 group-hover:text-gray-100 transition-colors duration-200'
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SimpleTable
