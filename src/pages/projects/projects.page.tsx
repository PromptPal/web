import { useQuery as useGraphQLQuery } from '@apollo/client'
import { Title as Heading } from '@mantine/core'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import LinkGlow from '../../components/Button/LinkGlow'
import ProjectCardItem from '../../components/Project/CardItem'
import { graphql } from '../../gql'

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
        offset: 0,
      },
    },
  })

  const tableData = useMemo(() => {
    return projects?.projects.edges ?? []
  }, [projects])

  return (
    <div>
      <div className='flex items-center justify-between'>
        <Heading>Projects</Heading>
        <LinkGlow
          to='/projects/new'
          className='px-4 py-2 rounded-md text-sm cursor-pointer '
        >
          New Project
        </LinkGlow>
      </div>
      <div className='daisyui-divider' />

      <div className='grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
        {tableData.map((row) => (
          <ProjectCardItem key={row.id} project={row} />
        ))}
      </div>
    </div>
  )
}

export default ProjectsPage
