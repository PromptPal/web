import { useQuery as useGraphQLQuery } from '@apollo/client'
import { Box, Button, Card, Title } from '@mantine/core'
import { Link } from '@tanstack/react-router'
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
  const { data } = useGraphQLQuery(q, {
    variables: {
      id: p ?? -1,
    },
    skip: !p,
  })

  const pj = data?.project

  if (!p) {
    return (
      <Box className='flex items-center justify-center flex-col' mt={4}>
        <Title>😔</Title>
        <Title>No existing project found</Title>
        <Button component={Link} to='/projects/new' color='teal' mt={4}>
          Create new project
        </Button>
      </Box>
    )
  }

  return (
    <Card>
      <div className='flex flex-row items-end mb-4'>
        <Title size='lg'>{pj?.name}</Title>
        <span className='ml-2 text-gray-500 text-xs'>recent 7 days</span>
      </div>
      <div className='flex flex-col gap-12'>
        {pj?.promptMetrics.recentCounts.length === 0 && <HelpIntegration />}
        {/* {pj && pj?.promptMetrics.recentCounts.length > 0 && (
          <ProjectTopPromptsCount
            recentCounts={pj?.promptMetrics.recentCounts}
          />
        )} */}
        {pj && pj?.promptMetrics.last7Days.length > 0 && (
          <ProjectTopPromptsByDate recentCounts={pj?.promptMetrics.last7Days} />
        )}
      </div>
    </Card>
  )
}

export default OverallPage
