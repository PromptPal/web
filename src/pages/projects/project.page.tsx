import { graphql } from '@/gql'
import { useQuery as useGraphQLQuery } from '@apollo/client'
import { Link, useParams } from '@tanstack/react-router'
import { Pencil } from 'lucide-react'
import OpenTokenListOfProject from '../../components/OpenToken/List'
import ProjectTopPromptsCount from '../../components/Project/TopPromptsCount'

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
          apiValidateEnabled
          apiValidatePath
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

function ProjectPage() {
  const pid = useParams({ strict: false }).pid ?? '0'

  const { data: projectData } = useGraphQLQuery(q, {
    variables: {
      id: ~~pid,
    },
  })
  const project = projectData?.project
  const openTokens = project?.openTokens.edges ?? []

  return (
    <div className='w-full flex flex-col gap-6'>
      <section className='w-full backdrop-blur-sm bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 shadow-xl rounded-xl overflow-hidden'>
        <div className='p-6 border-b border-gray-700/50'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-3'>
              <h1 className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500'>
                {project?.name}
              </h1>
              <span className='text-sm text-gray-500 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700/50'>
                recent 7 days
              </span>
            </div>
            <Link
              to={'/$pid/edit'}
              params={{ pid }}
              className='inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 shadow-lg shadow-blue-500/20'
            >
              <Pencil className='w-4 h-4' />
              Edit
            </Link>
          </div>
        </div>
        <div className='p-6'>
          <ProjectTopPromptsCount
            recentCounts={project?.promptMetrics.recentCounts}
          />
        </div>
      </section>

      <OpenTokenListOfProject pid={~~pid} openTokens={openTokens} />
    </div>
  )
}

export default ProjectPage
