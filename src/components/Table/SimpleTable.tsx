import { Table } from '@mantine/core'
import { Table as TableInstance, flexRender } from '@tanstack/react-table'
import { useAutoAnimate } from '@formkit/auto-animate/react'

type SimpleTableProps<T> = {
  table: TableInstance<T>
  loading?: boolean
}

function SimpleTable<T>(props: SimpleTableProps<T>) {
  const { table } = props

  const [autoAnimateRef] = useAutoAnimate()

  return (
    <Table>
      <Table.Thead>
        {table.getHeaderGroups().map(hg => (
          <Table.Tr key={hg.id}>
            {hg.headers.map(header => (
              <Table.Th key={header.id}>
                {
                  header.isPlaceholder ?
                    null :
                    flexRender(
                      header.column.columnDef.header, header.getContext()
                    )
                }
              </Table.Th>
            ))}
          </Table.Tr>
        ))}
      </Table.Thead>
      <Table.Tbody ref={autoAnimateRef}>
        {table.getRowModel().rows.map(row => (
          <Table.Tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <Table.Td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}

export default SimpleTable