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
        <div className='absolute inset-0 flex items-center justify-center bg-gray-900/20 backdrop-blur-xs z-10'>
          <Loader2 className='w-6 h-6 text-blue-400 animate-spin' />
        </div>
      )}
      <table className='w-full border-separate border-spacing-0'>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className='text-left py-3 px-4 text-sm font-medium text-gray-400 bg-gray-800/50 first:rounded-l-lg last:rounded-r-lg'
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
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className='group transition-colors hover:bg-gray-800/30'
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className='py-3 px-4 text-sm border-b border-gray-700/50 group-last:border-0'
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SimpleTable
