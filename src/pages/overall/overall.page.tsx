import { useAtomValue } from 'jotai'
import { projectAtom } from '../../stats/project'
import { Box, Text, Button, Card, Title } from '@mantine/core'
import { Link } from 'react-router-dom'
import ProjectTopPromptsChart from '../../components/Project/TopPromptsChart'
import { useQuery as useGraphQLQuery } from '@apollo/client'
import { graphql } from '../../gql'

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
  const p = useAtomValue(projectAtom)

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
        <Text ml={2} color={'gray.500'} size={'xs'}>recent 7 days</Text>
      </div>
      <div>
        <ProjectTopPromptsChart recentCounts={pj?.promptMetrics.recentCounts} />
      </div>
    </Card>
  )
}

export default OverallPage