import { useInfiniteQuery } from '@tanstack/react-query'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Link } from 'react-router-dom'
import SimpleTable from '../../components/Table/SimpleTable'
import { Button, Heading, Link as LinkUI, Stack, StackDivider, Switch, Tooltip } from '@chakra-ui/react'
import { useQuery as useGraphQLQuery } from '@apollo/client'
import { useMemo } from 'react'
import { graphql } from '../../gql'
import { ProjectsQuery } from '../../gql/graphql'

const columnHelper = createColumnHelper<ProjectsQuery['projects']['edges'][0]>()
const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('enabled', {
    header: 'Enabled',
    cell: (info) => (
      <Tooltip label={`please use 'edit' button to update ${info.getValue() ? 'disabled' : 'enabled'}`}>
        <div>
          <Switch
            isChecked={info.getValue()}
            isDisabled
          />
        </div>
      </Tooltip>
    ),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created At',
    cell: (info) => new Intl.DateTimeFormat()
      .format(new Date(info.getValue())),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: (info) => (
      <Stack
        spacing={2}
        flexDirection='row'
      >
        <Button
          as={Link}
          size='xs'
          to={`/projects/${info.row.getValue('id')}`}
        >
          View
        </Button>
        <Button
          as={Link}
          size='xs'
          to={`/projects/${info.row.getValue('id')}/edit`}
        >
          Edit
        </Button>
      </Stack>
    )
  })
]

const q = graphql(`
  query projects($pagination: PaginationInput!) {
    projects(pagination: $pagination) {
      count
      edges {
        id
        name
        enabled
        createdAt
      }
    }
  }
`)

function ProjectsPage() {
  const { data: projects } = useGraphQLQuery(q, {
    variables: {
      pagination: {
        limit: 100,
        offset: 0
      }
    }
  })

  const tableData = useMemo(() => {
    return projects?.projects.edges ?? []
  }, [projects])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <div className='flex items-center justify-between'>
        <Heading>Projects</Heading>
        <Link to='/projects/new' className='daisyui-btn daisyui-btn-primary'>
          New Project
        </Link>
      </div>
      <div className=' daisyui-divider' />
      <SimpleTable table={table} />
    </div>
  )
}

export default ProjectsPage