import { Link, useParams } from 'react-router-dom'
import { ColumnDef, createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import SimpleTable from '../../components/Table/SimpleTable'
import { Badge, Button, Heading, Stack, Switch, Tooltip } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { useQuery as useGraphQLQuery } from '@apollo/client'
import { projectAtom } from '../../stats/project'
import { graphql } from '../../gql'
import { FetchPromptsQuery } from '../../gql/graphql'

const columnHelper = createColumnHelper<FetchPromptsQuery['prompts']['edges'][0]>()
function usePromptListColumns(pid: number) {
  return useMemo<ColumnDef<FetchPromptsQuery['prompts']['edges'][0], any>[]>(() => {
    return [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
      }),
      // columnHelper.accessor('hid', {
      //   header: 'Hash ID',
      //   // TODO: add copy button
      //   cell: (info) => info.getValue(),
      // }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('enabled', {
        header: 'Enabled',
        cell: (info) => (
          <Tooltip label={`please use 'edit' button to update ${info.getValue() ? 'disabled' : 'enabled'}`}>
            <div>
              <Switch isChecked={info.getValue()} />
            </div>
          </Tooltip>
        ),
      }),
      columnHelper.accessor('tokenCount', {
        header: 'Token Count',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('publicLevel', {
        header: 'Public Level',
        cell: (info) => <Badge colorScheme='teal'>{info.getValue()}</Badge>,
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: (info) => new Intl.DateTimeFormat()
          .format(new Date(info.getValue())),
      }),
      columnHelper.display({
        header: 'Actions',
        cell: (info) => (
          <Stack gap={2}>
            <Button as={Link} size='sm' to={`/prompts/${info.row.getValue('id')}`}>View</Button>
            <Button
              as={Link}
              size='sm'
              to={`/prompts/${info.row.getValue('id')}/edit?pid=${pid}`}
            >
              Edit
            </Button>
          </Stack>
        )
      })
    ]

  }, [pid])
}

const q = graphql(`
  query fetchPrompts($id: Int!, $pagination: PaginationInput!) {
    prompts(projectId: $id, pagination: $pagination) {
      count
      edges {
        id
        hashId
        name
        publicLevel
        enabled
        tokenCount
        createdAt
      }
    }
  }
`)

function PromptsPage() {
  const currentProject = useAtomValue(projectAtom)
  // TODO: handle the page that without project id
  const pid = ~~(useParams().id ?? currentProject ?? '0')

  const { data } = useGraphQLQuery(q, {
    variables: {
      id: pid,
      pagination: {
        limit: 100,
        offset: 0,
      }
    },
    skip: !pid
  })


  const tableData = useMemo(() => {
    return data?.prompts.edges ?? []
  }, [data])

  const columns = usePromptListColumns(pid)

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between'>
        <Heading>Prompts</Heading>
        <Link to={`/prompts/new?pid=${pid}`} className='daisyui-btn daisyui-btn-primary'>
          New Prompt
        </Link>
      </div>
      <div className='daisyui-divider' />

      <SimpleTable table={table} />

    </div>
  )
}

export default PromptsPage