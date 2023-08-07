import { Link } from 'react-router-dom'
import { Button, Heading, Link as LinkUI, Stack, StackDivider, Switch, Tooltip } from '@chakra-ui/react'
import { useQuery as useGraphQLQuery } from '@apollo/client'
import { useMemo } from 'react'
import { graphql } from '../../gql'
import ProjectCardItem from '../../components/Project/CardItem'

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
        offset: 0
      }
    }
  })

  const tableData = useMemo(() => {
    return projects?.projects.edges ?? []
  }, [projects])

  return (
    <div>
      <div className='flex items-center justify-between'>
        <Heading>Projects</Heading>
        <Link to='/projects/new' className='daisyui-btn daisyui-btn-primary'>
          New Project
        </Link>
      </div>
      <div className=' daisyui-divider' />

      <div className='grid gap-4 grid-cols-3'>
        {tableData.map((row) => (
          <ProjectCardItem key={row.id} project={row} />
        ))}
      </div>

    </div>
  )
}

export default ProjectsPage