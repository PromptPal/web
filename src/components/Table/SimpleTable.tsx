import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { Table as TableInstance, flexRender } from '@tanstack/react-table'
import { useAutoAnimate } from '@formkit/auto-animate/react'

type SimpleTableProps<T> = {
  table: TableInstance<T>
}

function SimpleTable<T>(props: SimpleTableProps<T>) {
  const { table } = props

  const [autoAnimateRef] = useAutoAnimate()

  return (
    <TableContainer>
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
        <Tbody ref={autoAnimateRef}>
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
    </TableContainer>
  )
}

export default SimpleTable