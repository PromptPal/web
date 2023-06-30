import { useInfiniteQuery } from '@tanstack/react-query'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Project, getProjectList } from '../../service/project'
import { Link, Outlet } from 'react-router-dom'
import SimpleTable from '../../components/Table/SimpleTable'

const columnHelper = createColumnHelper<Project>()
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

function ProjectsPage() {
  const { data: projects } = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: ({ pageParam, signal }) => {
      let cursor = pageParam
      if (!cursor) {
        cursor = 1 << 30
      }
      return getProjectList(cursor, signal)
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
    data: projects?.pages.flatMap((page) => page.data) ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <div className='flex items-center justify-between'>
        <h1>Projects</h1>
        <Link to='/projects/new' className='daisyui-btn daisyui-btn-primary'>
          New Project
        </Link>
      </div>
      <div className=' daisyui-divider' />
      <SimpleTable table={table} />
      <Outlet />
    </div>
  )
}

export default ProjectsPage