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
      <div className='flex items-center justify-center flex-col min-h-[50vh] gap-4'>
        <div className='p-4 rounded-full bg-primary/10'>
          <BarChart3 className='w-12 h-12 text-primary' />
        </div>
        <h1 className='text-2xl font-bold'>No Project Selected</h1>
        <p className='text-muted-foreground mb-4'>
          Create a new project to get started
        </p>
        <Link
          to='/projects/new'
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
            'bg-primary text-primary-foreground hover:bg-primary/90',
            'font-medium transition-colors',
          )}
        >
          <PlusCircle className='w-4 h-4' />
          Create New Project
        </Link>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h1 className='text-2xl font-bold tracking-tight'>{pj?.name}</h1>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <CalendarDays className='w-4 h-4' />
            <span>Last 7 days overview</span>
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
          <div className='rounded-xl border border-border bg-gradient-to-br from-background/50 to-background p-8 backdrop-blur-xl'>
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
    </div>
  )
}

export default OverallPage
