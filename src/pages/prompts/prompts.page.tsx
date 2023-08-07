import { Link, useParams } from 'react-router-dom'
import { Badge, Button, Heading, Stack, Switch, Tooltip } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { useQuery as useGraphQLQuery } from '@apollo/client'
import { projectAtom } from '../../stats/project'
import { graphql } from '../../gql'
import PromptCardItem from '../../components/Prompt/CardItem'

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
  const currentProject = useAtomValue(projectAtom)
  // TODO: handle the page that without project id
  const pid = ~~(useParams().id ?? currentProject ?? '0')

  const { data } = useGraphQLQuery(q, {
    variables: {
      id: pid,
      pagination: {
        limit: 100,
        offset: 0,
      }
    },
    skip: !pid
  })


  const tableData = useMemo(() => {
    return data?.prompts.edges ?? []
  }, [data])

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between'>
        <Heading>Prompts</Heading>
        <Link to={`/prompts/new?pid=${pid}`} className='daisyui-btn daisyui-btn-primary'>
          New Prompt
        </Link>
      </div>
      <div className='daisyui-divider' />

      <div className='grid gap-4 grid-cols-3'>
        {tableData.map((row) => (
          <PromptCardItem key={row.id} prompt={row} />
        ))}
      </div>

    </div>
  )
}

export default PromptsPage