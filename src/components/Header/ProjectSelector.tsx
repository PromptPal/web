import { useAtom, useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { tokenAtom } from '../../stats/profile'
import { Center, Divider, Select, Stack } from '@mantine/core'
import { projectAtom } from '../../stats/project'
import { useQuery as useGraphQLQuery } from '@apollo/client'
import { graphql } from '@/gql'

const q = graphql(`
  query allProjectsNameOnly($pagination: PaginationInput!) {
    projects(pagination: $pagination) {
      count
      edges {
        id
        name
        enabled
      }
    }
  }
`)

function ProjectSelector() {
  const logged = !!useAtomValue(tokenAtom)
  const [currentProject, setCurrentProject] = useAtom(projectAtom)

  const { data: projectsData } = useGraphQLQuery(q, {
    variables: {
      pagination: {
        limit: 100,
        offset: 0
      }
    },
    skip: !logged
  })

  const projects = projectsData?.projects.edges ?? []

  useEffect(() => {
    if (projects.length === 0) {
      return
    }
    if (currentProject) {
      return
    }

    setCurrentProject(projects[0].id)
  }, [projects, currentProject])

  if (projects.length === 0) {
    return null
  }

  return (
    <Stack dir='row' align='center' gap={1}>
      <Center h={'20px'} ml={2} mr={1}>
        <Divider orientation='vertical' />
      </Center>
      <Select
        size='xs'
        value={currentProject?.toString()}
        onChange={(val) => {
          if (!val) {
            setCurrentProject(null)
            return
          }
          const pjId = parseInt(val)
          setCurrentProject(pjId)
        }}
      >
        {projects.map((project) => (
          <option key={project.id} value={project.id}>{project.name}</option>
        ))}
      </Select>
    </Stack>
  )
}

export default ProjectSelector