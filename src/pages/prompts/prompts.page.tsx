import { useQuery as useGraphQLQuery } from '@apollo/client'
import { Title as Heading } from '@mantine/core'
import { Link } from '@tanstack/react-router'
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
    <div className='w-full'>
      <div className='flex items-center justify-between'>
        <Heading>Prompts</Heading>
        <Link
          to={`/${pid}/prompts/new`}
          className='daisyui-btn daisyui-btn-primary'
        >
          New Prompt
        </Link>
      </div>
      <div className='daisyui-divider' />

      <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        {tableData.map((row) => (
          <PromptCardItem key={row.id} prompt={row} />
        ))}
      </div>
    </div>
  )
}

export default PromptsPage
