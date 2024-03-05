import { Link, useParams } from 'react-router-dom'
import { Stack, Title, Button, Card } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
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
      promptMetrics {
        recentCounts {
          prompt {
            id
            name
          }
          count
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
  const pid = useParams().pid ?? '0'

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

  const [isOpen, {
    close: onClose, open: onOpen,
  }] = useDisclosure()

  return (
    <Stack className='w-full'>
      <Card>
        <div className='flex justify-between items-center mb-4'>
          <div className='ml-4 mt-4 flex'>
            <Title size='lg'>
              {project?.name}
            </Title>
            <span color={'gray.500'}>recent 7 days</span>
          </div>
          <Button variant='filled' className='text-white' component={Link} to={`/${pid}/edit`}>
            Edit
          </Button>
        </div>
        <div>
          <ProjectTopPromptsChart recentCounts={project?.promptMetrics.recentCounts} />
        </div>
      </Card>

      <Stack>
        <div className='w-full flex justify-between items-center'>
          <Title order={4} size='xl'>
            Open Tokens
          </Title>
          <Button
            variant='gradient'
            gradient={{ from: 'blue', to: 'cyan' }}
            disabled={(openTokens?.length ?? 0) >= 20}
            onClick={onOpen}
          >
            New Token
          </Button>
        </div>
        <SimpleTable table={table} />
      </Stack>

      <CreateOpenTokenModal isOpen={isOpen} onClose={onClose} projectId={~~pid} />
    </Stack>
  )
}

export default ProjectPage