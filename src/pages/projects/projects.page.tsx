import { useQuery as useGraphQLQuery } from '@apollo/client'
import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useMemo } from 'react'
import ProjectCardItem from '../../components/Project/CardItem'
import { graphql } from '../../gql'

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
        offset: 0,
      },
    },
  })

  const tableData = useMemo(() => {
    return projects?.projects.edges ?? []
  }, [projects])

  return (
    <div className='w-full space-y-6'>
      <section className='w-full backdrop-blur-xs bg-linear-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 shadow-xl rounded-xl overflow-hidden'>
        <div className='p-6'>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <h1 className='text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500'>
                Projects
              </h1>
              <p className='text-sm text-gray-400'>
                Manage your AI projects and their configurations
              </p>
            </div>
            <Link
              to='/projects/new'
              className='inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 shadow-lg shadow-blue-500/20'
            >
              <Plus className='w-4 h-4' />
              New Project
            </Link>
          </div>
        </div>
      </section>

      <div className='grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
        {tableData.map(row => (
          <ProjectCardItem key={row.id} project={row} />
        ))}
        {tableData.length === 0 && (
          <div className='col-span-full flex flex-col items-center justify-center p-12 rounded-xl backdrop-blur-xs bg-linear-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50'>
            <p className='text-lg text-gray-400 text-center'>
              No projects yet. Create your first project to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectsPage
