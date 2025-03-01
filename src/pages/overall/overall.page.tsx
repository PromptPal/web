import { useQuery as useGraphQLQuery } from '@apollo/client'
import { Link } from '@tanstack/react-router'
import { BarChart3, CalendarDays, Loader2, PlusCircle } from 'lucide-react'
import HelpIntegration from '../../components/Helps/Intergation'
import ProjectTopPromptsByDate from '../../components/Project/TopPromptsByDate'
import { graphql } from '../../gql'
import { useProjectId } from '../../hooks/route'
import { cn } from '../../utils'

const q = graphql(`
  query getOverallProjectData($id: Int!) {
    project(id: $id) {
      id
      name
      promptMetrics {
        recentCounts {
          prompt {
            id
            name
          }
          count
        }
        last7Days {
          date
          prompts {
            count
            prompt {
              id
              name
            }
          }
        }
      }
    }
  }
`)

function OverallPage() {
  const p = useProjectId()
  const { data, loading } = useGraphQLQuery(q, {
    variables: {
      id: p ?? -1,
    },
    skip: !p,
  })

  const pj = data?.project

  if (!p || !pj) {
    return (
      <div className='flex items-center justify-center flex-col min-h-[50vh] gap-6'>
        <div className='p-6 rounded-full bg-linear-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 shadow-xl backdrop-blur-xl'>
          <BarChart3 className='w-16 h-16 text-blue-400' />
        </div>
        <h1 className='text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500'>
          No Project Selected
        </h1>
        <p className='text-gray-400 text-lg'>
          Create a new project to get started
        </p>
        <Link
          to='/projects/new'
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
            'bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200',
            'font-medium shadow-lg shadow-blue-500/20',
          )}
        >
          <PlusCircle className='w-4 h-4' />
          Create New Project
        </Link>
      </div>
    )
  }

  return (
    <div className='w-full flex flex-col gap-6'>
      <section className='w-full backdrop-blur-xs bg-linear-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 shadow-xl rounded-xl overflow-hidden'>
        <div className='p-6 border-b border-gray-700/50'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-3'>
              <h1 className='text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500'>
                {pj?.name}
              </h1>
              <span className='text-sm text-gray-500 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700/50'>
                Last 7 days overview
              </span>
            </div>
          </div>

          {loading && (
            <div className='flex items-center gap-2 text-muted-foreground'>
              <Loader2 className='w-4 h-4 animate-spin' />
              <span>Loading data...</span>
            </div>
          )}
        </div>

        <div className='grid gap-8'>
          {(!pj?.promptMetrics.recentCounts.length ||
            !pj?.promptMetrics.last7Days.length) && (
            <div className='rounded-xl bg-linear-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 p-8 backdrop-blur-xs shadow-xl'>
              <HelpIntegration />
            </div>
          )}

          {pj?.promptMetrics.last7Days.length > 0 && (
            <ProjectTopPromptsByDate
              recentCounts={pj?.promptMetrics.last7Days}
              loading={loading}
            />
          )}
        </div>
      </section>
    </div>
  )
}

export default OverallPage
