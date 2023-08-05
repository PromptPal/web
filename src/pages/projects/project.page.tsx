import { useParams } from 'react-router-dom'
import { Stack, Heading, Button, useDisclosure, Card, CardHeader, CardBody, Text } from '@chakra-ui/react'
import SimpleTable from '../../components/Table/SimpleTable'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import CreateOpenTokenModal from '../../components/OpenToken/CreateOpenTokenModal'
import ProjectTopPromptsChart from '../../components/Project/TopPromptsChart'
import { useQuery as useGraphQLQuery } from '@apollo/client'
import { graphql } from '@/gql'
import { OpenToken } from '@/gql/graphql'

const q = graphql(`
  query fetchProject($id: Int!) {
    project(id: $id) {
      id
      name
      enabled
      openAIModel
      openAIBaseURL
      openAITemperature
      openTokens {
        count
        edges {
          id
          name
          description
          expireAt
        }
      }
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

  const { data: projectData } = useGraphQLQuery(q, {
    variables: {
      id: ~~pid
    }
  })
  const project = projectData?.project
  const openTokens = project?.openTokens.edges ?? []

  const table = useReactTable({
    data: openTokens,
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
            isDisabled={(openTokens?.length ?? 0) >= 20}
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