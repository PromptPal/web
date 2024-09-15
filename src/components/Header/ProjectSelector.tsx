import { graphql } from '@/gql'
import { useQuery as useGraphQLQuery } from '@apollo/client'
import { Center, Divider, Select } from '@mantine/core'
import { useLocation, useNavigate, useSearch } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { useCallback } from 'react'
import { tokenAtom } from '../../stats/profile'

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
  const location = useLocation()

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const sq = useSearch({ strict: false }) as any
  const currentProject = sq.pjId
  const nav = useNavigate()

  const navigateToProject = useCallback(
    (id?: number) => {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      nav({ search: { pjId: id ? id.toString() : undefined } as any })
      // setSq({
      //   pjId: id ? id.toString() : '',
      // })
    },
    [location.search, location.pathname],
  )

  const { data: projectsData } = useGraphQLQuery(q, {
    variables: {
      pagination: {
        limit: 100,
        offset: 0,
      },
    },
    skip: !logged,
    onCompleted(data) {
      // init project if not set before
      const projects = data?.projects.edges ?? []
      const pjId = new URLSearchParams(location.search).get('pjId')
      if (!pjId && projects.length > 0) {
        navigateToProject(projects[0].id)
      }
    },
  })

  const projects = projectsData?.projects.edges ?? []

  const onProjectChange = useCallback((val?: string | null) => {
    if (!val) {
      navigateToProject(undefined)
    } else {
      const pjId = parseInt(val)
      navigateToProject(pjId)
    }
  }, [])

  if (projects.length === 0) {
    return null
  }

  return (
    <div className='w-full flex items-center gap-4 ml-4'>
      <Center h={'20px'} ml={2} mr={1}>
        <Divider orientation='vertical' />
      </Center>
      <Select
        size='xs'
        className='w-36'
        value={currentProject?.toString()}
        onChange={onProjectChange}
        data={projects.map((project) => ({
          value: project.id.toString(),
          label: project.name,
        }))}
      />
    </div>
  )
}

export default ProjectSelector
