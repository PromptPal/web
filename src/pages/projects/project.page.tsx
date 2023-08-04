import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { getProjectDetail } from '../../service/project'
import { Stack, Heading, Button, useDisclosure, Card, CardHeader, CardBody, Text } from '@chakra-ui/react'
import { OpenToken, listOpenTokens } from '../../service/open-token'
import SimpleTable from '../../components/Table/SimpleTable'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import CreateOpenTokenModal from '../../components/OpenToken/CreateOpenTokenModal'
import ProjectTopPromptsChart from '../../components/Project/TopPromptsChart'
import { useQuery as useGraphQLQuery } from '@apollo/client'

import { graphql } from '../../gql'

const q = graphql(`
  query fetchProject($id: Int!) {
    project(id: $id) {
      id
    }
  }
`)

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

  const { data } = useGraphQLQuery(q, {
    variables: {
      id: ~~pid
    }
  })

  console.log('dd', data)
  

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

  const { onClose, onOpen, isOpen } = useDisclosure()

  return (
    <Stack className='w-full'>
      <Card>
        <CardHeader display='flex' flexDirection='row' alignItems='flex-end'>
          <Heading size='lg'>
            {project?.name}
          </Heading>
          <Text ml={2} color={'gray.500'} fontSize={'xs'}>recent 7 days</Text>
        </CardHeader>
        <CardBody>
          <ProjectTopPromptsChart projectId={~~pid} />
        </CardBody>
      </Card>

      <Stack>
        <Stack flexDirection='row' justifyContent='space-between'>
          <Heading variant='h4' size='xl'>
            Open Tokens
          </Heading>
          <Button
            colorScheme='teal'
            isDisabled={(openTokens?.data.length ?? 0) >= 20}
            onClick={onOpen}
          >
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