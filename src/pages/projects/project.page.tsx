import { graphql } from '@/gql'
import { useQuery as useGraphQLQuery } from '@apollo/client'
import { Button, Card, Stack, Title } from '@mantine/core'
import { Link, useParams } from 'react-router-dom'
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
    }
  }
`)

function ProjectPage() {
  const pid = useParams().pid ?? '0'

  const { data: projectData } = useGraphQLQuery(q, {
    variables: {
      id: ~~pid,
    },
  })
  const project = projectData?.project
  const openTokens = project?.openTokens.edges ?? []

  return (
    <Stack className='w-full'>
      <Card>
        <div className='flex justify-between items-center mb-4'>
          <div className='ml-4 mt-4 flex'>
            <Title size='lg'>{project?.name}</Title>
            <span className='ml-2 text-gray-500'>recent 7 days</span>
          </div>
          <Button
            variant='filled'
            className='text-white'
            component={Link}
            to={`/${pid}/edit`}
          >
            Edit
          </Button>
        </div>
        <div>
          <ProjectTopPromptsCount
            recentCounts={project?.promptMetrics.recentCounts}
          />
        </div>
      </Card>

      <OpenTokenListOfProject pid={~~pid} openTokens={openTokens} />
    </Stack>
  )
}

export default ProjectPage
