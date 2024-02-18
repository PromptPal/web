import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo } from 'react'
import { tokenAtom } from '../../stats/profile'
import { Center, Divider, Select } from '@mantine/core'
import { useQuery as useGraphQLQuery } from '@apollo/client'
import { graphql } from '@/gql'
import { useLocation, useNavigate } from 'react-router-dom'

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

  const sq = useMemo(() => {
    return new URLSearchParams(location.search)
  }, [location.search])
  const currentProject = sq.get('pjId')

  const navigate = useNavigate()
  const navigateToProject = useCallback((id?: number) => {
    const nextSq = new URLSearchParams(location.search)
    if (!id) {
      nextSq.delete('pjId')
    } else {
      nextSq.set('pjId', id.toString())
    }
    navigate(`${location.pathname}?${nextSq.toString()}`)
  }, [location.search, location.pathname])

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

  // init project if not set before
  useEffect(() => {
    if (projects.length === 0) {
      return
    }
    if (currentProject) {
      return
    }

    navigateToProject(projects[0].id)
  }, [projects, currentProject])

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
        data={projects.map((project) => ({ value: project.id.toString(), label: project.name }))}
      />
    </div>
  )
}

export default ProjectSelector