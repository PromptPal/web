import { useQuery as useGraphQLQuery } from '@apollo/client'
import { Link } from '@tanstack/react-router'
import { BarChart3, Loader2, PlusCircle, TrendingUp, Calendar, Activity, Sparkles } from 'lucide-react'
import HelpIntegration from '../../components/Helps/Intergation'
import ProjectTopPromptsByDate from '../../components/Project/TopPromptsByDate'
import { graphql } from '../../gql'
import { useProjectId } from '../../hooks/route'

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
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-sky-900/5 to-slate-900 flex items-center justify-center p-4'>
        <div className='text-center space-y-8 max-w-md'>
          {/* Ambient background */}
          <div className='absolute inset-0 pointer-events-none'>
            <div className='absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-sky-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse' />
            <div className='absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl animate-pulse delay-1000' />
          </div>

          {/* Main content */}
          <div className='relative z-10 space-y-8'>
            <div className='bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/20'>
              <div className='w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-600/20 flex items-center justify-center mx-auto mb-6 border border-sky-500/30'>
                <BarChart3 className='w-10 h-10 text-sky-400' />
              </div>
              <h1 className='text-3xl font-bold text-white mb-3'>
                No Project Selected
              </h1>
              <p className='text-gray-300 text-lg leading-relaxed'>
                Create a new project to start analyzing your AI workflows and tracking performance metrics.
              </p>
            </div>

            <Link
              to='/projects/new'
              className='inline-flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg shadow-orange-600/25 hover:shadow-xl hover:shadow-orange-600/30 hover:scale-105'
            >
              <PlusCircle className='w-5 h-5' />
              Create New Project
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-sky-900/5 to-slate-900'>
      <div className='max-w-7xl mx-auto p-4 space-y-6'>
        {/* Enhanced Header Section */}
        <div className='bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/20'>
          <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-600/20 flex items-center justify-center border border-sky-500/30'>
                <TrendingUp className='w-6 h-6 text-sky-400' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-white leading-tight'>
                  {pj?.name}
                </h1>
                <p className='text-sm text-gray-400'>Project Analytics Overview</p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/10'>
                <Calendar className='w-4 h-4 text-sky-400' />
                <span className='text-sm text-gray-300 font-medium'>Last 7 days</span>
              </div>
              {loading && (
                <div className='flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20'>
                  <Loader2 className='w-4 h-4 animate-spin text-sky-400' />
                  <span className='text-sm text-sky-400 font-medium'>Loading...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:bg-white/[0.04] hover:border-white/15 transition-all duration-300'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center'>
                <Activity className='w-4 h-4 text-emerald-400' />
              </div>
              <span className='text-sm font-medium text-gray-300'>Total Executions</span>
            </div>
            <p className='text-2xl font-bold text-white'>
              {pj?.promptMetrics.recentCounts?.reduce((acc, item) => acc + item.count, 0) || 0}
            </p>
            <p className='text-xs text-gray-500 mt-1'>Across all prompts</p>
          </div>

          <div className='bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:bg-white/[0.04] hover:border-white/15 transition-all duration-300'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center'>
                <Sparkles className='w-4 h-4 text-sky-400' />
              </div>
              <span className='text-sm font-medium text-gray-300'>Active Prompts</span>
            </div>
            <p className='text-2xl font-bold text-white'>
              {pj?.promptMetrics.recentCounts?.length || 0}
            </p>
            <p className='text-xs text-gray-500 mt-1'>With recent activity</p>
          </div>

          <div className='bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:bg-white/[0.04] hover:border-white/15 transition-all duration-300'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center'>
                <BarChart3 className='w-4 h-4 text-blue-400' />
              </div>
              <span className='text-sm font-medium text-gray-300'>Daily Average</span>
            </div>
            <p className='text-2xl font-bold text-white'>
              {pj?.promptMetrics.last7Days?.length
                ? Math.round(pj.promptMetrics.recentCounts.reduce((acc, item) => acc + item.count, 0) / 7)
                : 0}
            </p>
            <p className='text-xs text-gray-500 mt-1'>Executions per day</p>
          </div>
        </div>

        {/* Main Content */}
        <div className='space-y-6'>
          {(!pj?.promptMetrics.recentCounts.length
            || !pj?.promptMetrics.last7Days.length) && (
            <div className='bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/20'>
              <HelpIntegration />
            </div>
          )}

          {pj?.promptMetrics.last7Days.length > 0 && (
            <div className='bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/20'>
              <div className='flex items-center gap-2 mb-6'>
                <BarChart3 className='w-5 h-5 text-sky-400' />
                <h2 className='text-lg font-semibold text-white'>
                  Usage Trends
                </h2>
                <span className='text-xs text-gray-400'>Daily breakdown</span>
              </div>
              <ProjectTopPromptsByDate
                recentCounts={pj?.promptMetrics.last7Days}
                loading={loading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OverallPage
