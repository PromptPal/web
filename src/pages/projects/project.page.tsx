import { ProviderCard } from '@/components/Providers/ProviderCard'
import { graphql } from '@/gql'
import { useQuery as useGraphQLQuery } from '@apollo/client'
import { Link, useParams } from '@tanstack/react-router'
import {
  BarChart3,
  Zap,
  TrendingUp,
  Shield,
  Settings,
  Eye,
  Clock,
  Cpu,
  Star,
} from 'lucide-react'
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
      provider {
        id
        name
        description
        enabled
        source
        endpoint
        organizationId
        defaultModel
        temperature
        topP
        maxTokens
        config
        headers
        createdAt
        updatedAt
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

  if (!project) {
    return (
      <div className='w-full min-h-screen bg-gradient-to-br from-slate-900 via-sky-900/10 to-slate-900 flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <div className='w-12 h-12 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-600/20 flex items-center justify-center mx-auto'>
            <div className='w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin' />
          </div>
          <p className='text-gray-400'>Loading project...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-slate-900 via-sky-900/10 to-slate-900'>
      <div className='w-full flex flex-col gap-4 p-4 max-w-6xl mx-auto'>
        {/* Compact Header */}
        <div className='bg-white/[0.03] border border-white/10 rounded-lg p-4 hover:bg-white/[0.04] hover:border-white/15 transition-all duration-300'>
          <div className='flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3'>
            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-600/20 flex items-center justify-center border border-sky-500/30'>
                  <Zap className='w-4 h-4 text-sky-400' />
                </div>
                <div>
                  <h1 className='text-xl font-bold text-white leading-tight'>
                    {project.name}
                  </h1>
                  <p className='text-xs text-gray-400'>AI Project Dashboard</p>
                </div>
              </div>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20'>
                  <div className='w-1.5 h-1.5 bg-green-400 rounded-full' />
                  Active
                </span>
                <span className='inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20'>
                  <Clock className='w-3 h-3' />
                  7 days
                </span>
                <span className='inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20'>
                  <Star className='w-3 h-3' />
                  Premium
                </span>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Link
                to='/$pid/prompts'
                params={{ pid }}
                className='inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] hover:border-white/15 transition-all duration-200'
              >
                <Eye className='w-3 h-3' />
                Prompts
              </Link>
              <Link
                to='/$pid/edit'
                params={{ pid }}
                className='inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200'
              >
                <Settings className='w-3 h-3' />
                Configure
              </Link>
            </div>
          </div>

          {/* Compact Stats Grid */}
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4'>
            <div className='bg-white/[0.02] border border-white/5 rounded-lg p-3 hover:bg-white/[0.03] transition-colors duration-200'>
              <div className='flex items-center gap-2 mb-1'>
                <TrendingUp className='w-4 h-4 text-emerald-400' />
                <span className='text-xs font-medium text-gray-400'>Usage</span>
              </div>
              <p className='text-lg font-bold text-white'>
                {project.promptMetrics.recentCounts?.reduce((acc, item) => acc + item.count, 0) || 0}
              </p>
              <p className='text-xs text-gray-500'>Executions</p>
            </div>

            <div className='bg-white/[0.02] border border-white/5 rounded-lg p-3 hover:bg-white/[0.03] transition-colors duration-200'>
              <div className='flex items-center gap-2 mb-1'>
                <BarChart3 className='w-4 h-4 text-sky-400' />
                <span className='text-xs font-medium text-gray-400'>Prompts</span>
              </div>
              <p className='text-lg font-bold text-white'>
                {project.promptMetrics.recentCounts?.length || 0}
              </p>
              <p className='text-xs text-gray-500'>Active</p>
            </div>

            <div className='bg-white/[0.02] border border-white/5 rounded-lg p-3 hover:bg-white/[0.03] transition-colors duration-200'>
              <div className='flex items-center gap-2 mb-1'>
                <Shield className='w-4 h-4 text-blue-400' />
                <span className='text-xs font-medium text-gray-400'>Tokens</span>
              </div>
              <p className='text-lg font-bold text-white'>
                {openTokens.length}
              </p>
              <p className='text-xs text-gray-500'>Configured</p>
            </div>

            <div className='bg-white/[0.02] border border-white/5 rounded-lg p-3 hover:bg-white/[0.03] transition-colors duration-200'>
              <div className='flex items-center gap-2 mb-1'>
                <Cpu className='w-4 h-4 text-orange-400' />
                <span className='text-xs font-medium text-gray-400'>Provider</span>
              </div>
              <p className='text-lg font-bold text-white'>
                {project.provider ? '1' : '0'}
              </p>
              <p className='text-xs text-gray-500'>{project.provider?.enabled ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        </div>

        {/* Provider Card */}
        <ProviderCard provider={project.provider} />

        {/* Compact Metrics Section */}
        <div className='bg-white/[0.03] border border-white/10 rounded-lg p-4 hover:bg-white/[0.04] hover:border-white/15 transition-all duration-300'>
          <div className='flex items-center gap-2 mb-4'>
            <BarChart3 className='w-4 h-4 text-sky-400' />
            <h2 className='text-lg font-semibold text-white'>
              Usage Analytics
            </h2>
            <span className='text-xs text-gray-400'>Last 7 days</span>
          </div>

          <div className='bg-white/[0.02] border border-white/5 rounded-lg p-4'>
            <ProjectTopPromptsCount
              recentCounts={project.promptMetrics.recentCounts}
            />
          </div>
        </div>

        {/* Token Management */}
        <OpenTokenListOfProject pid={~~pid} openTokens={openTokens} />
      </div>
    </div>
  )
}

export default ProjectPage
