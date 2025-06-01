import { useQuery as useGraphQLQuery } from '@apollo/client'
import { Link } from '@tanstack/react-router'
import { PlusCircle } from 'lucide-react'
import { useMemo } from 'react'
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
    <div className='w-full flex flex-col gap-6'>
      <section className='w-full backdrop-blur-xs bg-linear-to-br from-gray-900/80 to-gray-800/80 rounded-xl overflow-hidden'>
        <div className='p-6'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-3'>
              <h1 className='text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500'>
                Prompts
              </h1>
            </div>
            <Link
              to='/$pid/prompts/new'
              params={{ pid: pid.toString() }}
              className='inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 font-medium shadow-lg shadow-blue-500/20'
            >
              <PlusCircle className='w-4 h-4' />
              New Prompt
            </Link>
          </div>
        </div>
      </section>

      <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        {tableData.map(row => (
          <PromptCardItem key={row.id} prompt={row} />
        ))}
      </div>
    </div>
  )
}

export default PromptsPage
