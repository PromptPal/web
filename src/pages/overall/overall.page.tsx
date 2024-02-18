import { Box, Button, Card, Title } from '@mantine/core'
import { Link, useLocation } from 'react-router-dom'
import ProjectTopPromptsChart from '../../components/Project/TopPromptsChart'
import { useQuery as useGraphQLQuery } from '@apollo/client'
import { graphql } from '../../gql'
import { useMemo } from 'react'

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
      }
    }
  }
`)

function OverallPage() {
  const location = useLocation()

  const p = useMemo(() => {
    const sq = new URLSearchParams(location.search)
    if (!sq.has('pjId')) {
      return null
    }
    return parseInt(sq.get('pjId')!)
  }, [location.search])

  const { data } = useGraphQLQuery(q, {
    variables: {
      id: p ?? -1
    },
    skip: !p
  })

  const pj = data?.project

  if (!p) {
    return (
      <Box
        className='flex items-center justify-center flex-col'
        mt={4}
      >
        <Title>😔</Title>
        <Title>No existing project found</Title>
        <Button
          component={Link}
          to='/projects/new'
          color='teal'
          mt={4}
        >
          Create new project
        </Button>
      </Box>
    )
  }

  return (
    <Card>
      <div className='flex flex-row items-end'>
        <Title size='lg'>
          {pj?.name}
        </Title>
        <span className='ml-2 text-gray-500 text-xs'>recent 7 days</span>
      </div>
      <div>
        <ProjectTopPromptsChart
          recentCounts={pj?.promptMetrics.recentCounts}
        />
      </div>
    </Card>
  )
}

export default OverallPage