import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProjectDetail } from '../../service/project'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Stack, Heading, Button, useDisclosure } from '@chakra-ui/react'
import { OpenToken, listOpenTokens } from '../../service/open-token'
import SimpleTable from '../../components/Table/SimpleTable'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import CreateOpenTokenModal from '../../components/OpenToken/CreateOpenTokenModal'

const columnHelper = createColumnHelper<OpenToken>()
const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'token',
    header: 'Token',
    cell: '-',
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

  const { onClose, isOpen } = useDisclosure()

  return (
    <Stack>
      <Heading>
        {project?.name}
      </Heading>

      <Stack>
        <Stack>
          <Heading>
            Open Tokens
          </Heading>
          <Button isDisabled={(openTokens?.data.length ?? 0) >= 20}>
            New Token
          </Button>
        </Stack>
        <SimpleTable table={table} />
      </Stack>

      <CreateOpenTokenModal isOpen={isOpen} onClose={onClose} projectId={~~pid} />

    </Stack>
  )
}

export default ProjectPage