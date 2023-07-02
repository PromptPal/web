import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProjectDetail } from '../../service/project'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Stack, Heading } from '@chakra-ui/react'
import { OpenToken, listOpenTokens } from '../../service/open-token'
import SimpleTable from '../../components/Table/SimpleTable'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'

const columnHelper = createColumnHelper<OpenToken>()
const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  })
]

function ProjectPage() {
  const pid = useParams().id ?? '0'

  const { data: project } = useQuery({
    queryKey: ['projects', ~~pid],
    enabled: !!pid,
    queryFn: ({ signal }) => getProjectDetail(~~pid, signal)
  })

  const { data: openTokens } = useQuery({
    queryKey: ['projects', ~~pid, 'openTokens'],
    enabled: !!pid,
    queryFn: ({ signal }) => listOpenTokens(~~pid, 1 << 30, signal)
  })

  const table = useReactTable({
    data: openTokens?.data ?? [],
    getCoreRowModel: getCoreRowModel(),
    columns,
  })

  return (
    <Stack>
      <Heading>
        {project?.name}
      </Heading>

      <SimpleTable table={table} />
    </Stack>
  )
}

export default ProjectPage