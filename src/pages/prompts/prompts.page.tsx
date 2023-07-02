import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { PromptObject, getPromptList } from '../../service/prompt'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import SimpleTable from '../../components/Table/SimpleTable'
import { Heading, Switch, Tooltip } from '@chakra-ui/react'
import { useAtom, useAtomValue } from 'jotai'
import { projectAtom } from '../../stats/project'

const columnHelper = createColumnHelper<PromptObject>()
const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('hid', {
    header: 'Hash ID',
    // TODO: add copy button
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
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('create_time', {
    header: 'Created At',
    cell: (info) => new Intl.DateTimeFormat()
      .format(new Date(info.getValue())),
  })
]

function PromptsPage() {
  const currentProject = useAtomValue(projectAtom)
  // TODO: handle the page that without project id
  const pid = ~~(useParams().id ?? currentProject ?? '0')

  const { data: prompts } = useInfiniteQuery({
    queryKey: ['projects', pid, 'prompts'],
    enabled: !!pid,
    queryFn: ({ pageParam, signal }) => {
      let cursor = pageParam
      if (!cursor) {
        cursor = 1 << 30
      }
      return getPromptList(pid, cursor, signal)
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) {
        return 1 << 30
      }
      const d = lastPage.data
      if (d.length === 0) {
        return null
      }
      return d[d.length - 1].id
    }
  })

  const table = useReactTable({
    data: prompts?.pages.flatMap((page) => page.data) ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <div className='flex items-center justify-between'>
        <Heading>
          Prompts

        </Heading>
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