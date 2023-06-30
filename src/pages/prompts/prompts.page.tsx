import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { getPromptList } from '../../service/prompt'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import SimpleTable from '../../components/Table/SimpleTable'
import { getProjectDetail } from '../../service/project'

const columnHelper = createColumnHelper<any>()
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
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('create_time', {
    header: 'Created At',
    cell: (info) => new Intl.DateTimeFormat()
      .format(new Date(info.getValue())),
  })
]

function PromptsPage() {
  // TODO: handle the page that without project id
  const pid = ~~(useParams().id ?? '0')

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
        <h1>Prompts</h1>
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