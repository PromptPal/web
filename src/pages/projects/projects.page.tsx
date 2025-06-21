import { useQuery as useGraphQLQuery } from '@apollo/client'
import { Link } from '@tanstack/react-router'
import { Plus, Sparkles, Folder } from 'lucide-react'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import ProjectCardItem from '../../components/Project/CardItem'
import { graphql } from '../../gql'
import { ProjectEmptyState } from './components/ProjectEmptyState'

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
    <div className='w-full space-y-8'>
      {/* Header Section with Gradient Background */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='relative overflow-hidden'
      >
        <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10 blur-3xl' />
        <div className='relative backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 shadow-2xl rounded-2xl'>
          <div className='p-8'>
            <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
              <div className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500'>
                    <Folder className='w-6 h-6 text-white' />
                  </div>
                  <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent'>
                    Projects
                  </h1>
                </div>
                <p className='text-gray-300 max-w-xl'>
                  Organize your AI prompts and providers into projects for better workflow management
                </p>
                <div className='flex items-center gap-4 text-sm'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
                    <span className='text-gray-400'>
                      {tableData.length}
                      {' '}
                      Active Projects
                    </span>
                  </div>
                </div>
              </div>
              <Link
                to='/projects/new'
                className='group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300' />
                <Plus className='w-4 h-4 relative z-10' />
                <span className='relative z-10'>Create Project</span>
                <Sparkles className='w-4 h-4 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Projects Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
      >
        {tableData.map((row, index) => (
          <motion.div
            key={row.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            <ProjectCardItem project={row} />
          </motion.div>
        ))}
        {tableData.length === 0 && <ProjectEmptyState />}
      </motion.div>
    </div>
  )
}

export default ProjectsPage
