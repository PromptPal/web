import { useQuery as useGraphQLQuery } from '@apollo/client'
import { Link } from '@tanstack/react-router'
import { PlusCircle, MessageSquare, Sparkles, Hash } from 'lucide-react'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import PromptCardItem from '../../components/Prompt/CardItem'
import { graphql } from '../../gql'
import { useProjectId } from '../../hooks/route'

const q = graphql(`
  query fetchPrompts($id: Int!, $pagination: PaginationInput!) {
    prompts(projectId: $id, pagination: $pagination) {
      count
      edges {
        id
        hashId
        name
        publicLevel
        enabled
        tokenCount
        createdAt
      }
    }
  }
`)

function PromptsPage() {
  const pid = useProjectId()

  const { data } = useGraphQLQuery(q, {
    variables: {
      id: pid!,
      pagination: {
        limit: 100,
        offset: 0,
      },
    },
    skip: !pid,
  })

  const tableData = useMemo(() => {
    return data?.prompts.edges ?? []
  }, [data])

  return (
    <div className='w-full space-y-8'>
      {/* Header Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='relative overflow-hidden'
      >
        <div className='absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-blue-500/10 blur-3xl' />
        <div className='relative backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 shadow-2xl rounded-2xl'>
          <div className='p-8'>
            <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
              <div className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 rounded-lg bg-gradient-to-br from-sky-500 to-blue-500'>
                    <MessageSquare className='w-6 h-6 text-white' />
                  </div>
                  <h1 className='text-3xl font-bold bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent'>
                    Prompts
                  </h1>
                </div>
                <p className='text-gray-300 max-w-xl'>
                  Create, manage, and optimize your AI prompts with intelligent versioning and analytics
                </p>
                <div className='flex items-center gap-6 text-sm'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 rounded-full bg-sky-500 animate-pulse' />
                    <span className='text-gray-400'>
                      {tableData.length}
                      {' '}
                      Prompts
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Hash className='w-4 h-4 text-gray-500' />
                    <span className='text-gray-400'>
                      {tableData.reduce((sum, prompt) => sum + prompt.tokenCount, 0)}
                      {' '}
                      Total Tokens
                    </span>
                  </div>
                </div>
              </div>
              <Link
                to='/$pid/prompts/new'
                params={{ pid: pid.toString() }}
                className='group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-xl shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/40'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300' />
                <PlusCircle className='w-4 h-4 relative z-10' />
                <span className='relative z-10'>Create Prompt</span>
                <Sparkles className='w-4 h-4 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Prompts Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      >
        {tableData.map((row, index) => (
          <motion.div
            key={row.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            <PromptCardItem prompt={row} />
          </motion.div>
        ))}
      </motion.div>

      {tableData.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='text-center py-12'
        >
          <div className='max-w-md mx-auto'>
            <div className='p-4 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-500/20 w-20 h-20 mx-auto mb-4 flex items-center justify-center'>
              <MessageSquare className='w-10 h-10 text-sky-400' />
            </div>
            <h3 className='text-xl font-semibold text-gray-300 mb-2'>No prompts yet</h3>
            <p className='text-gray-500 mb-6'>Start building your AI workflow by creating your first prompt</p>
            <Link
              to='/$pid/prompts/new'
              params={{ pid: pid.toString() }}
              className='inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg shadow-orange-500/25'
            >
              <PlusCircle className='w-4 h-4' />
              Create Your First Prompt
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default PromptsPage
