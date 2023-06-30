import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { Table as TableInstance, flexRender } from '@tanstack/react-table'

type SimpleTableProps<T> = {
  table: TableInstance<T>
}

function SimpleTable<T>(props: SimpleTableProps<T>) {
  const { table } = props
  return (
    <Table>
      <Thead>
        {table.getHeaderGroups().map(hg => (
          <Tr key={hg.id}>
            {hg.headers.map(header => (
              <Th key={header.id}>
                {
                  header.isPlaceholder ?
                    null :
                    flexRender(
                      header.column.columnDef.header, header.getContext()
                    )
                }
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map(row => (
          <Tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <Td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default SimpleTable