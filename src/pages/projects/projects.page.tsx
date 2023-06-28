import { useInfiniteQuery } from '@tanstack/react-query'
import { getProjectList } from '../../service/project'
import { Outlet } from 'react-router-dom'

type ProjectsPageProps = {
}

function ProjectsPage(props: ProjectsPageProps) {
  const { data: projects } = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: ({ pageParam, signal }) => pageParam && getProjectList(pageParam, signal),
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

  return (
    <div>
      <div className='flex items-center justify-between'>
        <h1>Projects</h1>
        <button className='daisyui-btn daisyui-btn-primary'>
          New Project
        </button>
      </div>
      <div className=' daisyui-divider' />

      <div>
        table list
      </div>
      <Outlet />
    </div>
  )
}

export default ProjectsPage